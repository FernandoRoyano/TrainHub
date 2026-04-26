import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, STRIPE_PRICES } from "@/lib/stripe/client";
import type { SubscriptionTier, BillingInterval } from "@/lib/stripe/client";

export async function POST(request: Request) {
  // Pagos deshabilitados hasta que Stripe esté configurado en Vercel.
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Payments not enabled" }, { status: 503 });
  }
  try {
    const { tier, interval } = (await request.json()) as {
      tier: SubscriptionTier;
      interval: BillingInterval;
    };

    // Validate input
    if (!tier || !interval || !["pro", "elite"].includes(tier) || !["monthly", "yearly"].includes(interval)) {
      return NextResponse.json({ error: "Invalid tier or interval" }, { status: 400 });
    }

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const stripe = getStripe();
    const admin = createAdminClient();
    const priceId = STRIPE_PRICES[tier][interval];

    if (!priceId) {
      return NextResponse.json({ error: "Price not configured" }, { status: 500 });
    }

    // Get or create Stripe customer
    let { data: subscription } = await admin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    let customerId = subscription?.stripe_customer_id;

    if (!customerId) {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;

      // Create subscription record
      await admin.from("subscriptions").upsert({
        user_id: user.id,
        stripe_customer_id: customerId,
        tier: "free",
        status: "active",
      }, { onConflict: "user_id" });
    }

    // Create checkout session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${appUrl}/settings?subscription=success`,
      cancel_url: `${appUrl}/settings?subscription=cancelled`,
      metadata: {
        user_id: user.id,
        tier,
        interval,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          tier,
        },
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
