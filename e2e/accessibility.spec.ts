import { test, expect } from "@playwright/test";

/**
 * E2E tests for basic accessibility.
 * Verifies keyboard navigation, ARIA labels, and semantic HTML.
 */

test.describe("Accessibility - Login Page", () => {
  test("form inputs have associated labels", async ({ page }) => {
    await page.goto("/es/login");
    await page.waitForLoadState("networkidle");

    // Email input should have a label
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible({ timeout: 10000 });

    // Check input has an id and a label points to it, or it's wrapped in a label
    const hasLabel = await emailInput.evaluate((el) => {
      const id = el.id;
      if (id && document.querySelector(`label[for="${id}"]`)) return true;
      if (el.closest("label")) return true;
      if (el.getAttribute("aria-label")) return true;
      if (el.getAttribute("aria-labelledby")) return true;
      return false;
    });
    expect(hasLabel).toBe(true);
  });

  test("can tab through login form", async ({ page }) => {
    await page.goto("/es/login");
    await page.waitForLoadState("networkidle");

    // Tab to email input
    await page.keyboard.press("Tab");
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
    // Should focus an interactive element
    expect(["INPUT", "BUTTON", "A"]).toContain(firstFocused);
  });

  test("submit button is focusable", async ({ page }) => {
    await page.goto("/es/login");

    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible({ timeout: 10000 });

    await submitBtn.focus();
    const isFocused = await submitBtn.evaluate(
      (el) => document.activeElement === el
    );
    expect(isFocused).toBe(true);
  });

  test("password input has correct type", async ({ page }) => {
    await page.goto("/es/login");

    const pwInput = page.locator('input[type="password"]');
    await expect(pwInput).toBeVisible({ timeout: 10000 });

    const type = await pwInput.getAttribute("type");
    expect(type).toBe("password");
  });
});

test.describe("Accessibility - Register Page", () => {
  test("form inputs have autocomplete attributes", async ({ page }) => {
    await page.goto("/es/register");
    await page.waitForLoadState("networkidle");

    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible({ timeout: 10000 });

    const emailAutocomplete = await emailInput.getAttribute("autocomplete");
    expect(emailAutocomplete).toBe("email");

    const nameInput = page.locator('input[autocomplete="name"]');
    await expect(nameInput).toBeVisible();
  });

  test("password fields have new-password autocomplete", async ({ page }) => {
    await page.goto("/es/register");
    await page.waitForLoadState("networkidle");

    const pwInputs = page.locator('input[autocomplete="new-password"]');
    const count = await pwInputs.count();
    expect(count).toBeGreaterThanOrEqual(2); // password + confirm
  });
});

test.describe("Accessibility - Join Page", () => {
  test("error state has visible alert icon", async ({ page }) => {
    await page.goto("/es/join/00000000-0000-0000-0000-000000000000");

    // Should show some visual indicator of error
    const errorIndicator = page
      .locator('[class*="destructive"]')
      .or(page.locator("svg"))
      .first();
    await expect(errorIndicator).toBeVisible({ timeout: 10000 });
  });

  test("has a link to navigate away from error", async ({ page }) => {
    await page.goto("/es/join/00000000-0000-0000-0000-000000000000");

    // Should have a link to login or home
    const link = page.locator("a").first();
    await expect(link).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Accessibility - General", () => {
  test("pages have html lang attribute", async ({ page }) => {
    await page.goto("/es/login");
    await page.waitForLoadState("networkidle");

    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBeTruthy();
  });

  test("pages have a viewport meta tag", async ({ page }) => {
    await page.goto("/es/login");

    const viewport = await page.locator('meta[name="viewport"]').getAttribute("content");
    expect(viewport).toContain("width=device-width");
  });
});
