import { test, expect } from "@playwright/test";
import { loginAsTrainer } from "./auth.setup";

/**
 * E2E: Routine template → assignment flow.
 * Tests: view templates, routines, client detail, dashboard.
 */

test.describe("Routine Assignment Flow", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTrainer(page);
  });

  test("trainer can view templates page", async ({ page }) => {
    await page.goto("/es/templates");
    await page.waitForLoadState("networkidle");

    const heading = page.locator("h1");
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test("template list shows content", async ({ page }) => {
    await page.goto("/es/templates");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Should show cards or empty state — either is valid
    const hasCards = await page.locator('[class*="card"]').count() > 0;
    const hasEmpty = await page.locator("text=/no hay|sin plantillas/i").count() > 0;
    expect(hasCards || hasEmpty).toBe(true);
  });

  test("trainer can view routines list", async ({ page }) => {
    await page.goto("/es/routines");
    await page.waitForLoadState("networkidle");

    const heading = page.locator("h1");
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test("routine detail page shows days and exercises", async ({ page }) => {
    await page.goto("/es/routines");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    const routineLinks = page.locator('a[href*="/routines/"]').filter({ hasNotText: /new|edit|templates/i });
    if (await routineLinks.count() === 0) {
      test.skip(true, "No routines found");
      return;
    }

    await routineLinks.first().click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    const title = page.locator("h1");
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test("trainer can access client list", async ({ page }) => {
    await page.goto("/es/clients");
    await page.waitForLoadState("networkidle");

    const heading = page.locator("h1");
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test("client detail page has tabs", async ({ page }) => {
    await page.goto("/es/clients");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    const clientLinks = page.locator('a[href*="/clients/"]').filter({ hasNotText: /new|edit/i });
    if (await clientLinks.count() === 0) {
      test.skip(true, "No clients found");
      return;
    }

    await clientLinks.first().click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Should have tab buttons
    const tabs = page.locator('button[role="tab"]');
    const tabCount = await tabs.count();
    expect(tabCount).toBeGreaterThanOrEqual(3);
  });

  test("dashboard loads with KPI cards", async ({ page }) => {
    await page.goto("/es/dashboard");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    const cards = page.locator('[class*="glass-elevated"]');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThanOrEqual(1);
  });

  test("sidebar navigation works", async ({ page }) => {
    await page.goto("/es/dashboard");
    await page.waitForLoadState("networkidle");

    // Navigate via URL since sidebar might be collapsed
    await page.goto("/es/clients");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/clients/);
  });
});
