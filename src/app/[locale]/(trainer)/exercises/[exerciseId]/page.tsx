"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useExercise, useDeleteExercise } from "@/hooks/use-exercises";
import { useAuth } from "@/hooks/use-auth";
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
import { useState } from "react";

const difficultyColors: Record<string, string> = {
  beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  advanced: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export default function ExerciseDetailPage() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const t = useTranslations("exercises");
  const tc = useTranslations("common");
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
    return <p className="text-muted-foreground">Exercise not found</p>;
  }

  const canEdit = !!exercise.trainer_id || isAdmin;

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
            <h1 className="text-2xl font-bold">{exercise.name}</h1>
            <p className="text-sm text-muted-foreground">
              {exercise.trainer_id ? t("createdBy") : t("platformExercise")}
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

      {/* Thumbnail (if no video) */}
      {!exercise.video_url && exercise.thumbnail_url && (
        <Card>
          <CardContent className="p-0 overflow-hidden rounded-lg">
            <img
              src={exercise.thumbnail_url}
              alt={exercise.name}
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
              <div className="flex gap-2">
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
            </div>
          </div>

          {exercise.muscle_groups.length > 0 && (
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
