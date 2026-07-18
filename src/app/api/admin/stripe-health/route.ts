import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/client";

export const runtime = "nodejs";

interface HealthCheck {
  key: string;
  ok: boolean;
  detail: string;
  // critical=false → un fallo no marca todo el sistema como caído (p.ej. portal).
  critical: boolean;
}

const PRICE_ENV_KEYS = [
  "STRIPE_PRICE_PRO_MONTHLY",
  "STRIPE_PRICE_PRO_YEARLY",
  "STRIPE_PRICE_ELITE_MONTHLY",
  "STRIPE_PRICE_ELITE_YEARLY",
] as const;

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

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const mode = secretKey?.startsWith("sk_live_")
    ? "live"
    : secretKey?.startsWith("sk_test_")
    ? "test"
    : "unknown";
  const paymentsEnabled = process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === "true";

  const checks: HealthCheck[] = [];

  // 1. Clave secreta presente
  checks.push({
    key: "secret_key",
    ok: !!secretKey,
    detail: secretKey ? `Modo ${mode.toUpperCase()}` : "STRIPE_SECRET_KEY ausente",
    critical: true,
  });

  // 2. Webhook secret presente
  checks.push({
    key: "webhook_secret",
    ok: !!process.env.STRIPE_WEBHOOK_SECRET,
    detail: process.env.STRIPE_WEBHOOK_SECRET ? "Configurado" : "STRIPE_WEBHOOK_SECRET ausente",
    critical: true,
  });

  // 3. Portal config (no crítico: solo afecta al botón "gestionar suscripción")
  checks.push({
    key: "portal_config",
    ok: !!process.env.STRIPE_PORTAL_CONFIG_ID,
    detail: process.env.STRIPE_PORTAL_CONFIG_ID ? "Configurado" : "STRIPE_PORTAL_CONFIG_ID ausente",
    critical: false,
  });

  let account: { id: string; chargesEnabled: boolean } | null = null;

  // 4. Llamada real a la API: cuenta (prueba que la clave funciona de verdad)
  if (secretKey) {
    try {
      const acct = await getStripe().accounts.retrieve();
      account = { id: acct.id, chargesEnabled: acct.charges_enabled ?? false };
      checks.push({
        key: "api_connection",
        ok: true,
        detail: `Cuenta ${acct.id}${acct.charges_enabled ? "" : " (cobros deshabilitados)"}`,
        critical: true,
      });
    } catch (err) {
      checks.push({
        key: "api_connection",
        ok: false,
        detail: err instanceof Error ? err.message : "Fallo al conectar con Stripe",
        critical: true,
      });
    }

    // 5. Cada price ID configurado existe y está activo
    for (const envKey of PRICE_ENV_KEYS) {
      const priceId = process.env[envKey];
      if (!priceId) {
        checks.push({ key: envKey, ok: false, detail: "Price ID ausente", critical: true });
        continue;
      }
      try {
        const price = await getStripe().prices.retrieve(priceId);
        checks.push({
          key: envKey,
          ok: price.active,
          detail: price.active ? `${priceId} activo` : `${priceId} inactivo`,
          critical: true,
        });
      } catch (err) {
        checks.push({
          key: envKey,
          ok: false,
          detail: err instanceof Error ? err.message : "Price no encontrado",
          critical: true,
        });
      }
    }
  }

  // 6. Último webhook recibido (confirma que Stripe llega al servidor)
  let lastWebhook: { type: string; receivedAt: string } | null = null;
  const { data: lastEvent } = await admin
    .from("stripe_events")
    .select("type, received_at")
    .order("received_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (lastEvent) {
    lastWebhook = { type: lastEvent.type, receivedAt: lastEvent.received_at };
  }

  const ok = checks.filter((c) => c.critical).every((c) => c.ok);

  return NextResponse.json({ ok, mode, paymentsEnabled, account, checks, lastWebhook });
}
