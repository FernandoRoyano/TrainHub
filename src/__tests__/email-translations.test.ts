import { describe, it, expect } from "vitest";
import {
  getEmailTranslations,
  getLocaleForEmail,
} from "@/lib/email/translations";

describe("getLocaleForEmail", () => {
  it("returns 'es' as default when no locale provided", () => {
    expect(getLocaleForEmail()).toBe("es");
  });

  it("returns 'es' when locale is null", () => {
    expect(getLocaleForEmail(null)).toBe("es");
  });

  it("returns 'es' when locale is undefined", () => {
    expect(getLocaleForEmail(undefined)).toBe("es");
  });

  it("returns 'es' for valid Spanish locale", () => {
    expect(getLocaleForEmail("es")).toBe("es");
  });

  it("returns 'en' for valid English locale", () => {
    expect(getLocaleForEmail("en")).toBe("en");
  });

  it("returns 'es' for unsupported locale", () => {
    expect(getLocaleForEmail("fr")).toBe("es");
  });

  it("returns 'es' for empty string", () => {
    expect(getLocaleForEmail("")).toBe("es");
  });
});

describe("getEmailTranslations", () => {
  it("returns Spanish translations for 'es' locale", () => {
    const t = getEmailTranslations("es");
    expect(t.inviteCta).toBe("Crear mi cuenta");
  });

  it("returns English translations for 'en' locale", () => {
    const t = getEmailTranslations("en");
    expect(t.inviteCta).toBe("Create my account");
  });

  it("falls back to Spanish for unknown locale", () => {
    const t = getEmailTranslations("de");
    expect(t.inviteCta).toBe("Crear mi cuenta");
  });

  it("contains inviteSubject with {trainer} placeholder", () => {
    const t = getEmailTranslations("en");
    expect(t.inviteSubject).toContain("{trainer}");
  });

  it("contains inviteTitle with {name} placeholder", () => {
    const t = getEmailTranslations("en");
    expect(t.inviteTitle).toContain("{name}");
  });

  it("contains inviteBody with {trainer} placeholder", () => {
    const t = getEmailTranslations("en");
    expect(t.inviteBody).toContain("{trainer}");
  });

  it("contains welcomeSubject key", () => {
    const t = getEmailTranslations("es");
    expect(t.welcomeSubject).toBeDefined();
    expect(typeof t.welcomeSubject).toBe("string");
  });

  it("contains routineAssignedSubject key", () => {
    const t = getEmailTranslations("en");
    expect(t.routineAssignedSubject).toBeDefined();
  });

  it("contains mealPlanAssignedSubject key", () => {
    const t = getEmailTranslations("en");
    expect(t.mealPlanAssignedSubject).toBeDefined();
  });

  it("returns same keys for both locales", () => {
    const esKeys = Object.keys(getEmailTranslations("es")).sort();
    const enKeys = Object.keys(getEmailTranslations("en")).sort();
    expect(esKeys).toEqual(enKeys);
  });
});
