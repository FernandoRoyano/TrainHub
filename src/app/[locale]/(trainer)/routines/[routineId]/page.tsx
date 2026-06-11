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
  Eye,
  EyeOff,
  Repeat,
  Timer,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type { Exercise } from "@/services/exercises.service";
import type { ExerciseGroup } from "@/services/routines.service";
import { ExerciseAnimation } from "@/components/workout/exercise-animation";

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
  const tca = useTranslations("clientApp");
  const locale = useLocale();
  const router = useRouter();

  const { data: routine, isLoading } = useRoutine(routineId);
  const deleteRoutine = useDeleteRoutine();
  const duplicateRoutine = useDuplicateRoutine();

  const [showDelete, setShowDelete] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [clientView, setClientView] = useState(false);

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
    return <p className="text-muted-foreground">{tc("notFound")}</p>;
  }

  return (
    <div className="space-y-4 overflow-x-hidden">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <Link href="/routines">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold truncate">{routine.name}</h1>
            {routine.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {routine.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={clientView ? "default" : "outline"}
            onClick={() => setClientView(!clientView)}
          >
            {clientView ? <EyeOff className="mr-1 h-3.5 w-3.5" /> : <Eye className="mr-1 h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{clientView ? t("trainerView") : t("clientView")}</span>
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowAssign(true)}>
            <Users className="mr-1 h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("assignToClient")}</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => duplicateRoutine.mutate(routine.id)}
            disabled={duplicateRoutine.isPending}
          >
            <Copy className="mr-1 h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("duplicate")}</span>
          </Button>
          <RoutinePdfButton routine={routine} />
          <RoutinePrintView routine={routine} />
          <Button size="sm" variant="outline" asChild>
            <Link href={`/routines/${routine.id}/edit`}>
              <Pencil className="mr-1 h-3.5 w-3.5" />
              <span className="hidden sm:inline">{tc("edit")}</span>
            </Link>
          </Button>
          <Button size="sm" variant="destructive" onClick={() => setShowDelete(true)}>
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            <span className="hidden sm:inline">{tc("delete")}</span>
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
                {/* Day description (both views) */}
                {day.description && (
                  <div className="rounded-lg border bg-muted/50 p-3 mb-4">
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{day.description}</p>
                  </div>
                )}

                {/* Day notes (trainer view only) */}
                {!clientView && day.notes && (
                  <p className="text-xs text-muted-foreground mb-3 italic">{day.notes}</p>
                )}

                {clientView ? (
                  /* ===== CLIENT VIEW ===== */
                  <div className="space-y-3">
                    {day.groups && day.groups.length > 0 ? (
                      day.groups.map((group: ExerciseGroup) => {
                        const groupLabel =
                          group.group_type === "superset" ? t("supersetGroup") :
                          group.group_type === "triset" ? t("trisetGroup") :
                          group.group_type === "circuit" ? t("circuitGroup") :
                          group.group_type === "emom" ? t("emomGroup") :
                          group.group_type === "amrap" ? t("amrapGroup") : null;

                        const isSolo = group.group_type === "solo";

                        const groupIcon =
                          group.group_type === "circuit" ? <Repeat className="h-3 w-3" /> :
                          group.group_type === "emom" ? <Timer className="h-3 w-3" /> :
                          group.group_type === "amrap" ? <Zap className="h-3 w-3" /> : null;

                        return (
                          <div key={group.id} className={!isSolo ? "border-l-4 border-primary/40 pl-3 space-y-2" : "space-y-2"}>
                            {!isSolo && (
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs font-semibold">
                                  {groupIcon} {groupLabel}
                                </Badge>
                                {group.rounds && (
                                  <span className="text-xs text-muted-foreground">{group.rounds} {t("roundsLabel")}</span>
                                )}
                                {group.time_limit_seconds && (
                                  <span className="text-xs text-muted-foreground">{Math.floor(group.time_limit_seconds / 60)} min</span>
                                )}
                                {group.rest_between_rounds != null && group.rest_between_rounds > 0 && (
                                  <span className="text-xs text-muted-foreground">· {group.rest_between_rounds}s {tca("restShort")}</span>
                                )}
                              </div>
                            )}
                            {group.exercises.map((ex) => {
                              const exData = ex.exercise as Exercise | undefined;
                              const displayName = exData ? getExerciseDisplayName(exData, locale) : ex.exercise_id;
                              const muscles = exData?.primary_muscles?.length ? exData.primary_muscles : exData?.muscle_groups ?? [];

                              return (
                                <div key={ex.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                                  <ExerciseAnimation
                                    thumbnailUrl={exData?.thumbnail_url}
                                    alt={exData?.name}
                                    className="w-14 h-14 rounded-md object-cover"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{displayName}</p>
                                    <div className="flex gap-1 mt-0.5">
                                      {muscles.slice(0, 2).map((mg) => (
                                        <Badge key={mg} variant="outline" className="text-[10px] px-1 py-0">
                                          {te(`muscle_${mg}` as Parameters<typeof te>[0])}
                                        </Badge>
                                      ))}
                                    </div>
                                    {ex.notes && (
                                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{ex.notes}</p>
                                    )}
                                  </div>
                                  <div className="flex gap-3 text-xs text-muted-foreground shrink-0">
                                    <span>{ex.sets}x{ex.reps}</span>
                                    {ex.rest_seconds > 0 && <span>{ex.rest_seconds}s</span>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })
                    ) : (
                      /* Fallback: flat exercises in client view */
                      day.exercises.map((ex) => {
                        const exData = ex.exercise as Exercise | undefined;
                        const displayName = exData ? getExerciseDisplayName(exData, locale) : ex.exercise_id;
                        return (
                          <div key={ex.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                            <ExerciseAnimation
                              thumbnailUrl={exData?.thumbnail_url}
                              alt={exData?.name}
                              className="w-14 h-14 rounded-md object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{displayName}</p>
                            </div>
                            <div className="flex gap-3 text-xs text-muted-foreground shrink-0">
                              <span>{ex.sets}x{ex.reps}</span>
                              <span>{ex.rest_seconds}s</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                ) : (
                  /* ===== TRAINER VIEW (original) ===== */
                  day.exercises.length === 0 ? (
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
                                {muscles.slice(0, 2).map((mg) => (
                                  <Badge
                                    key={mg}
                                    variant="outline"
                                    className="text-[10px] px-1 py-0"
                                  >
                                    {te(`muscle_${mg}` as Parameters<typeof te>[0])}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-3 text-xs text-muted-foreground shrink-0">
                              <span>{ex.sets}x{ex.reps}</span>
                              <span>{ex.rest_seconds}s</span>
                            </div>
                            {inSuperset && (
                              <Badge variant="secondary" className="text-[10px] shrink-0">
                                SS
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )
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
