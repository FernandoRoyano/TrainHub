"use client";

import { FeatureGate } from "@/components/shared/feature-gate";
import { useTranslations } from "next-intl";
import { useMyMealPlan } from "@/hooks/use-client-app";
import { MacroSummary } from "@/components/nutrition/macro-summary";
import { MealCard } from "@/components/nutrition/meal-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { QueryErrorState } from "@/components/shared/query-error-state";
import { UtensilsCrossed } from "lucide-react";
import { ClientSectionHeader } from "@/components/shared/client-section-header";

function MyNutritionPageContent() {
  const t = useTranslations("nutrition");
  const tc = useTranslations("clientApp");
  const tx = useTranslations("clientExperience");
  const { data: mealPlan, isLoading, isError, refetch, isRefetching } = useMyMealPlan();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Un fallo de red no es "tu entrenador no te ha asignado plan"
  if (isError) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold">{t("myMealPlan")}</h1>
        <QueryErrorState onRetry={() => refetch()} isRetrying={isRefetching} />
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold">{t("myMealPlan")}</h1>
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
      <ClientSectionHeader
        icon={UtensilsCrossed}
        eyebrow={tx("nutritionEyebrow")}
        title={mealPlan.name || t("myMealPlan")}
        description={mealPlan.description || tx("nutritionDescription")}
        metric={mealPlan.daily_calories ? String(mealPlan.daily_calories) : undefined}
        metricLabel={mealPlan.daily_calories ? tx("dailyCalories") : undefined}
      />

      {/* Daily Macro Targets */}
      <Card className="border-primary/15 bg-gradient-to-br from-primary/5 via-card to-card shadow-none">
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

export default function MyNutritionPage() {
  return (
    <FeatureGate feature="nutrition">
      <MyNutritionPageContent />
    </FeatureGate>
  );
}
