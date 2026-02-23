"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  useMealPlan,
  useDeleteMealPlan,
  useDuplicateMealPlan,
} from "@/hooks/use-nutrition";
import { MacroSummary } from "@/components/nutrition/macro-summary";
import { MealCard } from "@/components/nutrition/meal-card";
import { AssignMealPlanDialog } from "@/components/nutrition/assign-meal-plan-dialog";
import { NutritionPrintView } from "@/components/nutrition/nutrition-print-view";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Copy,
  Users,
} from "lucide-react";
import Link from "next/link";

const goalColors: Record<string, string> = {
  loss: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  maintenance: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  gain: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  performance: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  health: "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

export default function MealPlanDetailPage() {
  const { planId } = useParams<{ planId: string }>();
  const t = useTranslations("nutrition");
  const tc = useTranslations("common");
  const router = useRouter();

  const { data: mealPlan, isLoading } = useMealPlan(planId);
  const deleteMealPlan = useDeleteMealPlan();
  const duplicateMealPlan = useDuplicateMealPlan();

  const [showDelete, setShowDelete] = useState(false);
  const [showAssign, setShowAssign] = useState(false);

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
    return <p className="text-muted-foreground">{tc("notFound")}</p>;
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/nutrition">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{mealPlan.name}</h1>
            {mealPlan.description && (
              <p className="text-sm text-muted-foreground">
                {mealPlan.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => setShowAssign(true)}>
            <Users className="mr-2 h-4 w-4" />
            {t("assignToClient")}
          </Button>
          <Button
            variant="outline"
            onClick={() => duplicateMealPlan.mutate(mealPlan.id)}
            disabled={duplicateMealPlan.isPending}
          >
            <Copy className="mr-2 h-4 w-4" />
            {t("duplicate")}
          </Button>
          <NutritionPrintView mealPlan={mealPlan} />
          <Button variant="outline" asChild>
            <Link href={`/nutrition/${mealPlan.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              {tc("edit")}
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => setShowDelete(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            {tc("delete")}
          </Button>
        </div>
      </div>

      {/* Metadata badges */}
      <div className="flex flex-wrap gap-2">
        {mealPlan.goal && (
          <Badge
            variant="outline"
            className={goalColors[mealPlan.goal] || ""}
          >
            {t(`goal_${mealPlan.goal}` as Parameters<typeof t>[0])}
          </Badge>
        )}
        {mealPlan.is_template && (
          <Badge variant="secondary">{t("templatePlan")}</Badge>
        )}
      </div>

      {/* Daily Macro Targets Card */}
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

      {/* Dialogs */}
      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title={tc("delete")}
        description={t("deleteConfirm")}
        confirmLabel={tc("delete")}
        cancelLabel={tc("cancel")}
        isLoading={deleteMealPlan.isPending}
        onConfirm={() => {
          deleteMealPlan.mutate(mealPlan.id, {
            onSuccess: () => router.push("/nutrition"),
          });
        }}
      />

      <AssignMealPlanDialog
        mealPlanId={mealPlan.id}
        open={showAssign}
        onOpenChange={setShowAssign}
      />
    </div>
  );
}
