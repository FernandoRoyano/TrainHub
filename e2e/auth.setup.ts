import { expect } from "@playwright/test";

/**
 * Shared auth helpers for E2E tests.
 * Uses environment variables for credentials:
 *   E2E_TRAINER_EMAIL / E2E_TRAINER_PASSWORD
 *   E2E_CLIENT_EMAIL / E2E_CLIENT_PASSWORD
 */

export async function loginAsTrainer(page: import("@playwright/test").Page) {
  const email = process.env.E2E_TRAINER_EMAIL || "wellnessrealoficial@gmail.com";
  const password = process.env.E2E_TRAINER_PASSWORD || "";

  if (!password) {
    throw new Error("E2E_TRAINER_PASSWORD env var required for E2E tests");
  }

  await page.goto("/es/login");
  await page.waitForLoadState("networkidle");
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard", { timeout: 15000 });
  await expect(page).toHaveURL(/dashboard/);
}

export async function loginAsClient(page: import("@playwright/test").Page) {
  const email = process.env.E2E_CLIENT_EMAIL || "";
  const password = process.env.E2E_CLIENT_PASSWORD || "";

  if (!email || !password) {
    throw new Error("E2E_CLIENT_EMAIL and E2E_CLIENT_PASSWORD env vars required");
  }

  await page.goto("/es/login");
  await page.waitForLoadState("networkidle");
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  // Client may redirect to my-plan, my-routine, or any client page
  await page.waitForURL(/my-(plan|routine|nutrition|messages)/, { timeout: 15000 });
  await expect(page).toHaveURL(/my-/);
}
