import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T = (key: string, values?: any) => string;

export const mealFoodSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().min(0).default(100),
  unit: z.enum(["g", "ml", "oz", "cup", "tbsp", "tsp", "unit", "slice", "scoop"]).default("g"),
  calories: z.number().int().min(0).default(0),
  protein: z.number().min(0).default(0),
  carbs: z.number().min(0).default(0),
  fat: z.number().min(0).default(0),
  order_index: z.number().int().min(0),
  notes: z.string().optional().or(z.literal("")),
  image_url: z.string().optional().or(z.literal("")).nullable(),
});

export const mealPlanMealSchema = z.object({
  name: z.string().min(1),
  meal_type: z.enum([
    "breakfast",
    "morning_snack",
    "lunch",
    "afternoon_snack",
    "dinner",
    "evening_snack",
    "pre_workout",
    "post_workout",
    "other",
  ]),
  order_index: z.number().int().min(0),
  notes: z.string().optional().or(z.literal("")),
  foods: z.array(mealFoodSchema),
});

export function createMealPlanSchema(t: T) {
  return z.object({
    name: z.string().min(2, t("minChars", { min: 2 })),
    description: z.string().optional().or(z.literal("")),
    goal: z.enum(["loss", "maintenance", "gain", "performance", "health"]),
    daily_calories: z.number().int().min(0).optional(),
    daily_protein: z.number().min(0).optional(),
    daily_carbs: z.number().min(0).optional(),
    daily_fat: z.number().min(0).optional(),
    is_template: z.boolean(),
    meals: z.array(mealPlanMealSchema),
  });
}

export const assignMealPlanSchema = z.object({
  client_id: z.string().uuid(),
  meal_plan_id: z.string().uuid(),
  start_date: z.string().min(1),
  notes: z.string().optional().or(z.literal("")),
});

export type MealPlanFormData = z.infer<ReturnType<typeof createMealPlanSchema>>;
export type MealPlanMealData = z.infer<typeof mealPlanMealSchema>;
export type MealFoodData = z.infer<typeof mealFoodSchema>;
export type AssignMealPlanData = z.infer<typeof assignMealPlanSchema>;
