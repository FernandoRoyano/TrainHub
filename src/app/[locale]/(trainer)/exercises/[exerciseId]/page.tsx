"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useExercise, useDeleteExercise } from "@/hooks/use-exercises";
import { useAuth } from "@/hooks/use-auth";
import type { Exercise } from "@/services/exercises.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  ArrowLeft,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { STATUS_STYLES } from "@/lib/ui-tokens";

function getExerciseDisplayName(exercise: Exercise, locale: string): string {
  if (locale === "es" && exercise.name_es) return exercise.name_es;
  return exercise.name;
}

/** Animated display that cycles between exercise images to show the movement */
function AnimatedExercise({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);

  const advance = useCallback(() => {
    setIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(advance, 1200);
    return () => clearInterval(id);
  }, [images.length, advance]);

  if (images.length === 0) return null;

  return (
    <div className="relative bg-muted rounded-lg overflow-hidden">
      <img
        src={images[index]}
        alt={alt}
        className="w-full max-h-96 object-contain transition-opacity duration-300"
      />
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === index ? "bg-primary" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExerciseDetailPage() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const t = useTranslations("exercises");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const { data: exercise, isLoading } = useExercise(exerciseId);
  const deleteExercise = useDeleteExercise();
  const { isAdmin } = useAuth();
  const [showDelete, setShowDelete] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!exercise) {
    return <p className="text-muted-foreground">{tc("notFound")}</p>;
  }

  const canEdit = !!exercise.trainer_id || isAdmin;
  const displayName = getExerciseDisplayName(exercise, locale);
  const hasImages = exercise.images && exercise.images.length > 0;
  const primaryMuscles = exercise.primary_muscles?.length > 0 ? exercise.primary_muscles : null;
  const secondaryMuscles = exercise.secondary_muscles?.length > 0 ? exercise.secondary_muscles : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/exercises">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold">{displayName}</h1>
            {locale === "es" && exercise.name_es && (
              <p className="text-sm text-muted-foreground">{exercise.name}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {exercise.trainer_id ? t("createdBy") : exercise.source === "free_exercise_db" ? t("sourceImported") : t("platformExercise")}
            </p>
          </div>
        </div>
        {canEdit && (
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/exercises/${exercise.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                {tc("edit")}
              </Link>
            </Button>
            <Button variant="destructive" onClick={() => setShowDelete(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              {tc("delete")}
            </Button>
          </div>
        )}
      </div>

      {/* Animated exercise images showing the movement */}
      {hasImages && (
        <Card>
          <CardContent className="p-0 overflow-hidden rounded-lg">
            <AnimatedExercise images={exercise.images} alt={displayName} />
          </CardContent>
        </Card>
      )}

      {/* Video */}
      {exercise.video_url && (
        <Card>
          <CardContent className="p-0 overflow-hidden rounded-lg">
            <video
              src={exercise.video_url}
              controls
              className="w-full max-h-96 object-contain bg-black"
              poster={exercise.thumbnail_url ?? undefined}
            />
          </CardContent>
        </Card>
      )}

      {/* Thumbnail (if no video and no images) */}
      {!exercise.video_url && !hasImages && exercise.thumbnail_url && (
        <Card>
          <CardContent className="p-0 overflow-hidden rounded-lg">
            <img
              src={exercise.thumbnail_url}
              alt={displayName}
              className="w-full max-h-96 object-cover"
            />
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("description")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {exercise.description || "-"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("instructions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {exercise.instructions || "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Badges section */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <div className="w-full">
              <p className="text-sm font-medium mb-2">{t("difficulty")} / {t("category")}</p>
              <div className="flex gap-2 flex-wrap">
                {exercise.difficulty && (
                  <Badge
                    variant="outline"
                    className={STATUS_STYLES[exercise.difficulty] || ""}
                  >
                    {t(exercise.difficulty as Parameters<typeof t>[0])}
                  </Badge>
                )}
                {exercise.category && (
                  <Badge variant="secondary">
                    {t(exercise.category as Parameters<typeof t>[0])}
                  </Badge>
                )}
                {exercise.exercise_type && (
                  <Badge variant="outline">
                    {t(`type_${exercise.exercise_type}` as Parameters<typeof t>[0])}
                  </Badge>
                )}
                {exercise.mechanics && (
                  <Badge variant="outline">
                    {t(`mechanics_${exercise.mechanics}` as Parameters<typeof t>[0])}
                  </Badge>
                )}
                {exercise.force && (
                  <Badge variant="outline">
                    {t(`force_${exercise.force}` as Parameters<typeof t>[0])}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Primary muscles */}
          {primaryMuscles && (
            <div>
              <p className="text-sm font-medium mb-2">{t("primaryMuscles")}</p>
              <div className="flex gap-2 flex-wrap">
                {primaryMuscles.map((mg) => (
                  <Badge key={mg} variant="outline">
                    {t(`muscle_${mg}` as Parameters<typeof t>[0])}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Secondary muscles */}
          {secondaryMuscles && (
            <div>
              <p className="text-sm font-medium mb-2">{t("secondaryMuscles")}</p>
              <div className="flex gap-2 flex-wrap">
                {secondaryMuscles.map((mg) => (
                  <Badge key={mg} variant="outline">
                    {t(`muscle_${mg}` as Parameters<typeof t>[0])}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Legacy muscle groups (shown if no primary_muscles) */}
          {!primaryMuscles && exercise.muscle_groups.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">{t("muscleGroups")}</p>
              <div className="flex gap-2 flex-wrap">
                {exercise.muscle_groups.map((mg) => (
                  <Badge key={mg} variant="outline">
                    {t(`muscle_${mg}` as Parameters<typeof t>[0])}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {exercise.equipment.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">{t("equipment")}</p>
              <div className="flex gap-2 flex-wrap">
                {exercise.equipment.map((eq) => (
                  <Badge key={eq} variant="outline">
                    {t(`equip_${eq}` as Parameters<typeof t>[0])}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title={tc("delete")}
        description={t("deleteConfirm")}
        confirmLabel={tc("delete")}
        cancelLabel={tc("cancel")}
        isLoading={deleteExercise.isPending}
        onConfirm={() => {
          deleteExercise.mutate(exercise.id, {
            onSuccess: () => router.push("/exercises"),
          });
        }}
      />
    </div>
  );
}
