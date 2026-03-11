"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useRoutine, useDeleteRoutine, useDuplicateRoutine } from "@/hooks/use-routines";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { AssignRoutineDialog } from "@/components/routines/assign-routine-dialog";
import { RoutinePrintView } from "@/components/routines/routine-print-view";
import { RoutinePdfButton } from "@/components/routines/routine-pdf-button";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Copy,
  Users,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import type { Exercise } from "@/services/exercises.service";

function getExerciseDisplayName(exercise: Exercise, locale: string): string {
  if (locale === "es" && exercise.name_es) return exercise.name_es;
  return exercise.name;
}

function getExerciseFirstImage(exercise: Exercise): string | null {
  if (exercise.images && exercise.images.length > 0) return exercise.images[0];
  return exercise.thumbnail_url;
}

const difficultyColors: Record<string, string> = {
  beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  advanced: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export default function RoutineDetailPage() {
  const { routineId } = useParams<{ routineId: string }>();
  const t = useTranslations("routines");
  const te = useTranslations("exercises");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();

  const { data: routine, isLoading } = useRoutine(routineId);
  const deleteRoutine = useDeleteRoutine();
  const duplicateRoutine = useDuplicateRoutine();

  const [showDelete, setShowDelete] = useState(false);
  const [showAssign, setShowAssign] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!routine) {
    return <p className="text-muted-foreground">Routine not found</p>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/routines">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{routine.name}</h1>
            {routine.description && (
              <p className="text-sm text-muted-foreground">
                {routine.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => setShowAssign(true)}>
            <Users className="mr-2 h-4 w-4" />
            {t("assignToClient")}
          </Button>
          <Button
            variant="outline"
            onClick={() => duplicateRoutine.mutate(routine.id)}
            disabled={duplicateRoutine.isPending}
          >
            <Copy className="mr-2 h-4 w-4" />
            {t("duplicate")}
          </Button>
          <RoutinePdfButton routine={routine} />
          <RoutinePrintView routine={routine} />
          <Button variant="outline" asChild>
            <Link href={`/routines/${routine.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              {tc("edit")}
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => setShowDelete(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            {tc("delete")}
          </Button>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap gap-2">
        {routine.difficulty && (
          <Badge
            variant="outline"
            className={difficultyColors[routine.difficulty] || ""}
          >
            {t(routine.difficulty as Parameters<typeof t>[0])}
          </Badge>
        )}
        {routine.is_template && (
          <Badge variant="secondary">{t("templateRoutine")}</Badge>
        )}
        <Badge variant="outline">
          <Calendar className="mr-1 h-3 w-3" />
          {routine.duration_weeks}w / {routine.days_per_week}d
        </Badge>
        <Badge variant="outline">
          {t(routine.target_gender as Parameters<typeof t>[0])}
        </Badge>
      </div>

      {/* Days */}
      {routine.days && routine.days.length > 0 ? (
        <div className="space-y-4">
          {routine.days.map((day) => (
            <Card key={day.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {t("day", { number: day.day_number })}
                  {day.name && (
                    <span className="text-muted-foreground font-normal ml-2">
                      - {day.name}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {day.exercises.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t("noExercisesInDay")}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {day.exercises.map((ex, i) => {
                      const inSuperset = ex.superset_group !== null;
                      const exData = ex.exercise as Exercise | undefined;
                      const displayName = exData
                        ? getExerciseDisplayName(exData, locale)
                        : ex.exercise_id;
                      const thumbnail = exData
                        ? getExerciseFirstImage(exData)
                        : null;
                      const muscles = exData?.primary_muscles?.length
                        ? exData.primary_muscles
                        : exData?.muscle_groups ?? [];

                      return (
                        <div
                          key={ex.id}
                          className={`flex items-center gap-3 p-2 rounded ${inSuperset ? "bg-primary/5 border border-primary/20" : "bg-muted/50"}`}
                        >
                          <span className="text-xs text-muted-foreground font-mono w-5">
                            {i + 1}
                          </span>
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
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {displayName}
                            </p>
                            <div className="flex gap-1 mt-0.5">
                              {muscles
                                .slice(0, 2)
                                .map((mg) => (
                                  <Badge
                                    key={mg}
                                    variant="outline"
                                    className="text-[10px] px-1 py-0"
                                  >
                                    {te(
                                      `muscle_${mg}` as Parameters<typeof te>[0]
                                    )}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                          <div className="flex gap-3 text-xs text-muted-foreground shrink-0">
                            <span>
                              {ex.sets}x{ex.reps}
                            </span>
                            <span>{ex.rest_seconds}s</span>
                          </div>
                          {inSuperset && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] shrink-0"
                            >
                              SS
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t("noExercisesInDay")}
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title={tc("delete")}
        description={t("deleteConfirm")}
        confirmLabel={tc("delete")}
        cancelLabel={tc("cancel")}
        isLoading={deleteRoutine.isPending}
        onConfirm={() => {
          deleteRoutine.mutate(routine.id, {
            onSuccess: () => router.push("/routines"),
          });
        }}
      />

      <AssignRoutineDialog
        routineId={routine.id}
        open={showAssign}
        onOpenChange={setShowAssign}
      />
    </div>
  );
}
