"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useExercises } from "@/hooks/use-exercises";
import { useDebounce } from "@/hooks/use-debounce";
import type { Exercise } from "@/services/exercises.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Image as ImageIcon } from "lucide-react";

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
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useExercises({
    search: debouncedSearch,
    pageSize: 100,
  });

  const exercises = data?.data ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{tr("pickExercise")}</DialogTitle>
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

        <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
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
                  }}
                >
                  <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {displayName}
                    </p>
                    <div className="flex gap-1 mt-0.5">
                      {exercise.difficulty && (
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1 py-0 ${difficultyColors[exercise.difficulty] || ""}`}
                        >
                          {t(exercise.difficulty as Parameters<typeof t>[0])}
                        </Badge>
                      )}
                      {muscles.slice(0, 2).map((mg) => (
                        <Badge
                          key={mg}
                          variant="outline"
                          className="text-[10px] px-1 py-0"
                        >
                          {t(`muscle_${mg}` as Parameters<typeof t>[0])}
                        </Badge>
                      ))}
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
