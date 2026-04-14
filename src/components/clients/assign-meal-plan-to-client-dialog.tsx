"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMealPlans, useAssignMealPlan } from "@/hooks/use-nutrition";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Search, UtensilsCrossed, Calendar, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssignMealPlanToClientDialogProps {
  clientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Tab = "my-plans" | "templates";

export function AssignMealPlanToClientDialog({
  clientId,
  open,
  onOpenChange,
}: AssignMealPlanToClientDialogProps) {
  const t = useTranslations("planTab");
  const tn = useTranslations("nutrition");
  const tc = useTranslations("common");

  const [tab, setTab] = useState<Tab>("my-plans");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);

  const debouncedSearch = useDebounce(search, 300);

  const { data: mealPlansData, isLoading } = useMealPlans({
    search: debouncedSearch,
    is_template: tab === "templates",
    pageSize: 50,
  });

  const assignMealPlan = useAssignMealPlan();

  const mealPlans = mealPlansData?.data ?? [];

  const handleAssign = () => {
    if (!selectedId) return;
    assignMealPlan.mutate(
      {
        client_id: clientId,
        meal_plan_id: selectedId,
        start_date: startDate,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setSelectedId(null);
          setSearch("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            {t("assignMealPlanTitle")}
          </DialogTitle>
          <DialogDescription>{t("assignMealPlanDesc")}</DialogDescription>
        </DialogHeader>

        {/* Tabs: Mis planes / Plantillas */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <Button
            variant={tab === "my-plans" ? "default" : "ghost"}
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={() => {
              setTab("my-plans");
              setSelectedId(null);
            }}
          >
            {t("myMealPlans")}
          </Button>
          <Button
            variant={tab === "templates" ? "default" : "ghost"}
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={() => {
              setTab("templates");
              setSelectedId(null);
            }}
          >
            {t("templates")}
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={tc("search") + "..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto min-h-0 space-y-1">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))
          ) : mealPlans.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              {tc("noResults")}
            </div>
          ) : (
            mealPlans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedId(plan.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                  selectedId === plan.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-accent"
                )}
              >
                <div
                  className={cn(
                    "h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center",
                    selectedId === plan.id
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  )}
                >
                  {selectedId === plan.id && (
                    <Check className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{plan.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground flex-wrap">
                    {plan.goal && <span>{tn(`goal_${plan.goal}` as Parameters<typeof tn>[0])}</span>}
                    {plan.daily_calories && <span>· {plan.daily_calories} kcal</span>}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Start date */}
        {selectedId && (
          <div className="space-y-2 border-t pt-3">
            <Label className="flex items-center gap-1 text-xs">
              <Calendar className="h-3.5 w-3.5" />
              {t("startDate")}
            </Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-9"
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {tc("cancel")}
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedId || assignMealPlan.isPending}
          >
            {assignMealPlan.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("assignMealPlan")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
