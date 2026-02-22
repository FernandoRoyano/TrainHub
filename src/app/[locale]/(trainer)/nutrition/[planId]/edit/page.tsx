"use client";

import { useParams } from "next/navigation";
import { useMealPlan } from "@/hooks/use-nutrition";
import { NutritionBuilder } from "@/components/nutrition/nutrition-builder";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditMealPlanPage() {
  const { planId } = useParams<{ planId: string }>();
  const { data: mealPlan, isLoading } = useMealPlan(planId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!mealPlan) return null;

  return <NutritionBuilder mode="edit" mealPlan={mealPlan} />;
}
