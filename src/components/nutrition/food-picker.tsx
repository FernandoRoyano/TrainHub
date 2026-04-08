"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
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
import { Search, Database, Globe, Loader2, Camera } from "lucide-react";

interface FoodPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (food: Food) => void;
}

interface UsdaFood {
  fdcId: number;
  name: string;
  brandName: string | null;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
}

interface SpoonFood {
  spoonId: number;
  name: string;
  image_url: string | null;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
}

function getFoodDisplayName(food: Food, locale: string): string {
  if (locale === "es" && food.name_es) return food.name_es;
  return food.name;
}

function useUsdaSearch(query: string, enabled: boolean) {
  return useQuery({
    queryKey: ["usda-search", query],
    queryFn: async (): Promise<UsdaFood[]> => {
      if (!query || query.length < 2) return [];
      const res = await fetch(`/api/usda/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("USDA search failed");
      const data = await res.json();
      return data.foods ?? [];
    },
    enabled: enabled && query.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}

function usdaToFood(usda: UsdaFood): Food {
  return {
    id: `usda-${usda.fdcId}`,
    name: usda.name,
    name_es: null,
    slug: null,
    category: usda.category,
    calories_per_100g: usda.calories_per_100g,
    protein_per_100g: usda.protein_per_100g,
    carbs_per_100g: usda.carbs_per_100g,
    fat_per_100g: usda.fat_per_100g,
    source: "usda",
    source_id: String(usda.fdcId),
    is_public: true,
    trainer_id: null,
    created_at: "",
    updated_at: "",
  };
}

function useSpoonacularSearch(query: string, enabled: boolean) {
  return useQuery({
    queryKey: ["spoonacular-search", query],
    queryFn: async (): Promise<SpoonFood[]> => {
      if (!query || query.length < 2) return [];
      const res = await fetch(`/api/spoonacular/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Spoonacular search failed");
      const data = await res.json();
      return data.foods ?? [];
    },
    enabled: enabled && query.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}

function spoonToFood(spoon: SpoonFood): Food {
  return {
    id: `spoon-${spoon.spoonId}`,
    name: spoon.name,
    name_es: null,
    slug: null,
    category: spoon.category,
    calories_per_100g: spoon.calories_per_100g,
    protein_per_100g: spoon.protein_per_100g,
    carbs_per_100g: spoon.carbs_per_100g,
    fat_per_100g: spoon.fat_per_100g,
    source: "spoonacular",
    source_id: String(spoon.spoonId),
    is_public: true,
    trainer_id: null,
    created_at: "",
    updated_at: "",
    image_url: spoon.image_url,
  };
}

type Tab = "local" | "usda" | "spoonacular";

export function FoodPicker({ open, onOpenChange, onSelect }: FoodPickerProps) {
  const t = useTranslations("nutrition");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [tab, setTab] = useState<Tab>("local");
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading: isLoadingLocal } = useFoods({
    search: debouncedSearch,
    category,
    pageSize: 100,
  });

  const { data: usdaFoods, isLoading: isLoadingUsda } = useUsdaSearch(
    debouncedSearch,
    tab === "usda"
  );

  const { data: spoonFoods, isLoading: isLoadingSpoon } = useSpoonacularSearch(
    debouncedSearch,
    tab === "spoonacular"
  );

  const localFoods = data?.data ?? [];
  const isLoading = tab === "local" ? isLoadingLocal : tab === "usda" ? isLoadingUsda : isLoadingSpoon;
  const foods: Food[] =
    tab === "local" ? localFoods
    : tab === "usda" ? (usdaFoods ?? []).map(usdaToFood)
    : (spoonFoods ?? []).map(spoonToFood);

  function handleSelect(food: Food) {
    onSelect(food);
    onOpenChange(false);
    setSearch("");
    setCategory(undefined);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("pickFood")}</DialogTitle>
        </DialogHeader>

        {/* Tabs: Local / USDA */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <Button
            variant={tab === "local" ? "default" : "ghost"}
            size="sm"
            className="flex-1 h-8 text-xs gap-1.5"
            onClick={() => setTab("local")}
          >
            <Database className="h-3.5 w-3.5" />
            {t("localFoods")}
          </Button>
          <Button
            variant={tab === "usda" ? "default" : "ghost"}
            size="sm"
            className="flex-1 h-8 text-xs gap-1.5"
            onClick={() => setTab("usda")}
          >
            <Globe className="h-3.5 w-3.5" />
            USDA
          </Button>
          <Button
            variant={tab === "spoonacular" ? "default" : "ghost"}
            size="sm"
            className="flex-1 h-8 text-xs gap-1.5"
            onClick={() => setTab("spoonacular")}
          >
            <Camera className="h-3.5 w-3.5" />
            {t("withPhotos")}
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={
              tab === "usda"
                ? t("usdaSearchPlaceholder")
                : tc("search") + "..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            autoFocus
          />
        </div>

        {/* Category filter - only for local */}
        {tab === "local" && (
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
                onClick={() =>
                  setCategory(cat === category ? undefined : cat)
                }
              >
                {t(`category_${cat}` as Parameters<typeof t>[0])}
              </Button>
            ))}
          </div>
        )}

        {/* Search hint for external APIs */}
        {(tab === "usda" || tab === "spoonacular") && debouncedSearch.length < 2 && (
          <p className="text-xs text-muted-foreground text-center py-2">
            {tab === "usda" ? t("usdaHint") : t("spoonacularHint")}
          </p>
        )}

        <div className="flex-1 overflow-y-auto space-y-1 min-h-0 max-h-[400px]">
          {isLoading ? (
            <div className="space-y-2">
              {(tab === "usda" || tab === "spoonacular") && (
                <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {tab === "usda" ? t("searchingUsda") : t("searchingSpoonacular")}
                </div>
              )}
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
              {(tab === "usda" || tab === "spoonacular") && debouncedSearch.length >= 2
                ? t("noUsdaResults")
                : tc("noResults")}
            </div>
          ) : (
            foods.map((food) => {
              const displayName = getFoodDisplayName(food, locale);
              const isUsda = food.source === "usda";
              const isSpoon = food.source === "spoonacular";

              return (
                <button
                  key={food.id}
                  type="button"
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors text-left"
                  onClick={() => handleSelect(food)}
                >
                  {/* Food image */}
                  {food.image_url ? (
                    <img
                      src={food.image_url}
                      alt={displayName}
                      className="h-10 w-10 rounded-md object-cover shrink-0 bg-muted"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center shrink-0">
                      <Database className="h-4 w-4 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate capitalize">
                      {displayName}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {isUsda ? (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1 py-0 bg-green-500/10 text-green-400 border-green-500/20"
                        >
                          USDA
                        </Badge>
                      ) : isSpoon ? (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1 py-0 bg-purple-500/10 text-purple-400 border-purple-500/20"
                        >
                          Spoonacular
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1 py-0"
                        >
                          {t(
                            `category_${food.category}` as Parameters<
                              typeof t
                            >[0]
                          )}
                        </Badge>
                      )}
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
