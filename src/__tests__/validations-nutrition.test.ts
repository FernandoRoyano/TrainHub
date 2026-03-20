import { describe, it, expect } from "vitest";
import {
  mealFoodSchema,
  mealPlanMealSchema,
  createMealPlanSchema,
  assignMealPlanSchema,
} from "@/lib/validations/nutrition";

const mockT = (key: string) => key;

describe("Meal food validation", () => {
  it("accepts valid food item", () => {
    const result = mealFoodSchema.safeParse({
      name: "Chicken Breast",
      quantity: 150,
      unit: "g",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      order_index: 0,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty food name", () => {
    const result = mealFoodSchema.safeParse({
      name: "",
      quantity: 100,
      unit: "g",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      order_index: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative quantity", () => {
    const result = mealFoodSchema.safeParse({
      name: "Rice",
      quantity: -50,
      unit: "g",
      calories: 100,
      protein: 2,
      carbs: 22,
      fat: 0.5,
      order_index: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid unit", () => {
    const result = mealFoodSchema.safeParse({
      name: "Rice",
      quantity: 100,
      unit: "pounds",
      calories: 100,
      protein: 2,
      carbs: 22,
      fat: 0.5,
      order_index: 0,
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid units", () => {
    const validUnits = ["g", "ml", "oz", "cup", "tbsp", "tsp", "unit", "slice", "scoop"];
    for (const unit of validUnits) {
      const result = mealFoodSchema.safeParse({
        name: "Food",
        quantity: 100,
        unit,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        order_index: 0,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects negative calories", () => {
    const result = mealFoodSchema.safeParse({
      name: "Food",
      quantity: 100,
      unit: "g",
      calories: -50,
      protein: 0,
      carbs: 0,
      fat: 0,
      order_index: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe("Meal plan meal validation", () => {
  it("accepts valid meal with foods", () => {
    const result = mealPlanMealSchema.safeParse({
      name: "Breakfast",
      meal_type: "breakfast",
      order_index: 0,
      foods: [
        {
          name: "Oats",
          quantity: 80,
          unit: "g",
          calories: 300,
          protein: 10,
          carbs: 50,
          fat: 5,
          order_index: 0,
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("accepts all valid meal types", () => {
    const types = [
      "breakfast", "morning_snack", "lunch", "afternoon_snack",
      "dinner", "evening_snack", "pre_workout", "post_workout", "other",
    ];
    for (const type of types) {
      const result = mealPlanMealSchema.safeParse({
        name: "Meal",
        meal_type: type,
        order_index: 0,
        foods: [],
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid meal type", () => {
    const result = mealPlanMealSchema.safeParse({
      name: "Meal",
      meal_type: "brunch",
      order_index: 0,
      foods: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("Meal plan schema", () => {
  const schema = createMealPlanSchema(mockT);

  it("accepts valid meal plan", () => {
    const result = schema.safeParse({
      name: "Cut Plan",
      goal: "loss",
      daily_calories: 2000,
      daily_protein: 150,
      daily_carbs: 200,
      daily_fat: 60,
      is_template: false,
      meals: [],
    });
    expect(result.success).toBe(true);
  });

  it("accepts all valid goals", () => {
    for (const goal of ["loss", "maintenance", "gain", "performance", "health"]) {
      const result = schema.safeParse({
        name: "Plan",
        goal,
        is_template: false,
        meals: [],
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid goal", () => {
    const result = schema.safeParse({
      name: "Plan",
      goal: "bulk",
      is_template: false,
      meals: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects short name", () => {
    const result = schema.safeParse({
      name: "A",
      goal: "loss",
      is_template: false,
      meals: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("Assign meal plan validation", () => {
  it("accepts valid assignment", () => {
    const result = assignMealPlanSchema.safeParse({
      client_id: "550e8400-e29b-41d4-a716-446655440000",
      meal_plan_id: "550e8400-e29b-41d4-a716-446655440001",
      start_date: "2026-03-20",
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-UUID client_id", () => {
    const result = assignMealPlanSchema.safeParse({
      client_id: "not-a-uuid",
      meal_plan_id: "550e8400-e29b-41d4-a716-446655440001",
      start_date: "2026-03-20",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty start_date", () => {
    const result = assignMealPlanSchema.safeParse({
      client_id: "550e8400-e29b-41d4-a716-446655440000",
      meal_plan_id: "550e8400-e29b-41d4-a716-446655440001",
      start_date: "",
    });
    expect(result.success).toBe(false);
  });
});
