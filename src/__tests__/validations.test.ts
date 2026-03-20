import { describe, it, expect } from "vitest";
import { createBlockSchema } from "@/lib/validations/block";
import { createRegisterSchema } from "@/lib/validations/auth";

const mockT = (key: string, values?: Record<string, unknown>) =>
  values ? `${key}: ${JSON.stringify(values)}` : key;

describe("Block validation schema", () => {
  const schema = createBlockSchema(mockT);

  it("accepts valid warmup block", () => {
    const result = schema.safeParse({
      name: "Morning Warmup",
      block_type: "warmup",
      exercises: [],
    });
    expect(result.success).toBe(true);
  });

  it("accepts all valid block types", () => {
    for (const type of ["warmup", "cooldown", "circuit", "custom"]) {
      const result = schema.safeParse({
        name: "Test Block",
        block_type: type,
        exercises: [],
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid block type", () => {
    const result = schema.safeParse({
      name: "Test",
      block_type: "invalid_type",
      exercises: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects name shorter than 2 chars", () => {
    const result = schema.safeParse({
      name: "A",
      block_type: "warmup",
      exercises: [],
    });
    expect(result.success).toBe(false);
  });

  it("accepts block with exercises", () => {
    const result = schema.safeParse({
      name: "Leg Day",
      block_type: "custom",
      exercises: [
        {
          exercise_id: "550e8400-e29b-41d4-a716-446655440000",
          order_index: 0,
          sets: 3,
          reps: "12",
          rest_seconds: 90,
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects exercise with sets > 20", () => {
    const result = schema.safeParse({
      name: "Leg Day",
      block_type: "custom",
      exercises: [
        {
          exercise_id: "550e8400-e29b-41d4-a716-446655440000",
          order_index: 0,
          sets: 25,
          reps: "12",
          rest_seconds: 90,
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects exercise with rest > 600 seconds", () => {
    const result = schema.safeParse({
      name: "Leg Day",
      block_type: "custom",
      exercises: [
        {
          exercise_id: "550e8400-e29b-41d4-a716-446655440000",
          order_index: 0,
          sets: 3,
          reps: "12",
          rest_seconds: 700,
        },
      ],
    });
    expect(result.success).toBe(false);
  });
});

describe("Register validation schema", () => {
  const schema = createRegisterSchema(mockT);

  it("accepts valid registration data", () => {
    const result = schema.safeParse({
      fullName: "Mary Bornaghi",
      email: "mary@example.com",
      password: "SecurePass123!",
      confirmPassword: "SecurePass123!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = schema.safeParse({
      fullName: "Mary Bornaghi",
      email: "mary@example.com",
      password: "SecurePass123!",
      confirmPassword: "DifferentPass456!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = schema.safeParse({
      fullName: "Mary",
      email: "not-an-email",
      password: "SecurePass123!",
      confirmPassword: "SecurePass123!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = schema.safeParse({
      fullName: "",
      email: "mary@example.com",
      password: "SecurePass123!",
      confirmPassword: "SecurePass123!",
    });
    expect(result.success).toBe(false);
  });
});
