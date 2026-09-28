"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMealPlan } from "@/hooks/use-nutrition";
import { NutritionBuilder } from "@/components/nutrition/nutrition-builder";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryErrorState } from "@/components/shared/query-error-state";

export default function EditMealPlanPage() {
  const { planId } = useParams<{ planId: string }>();
  const tc = useTranslations("common");
  const { data: mealPlan, isLoading, isError, refetch, isRefetching } = useMealPlan(planId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return <QueryErrorState onRetry={() => refetch()} isRetrying={isRefetching} />;
  }

  if (!mealPlan) {
    return <p className="text-muted-foreground">{tc("notFound")}</p>;
  }

  return <NutritionBuilder mode="edit" mealPlan={mealPlan} />;
}
