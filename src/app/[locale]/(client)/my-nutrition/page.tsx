"use client";

import { useTranslations } from "next-intl";
import { useMyMealPlan } from "@/hooks/use-client-app";
import { MacroSummary } from "@/components/nutrition/macro-summary";
import { MealCard } from "@/components/nutrition/meal-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { UtensilsCrossed } from "lucide-react";

export default function MyNutritionPage() {
  const t = useTranslations("nutrition");
  const tc = useTranslations("clientApp");
  const { data: mealPlan, isLoading } = useMyMealPlan();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t("myMealPlan")}</h1>
        <EmptyState
          icon={UtensilsCrossed}
          title={tc("noMealPlanAssigned")}
          description={tc("noMealPlanDescription")}
        />
      </div>
    );
  }

  // Compute total macros from meals
  const totalMacros = (mealPlan.meals ?? []).reduce(
    (acc, meal) => {
      for (const food of meal.foods) {
        acc.calories += food.calories;
        acc.protein += food.protein;
        acc.carbs += food.carbs;
        acc.fat += food.fat;
      }
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{t("myMealPlan")}</h1>
        <p className="text-muted-foreground">{mealPlan.name}</p>
        {mealPlan.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {mealPlan.description}
          </p>
        )}
      </div>

      {/* Daily Macro Targets */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("dailyTargets")}</CardTitle>
        </CardHeader>
        <CardContent>
          <MacroSummary
            calories={totalMacros.calories}
            protein={totalMacros.protein}
            carbs={totalMacros.carbs}
            fat={totalMacros.fat}
            targetCalories={mealPlan.daily_calories ?? undefined}
            targetProtein={mealPlan.daily_protein ?? undefined}
            targetCarbs={mealPlan.daily_carbs ?? undefined}
            targetFat={mealPlan.daily_fat ?? undefined}
          />
        </CardContent>
      </Card>

      {/* Meals */}
      {mealPlan.meals && mealPlan.meals.length > 0 ? (
        <div className="space-y-4">
          {mealPlan.meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t("noMeals")}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
