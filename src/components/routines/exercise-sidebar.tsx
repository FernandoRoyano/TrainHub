"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useExercises } from "@/hooks/use-exercises";
import { useDebounce } from "@/hooks/use-debounce";
import { MUSCLE_GROUPS, EQUIPMENT, EXERCISE_CATEGORIES } from "@/lib/constants";
import type { Exercise } from "@/services/exercises.service";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Image as ImageIcon, Filter, X } from "lucide-react";

interface ExerciseSidebarProps {
  onSelect: (exercise: Exercise) => void;
}

function getExerciseDisplayName(exercise: Exercise, locale: string): string {
  if (locale === "es" && exercise.name_es) return exercise.name_es;
  return exercise.name;
}

function getExerciseFirstImage(exercise: Exercise): string | null {
  if (exercise.images && exercise.images.length > 0) return exercise.images[0];
  return exercise.thumbnail_url;
}

function getDisplayMuscles(exercise: Exercise): string[] {
  if (exercise.primary_muscles && exercise.primary_muscles.length > 0) {
    return exercise.primary_muscles;
  }
  return exercise.muscle_groups;
}

export function ExerciseSidebar({ onSelect }: ExerciseSidebarProps) {
  const t = useTranslations("exercises");
  const tc = useTranslations("common");
  const tr = useTranslations("routines");
  const locale = useLocale();
  const [search, setSearch] = useState("");
  const [muscleGroup, setMuscleGroup] = useState<string>("all");
  const [equipmentFilter, setEquipmentFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const hasActiveFilters =
    muscleGroup !== "all" || equipmentFilter !== "all" || categoryFilter !== "all";

  function clearFilters() {
    setMuscleGroup("all");
    setEquipmentFilter("all");
    setCategoryFilter("all");
  }

  const { data, isLoading } = useExercises({
    search: debouncedSearch,
    muscle_group: muscleGroup !== "all" ? muscleGroup : undefined,
    equipment: equipmentFilter !== "all" ? equipmentFilter : undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    pageSize: 100,
  });

  const exercises = data?.data ?? [];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] border rounded-lg bg-card">
      {/* Header */}
      <div className="p-3 border-b space-y-2 shrink-0">
        <h3 className="font-semibold text-sm">{tr("pickExercise")}</h3>

        {/* Search + filter toggle */}
        <div className="flex gap-1.5">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder={tc("search") + "..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
          <Button
            type="button"
            variant={showFilters || hasActiveFilters ? "default" : "outline"}
            size="icon"
            className="shrink-0 h-8 w-8"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="space-y-1.5">
            <div className="grid grid-cols-1 gap-1.5">
              <Select value={muscleGroup} onValueChange={setMuscleGroup}>
                <SelectTrigger className="text-xs h-7">
                  <SelectValue placeholder={t("muscleGroup")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allMuscles")}</SelectItem>
                  {MUSCLE_GROUPS.map((mg) => (
                    <SelectItem key={mg} value={mg}>
                      {t(`muscle_${mg}` as Parameters<typeof t>[0])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
                <SelectTrigger className="text-xs h-7">
                  <SelectValue placeholder={t("equipment")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allEquipment")}</SelectItem>
                  {EQUIPMENT.map((eq) => (
                    <SelectItem key={eq} value={eq}>
                      {t(`equip_${eq}` as Parameters<typeof t>[0])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="text-xs h-7">
                  <SelectValue placeholder={t("category")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allCategories")}</SelectItem>
                  {EXERCISE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {t(cat as Parameters<typeof t>[0])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={clearFilters}
              >
                <X className="h-3 w-3 mr-1" />
                {tc("clearFilters")}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Scrollable exercise grid */}
      <div className="flex-1 overflow-y-auto p-2 min-h-0">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1 p-2">
                <Skeleton className="w-full aspect-square rounded-md" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        ) : exercises.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">{tc("noResults")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {exercises.map((exercise) => {
              const displayName = getExerciseDisplayName(exercise, locale);
              const thumbnail = getExerciseFirstImage(exercise);
              const muscles = getDisplayMuscles(exercise);

              return (
                <button
                  key={exercise.id}
                  type="button"
                  onClick={() => onSelect(exercise)}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg border hover:border-primary hover:bg-accent transition-colors text-center"
                >
                  <div className="w-full aspect-square rounded-md bg-muted overflow-hidden">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-medium line-clamp-2">{displayName}</p>
                  <div className="flex gap-0.5 flex-wrap justify-center">
                    {muscles.slice(0, 2).map((mg) => (
                      <Badge
                        key={mg}
                        variant="outline"
                        className="text-[9px] px-1 py-0"
                      >
                        {t(`muscle_${mg}` as Parameters<typeof t>[0])}
                      </Badge>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
