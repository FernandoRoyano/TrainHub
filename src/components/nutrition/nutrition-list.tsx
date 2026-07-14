"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMealPlans, useDeleteMealPlan, useDuplicateMealPlan } from "@/hooks/use-nutrition";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Search,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Copy,
  UtensilsCrossed,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { STATUS_STYLES } from "@/lib/ui-tokens";

export function NutritionList() {
  const t = useTranslations("nutrition");
  const tc = useTranslations("common");
  const te = useTranslations("empty");
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading } = useMealPlans({ search: debouncedSearch });
  const deleteMealPlan = useDeleteMealPlan();
  const duplicateMealPlan = useDuplicateMealPlan();

  const mealPlans = data?.data ?? [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
        <Button asChild>
          <Link href="/nutrition/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("addPlan")}
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={tc("search") + "..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 max-w-md"
        />
      </div>

      {/* Meal Plan Grid */}
      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-60" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-2 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : mealPlans.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title={te("nutritionTitle")}
          description={te("nutritionDescription")}
          actionLabel={t("addPlan")}
          actionHref="/nutrition/new"
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {mealPlans.map((plan) => (
            <Card
              key={plan.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => router.push(`/nutrition/${plan.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{plan.name}</p>
                    {plan.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {plan.description}
                      </p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/nutrition/${plan.id}/edit`);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        {tc("edit")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateMealPlan.mutate(plan.id);
                        }}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        {t("duplicate")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(plan.id);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {tc("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {plan.goal && (
                    <Badge
                      variant="outline"
                      className={STATUS_STYLES[plan.goal] || ""}
                    >
                      {t(`goal_${plan.goal}` as Parameters<typeof t>[0])}
                    </Badge>
                  )}
                  {plan.is_template && (
                    <Badge variant="secondary">{t("templatePlan")}</Badge>
                  )}
                </div>

                {/* Calories summary */}
                {plan.daily_calories && plan.daily_calories > 0 && (
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Flame className="h-3 w-3 text-chart-4" />
                      {plan.daily_calories} kcal
                    </span>
                    {plan.daily_protein && plan.daily_protein > 0 && (
                      <span className="text-chart-2">
                        P: {plan.daily_protein}g
                      </span>
                    )}
                    {plan.daily_carbs && plan.daily_carbs > 0 && (
                      <span className="text-chart-1">
                        C: {plan.daily_carbs}g
                      </span>
                    )}
                    {plan.daily_fat && plan.daily_fat > 0 && (
                      <span className="text-chart-5">
                        F: {plan.daily_fat}g
                      </span>
                    )}
                  </div>
                )}

                {/* Mini macro bar */}
                {plan.daily_calories && plan.daily_calories > 0 && (
                  <div className="flex gap-0.5 mt-2 h-1.5 rounded-full overflow-hidden bg-muted">
                    {plan.daily_protein && plan.daily_protein > 0 && (
                      <div
                        className="bg-chart-2 h-full"
                        style={{
                          width: `${Math.round(((plan.daily_protein * 4) / plan.daily_calories) * 100)}%`,
                        }}
                      />
                    )}
                    {plan.daily_carbs && plan.daily_carbs > 0 && (
                      <div
                        className="bg-chart-1 h-full"
                        style={{
                          width: `${Math.round(((plan.daily_carbs * 4) / plan.daily_calories) * 100)}%`,
                        }}
                      />
                    )}
                    {plan.daily_fat && plan.daily_fat > 0 && (
                      <div
                        className="bg-chart-5 h-full"
                        style={{
                          width: `${Math.round(((plan.daily_fat * 9) / plan.daily_calories) * 100)}%`,
                        }}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title={tc("delete")}
        description={t("deleteConfirm")}
        confirmLabel={tc("delete")}
        cancelLabel={tc("cancel")}
        isLoading={deleteMealPlan.isPending}
        onConfirm={() => {
          if (deleteId) {
            deleteMealPlan.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            });
          }
        }}
      />
    </div>
  );
}
