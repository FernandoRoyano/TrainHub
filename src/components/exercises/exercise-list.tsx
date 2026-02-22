"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useExercises, useDeleteExercise } from "@/hooks/use-exercises";
import { useDebounce } from "@/hooks/use-debounce";
import { MUSCLE_GROUPS, EQUIPMENT, DIFFICULTY_LEVELS, EXERCISE_CATEGORIES } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Dumbbell,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import type { Exercise, ExerciseFilters } from "@/services/exercises.service";

const difficultyColors: Record<string, string> = {
  beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  advanced: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

function getExerciseDisplayName(exercise: Exercise, locale: string): string {
  if (locale === "es" && exercise.name_es) return exercise.name_es;
  return exercise.name;
}

function getExerciseImages(exercise: Exercise): string[] {
  if (exercise.images && exercise.images.length > 0) return exercise.images;
  if (exercise.thumbnail_url) return [exercise.thumbnail_url];
  return [];
}

function getDisplayMuscles(exercise: Exercise): string[] {
  if (exercise.primary_muscles && exercise.primary_muscles.length > 0) {
    return exercise.primary_muscles;
  }
  return exercise.muscle_groups;
}

/** Animated thumbnail that cycles between exercise images (start/end positions) */
function AnimatedThumbnail({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);

  const advance = useCallback(() => {
    setIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(advance, 1200);
    return () => clearInterval(id);
  }, [images.length, advance]);

  if (images.length === 0) {
    return <ImageIcon className="h-12 w-12 text-muted-foreground/40" />;
  }

  return (
    <img
      src={images[index]}
      alt={alt}
      className="h-full w-full object-cover transition-opacity duration-300"
    />
  );
}

export function ExerciseList() {
  const t = useTranslations("exercises");
  const tc = useTranslations("common");
  const te = useTranslations("empty");
  const locale = useLocale();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [source, setSource] = useState<ExerciseFilters["source"]>("all");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [equipment, setEquipment] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useExercises({
    search: debouncedSearch,
    source,
    muscle_group: muscleGroup || undefined,
    equipment: equipment || undefined,
    difficulty: difficulty || undefined,
    category: category || undefined,
  });
  const deleteExercise = useDeleteExercise();

  const exercises = data?.data ?? [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button asChild>
          <Link href="/exercises/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("addExercise")}
          </Link>
        </Button>
      </div>

      {/* Source Tabs */}
      <Tabs value={source ?? "all"} onValueChange={(v) => setSource(v as ExerciseFilters["source"])}>
        <TabsList>
          <TabsTrigger value="all">{t("allExercises")}</TabsTrigger>
          <TabsTrigger value="mine">{t("myExercises")}</TabsTrigger>
          <TabsTrigger value="platform">{t("platform")}</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={tc("search") + "..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={muscleGroup} onValueChange={setMuscleGroup}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder={t("muscleGroups")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tc("all")}</SelectItem>
            {MUSCLE_GROUPS.map((mg) => (
              <SelectItem key={mg} value={mg}>
                {t(`muscle_${mg}` as Parameters<typeof t>[0])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={equipment} onValueChange={setEquipment}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder={t("equipment")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tc("all")}</SelectItem>
            {EQUIPMENT.map((eq) => (
              <SelectItem key={eq} value={eq}>
                {t(`equip_${eq}` as Parameters<typeof t>[0])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder={t("difficulty")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tc("all")}</SelectItem>
            {DIFFICULTY_LEVELS.map((d) => (
              <SelectItem key={d} value={d}>
                {t(d as Parameters<typeof t>[0])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder={t("category")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tc("all")}</SelectItem>
            {EXERCISE_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {t(c as Parameters<typeof t>[0])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Exercise Grid */}
      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="h-40 w-full rounded-t-lg rounded-b-none" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <div className="flex gap-1">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : exercises.length === 0 ? (
        <EmptyState
          icon={Dumbbell}
          emoji={"\uD83D\uDCAA"}
          title={te("exercisesTitle")}
          description={te("exercisesDescription")}
          actionLabel={t("addExercise")}
          actionHref="/exercises/new"
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {exercises.map((exercise) => {
            const displayName = getExerciseDisplayName(exercise, locale);
            const images = getExerciseImages(exercise);
            const muscles = getDisplayMuscles(exercise);

            return (
              <Card
                key={exercise.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors overflow-hidden"
                onClick={() => router.push(`/exercises/${exercise.id}`)}
              >
                <CardContent className="p-0">
                  {/* Animated thumbnail showing exercise movement */}
                  <div className="h-40 bg-muted flex items-center justify-center">
                    <AnimatedThumbnail images={images} alt={displayName} />
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{displayName}</p>
                        {locale === "es" && exercise.name_es && (
                          <p className="text-xs text-muted-foreground truncate">
                            {exercise.name}
                          </p>
                        )}
                      </div>

                      {/* Only show actions for own exercises */}
                      {exercise.trainer_id && (
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
                                router.push(`/exercises/${exercise.id}/edit`);
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              {tc("edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteId(exercise.id);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {tc("delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="flex gap-1 flex-wrap">
                      {exercise.difficulty && (
                        <Badge
                          variant="outline"
                          className={difficultyColors[exercise.difficulty] || ""}
                        >
                          {t(exercise.difficulty as Parameters<typeof t>[0])}
                        </Badge>
                      )}
                      {exercise.category && (
                        <Badge variant="secondary">
                          {t(exercise.category as Parameters<typeof t>[0])}
                        </Badge>
                      )}
                    </div>

                    {/* Muscle groups */}
                    {muscles.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {muscles.slice(0, 3).map((mg) => (
                          <Badge key={mg} variant="outline" className="text-xs">
                            {t(`muscle_${mg}` as Parameters<typeof t>[0])}
                          </Badge>
                        ))}
                        {muscles.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{muscles.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
        isLoading={deleteExercise.isPending}
        onConfirm={() => {
          if (deleteId) {
            deleteExercise.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            });
          }
        }}
      />
    </div>
  );
}
