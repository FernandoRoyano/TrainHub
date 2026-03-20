import { test, expect, devices } from "@playwright/test";

/**
 * E2E tests for responsive design on mobile devices.
 * Verifies critical pages render correctly on small screens.
 */

const mobileViewport = devices["iPhone 13"].viewport;

test.describe("Mobile Responsive - Auth Pages", () => {
  test.use({ viewport: mobileViewport });

  test("login page is usable on mobile", async ({ page }) => {
    await page.goto("/es/login");

    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // Verify inputs are not overflowing
    const emailBox = await emailInput.boundingBox();
    expect(emailBox!.width).toBeLessThanOrEqual(mobileViewport!.width);
  });

  test("register page is usable on mobile", async ({ page }) => {
    await page.goto("/es/register");

    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible({ timeout: 10000 });

    const passwordInputs = page.locator('input[type="password"]');
    await expect(passwordInputs.first()).toBeVisible();
  });

  test("join page shows error on mobile", async ({ page }) => {
    await page.goto("/es/join/00000000-0000-0000-0000-000000000000");

    await expect(
      page.locator("text=invalidToken").or(page.locator('[class*="destructive"]'))
    ).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Mobile Responsive - Navigation", () => {
  test.use({ viewport: mobileViewport });

  test("login page does not have horizontal scroll", async ({ page }) => {
    await page.goto("/es/login");
    await page.waitForLoadState("networkidle");

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(mobileViewport!.width + 1);
  });

  test("register page does not have horizontal scroll", async ({ page }) => {
    await page.goto("/es/register");
    await page.waitForLoadState("networkidle");

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(mobileViewport!.width + 1);
  });
});

test.describe("Tablet Responsive", () => {
  test.use({ viewport: devices["iPad (gen 7)"].viewport });

  test("login page renders on tablet", async ({ page }) => {
    await page.goto("/es/login");

    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});
