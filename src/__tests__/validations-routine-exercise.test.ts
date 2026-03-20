import { describe, it, expect } from "vitest";
import {
  routineExerciseSchema,
  routineDaySchema,
  createRoutineSchema,
  assignRoutineSchema,
} from "@/lib/validations/routine";
import { createExerciseSchema } from "@/lib/validations/exercise";

const mockT = (key: string) => key;

describe("Routine exercise validation", () => {
  it("accepts valid exercise config", () => {
    const result = routineExerciseSchema.safeParse({
      exercise_id: "550e8400-e29b-41d4-a716-446655440000",
      order_index: 0,
      sets: 3,
      reps: "10-12",
      rest_seconds: 90,
    });
    expect(result.success).toBe(true);
  });

  it("accepts time-based reps", () => {
    const result = routineExerciseSchema.safeParse({
      exercise_id: "550e8400-e29b-41d4-a716-446655440000",
      order_index: 0,
      sets: 3,
      reps: "30 seg",
      rest_seconds: 45,
    });
    expect(result.success).toBe(true);
  });

  it("accepts superset group", () => {
    const result = routineExerciseSchema.safeParse({
      exercise_id: "550e8400-e29b-41d4-a716-446655440000",
      order_index: 0,
      sets: 3,
      reps: "12",
      rest_seconds: 0,
      superset_group: 1,
    });
    expect(result.success).toBe(true);
  });

  it("rejects 0 sets", () => {
    const result = routineExerciseSchema.safeParse({
      exercise_id: "550e8400-e29b-41d4-a716-446655440000",
      order_index: 0,
      sets: 0,
      reps: "12",
      rest_seconds: 60,
    });
    expect(result.success).toBe(false);
  });

  it("rejects sets > 20", () => {
    const result = routineExerciseSchema.safeParse({
      exercise_id: "550e8400-e29b-41d4-a716-446655440000",
      order_index: 0,
      sets: 25,
      reps: "12",
      rest_seconds: 60,
    });
    expect(result.success).toBe(false);
  });

  it("rejects rest > 600 seconds", () => {
    const result = routineExerciseSchema.safeParse({
      exercise_id: "550e8400-e29b-41d4-a716-446655440000",
      order_index: 0,
      sets: 3,
      reps: "12",
      rest_seconds: 700,
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty reps", () => {
    const result = routineExerciseSchema.safeParse({
      exercise_id: "550e8400-e29b-41d4-a716-446655440000",
      order_index: 0,
      sets: 3,
      reps: "",
      rest_seconds: 60,
    });
    expect(result.success).toBe(false);
  });
});

describe("Routine day validation", () => {
  it("accepts valid day with exercises", () => {
    const result = routineDaySchema.safeParse({
      day_number: 1,
      name: "Día A - Pierna",
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

  it("accepts day with no exercises", () => {
    const result = routineDaySchema.safeParse({
      day_number: 1,
      exercises: [],
    });
    expect(result.success).toBe(true);
  });

  it("rejects day_number 0", () => {
    const result = routineDaySchema.safeParse({
      day_number: 0,
      exercises: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("Routine schema validation", () => {
  const schema = createRoutineSchema(mockT);

  it("accepts valid routine", () => {
    const result = schema.safeParse({
      name: "PPL Routine",
      duration_weeks: 8,
      days_per_week: 3,
      difficulty: "intermediate",
      target_gender: "unisex",
      is_template: true,
      days: [],
    });
    expect(result.success).toBe(true);
  });

  it("rejects duration > 52 weeks", () => {
    const result = schema.safeParse({
      name: "Too Long",
      duration_weeks: 53,
      days_per_week: 3,
      difficulty: "beginner",
      target_gender: "unisex",
      is_template: false,
      days: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects days_per_week > 7", () => {
    const result = schema.safeParse({
      name: "Overtraining",
      duration_weeks: 4,
      days_per_week: 8,
      difficulty: "advanced",
      target_gender: "unisex",
      is_template: false,
      days: [],
    });
    expect(result.success).toBe(false);
  });

  it("accepts all difficulty levels", () => {
    for (const diff of ["beginner", "intermediate", "advanced"]) {
      const result = schema.safeParse({
        name: "Routine",
        duration_weeks: 4,
        days_per_week: 3,
        difficulty: diff,
        target_gender: "unisex",
        is_template: false,
        days: [],
      });
      expect(result.success).toBe(true);
    }
  });

  it("accepts all target genders", () => {
    for (const gender of ["male", "female", "unisex"]) {
      const result = schema.safeParse({
        name: "Routine",
        duration_weeks: 4,
        days_per_week: 3,
        difficulty: "beginner",
        target_gender: gender,
        is_template: false,
        days: [],
      });
      expect(result.success).toBe(true);
    }
  });
});

describe("Assign routine validation", () => {
  it("accepts valid assignment", () => {
    const result = assignRoutineSchema.safeParse({
      client_id: "550e8400-e29b-41d4-a716-446655440000",
      routine_id: "550e8400-e29b-41d4-a716-446655440001",
      start_date: "2026-03-20",
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-UUID IDs", () => {
    const result = assignRoutineSchema.safeParse({
      client_id: "not-uuid",
      routine_id: "also-not",
      start_date: "2026-03-20",
    });
    expect(result.success).toBe(false);
  });
});

describe("Exercise schema validation", () => {
  const schema = createExerciseSchema(mockT);

  it("accepts valid exercise", () => {
    const result = schema.safeParse({
      name: "Bench Press",
      muscle_groups: ["chest", "triceps"],
      equipment: ["barbell", "bench"],
      difficulty: "intermediate",
      category: "strength",
    });
    expect(result.success).toBe(true);
  });

  it("accepts exercise with Spanish name", () => {
    const result = schema.safeParse({
      name: "Bench Press",
      name_es: "Press de Banca",
      muscle_groups: ["chest"],
      equipment: ["barbell"],
      difficulty: "beginner",
      category: "strength",
    });
    expect(result.success).toBe(true);
  });

  it("accepts all categories", () => {
    for (const cat of ["strength", "cardio", "flexibility", "balance"]) {
      const result = schema.safeParse({
        name: "Exercise",
        muscle_groups: [],
        equipment: [],
        difficulty: "beginner",
        category: cat,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid category", () => {
    const result = schema.safeParse({
      name: "Exercise",
      muscle_groups: [],
      equipment: [],
      difficulty: "beginner",
      category: "crossfit",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short name", () => {
    const result = schema.safeParse({
      name: "A",
      muscle_groups: [],
      equipment: [],
      difficulty: "beginner",
      category: "strength",
    });
    expect(result.success).toBe(false);
  });
});
