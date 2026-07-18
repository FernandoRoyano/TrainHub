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

  // Varias queries + merge en JS: los embeds anidados de PostgREST con RLS dieron
  // problemas antes en este proyecto, así que se evitan a propósito.
  const [trainersResult, subsResult, clientsResult, paymentsResult] = await Promise.all([
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
    // Clientes reales: se excluyen las invitaciones abiertas sin usar (email
    // placeholder pending-...@placeholder.local).
    admin.from("clients").select("trainer_id, email"),
    // Facturación del entrenador a SUS clientes (solo pagos cobrados).
    admin.from("client_payments").select("trainer_id, amount, payment_date").eq("status", "paid"),
  ]);

  if (trainersResult.error) {
    return NextResponse.json({ error: trainersResult.error.message }, { status: 500 });
  }

  const subsByUser = new Map<string, SubRow>();
  for (const s of (subsResult.data ?? []) as SubRow[]) {
    subsByUser.set(s.user_id, s);
  }

  // Conteo de clientes reales por entrenador (sin placeholders de invitación).
  const clientCountByTrainer = new Map<string, number>();
  for (const c of (clientsResult.data ?? []) as { trainer_id: string; email: string | null }[]) {
    if (c.email && /^pending-.*@placeholder\.local$/.test(c.email)) continue;
    clientCountByTrainer.set(c.trainer_id, (clientCountByTrainer.get(c.trainer_id) ?? 0) + 1);
  }

  // Facturación por entrenador: total y mes actual. client_payments.amount está
  // en euros decimales (se asume EUR).
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const revenueByTrainer = new Map<string, { total: number; month: number }>();
  for (const p of (paymentsResult.data ?? []) as {
    trainer_id: string;
    amount: number | string | null;
    payment_date: string | null;
  }[]) {
    const amount = Number(p.amount) || 0;
    const entry = revenueByTrainer.get(p.trainer_id) ?? { total: 0, month: 0 };
    entry.total += amount;
    if (p.payment_date && new Date(p.payment_date) >= startOfMonth) entry.month += amount;
    revenueByTrainer.set(p.trainer_id, entry);
  }

  const trainers = (trainersResult.data ?? []).map((tr) => {
    const sub = subsByUser.get(tr.id) ?? null;
    // El tier efectivo sale de la fila de subscriptions (fuente de verdad con
    // status); users.subscription_tier es solo un espejo denormalizado.
    const tier = sub?.tier ?? tr.subscription_tier ?? "free";
    const status = sub?.status ?? null;
    const revenue = revenueByTrainer.get(tr.id) ?? { total: 0, month: 0 };
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
      clientCount: clientCountByTrainer.get(tr.id) ?? 0,
      revenueThisMonth: Math.round(revenue.month * 100) / 100,
      revenueTotal: Math.round(revenue.total * 100) / 100,
    };
  });

  const summary = {
    total: trainers.length,
    paid: trainers.filter((t) => t.billingClass === "paid").length,
    free: trainers.filter((t) => t.billingClass === "free").length,
    problem: trainers.filter((t) => t.billingClass === "problem").length,
    revenueThisMonth:
      Math.round(trainers.reduce((s, t) => s + t.revenueThisMonth, 0) * 100) / 100,
    revenueTotal: Math.round(trainers.reduce((s, t) => s + t.revenueTotal, 0) * 100) / 100,
  };

  return NextResponse.json({ trainers, summary });
}
