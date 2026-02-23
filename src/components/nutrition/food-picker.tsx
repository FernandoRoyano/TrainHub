"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useFoods } from "@/hooks/use-foods";
import { useDebounce } from "@/hooks/use-debounce";
import type { Food } from "@/services/foods.service";
import { FOOD_CATEGORIES } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

interface FoodPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (food: Food) => void;
}

function getFoodDisplayName(food: Food, locale: string): string {
  if (locale === "es" && food.name_es) return food.name_es;
  return food.name;
}

export function FoodPicker({ open, onOpenChange, onSelect }: FoodPickerProps) {
  const t = useTranslations("nutrition");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useFoods({
    search: debouncedSearch,
    category,
    pageSize: 100,
  });

  const foods = data?.data ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("pickFood")}</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={tc("search") + "..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            autoFocus
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <Button
            variant={category === undefined ? "default" : "outline"}
            size="sm"
            className="shrink-0 h-7 text-xs px-2.5"
            onClick={() => setCategory(undefined)}
          >
            {tc("all")}
          </Button>
          {FOOD_CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              className="shrink-0 h-7 text-xs px-2.5"
              onClick={() => setCategory(cat === category ? undefined : cat)}
            >
              {t(`category_${cat}` as Parameters<typeof t>[0])}
            </Button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 min-h-0 max-h-[400px]">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : foods.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              {tc("noResults")}
            </div>
          ) : (
            foods.map((food) => {
              const displayName = getFoodDisplayName(food, locale);

              return (
                <button
                  key={food.id}
                  type="button"
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors text-left"
                  onClick={() => {
                    onSelect(food);
                    onOpenChange(false);
                    setSearch("");
                    setCategory(undefined);
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {displayName}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1 py-0"
                      >
                        {t(
                          `category_${food.category}` as Parameters<typeof t>[0]
                        )}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1 py-0 bg-amber-500/10 text-amber-400 border-amber-500/20"
                      >
                        {food.calories_per_100g} kcal
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1 py-0 bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      >
                        P: {food.protein_per_100g}g
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1 py-0 bg-blue-500/10 text-blue-400 border-blue-500/20"
                      >
                        C: {food.carbs_per_100g}g
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1 py-0 bg-orange-500/10 text-orange-400 border-orange-500/20"
                      >
                        F: {food.fat_per_100g}g
                      </Badge>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
