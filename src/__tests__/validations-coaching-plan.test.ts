import { describe, it, expect } from "vitest";
import {
  createCoachingPlanSchema,
  assignCoachingPlanSchema,
} from "@/lib/validations/coaching-plan";

const mockT = (key: string, values?: Record<string, unknown>) =>
  values ? `${key}: ${JSON.stringify(values)}` : key;

const uuid = "550e8400-e29b-41d4-a716-446655440000";

describe("Coaching plan schema", () => {
  const schema = createCoachingPlanSchema(mockT);

  it("accepts valid plan data", () => {
    const result = schema.safeParse({
      name: "12-Week Shred",
      description: "Fat loss program",
      cover_image: "https://example.com/img.jpg",
      duration_weeks: 12,
      service_tier_id: uuid,
      routine_template_id: uuid,
      meal_plan_template_id: uuid,
      questionnaire_template_ids: [uuid],
      price: 199.99,
      currency: "USD",
      tags: ["fat-loss", "beginner"],
      is_active: true,
      is_published: false,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = schema.safeParse({
      duration_weeks: 4,
      is_active: true,
      is_published: false,
    });
    expect(result.success).toBe(false);
  });

  it("rejects name shorter than 2 chars", () => {
    const result = schema.safeParse({
      name: "X",
      duration_weeks: 4,
      is_active: true,
      is_published: false,
    });
    expect(result.success).toBe(false);
  });

  it("duration_weeks minimum is 1", () => {
    const result = schema.safeParse({
      name: "Short Plan",
      duration_weeks: 0,
      is_active: true,
      is_published: false,
    });
    expect(result.success).toBe(false);
  });

  it("duration_weeks maximum is 52", () => {
    const result = schema.safeParse({
      name: "Too Long",
      duration_weeks: 53,
      is_active: true,
      is_published: false,
    });
    expect(result.success).toBe(false);
  });

  it("accepts duration_weeks at boundaries (1 and 52)", () => {
    const result1 = schema.safeParse({
      name: "Min Plan",
      duration_weeks: 1,
      is_active: true,
      is_published: false,
    });
    expect(result1.success).toBe(true);

    const result52 = schema.safeParse({
      name: "Max Plan",
      duration_weeks: 52,
      is_active: true,
      is_published: false,
    });
    expect(result52.success).toBe(true);
  });

  it("cover_image is optional", () => {
    const result = schema.safeParse({
      name: "No Image",
      duration_weeks: 8,
      is_active: true,
      is_published: false,
    });
    expect(result.success).toBe(true);
  });

  it("cover_image accepts empty string", () => {
    const result = schema.safeParse({
      name: "Empty Image",
      duration_weeks: 8,
      cover_image: "",
      is_active: true,
      is_published: false,
    });
    expect(result.success).toBe(true);
  });

  it("price is optional", () => {
    const result = schema.safeParse({
      name: "Free Plan",
      duration_weeks: 4,
      is_active: true,
      is_published: true,
    });
    expect(result.success).toBe(true);
  });

  it("service_tier_id is optional", () => {
    const result = schema.safeParse({
      name: "No Tier",
      duration_weeks: 4,
      is_active: true,
      is_published: false,
    });
    expect(result.success).toBe(true);
  });

  it("tags accepts string array", () => {
    const result = schema.safeParse({
      name: "Tagged Plan",
      duration_weeks: 6,
      tags: ["muscle-building", "advanced", "high-volume"],
      is_active: true,
      is_published: false,
    });
    expect(result.success).toBe(true);
  });

  it("tags rejects non-string array items", () => {
    const result = schema.safeParse({
      name: "Bad Tags",
      duration_weeks: 6,
      tags: [123, true],
      is_active: true,
      is_published: false,
    });
    expect(result.success).toBe(false);
  });

  it("questionnaire_template_ids accepts UUID array", () => {
    const result = schema.safeParse({
      name: "With Questionnaires",
      duration_weeks: 4,
      questionnaire_template_ids: [uuid, "660e8400-e29b-41d4-a716-446655440001"],
      is_active: true,
      is_published: false,
    });
    expect(result.success).toBe(true);
  });
});

describe("Assign coaching plan schema", () => {
  it("accepts valid assignment data", () => {
    const result = assignCoachingPlanSchema.safeParse({
      client_id: uuid,
      coaching_plan_id: uuid,
      start_date: "2024-06-01",
    });
    expect(result.success).toBe(true);
  });

  it("requires client_id", () => {
    const result = assignCoachingPlanSchema.safeParse({
      coaching_plan_id: uuid,
      start_date: "2024-06-01",
    });
    expect(result.success).toBe(false);
  });

  it("requires coaching_plan_id", () => {
    const result = assignCoachingPlanSchema.safeParse({
      client_id: uuid,
      start_date: "2024-06-01",
    });
    expect(result.success).toBe(false);
  });

  it("requires start_date (non-empty)", () => {
    const result = assignCoachingPlanSchema.safeParse({
      client_id: uuid,
      coaching_plan_id: uuid,
      start_date: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional notes", () => {
    const result = assignCoachingPlanSchema.safeParse({
      client_id: uuid,
      coaching_plan_id: uuid,
      start_date: "2024-06-01",
      notes: "Starting Monday",
    });
    expect(result.success).toBe(true);
  });
});
