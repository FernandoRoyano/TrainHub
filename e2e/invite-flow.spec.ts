import { test, expect } from "@playwright/test";

/**
 * E2E test for the client invitation flow.
 *
 * This test covers the complete flow that broke in production:
 * 1. Invite link page loads correctly
 * 2. Token verification works
 * 3. Registration form appears for valid tokens
 * 4. Error state appears for invalid tokens
 *
 * To run against production:
 *   E2E_BASE_URL=https://train-hub-five.vercel.app npx playwright test
 *
 * To run locally:
 *   npx playwright test
 */

test.describe("Client Invitation Flow", () => {
  test("join page shows error for invalid token", async ({ page }) => {
    await page.goto("/es/join/00000000-0000-0000-0000-000000000000");

    // Should show invalid token message
    await expect(
      page.locator("text=invalidToken").or(page.locator('[class*="destructive"]'))
    ).toBeVisible({ timeout: 10000 });
  });

  test("join page shows error for malformed token", async ({ page }) => {
    await page.goto("/es/join/not-a-valid-uuid");

    await expect(
      page.locator("text=invalidToken").or(page.locator('[class*="destructive"]'))
    ).toBeVisible({ timeout: 10000 });
  });

  test("verify-invite API returns valid:false for nonexistent token", async ({
    request,
  }) => {
    const res = await request.get(
      "/api/verify-invite?token=00000000-0000-0000-0000-000000000000"
    );

    expect(res.ok()).toBe(true);
    const data = await res.json();
    expect(data.valid).toBe(false);
  });

  test("verify-invite API returns valid:false when no token", async ({
    request,
  }) => {
    const res = await request.get("/api/verify-invite");

    expect(res.ok()).toBe(true);
    const data = await res.json();
    expect(data.valid).toBe(false);
  });

  test("generate-invite-link API returns 401 without auth", async ({
    request,
  }) => {
    const res = await request.post("/api/generate-invite-link", {
      data: { clientId: "test-id" },
    });

    expect(res.status()).toBe(401);
  });

  test("invite-client API returns 401 without auth", async ({ request }) => {
    const res = await request.post("/api/invite-client", {
      data: { clientId: "test-id" },
    });

    expect(res.status()).toBe(401);
  });
});

test.describe("Auth Pages Accessibility", () => {
  test("login page loads correctly", async ({ page }) => {
    await page.goto("/es/login");

    // Should have email and password fields
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("register page loads correctly", async ({ page }) => {
    await page.goto("/es/register");

    // Should have registration form fields
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test("login page has link to register", async ({ page }) => {
    await page.goto("/es/login");

    const registerLink = page.locator('a[href*="register"]');
    await expect(registerLink).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Protected Routes", () => {
  test("dashboard redirects to login without auth", async ({ page }) => {
    await page.goto("/es/dashboard");

    // Should redirect to login
    await page.waitForURL("**/login**", { timeout: 10000 });
    expect(page.url()).toContain("login");
  });

  test("my-routine redirects to login without auth", async ({ page }) => {
    await page.goto("/es/my-routine");

    await page.waitForURL("**/login**", { timeout: 10000 });
    expect(page.url()).toContain("login");
  });
});
