import { describe, it, expect } from "vitest";

/**
 * Tests for print/PDF export logic.
 * The app uses window.print() for PDF generation, so we test
 * the data preparation logic, not the rendering.
 */

describe("Routine print data preparation", () => {
  interface PrintExercise {
    name: string;
    sets: number;
    reps: string;
    rest_seconds: number;
    superset_group: number | null;
    notes: string | null;
  }

  function groupSupersets(exercises: PrintExercise[]): PrintExercise[][] {
    const groups: PrintExercise[][] = [];
    let currentGroup: PrintExercise[] = [];
    let currentSupersetId: number | null = null;

    for (const ex of exercises) {
      if (ex.superset_group !== null) {
        if (ex.superset_group === currentSupersetId) {
          currentGroup.push(ex);
        } else {
          if (currentGroup.length > 0) groups.push(currentGroup);
          currentGroup = [ex];
          currentSupersetId = ex.superset_group;
        }
      } else {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
          currentGroup = [];
          currentSupersetId = null;
        }
        groups.push([ex]);
      }
    }
    if (currentGroup.length > 0) groups.push(currentGroup);

    return groups;
  }

  it("groups superset exercises together", () => {
    const exercises: PrintExercise[] = [
      { name: "Squat", sets: 3, reps: "12", rest_seconds: 90, superset_group: null, notes: null },
      { name: "Lat Pulldown", sets: 3, reps: "12", rest_seconds: 0, superset_group: 1, notes: null },
      { name: "Tricep Push", sets: 3, reps: "15", rest_seconds: 60, superset_group: 1, notes: null },
      { name: "Plank", sets: 3, reps: "30s", rest_seconds: 45, superset_group: null, notes: null },
    ];

    const groups = groupSupersets(exercises);
    expect(groups).toHaveLength(3);
    expect(groups[0]).toHaveLength(1); // Squat alone
    expect(groups[1]).toHaveLength(2); // Lat Pulldown + Tricep Push
    expect(groups[2]).toHaveLength(1); // Plank alone
  });

  it("handles no supersets", () => {
    const exercises: PrintExercise[] = [
      { name: "Squat", sets: 3, reps: "12", rest_seconds: 90, superset_group: null, notes: null },
      { name: "Press", sets: 3, reps: "10", rest_seconds: 90, superset_group: null, notes: null },
    ];

    const groups = groupSupersets(exercises);
    expect(groups).toHaveLength(2);
    expect(groups[0]).toHaveLength(1);
    expect(groups[1]).toHaveLength(1);
  });

  it("handles all exercises in superset", () => {
    const exercises: PrintExercise[] = [
      { name: "A1", sets: 3, reps: "12", rest_seconds: 0, superset_group: 1, notes: null },
      { name: "A2", sets: 3, reps: "12", rest_seconds: 60, superset_group: 1, notes: null },
    ];

    const groups = groupSupersets(exercises);
    expect(groups).toHaveLength(1);
    expect(groups[0]).toHaveLength(2);
  });

  it("handles empty exercises", () => {
    expect(groupSupersets([])).toEqual([]);
  });

  it("formats rest time correctly", () => {
    function formatRest(seconds: number): string {
      if (seconds === 0) return "Sin descanso";
      if (seconds < 60) return `${seconds}s`;
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;
      return sec > 0 ? `${min}m ${sec}s` : `${min}m`;
    }

    expect(formatRest(0)).toBe("Sin descanso");
    expect(formatRest(30)).toBe("30s");
    expect(formatRest(60)).toBe("1m");
    expect(formatRest(90)).toBe("1m 30s");
    expect(formatRest(120)).toBe("2m");
    expect(formatRest(600)).toBe("10m");
  });
});

describe("Nutrition print data preparation", () => {
  interface PrintFood {
    name: string;
    quantity: number;
    unit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }

  interface PrintMeal {
    name: string;
    foods: PrintFood[];
  }

  function calculateMealTotals(meal: PrintMeal) {
    return meal.foods.reduce(
      (acc, food) => ({
        calories: acc.calories + food.calories,
        protein: acc.protein + food.protein,
        carbs: acc.carbs + food.carbs,
        fat: acc.fat + food.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }

  function calculateDailyTotals(meals: PrintMeal[]) {
    return meals.reduce(
      (acc, meal) => {
        const mealTotals = calculateMealTotals(meal);
        return {
          calories: acc.calories + mealTotals.calories,
          protein: acc.protein + mealTotals.protein,
          carbs: acc.carbs + mealTotals.carbs,
          fat: acc.fat + mealTotals.fat,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }

  it("calculates meal totals correctly", () => {
    const meal: PrintMeal = {
      name: "Breakfast",
      foods: [
        { name: "Oats", quantity: 80, unit: "g", calories: 300, protein: 10, carbs: 50, fat: 5 },
        { name: "Banana", quantity: 1, unit: "unit", calories: 90, protein: 1, carbs: 23, fat: 0 },
      ],
    };

    const totals = calculateMealTotals(meal);
    expect(totals.calories).toBe(390);
    expect(totals.protein).toBe(11);
    expect(totals.carbs).toBe(73);
    expect(totals.fat).toBe(5);
  });

  it("calculates daily totals across meals", () => {
    const meals: PrintMeal[] = [
      {
        name: "Breakfast",
        foods: [
          { name: "Oats", quantity: 80, unit: "g", calories: 300, protein: 10, carbs: 50, fat: 5 },
        ],
      },
      {
        name: "Lunch",
        foods: [
          { name: "Chicken", quantity: 200, unit: "g", calories: 330, protein: 62, carbs: 0, fat: 7 },
          { name: "Rice", quantity: 150, unit: "g", calories: 195, protein: 4, carbs: 43, fat: 0.5 },
        ],
      },
    ];

    const totals = calculateDailyTotals(meals);
    expect(totals.calories).toBe(825);
    expect(totals.protein).toBe(76);
  });

  it("handles empty meal", () => {
    const meal: PrintMeal = { name: "Empty", foods: [] };
    const totals = calculateMealTotals(meal);
    expect(totals.calories).toBe(0);
    expect(totals.protein).toBe(0);
  });
});
