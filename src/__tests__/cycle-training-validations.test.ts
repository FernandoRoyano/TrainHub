import { describe, it, expect } from "vitest";
import {
  cycleTrainingConfigSchema,
  cyclePerformanceLogSchema,
  cyclePrivacySchema,
} from "@/lib/validations/cycle-training";

describe("cycleTrainingConfigSchema", () => {
  const validConfig = {
    enabled: true,
    menstrual_intensity: -20,
    menstrual_volume: -15,
    menstrual_notes: "Prioriza yoga",
    follicular_intensity: 0,
    follicular_volume: 0,
    follicular_notes: null,
    ovulation_intensity: 10,
    ovulation_volume: 5,
    ovulation_notes: null,
    luteal_intensity: -10,
    luteal_volume: -10,
    luteal_notes: null,
    auto_adjust: true,
  };

  it("validates a correct config", () => {
    const result = cycleTrainingConfigSchema.safeParse(validConfig);
    expect(result.success).toBe(true);
  });

  it("allows intensity and volume from -50 to +50", () => {
    const result = cycleTrainingConfigSchema.safeParse({
      ...validConfig,
      menstrual_intensity: -50,
      ovulation_intensity: 50,
    });
    expect(result.success).toBe(true);
  });

  it("rejects intensity below -50", () => {
    const result = cycleTrainingConfigSchema.safeParse({
      ...validConfig,
      menstrual_intensity: -51,
    });
    expect(result.success).toBe(false);
  });

  it("rejects intensity above 50", () => {
    const result = cycleTrainingConfigSchema.safeParse({
      ...validConfig,
      ovulation_intensity: 51,
    });
    expect(result.success).toBe(false);
  });

  it("rejects volume below -50", () => {
    const result = cycleTrainingConfigSchema.safeParse({
      ...validConfig,
      luteal_volume: -60,
    });
    expect(result.success).toBe(false);
  });

  it("allows empty string notes as null/optional", () => {
    const result = cycleTrainingConfigSchema.safeParse({
      ...validConfig,
      menstrual_notes: "",
    });
    // Empty string is a valid string
    expect(result.success).toBe(true);
  });

  it("rejects notes longer than 200 characters", () => {
    const result = cycleTrainingConfigSchema.safeParse({
      ...validConfig,
      menstrual_notes: "x".repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it("rejects when enabled is missing", () => {
    const { enabled, ...withoutEnabled } = validConfig;
    const result = cycleTrainingConfigSchema.safeParse(withoutEnabled);
    expect(result.success).toBe(false);
  });

  it("rejects when auto_adjust is not boolean", () => {
    const result = cycleTrainingConfigSchema.safeParse({
      ...validConfig,
      auto_adjust: "yes",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-numeric intensity values", () => {
    const result = cycleTrainingConfigSchema.safeParse({
      ...validConfig,
      follicular_intensity: "high",
    });
    expect(result.success).toBe(false);
  });
});

describe("cyclePerformanceLogSchema", () => {
  it("validates a complete log", () => {
    const result = cyclePerformanceLogSchema.safeParse({
      perceived_effort: 7,
      energy_before: 3,
      energy_after: 4,
      performance_rating: 4,
      training_symptoms: ["cramps", "fatigue"],
      notes: "Buen entrenamiento",
    });
    expect(result.success).toBe(true);
  });

  it("validates an empty log (all optional)", () => {
    const result = cyclePerformanceLogSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("rejects perceived_effort below 1", () => {
    const result = cyclePerformanceLogSchema.safeParse({
      perceived_effort: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects perceived_effort above 10", () => {
    const result = cyclePerformanceLogSchema.safeParse({
      perceived_effort: 11,
    });
    expect(result.success).toBe(false);
  });

  it("rejects energy_before below 1", () => {
    const result = cyclePerformanceLogSchema.safeParse({
      energy_before: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects energy_after above 5", () => {
    const result = cyclePerformanceLogSchema.safeParse({
      energy_after: 6,
    });
    expect(result.success).toBe(false);
  });

  it("rejects performance_rating outside 1-5", () => {
    const result = cyclePerformanceLogSchema.safeParse({
      performance_rating: 6,
    });
    expect(result.success).toBe(false);
  });

  it("rejects notes longer than 500 characters", () => {
    const result = cyclePerformanceLogSchema.safeParse({
      notes: "x".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid training_symptoms array", () => {
    const result = cyclePerformanceLogSchema.safeParse({
      training_symptoms: ["cramps", "headache", "bloating"],
    });
    expect(result.success).toBe(true);
  });
});

describe("cyclePrivacySchema", () => {
  const validPrivacy = {
    share_phase: true,
    share_symptoms: false,
    share_mood: false,
    share_flow: false,
    share_energy: true,
    share_predictions: false,
    anonymous_mode: false,
  };

  it("validates correct privacy settings", () => {
    const result = cyclePrivacySchema.safeParse(validPrivacy);
    expect(result.success).toBe(true);
  });

  it("rejects when share_phase is missing", () => {
    const { share_phase, ...without } = validPrivacy;
    const result = cyclePrivacySchema.safeParse(without);
    expect(result.success).toBe(false);
  });

  it("rejects non-boolean values", () => {
    const result = cyclePrivacySchema.safeParse({
      ...validPrivacy,
      anonymous_mode: "yes",
    });
    expect(result.success).toBe(false);
  });

  it("allows all fields to be true", () => {
    const allTrue = Object.fromEntries(
      Object.keys(validPrivacy).map((k) => [k, true])
    );
    const result = cyclePrivacySchema.safeParse(allTrue);
    expect(result.success).toBe(true);
  });

  it("allows all fields to be false", () => {
    const allFalse = Object.fromEntries(
      Object.keys(validPrivacy).map((k) => [k, false])
    );
    const result = cyclePrivacySchema.safeParse(allFalse);
    expect(result.success).toBe(true);
  });

  it("requires all 7 fields", () => {
    const result = cyclePrivacySchema.safeParse({ share_phase: true });
    expect(result.success).toBe(false);
  });
});
