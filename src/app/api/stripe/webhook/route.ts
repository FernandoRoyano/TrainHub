import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/client";
import type Stripe from "stripe";

export const runtime = "nodejs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StripeObj = any;

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Idempotencia atómica: insert con PK = event.id; si ya existe, error 23505
  // (unique_violation) → es un retry de Stripe, devolvemos 200 sin reprocesar.
  // Si el handler falla más abajo, el insert del registro de procesado ocurre
  // tras el switch — así Stripe puede reintentar correctamente.
  const reserved = await admin
    .from("stripe_events")
    .insert({ id: event.id, type: event.type })
    .select("id")
    .maybeSingle();
  if (reserved.error?.code === "23505") {
    return NextResponse.json({ received: true, duplicate: true });
  }
  if (reserved.error) {
    console.error("Failed to record stripe event:", reserved.error.code);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as StripeObj;
        if (session.mode === "subscription" && session.subscription) {
          const subscriptionId = typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;

          const sub: StripeObj = await stripe.subscriptions.retrieve(subscriptionId);
          const userId = session.metadata?.user_id || sub.metadata?.user_id;
          const tier = session.metadata?.tier || sub.metadata?.tier || "pro";

          if (userId) {
            const periodStart = sub.current_period_start ?? sub.start_date;
            const periodEnd = sub.current_period_end ?? sub.ended_at;

            await admin.from("subscriptions").upsert({
              user_id: userId,
              stripe_customer_id: typeof session.customer === "string" ? session.customer : session.customer?.id,
              stripe_subscription_id: subscriptionId,
              stripe_price_id: sub.items?.data?.[0]?.price?.id,
              tier,
              billing_interval: sub.items?.data?.[0]?.price?.recurring?.interval === "year" ? "yearly" : "monthly",
              status: sub.status,
              current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
              current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
              cancel_at_period_end: sub.cancel_at_period_end ?? false,
            }, { onConflict: "user_id" });

            await admin.from("users").update({ subscription_tier: tier }).eq("id", userId);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as StripeObj;
        const userId = sub.metadata?.user_id;

        if (userId) {
          const tier = sub.metadata?.tier || "pro";
          const isCanceled = sub.status === "canceled";
          const periodStart = sub.current_period_start ?? sub.start_date;
          const periodEnd = sub.current_period_end ?? sub.ended_at;

          await admin.from("subscriptions").update({
            status: sub.status,
            stripe_price_id: sub.items?.data?.[0]?.price?.id,
            billing_interval: sub.items?.data?.[0]?.price?.recurring?.interval === "year" ? "yearly" : "monthly",
            current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
            current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
            cancel_at_period_end: sub.cancel_at_period_end ?? false,
            tier: isCanceled ? "free" : tier,
          }).eq("user_id", userId);

          await admin.from("users")
            .update({ subscription_tier: isCanceled ? "free" : tier })
            .eq("id", userId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as StripeObj;
        const userId = sub.metadata?.user_id;

        if (userId) {
          await admin.from("subscriptions").update({
            status: "canceled",
            tier: "free",
            cancel_at_period_end: false,
          }).eq("user_id", userId);

          await admin.from("users")
            .update({ subscription_tier: "free" })
            .eq("id", userId);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as StripeObj;
        const userId = invoice.subscription_details?.metadata?.user_id
          || invoice.metadata?.user_id;

        const paymentIntentId = typeof invoice.payment_intent === "string"
          ? invoice.payment_intent
          : invoice.payment_intent?.id;

        if (userId && paymentIntentId) {
          await admin.from("payments").insert({
            user_id: userId,
            stripe_payment_intent_id: paymentIntentId,
            stripe_invoice_id: invoice.id,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: "succeeded",
            description: invoice.lines?.data?.[0]?.description || "Subscription payment",
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as StripeObj;
        const userId = invoice.subscription_details?.metadata?.user_id
          || invoice.metadata?.user_id;

        const paymentIntentId = typeof invoice.payment_intent === "string"
          ? invoice.payment_intent
          : invoice.payment_intent?.id;

        if (userId && paymentIntentId) {
          await admin.from("payments").insert({
            user_id: userId,
            stripe_payment_intent_id: paymentIntentId,
            stripe_invoice_id: invoice.id,
            amount: invoice.amount_due,
            currency: invoice.currency,
            status: "failed",
            description: "Payment failed",
          });

          await admin.from("subscriptions")
            .update({ status: "past_due" })
            .eq("user_id", userId);
        }
        break;
      }
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    // Libera el slot de idempotencia para que el reintento de Stripe pueda procesar.
    await admin.from("stripe_events").delete().eq("id", event.id);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
