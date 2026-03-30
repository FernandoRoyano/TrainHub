import { describe, it, expect } from "vitest";
import {
  createServiceTierSchema,
  assignServiceTierSchema,
  BILLING_INTERVALS,
  FEATURE_KEYS,
} from "@/lib/validations/service-tier";

const mockT = (key: string, values?: Record<string, unknown>) =>
  values ? `${key}: ${JSON.stringify(values)}` : key;

const validFeatures = {
  training: true,
  nutrition: true,
  messaging: true,
  progress_tracking: false,
  measurements: false,
  checkins: true,
  questionnaires: false,
};

describe("Service tier schema", () => {
  const schema = createServiceTierSchema(mockT);

  it("accepts valid tier data", () => {
    const result = schema.safeParse({
      name: "Pro Tier",
      description: "For serious athletes",
      color: "#3b82f6",
      price: 49.99,
      currency: "USD",
      billing_interval: "monthly",
      features: validFeatures,
      max_revisions_per_month: 4,
      is_active: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = schema.safeParse({
      features: validFeatures,
      is_active: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects name shorter than 2 chars", () => {
    const result = schema.safeParse({
      name: "X",
      features: validFeatures,
      is_active: true,
    });
    expect(result.success).toBe(false);
  });

  it("requires features to be an object with booleans", () => {
    const result = schema.safeParse({
      name: "Basic",
      features: {
        training: "yes", // string instead of boolean
        nutrition: true,
        messaging: true,
        progress_tracking: true,
        measurements: true,
        checkins: true,
        questionnaires: true,
      },
      is_active: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects features missing a key", () => {
    const result = schema.safeParse({
      name: "Basic",
      features: {
        training: true,
        nutrition: true,
        // missing other keys
      },
      is_active: true,
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid billing intervals", () => {
    for (const interval of BILLING_INTERVALS) {
      const result = schema.safeParse({
        name: "Test Tier",
        billing_interval: interval,
        features: validFeatures,
        is_active: true,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid billing interval", () => {
    const result = schema.safeParse({
      name: "Test Tier",
      billing_interval: "weekly",
      features: validFeatures,
      is_active: true,
    });
    expect(result.success).toBe(false);
  });

  it("price is optional", () => {
    const result = schema.safeParse({
      name: "Free Tier",
      features: validFeatures,
      is_active: true,
    });
    expect(result.success).toBe(true);
  });

  it("price must be numeric when provided", () => {
    const result = schema.safeParse({
      name: "Bad Price",
      price: "fifty",
      features: validFeatures,
      is_active: true,
    });
    expect(result.success).toBe(false);
  });

  it("price cannot be negative", () => {
    const result = schema.safeParse({
      name: "Negative",
      price: -10,
      features: validFeatures,
      is_active: true,
    });
    expect(result.success).toBe(false);
  });

  it("has 7 feature keys", () => {
    expect(FEATURE_KEYS).toHaveLength(7);
  });
});

describe("Assign service tier schema", () => {
  const uuid = "550e8400-e29b-41d4-a716-446655440000";

  it("accepts valid assignment", () => {
    const result = assignServiceTierSchema.safeParse({
      client_id: uuid,
      service_tier_id: uuid,
    });
    expect(result.success).toBe(true);
  });

  it("requires client_id as UUID", () => {
    const result = assignServiceTierSchema.safeParse({
      client_id: "not-a-uuid",
      service_tier_id: uuid,
    });
    expect(result.success).toBe(false);
  });

  it("requires service_tier_id as UUID", () => {
    const result = assignServiceTierSchema.safeParse({
      client_id: uuid,
      service_tier_id: "bad-id",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional start_date and notes", () => {
    const result = assignServiceTierSchema.safeParse({
      client_id: uuid,
      service_tier_id: uuid,
      start_date: "2024-06-01",
      notes: "Upgrade to pro",
    });
    expect(result.success).toBe(true);
  });
});
