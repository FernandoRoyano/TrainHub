import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Estados de subscripción que cuentan como "pagado activo" (mismo criterio
// que use-subscription.ts). Otros estados con tier de pago = "con problema".
const ACTIVE_STATUSES = ["active", "trialing"];

type BillingClass = "paid" | "free" | "problem";

interface SubRow {
  user_id: string;
  tier: string | null;
  status: string | null;
  billing_interval: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  stripe_customer_id: string | null;
}

function classify(tier: string | null, status: string | null): BillingClass {
  if (!tier || tier === "free") return "free";
  return status && ACTIVE_STATUSES.includes(status) ? "paid" : "problem";
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Dos queries + merge en JS: los embeds anidados de PostgREST con RLS dieron
  // problemas antes en este proyecto, así que se evitan a propósito.
  const [trainersResult, subsResult] = await Promise.all([
    admin
      .from("users")
      .select("id, full_name, email, subscription_tier, client_limit_override, created_at")
      .eq("role", "trainer")
      .order("created_at", { ascending: false }),
    admin
      .from("subscriptions")
      .select(
        "user_id, tier, status, billing_interval, current_period_end, cancel_at_period_end, stripe_customer_id"
      ),
  ]);

  if (trainersResult.error) {
    return NextResponse.json({ error: trainersResult.error.message }, { status: 500 });
  }

  const subsByUser = new Map<string, SubRow>();
  for (const s of (subsResult.data ?? []) as SubRow[]) {
    subsByUser.set(s.user_id, s);
  }

  const trainers = (trainersResult.data ?? []).map((tr) => {
    const sub = subsByUser.get(tr.id) ?? null;
    // El tier efectivo sale de la fila de subscriptions (fuente de verdad con
    // status); users.subscription_tier es solo un espejo denormalizado.
    const tier = sub?.tier ?? tr.subscription_tier ?? "free";
    const status = sub?.status ?? null;
    return {
      id: tr.id,
      full_name: tr.full_name,
      email: tr.email,
      created_at: tr.created_at,
      client_limit_override: tr.client_limit_override ?? null,
      tier,
      status,
      billing_interval: sub?.billing_interval ?? null,
      current_period_end: sub?.current_period_end ?? null,
      cancel_at_period_end: sub?.cancel_at_period_end ?? false,
      stripe_customer_id: sub?.stripe_customer_id ?? null,
      billingClass: classify(tier, status),
    };
  });

  const summary = {
    total: trainers.length,
    paid: trainers.filter((t) => t.billingClass === "paid").length,
    free: trainers.filter((t) => t.billingClass === "free").length,
    problem: trainers.filter((t) => t.billingClass === "problem").length,
  };

  return NextResponse.json({ trainers, summary });
}
