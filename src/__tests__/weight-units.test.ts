import { describe, it, expect } from "vitest";
import {
  kgToLb,
  lbToKg,
  toDisplayWeight,
  toStoredWeightKg,
  formatWeight,
} from "@/lib/weight-units";

describe("weight-units", () => {
  it("kgToLb/lbToKg round-trip within floating-point tolerance", () => {
    expect(lbToKg(kgToLb(82.5))).toBeCloseTo(82.5, 5);
  });

  it("toDisplayWeight returns null for null/undefined", () => {
    expect(toDisplayWeight(null, "kg")).toBeNull();
    expect(toDisplayWeight(undefined, "lb")).toBeNull();
  });

  it("toDisplayWeight converts and rounds to 1 decimal", () => {
    expect(toDisplayWeight(100, "kg")).toBe(100);
    expect(toDisplayWeight(100, "lb")).toBe(220.5);
  });

  it("toStoredWeightKg converts lb input to kg, rounded to 2 decimals", () => {
    expect(toStoredWeightKg("182", "lb")).toBeCloseTo(82.55, 2);
    expect(toStoredWeightKg("82.5", "kg")).toBe(82.5);
  });

  it("toStoredWeightKg returns null for empty/invalid input", () => {
    expect(toStoredWeightKg("", "lb")).toBeNull();
    expect(toStoredWeightKg(null, "kg")).toBeNull();
  });

  it("formatWeight renders a suffixed string or a dash for null", () => {
    expect(formatWeight(null, "kg")).toBe("—");
    expect(formatWeight(82.5, "kg")).toBe("82.5kg");
    expect(formatWeight(100, "lb")).toBe("220.5lb");
  });
});
