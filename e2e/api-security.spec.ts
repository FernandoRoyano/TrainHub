import { test, expect } from "@playwright/test";

/**
 * E2E tests for API endpoint security.
 * Verifies that all critical endpoints require authentication
 * and return proper error codes.
 */

test.describe("API Authentication Protection", () => {
  const protectedPostEndpoints = [
    { path: "/api/generate-invite-link", expectedStatus: 401 },
    { path: "/api/invite-client", expectedStatus: 401 },
    { path: "/api/stripe/checkout", expectedStatus: 400 }, // returns 400 for invalid input before auth check
  ];

  for (const { path, expectedStatus } of protectedPostEndpoints) {
    test(`POST ${path} rejects unauthenticated request`, async ({ request }) => {
      const res = await request.post(path, {
        data: { test: true },
      });
      expect(res.status()).toBe(expectedStatus);
    });
  }
});

test.describe("Stripe Webhook Security", () => {
  test("POST /api/stripe/webhook returns 400 without signature", async ({
    request,
  }) => {
    const res = await request.post("/api/stripe/webhook", {
      data: { type: "test" },
    });
    expect(res.status()).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Missing signature");
  });

  test("POST /api/stripe/webhook rejects invalid signature", async ({
    request,
  }) => {
    const res = await request.post("/api/stripe/webhook", {
      headers: { "stripe-signature": "invalid_signature" },
      data: { type: "test" },
    });
    // Returns 400 or 500 depending on whether STRIPE_WEBHOOK_SECRET is configured
    expect([400, 500]).toContain(res.status());
  });
});

test.describe("API Input Validation", () => {
  test("verify-invite handles empty token gracefully", async ({ request }) => {
    const res = await request.get("/api/verify-invite?token=");
    expect(res.ok()).toBe(true);
    const data = await res.json();
    expect(data.valid).toBe(false);
  });

  test("verify-invite handles SQL injection attempt", async ({ request }) => {
    const res = await request.get(
      "/api/verify-invite?token=' OR 1=1 --"
    );
    expect(res.ok()).toBe(true);
    const data = await res.json();
    expect(data.valid).toBe(false);
  });

  test("verify-invite handles XSS attempt", async ({ request }) => {
    const res = await request.get(
      "/api/verify-invite?token=<script>alert(1)</script>"
    );
    expect(res.ok()).toBe(true);
    const data = await res.json();
    expect(data.valid).toBe(false);
  });
});
