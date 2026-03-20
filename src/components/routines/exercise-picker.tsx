"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useExercises } from "@/hooks/use-exercises";
import { useDebounce } from "@/hooks/use-debounce";
import { MUSCLE_GROUPS, EQUIPMENT, EXERCISE_CATEGORIES } from "@/lib/constants";
import type { Exercise } from "@/services/exercises.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface ExercisePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (exercise: Exercise) => void;
}

const difficultyColors: Record<string, string> = {
  beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  advanced: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

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

export function ExercisePicker({
  open,
  onOpenChange,
  onSelect,
}: ExercisePickerProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{tr("pickExercise")}</DialogTitle>
        </DialogHeader>

        {/* Search + filter toggle */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={tc("search") + "..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
          <Button
            type="button"
            variant={showFilters || hasActiveFilters ? "default" : "outline"}
            size="icon"
            className="shrink-0"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <Select value={muscleGroup} onValueChange={setMuscleGroup}>
                <SelectTrigger className="text-xs h-8">
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
                <SelectTrigger className="text-xs h-8">
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
                <SelectTrigger className="text-xs h-8">
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

        <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : exercises.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">{tc("noResults")}</p>
            </div>
          ) : (
            exercises.map((exercise) => {
              const displayName = getExerciseDisplayName(exercise, locale);
              const thumbnail = getExerciseFirstImage(exercise);
              const muscles = getDisplayMuscles(exercise);

              return (
                <button
                  key={exercise.id}
                  type="button"
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors text-left"
                  onClick={() => {
                    onSelect(exercise);
                    onOpenChange(false);
                    setSearch("");
                    clearFilters();
                  }}
                >
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {displayName}
                    </p>
                    <div className="flex gap-1 mt-0.5 flex-wrap">
                      {exercise.difficulty && (
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1 py-0 ${difficultyColors[exercise.difficulty] || ""}`}
                        >
                          {t(exercise.difficulty as Parameters<typeof t>[0])}
                        </Badge>
                      )}
                      {muscles.slice(0, 3).map((mg) => (
                        <Badge
                          key={mg}
                          variant="outline"
                          className="text-[10px] px-1 py-0"
                        >
                          {t(`muscle_${mg}` as Parameters<typeof t>[0])}
                        </Badge>
                      ))}
                      {exercise.equipment?.length > 0 && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1 py-0 text-muted-foreground"
                        >
                          {t(`equip_${exercise.equipment[0]}` as Parameters<typeof t>[0])}
                        </Badge>
                      )}
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
