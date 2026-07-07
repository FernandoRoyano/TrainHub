// Fuente única de precios mostrados y límites por plan.
// Los importes deben coincidir con los prices configurados en Stripe
// (STRIPE_PRICE_* en Vercel); si cambias un price en Stripe, cámbialo aquí.
import type { SubscriptionTier } from "./client";

export const PLAN_PRICES: Record<
  Exclude<SubscriptionTier, "free">,
  { monthly: number; yearly: number }
> = {
  pro: { monthly: 29, yearly: 24 },
  elite: { monthly: 79, yearly: 66 },
};

export const TIER_LIMITS: Record<SubscriptionTier, number> = {
  free: 3,
  pro: 25,
  elite: Infinity,
};
