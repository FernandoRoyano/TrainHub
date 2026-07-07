import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-02-25.clover",
    });
  }
  return _stripe;
}

// Stripe price IDs from environment
export const STRIPE_PRICES: Record<string, Record<string, string>> = {
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY!,
  },
  elite: {
    monthly: process.env.STRIPE_PRICE_ELITE_MONTHLY!,
    yearly: process.env.STRIPE_PRICE_ELITE_YEARLY!,
  },
};

export type SubscriptionTier = "free" | "pro" | "elite";
export type BillingInterval = "monthly" | "yearly";

// El tier debe derivarse del price activo, no de metadata: un cambio de plan
// desde el Billing Portal no actualiza la metadata original del checkout.
export function tierFromPriceId(priceId: string | null | undefined): SubscriptionTier | null {
  if (!priceId) return null;
  for (const [tier, intervals] of Object.entries(STRIPE_PRICES)) {
    if (Object.values(intervals).includes(priceId)) {
      return tier as SubscriptionTier;
    }
  }
  return null;
}
