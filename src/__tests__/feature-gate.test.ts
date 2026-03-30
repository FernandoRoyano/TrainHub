import { describe, it, expect } from "vitest";
import { isFeatureEnabled } from "@/lib/feature-gate";
import type { ServiceTierFeatures } from "@/lib/validations/service-tier";

const allEnabled: ServiceTierFeatures = {
  training: true,
  nutrition: true,
  messaging: true,
  progress_tracking: true,
  measurements: true,
  checkins: true,
  questionnaires: true,
};

const allDisabled: ServiceTierFeatures = {
  training: false,
  nutrition: false,
  messaging: false,
  progress_tracking: false,
  measurements: false,
  checkins: false,
  questionnaires: false,
};

describe("isFeatureEnabled", () => {
  it("returns true when features is null (backward compat)", () => {
    expect(isFeatureEnabled(null, "training")).toBe(true);
    expect(isFeatureEnabled(null, "nutrition")).toBe(true);
  });

  it("returns true when features is undefined", () => {
    expect(isFeatureEnabled(undefined, "training")).toBe(true);
    expect(isFeatureEnabled(undefined, "messaging")).toBe(true);
  });

  it("returns true for an enabled feature", () => {
    expect(isFeatureEnabled(allEnabled, "training")).toBe(true);
    expect(isFeatureEnabled(allEnabled, "nutrition")).toBe(true);
  });

  it("returns false for a disabled feature", () => {
    expect(isFeatureEnabled(allDisabled, "training")).toBe(false);
    expect(isFeatureEnabled(allDisabled, "nutrition")).toBe(false);
  });

  it("all 7 feature keys work correctly when enabled", () => {
    const keys = [
      "training",
      "nutrition",
      "messaging",
      "progress_tracking",
      "measurements",
      "checkins",
      "questionnaires",
    ] as const;

    for (const key of keys) {
      expect(isFeatureEnabled(allEnabled, key)).toBe(true);
    }
  });

  it("all 7 feature keys work correctly when disabled", () => {
    const keys = [
      "training",
      "nutrition",
      "messaging",
      "progress_tracking",
      "measurements",
      "checkins",
      "questionnaires",
    ] as const;

    for (const key of keys) {
      expect(isFeatureEnabled(allDisabled, key)).toBe(false);
    }
  });

  it("returns correct value for mixed features", () => {
    const mixed: ServiceTierFeatures = {
      training: true,
      nutrition: false,
      messaging: true,
      progress_tracking: false,
      measurements: true,
      checkins: false,
      questionnaires: true,
    };

    expect(isFeatureEnabled(mixed, "training")).toBe(true);
    expect(isFeatureEnabled(mixed, "nutrition")).toBe(false);
    expect(isFeatureEnabled(mixed, "messaging")).toBe(true);
    expect(isFeatureEnabled(mixed, "progress_tracking")).toBe(false);
    expect(isFeatureEnabled(mixed, "measurements")).toBe(true);
    expect(isFeatureEnabled(mixed, "checkins")).toBe(false);
    expect(isFeatureEnabled(mixed, "questionnaires")).toBe(true);
  });
});
