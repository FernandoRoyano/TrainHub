import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Stripe as a class constructor
vi.mock("stripe", () => {
  const StripeMock = vi.fn(function (this: Record<string, unknown>) {
    this.webhooks = { constructEvent: vi.fn() };
    this.subscriptions = { retrieve: vi.fn() };
    this.checkout = { sessions: { create: vi.fn() } };
  });
  return { default: StripeMock };
});

describe("Stripe client", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.STRIPE_SECRET_KEY = "sk_test_123";
    process.env.STRIPE_PRICE_PRO_MONTHLY = "price_pro_monthly";
    process.env.STRIPE_PRICE_PRO_YEARLY = "price_pro_yearly";
    process.env.STRIPE_PRICE_ELITE_MONTHLY = "price_elite_monthly";
    process.env.STRIPE_PRICE_ELITE_YEARLY = "price_elite_yearly";
  });

  it("exports getStripe function", async () => {
    const { getStripe } = await import("@/lib/stripe/client");
    expect(typeof getStripe).toBe("function");
  });

  it("returns a Stripe instance", async () => {
    const { getStripe } = await import("@/lib/stripe/client");
    const stripe = getStripe();
    expect(stripe).toBeDefined();
    expect(stripe.webhooks).toBeDefined();
  });

  it("returns singleton instance", async () => {
    const { getStripe } = await import("@/lib/stripe/client");
    const stripe1 = getStripe();
    const stripe2 = getStripe();
    expect(stripe1).toBe(stripe2);
  });

  it("exports STRIPE_PRICES with correct structure", async () => {
    const { STRIPE_PRICES } = await import("@/lib/stripe/client");
    expect(STRIPE_PRICES.pro).toBeDefined();
    expect(STRIPE_PRICES.elite).toBeDefined();
    expect(STRIPE_PRICES.pro.monthly).toBe("price_pro_monthly");
    expect(STRIPE_PRICES.pro.yearly).toBe("price_pro_yearly");
    expect(STRIPE_PRICES.elite.monthly).toBe("price_elite_monthly");
    expect(STRIPE_PRICES.elite.yearly).toBe("price_elite_yearly");
  });
});
