import { describe, it, expect } from "vitest";
import esMessages from "../../messages/es.json";
import enMessages from "../../messages/en.json";

/**
 * Tests that all i18n keys exist in both languages.
 * Catches missing translations that show raw keys to users.
 */

function getAllKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      keys.push(...getAllKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

describe("i18n Translation Completeness", () => {
  const esKeys = getAllKeys(esMessages);
  const enKeys = getAllKeys(enMessages);

  it("ES and EN have the same number of keys", () => {
    const esMissing = enKeys.filter((k) => !esKeys.includes(k));
    const enMissing = esKeys.filter((k) => !enKeys.includes(k));

    if (esMissing.length > 0) {
      console.warn("Missing in ES:", esMissing);
    }
    if (enMissing.length > 0) {
      console.warn("Missing in EN:", enMissing);
    }

    expect(esMissing).toEqual([]);
    expect(enMissing).toEqual([]);
  });

  it("all top-level sections exist in both languages", () => {
    const esSections = Object.keys(esMessages);
    const enSections = Object.keys(enMessages);

    expect(esSections.sort()).toEqual(enSections.sort());
  });

  it("critical sections have content", () => {
    const criticalSections = [
      "common",
      "auth",
      "nav",
      "dashboard",
      "routines",
      "clients",
      "exercises",
    ];

    for (const section of criticalSections) {
      expect(esMessages).toHaveProperty(section);
      expect(enMessages).toHaveProperty(section);
    }
  });

  it("no translation value is an empty string", () => {
    const emptyEs = esKeys.filter((k) => {
      const parts = k.split(".");
      let val: unknown = esMessages;
      for (const p of parts) {
        val = (val as Record<string, unknown>)[p];
      }
      return val === "";
    });

    expect(emptyEs).toEqual([]);
  });

  it("no translation value contains untranslated key pattern", () => {
    const suspicious = esKeys.filter((k) => {
      const parts = k.split(".");
      let val: unknown = esMessages;
      for (const p of parts) {
        val = (val as Record<string, unknown>)[p];
      }
      // Check for values that look like keys (camelCase with dots)
      return typeof val === "string" && /^[a-z]+\.[a-z]+\.[a-z]+$/i.test(val);
    });

    expect(suspicious).toEqual([]);
  });
});
