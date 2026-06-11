import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock admin client
const mockUpsert = vi.fn().mockResolvedValue({ error: null });
const mockUpdateEq = vi.fn().mockResolvedValue({ error: null });

// insert debe soportar dos usos: await directo (payments) y
// .select().maybeSingle() (idempotencia stripe_events).
const mockInsert = vi.fn(() => {
  const thenable = {
    select: () => ({
      maybeSingle: () => Promise.resolve({ data: { id: "evt_test" }, error: null }),
    }),
    then: (onFulfilled: (v: { error: null }) => unknown) =>
      Promise.resolve({ error: null }).then(onFulfilled),
  };
  return thenable;
});

const mockAdminFrom = vi.fn().mockImplementation(() => ({
  upsert: mockUpsert,
  update: () => ({ eq: mockUpdateEq }),
  insert: mockInsert,
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({ from: mockAdminFrom }),
}));

// Mock Stripe
const mockConstructEvent = vi.fn();
const mockRetrieveSubscription = vi.fn();

vi.mock("@/lib/stripe/client", () => ({
  getStripe: () => ({
    webhooks: { constructEvent: mockConstructEvent },
    subscriptions: { retrieve: mockRetrieveSubscription },
  }),
}));

const { POST } = await import("@/app/api/stripe/webhook/route");

describe("POST /api/stripe/webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  });

  it("returns 400 when signature is missing", async () => {
    const req = new Request("http://localhost/api/stripe/webhook", {
      method: "POST",
      body: "{}",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Missing signature");
  });

  it("returns 400 when signature verification fails", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    const req = new Request("http://localhost/api/stripe/webhook", {
      method: "POST",
      body: "{}",
      headers: { "stripe-signature": "bad_sig" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Invalid signature");
  });

  it("handles checkout.session.completed — creates subscription", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          mode: "subscription",
          subscription: "sub_123",
          customer: "cus_123",
          metadata: { user_id: "user-1", tier: "pro" },
        },
      },
    });

    mockRetrieveSubscription.mockResolvedValue({
      status: "active",
      current_period_start: 1700000000,
      current_period_end: 1702592000,
      cancel_at_period_end: false,
      metadata: { user_id: "user-1", tier: "pro" },
      items: {
        data: [{ price: { id: "price_pro", recurring: { interval: "month" } } }],
      },
    });

    const req = new Request("http://localhost/api/stripe/webhook", {
      method: "POST",
      body: "event_body",
      headers: { "stripe-signature": "valid_sig" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    // Should upsert subscription
    expect(mockAdminFrom).toHaveBeenCalledWith("subscriptions");
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "user-1",
        stripe_subscription_id: "sub_123",
        tier: "pro",
        billing_interval: "monthly",
      }),
      { onConflict: "user_id" }
    );

    // Should update user tier
    expect(mockAdminFrom).toHaveBeenCalledWith("users");
    expect(mockUpdateEq).toHaveBeenCalledWith("id", "user-1");
  });

  it("handles customer.subscription.deleted — sets tier to free", async () => {
    mockConstructEvent.mockReturnValue({
      type: "customer.subscription.deleted",
      data: {
        object: {
          metadata: { user_id: "user-1" },
        },
      },
    });

    const req = new Request("http://localhost/api/stripe/webhook", {
      method: "POST",
      body: "event_body",
      headers: { "stripe-signature": "valid_sig" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    // Should set subscription to canceled/free
    expect(mockAdminFrom).toHaveBeenCalledWith("subscriptions");
    // Should set user tier to free
    expect(mockAdminFrom).toHaveBeenCalledWith("users");
  });

  it("handles invoice.payment_succeeded — records payment", async () => {
    mockConstructEvent.mockReturnValue({
      type: "invoice.payment_succeeded",
      data: {
        object: {
          id: "inv_123",
          payment_intent: "pi_123",
          amount_paid: 2900,
          currency: "eur",
          subscription_details: { metadata: { user_id: "user-1" } },
          lines: { data: [{ description: "Pro monthly" }] },
        },
      },
    });

    const req = new Request("http://localhost/api/stripe/webhook", {
      method: "POST",
      body: "event_body",
      headers: { "stripe-signature": "valid_sig" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    expect(mockAdminFrom).toHaveBeenCalledWith("payments");
    // Upsert (no insert): los reintentos de cobro reutilizan payment_intent
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "user-1",
        stripe_payment_intent_id: "pi_123",
        amount: 2900,
        currency: "eur",
        status: "succeeded",
      }),
      { onConflict: "stripe_payment_intent_id" }
    );
  });

  it("handles invoice.payment_failed — marks subscription past_due", async () => {
    mockConstructEvent.mockReturnValue({
      type: "invoice.payment_failed",
      data: {
        object: {
          id: "inv_fail",
          payment_intent: "pi_fail",
          amount_due: 2900,
          currency: "eur",
          subscription_details: { metadata: { user_id: "user-1" } },
        },
      },
    });

    const req = new Request("http://localhost/api/stripe/webhook", {
      method: "POST",
      body: "event_body",
      headers: { "stripe-signature": "valid_sig" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    // Should upsert failed payment
    expect(mockAdminFrom).toHaveBeenCalledWith("payments");
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "failed",
      }),
      { onConflict: "stripe_payment_intent_id" }
    );

    // Should mark subscription as past_due
    expect(mockAdminFrom).toHaveBeenCalledWith("subscriptions");
  });

  it("returns 200 for unhandled event types", async () => {
    mockConstructEvent.mockReturnValue({
      type: "some.other.event",
      data: { object: {} },
    });

    const req = new Request("http://localhost/api/stripe/webhook", {
      method: "POST",
      body: "event_body",
      headers: { "stripe-signature": "valid_sig" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});
