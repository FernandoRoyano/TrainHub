import { createClient } from "@/lib/supabase/client";
import type { MealPlanFormData, AssignMealPlanData } from "@/lib/validations/nutrition";

export interface MealFood {
  id: string;
  meal_plan_meal_id: string;
  name: string;
  name_es?: string | null;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  order_index: number;
  notes: string | null;
}

export interface MealPlanMeal {
  id: string;
  meal_plan_id: string;
  name: string;
  meal_type: string;
  order_index: number;
  notes: string | null;
  foods: MealFood[];
}

export interface MealPlan {
  id: string;
  trainer_id: string;
  name: string;
  description: string | null;
  goal: string | null;
  daily_calories: number | null;
  daily_protein: number | null;
  daily_carbs: number | null;
  daily_fat: number | null;
  is_template: boolean;
  created_at: string;
  updated_at: string;
  meals?: MealPlanMeal[];
}

export interface ClientMealPlan {
  id: string;
  client_id: string;
  meal_plan_id: string;
  trainer_id: string;
  start_date: string;
  end_date: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  meal_plan?: MealPlan;
}

export interface NutritionFilters {
  search?: string;
  goal?: string;
  page?: number;
  pageSize?: number;
}

export const nutritionService = {
  async getMealPlans(filters?: NutritionFilters) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const page = filters?.page ?? 0;
    const pageSize = filters?.pageSize ?? 50;
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("meal_plans")
      .select("*", { count: "exact" })
      .eq("trainer_id", user.id)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (filters?.goal) {
      query = query.eq("goal", filters.goal);
    }

    if (filters?.search) {
      query = query.ilike("name", `%${filters.search}%`);
    }

    const { data, count, error } = await query;
    if (error) throw error;
    return { data: data as MealPlan[], count: count ?? 0 };
  },

  async getMealPlanById(id: string) {
    const supabase = createClient();

    // Get meal plan
    const { data: mealPlan, error: planError } = await supabase
      .from("meal_plans")
      .select("*")
      .eq("id", id)
      .single();
    if (planError) throw planError;

    // Get meals
    const { data: meals, error: mealsError } = await supabase
      .from("meal_plan_meals")
      .select("*")
      .eq("meal_plan_id", id)
      .order("order_index", { ascending: true });
    if (mealsError) throw mealsError;

    // Get foods for all meals
    const mealIds = (meals ?? []).map((m) => m.id);
    let foods: MealFood[] = [];

    if (mealIds.length > 0) {
      const { data: foodData, error: foodError } = await supabase
        .from("meal_foods")
        .select("*")
        .in("meal_plan_meal_id", mealIds)
        .order("order_index", { ascending: true });
      if (foodError) throw foodError;
      foods = (foodData ?? []) as MealFood[];
    }

    // Assemble
    const assembledMeals: MealPlanMeal[] = (meals ?? []).map((meal) => ({
      ...meal,
      foods: foods.filter((f) => f.meal_plan_meal_id === meal.id),
    }));

    return { ...mealPlan, meals: assembledMeals } as MealPlan;
  },

  async createMealPlan(data: MealPlanFormData) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // 1. Create meal plan
    const { data: mealPlan, error: planError } = await supabase
      .from("meal_plans")
      .insert({
        trainer_id: user.id,
        name: data.name,
        description: data.description || null,
        goal: data.goal,
        daily_calories: data.daily_calories ?? null,
        daily_protein: data.daily_protein ?? null,
        daily_carbs: data.daily_carbs ?? null,
        daily_fat: data.daily_fat ?? null,
        is_template: data.is_template,
      })
      .select()
      .single();
    if (planError) throw planError;

    // 2. Create meals
    if (data.meals.length > 0) {
      const mealsToInsert = data.meals.map((meal) => ({
        meal_plan_id: mealPlan.id,
        name: meal.name,
        meal_type: meal.meal_type,
        order_index: meal.order_index,
        notes: meal.notes || null,
      }));

      const { data: insertedMeals, error: mealsError } = await supabase
        .from("meal_plan_meals")
        .insert(mealsToInsert)
        .select();
      if (mealsError) throw mealsError;

      // 3. Create foods for each meal
      const foodsToInsert: Array<{
        meal_plan_meal_id: string;
        name: string;
        quantity: number;
        unit: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        order_index: number;
        notes: string | null;
      }> = [];

      // Match inserted meals by order_index
      for (const meal of data.meals) {
        const insertedMeal = (insertedMeals ?? []).find(
          (m) => m.order_index === meal.order_index
        );
        if (!insertedMeal) continue;

        for (const food of meal.foods) {
          foodsToInsert.push({
            meal_plan_meal_id: insertedMeal.id,
            name: food.name,
            quantity: food.quantity,
            unit: food.unit,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            order_index: food.order_index,
            notes: food.notes || null,
          });
        }
      }

      if (foodsToInsert.length > 0) {
        const { error: foodError } = await supabase
          .from("meal_foods")
          .insert(foodsToInsert);
        if (foodError) throw foodError;
      }
    }

    return mealPlan as MealPlan;
  },

  async updateMealPlan(id: string, data: MealPlanFormData) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // 1. Update meal plan metadata
    const { error: planError } = await supabase
      .from("meal_plans")
      .update({
        name: data.name,
        description: data.description || null,
        goal: data.goal,
        daily_calories: data.daily_calories ?? null,
        daily_protein: data.daily_protein ?? null,
        daily_carbs: data.daily_carbs ?? null,
        daily_fat: data.daily_fat ?? null,
        is_template: data.is_template,
      })
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (planError) throw planError;

    // 2. Delete existing meals (cascades to foods)
    const { error: deleteError } = await supabase
      .from("meal_plan_meals")
      .delete()
      .eq("meal_plan_id", id);
    if (deleteError) throw deleteError;

    // 3. Re-create meals and foods
    if (data.meals.length > 0) {
      const mealsToInsert = data.meals.map((meal) => ({
        meal_plan_id: id,
        name: meal.name,
        meal_type: meal.meal_type,
        order_index: meal.order_index,
        notes: meal.notes || null,
      }));

      const { data: insertedMeals, error: mealsError } = await supabase
        .from("meal_plan_meals")
        .insert(mealsToInsert)
        .select();
      if (mealsError) throw mealsError;

      const foodsToInsert: Array<{
        meal_plan_meal_id: string;
        name: string;
        quantity: number;
        unit: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        order_index: number;
        notes: string | null;
      }> = [];

      for (const meal of data.meals) {
        const insertedMeal = (insertedMeals ?? []).find(
          (m) => m.order_index === meal.order_index
        );
        if (!insertedMeal) continue;

        for (const food of meal.foods) {
          foodsToInsert.push({
            meal_plan_meal_id: insertedMeal.id,
            name: food.name,
            quantity: food.quantity,
            unit: food.unit,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            order_index: food.order_index,
            notes: food.notes || null,
          });
        }
      }

      if (foodsToInsert.length > 0) {
        const { error: foodError } = await supabase
          .from("meal_foods")
          .insert(foodsToInsert);
        if (foodError) throw foodError;
      }
    }
  },

  async deleteMealPlan(id: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("meal_plans")
      .delete()
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (error) throw error;
  },

  async duplicateMealPlan(id: string, copySuffix = "(copy)") {
    const mealPlan = await this.getMealPlanById(id);
    const formData: MealPlanFormData = {
      name: `${mealPlan.name} ${copySuffix}`,
      description: mealPlan.description ?? "",
      goal: mealPlan.goal as MealPlanFormData["goal"],
      daily_calories: mealPlan.daily_calories ?? undefined,
      daily_protein: mealPlan.daily_protein ?? undefined,
      daily_carbs: mealPlan.daily_carbs ?? undefined,
      daily_fat: mealPlan.daily_fat ?? undefined,
      is_template: mealPlan.is_template,
      meals: (mealPlan.meals ?? []).map((meal) => ({
        name: meal.name,
        meal_type: meal.meal_type as MealPlanFormData["meals"][number]["meal_type"],
        order_index: meal.order_index,
        notes: meal.notes ?? "",
        foods: meal.foods.map((food) => ({
          name: food.name,
          quantity: food.quantity,
          unit: food.unit as MealPlanFormData["meals"][number]["foods"][number]["unit"],
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          order_index: food.order_index,
          notes: food.notes ?? "",
        })),
      })),
    };
    return this.createMealPlan(formData);
  },

  async assignToClient(data: AssignMealPlanData) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: assignment, error } = await supabase
      .from("client_meal_plans")
      .insert({
        client_id: data.client_id,
        meal_plan_id: data.meal_plan_id,
        trainer_id: user.id,
        start_date: data.start_date,
        notes: data.notes || null,
      })
      .select()
      .single();
    if (error) throw error;
    return assignment as ClientMealPlan;
  },

  async getClientMealPlans(clientId: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("client_meal_plans")
      .select("*, meal_plan:meal_plans(*)")
      .eq("client_id", clientId)
      .eq("trainer_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as ClientMealPlan[];
  },

  async cancelClientMealPlan(id: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("client_meal_plans")
      .update({ status: "cancelled" })
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (error) throw error;
  },
};
