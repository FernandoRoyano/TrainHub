import { create } from "zustand";

export interface BuilderFood {
  id: string; // temp id for UI
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  order_index: number;
  notes: string;
  image_url?: string | null;
}

export interface BuilderMeal {
  id: string; // temp id for UI
  name: string;
  meal_type: string;
  order_index: number;
  notes: string;
  foods: BuilderFood[];
}

interface NutritionBuilderState {
  meals: BuilderMeal[];
  activeMealIndex: number;

  // Meal actions
  setMeals: (meals: BuilderMeal[]) => void;
  addMeal: () => void;
  removeMeal: (index: number) => void;
  updateMeal: (index: number, data: Partial<BuilderMeal>) => void;
  setActiveMealIndex: (index: number) => void;

  // Food actions
  addFood: (mealIndex: number, food?: Partial<BuilderFood>) => void;
  removeFood: (mealIndex: number, foodIndex: number) => void;
  updateFood: (
    mealIndex: number,
    foodIndex: number,
    data: Partial<BuilderFood>
  ) => void;
  reorderFood: (mealIndex: number, oldIndex: number, newIndex: number) => void;

  // Computed
  getTotalMacros: () => {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };

  // Reset
  reset: () => void;
}

let idCounter = 0;
const tempId = () => `temp_${++idCounter}`;

const createEmptyMeal = (orderIndex: number): BuilderMeal => ({
  id: tempId(),
  name: "",
  meal_type: "breakfast",
  order_index: orderIndex,
  notes: "",
  foods: [],
});

export const useNutritionBuilderStore = create<NutritionBuilderState>(
  (set, get) => ({
    meals: [createEmptyMeal(0)],
    activeMealIndex: 0,

    setMeals: (meals) => set({ meals, activeMealIndex: 0 }),

    addMeal: () => {
      const { meals } = get();
      const newMeal = createEmptyMeal(meals.length);
      set({ meals: [...meals, newMeal], activeMealIndex: meals.length });
    },

    removeMeal: (index) => {
      const { meals, activeMealIndex } = get();
      if (meals.length <= 1) return;
      const newMeals = meals
        .filter((_, i) => i !== index)
        .map((m, i) => ({ ...m, order_index: i }));
      const newActive = Math.min(activeMealIndex, newMeals.length - 1);
      set({ meals: newMeals, activeMealIndex: newActive });
    },

    updateMeal: (index, data) => {
      const { meals } = get();
      const newMeals = [...meals];
      newMeals[index] = { ...newMeals[index], ...data };
      set({ meals: newMeals });
    },

    setActiveMealIndex: (index) => set({ activeMealIndex: index }),

    addFood: (mealIndex, food) => {
      const { meals } = get();
      const meal = meals[mealIndex];
      if (!meal) return;

      const qty = food?.quantity ?? 100;
      const calPer100 = food?.calories_per_100g ?? food?.calories ?? 0;
      const proPer100 = food?.protein_per_100g ?? food?.protein ?? 0;
      const carbPer100 = food?.carbs_per_100g ?? food?.carbs ?? 0;
      const fatPer100 = food?.fat_per_100g ?? food?.fat ?? 0;
      const ratio = qty / 100;

      const newFood: BuilderFood = {
        id: tempId(),
        name: food?.name ?? "",
        quantity: qty,
        unit: food?.unit ?? "g",
        calories: Math.round(calPer100 * ratio),
        protein: Math.round(proPer100 * ratio * 10) / 10,
        carbs: Math.round(carbPer100 * ratio * 10) / 10,
        fat: Math.round(fatPer100 * ratio * 10) / 10,
        calories_per_100g: calPer100,
        protein_per_100g: proPer100,
        carbs_per_100g: carbPer100,
        fat_per_100g: fatPer100,
        order_index: meal.foods.length,
        notes: food?.notes ?? "",
      };

      const newMeals = [...meals];
      newMeals[mealIndex] = {
        ...meal,
        foods: [...meal.foods, newFood],
      };
      set({ meals: newMeals });
    },

    removeFood: (mealIndex, foodIndex) => {
      const { meals } = get();
      const meal = meals[mealIndex];
      if (!meal) return;

      const newFoods = meal.foods
        .filter((_, i) => i !== foodIndex)
        .map((f, i) => ({ ...f, order_index: i }));

      const newMeals = [...meals];
      newMeals[mealIndex] = { ...meal, foods: newFoods };
      set({ meals: newMeals });
    },

    updateFood: (mealIndex, foodIndex, data) => {
      const { meals } = get();
      const meal = meals[mealIndex];
      if (!meal) return;

      const newFoods = [...meal.foods];
      const current = newFoods[foodIndex];
      let updated = { ...current, ...data };

      // Recalculate macros when quantity changes and per_100g values exist
      if (data.quantity !== undefined && current.calories_per_100g) {
        const ratio = data.quantity / 100;
        updated = {
          ...updated,
          calories: Math.round(current.calories_per_100g * ratio),
          protein: Math.round(current.protein_per_100g * ratio * 10) / 10,
          carbs: Math.round(current.carbs_per_100g * ratio * 10) / 10,
          fat: Math.round(current.fat_per_100g * ratio * 10) / 10,
        };
      }

      newFoods[foodIndex] = updated;

      const newMeals = [...meals];
      newMeals[mealIndex] = { ...meal, foods: newFoods };
      set({ meals: newMeals });
    },

    reorderFood: (mealIndex, oldIndex, newIndex) => {
      const { meals } = get();
      const meal = meals[mealIndex];
      if (!meal) return;
      if (newIndex < 0 || newIndex >= meal.foods.length) return;

      const newFoods = [...meal.foods];
      const [moved] = newFoods.splice(oldIndex, 1);
      newFoods.splice(newIndex, 0, moved);
      const reindexed = newFoods.map((f, i) => ({
        ...f,
        order_index: i,
      }));

      const newMeals = [...meals];
      newMeals[mealIndex] = { ...meal, foods: reindexed };
      set({ meals: newMeals });
    },

    getTotalMacros: () => {
      const { meals } = get();
      let calories = 0;
      let protein = 0;
      let carbs = 0;
      let fat = 0;

      for (const meal of meals) {
        for (const food of meal.foods) {
          calories += food.calories;
          protein += food.protein;
          carbs += food.carbs;
          fat += food.fat;
        }
      }

      return { calories, protein, carbs, fat };
    },

    reset: () => {
      idCounter = 0;
      set({ meals: [createEmptyMeal(0)], activeMealIndex: 0 });
    },
  })
);
