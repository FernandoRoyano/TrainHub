import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase server client
const mockGetUser = vi.fn();
const mockServerFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: () =>
    Promise.resolve({
      auth: { getUser: mockGetUser },
      from: mockServerFrom,
    }),
}));

// Mock admin client
const mockAdminUpsert = vi.fn().mockResolvedValue({ error: null });
const mockAdminMaybeSingle = vi.fn();

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: mockAdminMaybeSingle,
        }),
      }),
      upsert: mockAdminUpsert,
    }),
  }),
}));

// Mock Stripe
const mockCreateCustomer = vi.fn();
const mockCreateCheckoutSession = vi.fn();

vi.mock("@/lib/stripe/client", () => ({
  getStripe: () => ({
    customers: { create: mockCreateCustomer },
    checkout: { sessions: { create: mockCreateCheckoutSession } },
  }),
  STRIPE_PRICES: {
    pro: { monthly: "price_pro_monthly", yearly: "price_pro_yearly" },
    elite: { monthly: "price_elite_monthly", yearly: "price_elite_yearly" },
  },
}));

const { POST } = await import("@/app/api/stripe/checkout/route");

describe("POST /api/stripe/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_APP_URL = "https://train-hub-five.vercel.app";
    process.env.STRIPE_SECRET_KEY = "sk_test_dummy";
  });

  it("returns 401 without auth", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const req = new Request("http://localhost/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier: "pro", interval: "monthly" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid tier", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "u1", email: "test@test.com" } } });

    const req = new Request("http://localhost/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier: "mega", interval: "monthly" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid interval", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "u1", email: "test@test.com" } } });

    const req = new Request("http://localhost/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier: "pro", interval: "weekly" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for free tier", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "u1", email: "test@test.com" } } });

    const req = new Request("http://localhost/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier: "free", interval: "monthly" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates checkout session for existing customer", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "u1", email: "trainer@test.com" } },
    });

    mockAdminMaybeSingle.mockResolvedValue({
      data: { stripe_customer_id: "cus_existing" },
    });

    mockCreateCheckoutSession.mockResolvedValue({
      url: "https://checkout.stripe.com/session123",
    });

    const req = new Request("http://localhost/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier: "pro", interval: "monthly" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.url).toBe("https://checkout.stripe.com/session123");
    expect(mockCreateCustomer).not.toHaveBeenCalled();
    expect(mockCreateCheckoutSession).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: "cus_existing",
        mode: "subscription",
        metadata: expect.objectContaining({
          user_id: "u1",
          tier: "pro",
        }),
      })
    );
  });

  it("creates new Stripe customer when none exists", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "u1", email: "new@test.com" } },
    });

    mockAdminMaybeSingle.mockResolvedValue({ data: null });

    mockCreateCustomer.mockResolvedValue({ id: "cus_new" });
    mockCreateCheckoutSession.mockResolvedValue({
      url: "https://checkout.stripe.com/new",
    });

    const req = new Request("http://localhost/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier: "elite", interval: "yearly" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockCreateCustomer).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "new@test.com",
        metadata: { user_id: "u1" },
      })
    );
  });

  it("includes correct success/cancel URLs", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "u1", email: "test@test.com" } },
    });
    mockAdminMaybeSingle.mockResolvedValue({
      data: { stripe_customer_id: "cus_1" },
    });
    mockCreateCheckoutSession.mockResolvedValue({ url: "https://stripe.com" });

    const req = new Request("http://localhost/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier: "pro", interval: "monthly" }),
    });

    await POST(req);

    expect(mockCreateCheckoutSession).toHaveBeenCalledWith(
      expect.objectContaining({
        success_url: "https://train-hub-five.vercel.app/settings?subscription=success",
        cancel_url: "https://train-hub-five.vercel.app/settings?subscription=cancelled",
      })
    );
  });
});
