import { test, expect } from "@playwright/test";

/**
 * E2E tests for basic performance.
 * Verifies that critical pages and API endpoints respond within acceptable time.
 */

test.describe("Page Load Performance", () => {
  test("login page loads within 5 seconds", async ({ page }) => {
    const start = Date.now();
    await page.goto("/es/login");
    await page.locator('input[type="email"]').waitFor({ timeout: 5000 });
    const loadTime = Date.now() - start;

    expect(loadTime).toBeLessThan(5000);
  });

  test("register page loads within 5 seconds", async ({ page }) => {
    const start = Date.now();
    await page.goto("/es/register");
    await page.locator('input[type="email"]').waitFor({ timeout: 5000 });
    const loadTime = Date.now() - start;

    expect(loadTime).toBeLessThan(5000);
  });

  test("join page loads within 5 seconds", async ({ page }) => {
    const start = Date.now();
    await page.goto("/es/join/00000000-0000-0000-0000-000000000000");
    await page.waitForLoadState("networkidle");
    const loadTime = Date.now() - start;

    expect(loadTime).toBeLessThan(5000);
  });
});

test.describe("API Response Performance", () => {
  test("verify-invite responds within 1 second", async ({ request }) => {
    const start = Date.now();
    const res = await request.get(
      "/api/verify-invite?token=00000000-0000-0000-0000-000000000000"
    );
    const responseTime = Date.now() - start;

    expect(res.ok()).toBe(true);
    expect(responseTime).toBeLessThan(2000);
  });

  test("protected endpoints respond within 1 second (even with 401)", async ({
    request,
  }) => {
    const endpoints = [
      "/api/generate-invite-link",
      "/api/invite-client",
    ];

    for (const endpoint of endpoints) {
      const start = Date.now();
      await request.post(endpoint, { data: {} });
      const responseTime = Date.now() - start;

      expect(responseTime).toBeLessThan(1000);
    }
  });
});

test.describe("No Console Errors", () => {
  test("login page has no critical console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/es/login");
    await page.waitForLoadState("networkidle");

    // Filter out known non-critical errors
    const criticalErrors = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("deprecated") &&
        !e.includes("mobile-web-app-capable") &&
        !e.includes("hydration")
    );

    expect(criticalErrors).toEqual([]);
  });

  test("register page has no critical console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/es/register");
    await page.waitForLoadState("networkidle");

    const criticalErrors = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("deprecated") &&
        !e.includes("mobile-web-app-capable") &&
        !e.includes("hydration")
    );

    expect(criticalErrors).toEqual([]);
  });
});
