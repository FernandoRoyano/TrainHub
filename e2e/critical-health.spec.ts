import { test, expect, type Page, type ConsoleMessage, type Request } from "@playwright/test";
import { loginAsTrainer } from "./auth.setup";

/**
 * E2E de salud de las páginas críticas del trainer.
 *
 * Vigila consola y red mientras navega para detectar de forma automática los
 * fallos que rompieron producción y que NINGÚN test unitario detecta:
 *   - Violaciones de Content Security Policy (Turnstile, imágenes, videos).
 *   - Peticiones REST con status 400 (p.ej. columna inexistente en una query).
 *   - Traducciones faltantes (MISSING_MESSAGE de next-intl).
 */

interface PageProbe {
  cspViolations: string[];
  missingMessages: string[];
  badRequests: string[];
}

function attachProbe(page: Page): PageProbe {
  const probe: PageProbe = { cspViolations: [], missingMessages: [], badRequests: [] };

  page.on("console", (msg: ConsoleMessage) => {
    const text = msg.text();
    if (/content security policy|refused to (load|connect)/i.test(text)) {
      probe.cspViolations.push(text);
    }
    if (/MISSING_MESSAGE/i.test(text)) {
      probe.missingMessages.push(text);
    }
  });

  page.on("requestfinished", async (req: Request) => {
    const res = await req.response();
    if (!res) return;
    // Solo nos importan errores de cliente de nuestra API/Supabase (no 401/403
    // que son de auth ni 404 de assets opcionales).
    if (res.status() === 400) {
      probe.badRequests.push(`400 ${req.method()} ${req.url()}`);
    }
  });

  return probe;
}

function assertClean(probe: PageProbe, pageName: string) {
  expect(probe.cspViolations, `CSP violations en ${pageName}:\n${probe.cspViolations.join("\n")}`).toEqual([]);
  expect(probe.missingMessages, `Traducciones faltantes en ${pageName}:\n${probe.missingMessages.join("\n")}`).toEqual([]);
  expect(probe.badRequests, `Peticiones 400 en ${pageName}:\n${probe.badRequests.join("\n")}`).toEqual([]);
}

const CRITICAL_PAGES = [
  { name: "dashboard", path: "/es/dashboard" },
  { name: "clients", path: "/es/clients" },
  { name: "exercises", path: "/es/exercises" },
  { name: "routines", path: "/es/routines" },
  { name: "nutrition", path: "/es/nutrition" },
  { name: "coaching-plans", path: "/es/coaching-plans" },
  { name: "service-tiers", path: "/es/service-tiers" },
  { name: "questionnaires", path: "/es/questionnaires" },
  { name: "calendar", path: "/es/calendar" },
  { name: "help", path: "/es/help" },
];

test.describe("Critical pages health", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTrainer(page);
  });

  for (const { name, path } of CRITICAL_PAGES) {
    test(`${name} carga sin CSP/400/traducciones rotas`, async ({ page }) => {
      const probe = attachProbe(page);

      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1500);

      // La página debe renderizar un encabezado (no quedarse en blanco).
      await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });

      assertClean(probe, name);
    });
  }
});

test.describe("Critical happy path", () => {
  test("trainer puede crear un ejercicio", async ({ page }) => {
    await loginAsTrainer(page);
    const probe = attachProbe(page);

    await page.goto("/es/exercises/new");
    await page.waitForLoadState("networkidle");

    const name = `E2E Test Exercise ${Date.now()}`;
    await page.fill('input[name="name"]', name);

    await page.click('button[type="submit"]');
    // Tras crear redirige a la lista o al detalle.
    await page.waitForURL(/\/exercises/, { timeout: 15000 });

    assertClean(probe, "create-exercise");
  });
});
