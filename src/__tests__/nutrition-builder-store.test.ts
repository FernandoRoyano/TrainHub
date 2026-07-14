import { describe, it, expect, beforeEach } from "vitest";
import { useNutritionBuilderStore } from "@/stores/nutrition-builder-store";

describe("nutrition-builder-store", () => {
  beforeEach(() => {
    useNutritionBuilderStore.getState().reset();
  });

  it("addFood conserva image_url (bug: antes se perdía y meal_foods.image_url quedaba null)", () => {
    const store = useNutritionBuilderStore.getState();
    store.addFood(0, {
      name: "Manzana",
      calories_per_100g: 52,
      protein_per_100g: 0.3,
      carbs_per_100g: 14,
      fat_per_100g: 0.2,
      image_url: "https://img.spoonacular.com/ingredients_250x250/apple.jpg",
    });

    const food = useNutritionBuilderStore.getState().meals[0].foods[0];
    expect(food.image_url).toBe("https://img.spoonacular.com/ingredients_250x250/apple.jpg");
    expect(food.calories).toBe(52); // 100g por defecto
  });

  it("addFood sin imagen deja image_url null", () => {
    const store = useNutritionBuilderStore.getState();
    store.addFood(0, { name: "Arroz", calories_per_100g: 130 });
    expect(useNutritionBuilderStore.getState().meals[0].foods[0].image_url).toBeNull();
  });

  it("duplicateMeal clona la comida completa con ids nuevos y la activa", () => {
    const store = useNutritionBuilderStore.getState();
    store.updateMeal(0, { name: "Desayuno", meal_type: "breakfast" });
    store.addFood(0, { name: "Avena", calories_per_100g: 380, image_url: "x.jpg" });
    store.addFood(0, { name: "Plátano", calories_per_100g: 89 });

    store.duplicateMeal(0);

    const state = useNutritionBuilderStore.getState();
    expect(state.meals).toHaveLength(2);
    expect(state.activeMealIndex).toBe(1);

    const [original, copy] = state.meals;
    expect(copy.name).toBe("Desayuno");
    expect(copy.foods).toHaveLength(2);
    expect(copy.foods[0].image_url).toBe("x.jpg");
    expect(copy.id).not.toBe(original.id);
    expect(copy.foods[0].id).not.toBe(original.foods[0].id);
    expect(copy.order_index).toBe(1);

    // Deep clone: mutar la copia no toca el original
    useNutritionBuilderStore.getState().updateFood(1, 0, { quantity: 50 });
    const after = useNutritionBuilderStore.getState();
    expect(after.meals[1].foods[0].quantity).toBe(50);
    expect(after.meals[0].foods[0].quantity).toBe(100);
  });

  it("reorderFood mueve y reindexa", () => {
    const store = useNutritionBuilderStore.getState();
    store.addFood(0, { name: "A" });
    store.addFood(0, { name: "B" });
    store.addFood(0, { name: "C" });

    store.reorderFood(0, 2, 0);

    const foods = useNutritionBuilderStore.getState().meals[0].foods;
    expect(foods.map((f) => f.name)).toEqual(["C", "A", "B"]);
    expect(foods.map((f) => f.order_index)).toEqual([0, 1, 2]);
  });

  it("updateFood recalcula macros al cambiar cantidad", () => {
    const store = useNutritionBuilderStore.getState();
    store.addFood(0, { name: "Pollo", calories_per_100g: 165, protein_per_100g: 31 });

    store.updateFood(0, 0, { quantity: 200 });

    const food = useNutritionBuilderStore.getState().meals[0].foods[0];
    expect(food.calories).toBe(330);
    expect(food.protein).toBe(62);
  });
});
