"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Exercise } from "@/services/exercises.service";
import type { ExerciseGroup, RoutineExercise } from "@/services/routines.service";
import { ExerciseDetailDialog } from "@/components/workout/exercise-detail-dialog";
import { ExerciseAnimation } from "@/components/workout/exercise-animation";
import { useMyRoutine, useMyClient, useWorkoutLogs, useStartWorkout, useCompleteWorkout, useLogExercise } from "@/hooks/use-client-app";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Dumbbell, Check, Play, Timer, Loader2 } from "lucide-react";
import { RestTimer } from "@/components/workout/rest-timer";
import { useRestTimerStore } from "@/stores/rest-timer-store";

/* eslint-disable @typescript-eslint/no-explicit-any */
function ExerciseCard({
  ex,
  exerciseData,
  setExerciseData,
  activeWorkoutId,
  todayLog,
  logExercise,
  handleLogExercise,
  startCountdown,
  setSelectedExercise,
  locale,
  t,
  te,
}: {
  ex: any;
  exerciseData: Record<string, { sets: number; weight: string; reps: string }>;
  setExerciseData: React.Dispatch<React.SetStateAction<Record<string, { sets: number; weight: string; reps: string }>>>;
  activeWorkoutId: string | null;
  todayLog: any;
  logExercise: any;
  handleLogExercise: (id: string, rest?: number, name?: string) => void;
  startCountdown: (seconds: number, name?: string) => void;
  setSelectedExercise: (e: Exercise | null) => void;
  locale: string;
  t: any;
  te: any;
}) {
  const exData = exerciseData[ex.id] ?? { sets: ex.sets, weight: "", reps: ex.reps ?? "" };

  return (
    <Card key={ex.id}>
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => ex.exercise && setSelectedExercise(ex.exercise as Exercise)}
            className="shrink-0"
          >
            <ExerciseAnimation
              thumbnailUrl={ex.exercise?.thumbnail_url}
              alt={ex.exercise?.name}
              className="w-14 h-14 rounded-md object-cover hover:opacity-80 transition-opacity"
            />
          </button>
          <div className="flex-1 min-w-0">
            <button
              type="button"
              onClick={() => ex.exercise && setSelectedExercise(ex.exercise as Exercise)}
              className="text-left"
            >
              <p className="font-medium text-sm hover:text-primary transition-colors">
                {(locale === "es" ? ex.exercise?.name_es : null) ?? ex.exercise?.name ?? "Exercise"}
              </p>
            </button>
            <div className="flex gap-1 mt-1">
              {ex.exercise?.muscle_groups?.slice(0, 2).map((mg: string) => (
                <Badge
                  key={mg}
                  variant="outline"
                  className="text-[10px] px-1 py-0"
                >
                  {te(`muscle_${mg}` as Parameters<typeof te>[0])}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <p className="text-xs text-muted-foreground">
                {ex.sets}x{ex.reps} - {ex.rest_seconds}s
              </p>
              {(activeWorkoutId || (todayLog && !todayLog.completed)) && ex.rest_seconds > 0 && (
                <button
                  onClick={() => startCountdown(ex.rest_seconds, ex.exercise?.name)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title={t("startRestTimer")}
                >
                  <Timer className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {(activeWorkoutId || (todayLog && !todayLog.completed)) && (
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-center">
                <label className="text-[10px] text-muted-foreground block">
                  {t("setsCompleted")}
                </label>
                <Input
                  type="number"
                  min={0}
                  max={20}
                  value={exData.sets}
                  onChange={(e) =>
                    setExerciseData((prev: Record<string, { sets: number; weight: string; reps: string }>) => ({
                      ...prev,
                      [ex.id]: { ...exData, sets: parseInt(e.target.value) || 0 },
                    }))
                  }
                  className="h-7 w-14 text-xs text-center"
                />
              </div>
              <div className="text-center">
                <label className="text-[10px] text-muted-foreground block">
                  {t("repsCompleted")}
                </label>
                <Input
                  type="text"
                  value={exData.reps}
                  onChange={(e) =>
                    setExerciseData((prev: Record<string, { sets: number; weight: string; reps: string }>) => ({
                      ...prev,
                      [ex.id]: { ...exData, reps: e.target.value },
                    }))
                  }
                  className="h-7 w-14 text-xs text-center"
                  placeholder={ex.reps ?? ""}
                />
              </div>
              <div className="text-center">
                <label className="text-[10px] text-muted-foreground block">
                  {t("weightUsed")}
                </label>
                <Input
                  type="number"
                  step="0.5"
                  value={exData.weight}
                  onChange={(e) =>
                    setExerciseData((prev: Record<string, { sets: number; weight: string; reps: string }>) => ({
                      ...prev,
                      [ex.id]: { ...exData, weight: e.target.value },
                    }))
                  }
                  className="h-7 w-14 text-xs text-center"
                  placeholder="kg"
                />
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2"
                disabled={logExercise.isPending}
                onClick={() => handleLogExercise(ex.id, ex.rest_seconds, ex.exercise?.name)}
              >
                {logExercise.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function MyRoutinePage() {
  const t = useTranslations("clientApp");
  const te = useTranslations("exercises");
  const tr = useTranslations("routines");
  const locale = useLocale();
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const { data: routine, isLoading } = useMyRoutine();
  const { data: client } = useMyClient();
  const { data: logs } = useWorkoutLogs(routine?.id ?? "");
  const startWorkout = useStartWorkout();
  const completeWorkout = useCompleteWorkout();
  const logExercise = useLogExercise();

  const startCountdown = useRestTimerStore((s) => s.startCountdown);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);
  const [exerciseData, setExerciseData] = useState<
    Record<string, { sets: number; weight: string; reps: string }>
  >({});
  const [workoutNotes, setWorkoutNotes] = useState("");

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
    return (
      <EmptyState
        icon={Dumbbell}
        title={t("noRoutineAssigned")}
        description={t("noRoutineDescription")}
      />
    );
  }

  const days = routine.routine?.days ?? [];
  const activeDay = days[selectedDayIndex];

  const today = new Date().toISOString().split("T")[0];
  const todayLog = logs?.find(
    (l) => l.date === today && l.routine_day_id === activeDay?.id
  );

  const handleStartWorkout = () => {
    if (!client || !activeDay) return;
    startWorkout.mutate(
      {
        clientId: client.id,
        clientRoutineId: routine.id,
        routineDayId: activeDay.id,
      },
      {
        onSuccess: (log) => setActiveWorkoutId(log.id),
      }
    );
  };

  const handleLogExercise = (
    routineExerciseId: string,
    restSeconds?: number,
    exerciseName?: string
  ) => {
    const workoutId = activeWorkoutId ?? todayLog?.id;
    if (!workoutId) return;
    const data = exerciseData[routineExerciseId];
    logExercise.mutate(
      {
        workoutLogId: workoutId,
        routineExerciseId,
        data: {
          sets_completed: data?.sets ?? 0,
          weight_used: data?.weight ? parseFloat(data.weight) : undefined,
          reps_completed: data?.reps || undefined,
        },
      },
      {
        onSuccess: () => {
          if (restSeconds && restSeconds > 0) {
            startCountdown(restSeconds, exerciseName);
          }
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("myRoutine")}</h1>
      <p className="text-muted-foreground">{routine.routine?.name}</p>

      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((day, i) => (
          <Button
            key={day.id}
            variant={i === selectedDayIndex ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDayIndex(i)}
            className="shrink-0"
          >
            {tr("day", { number: day.day_number })}
            {day.name && (
              <span className="ml-1 text-xs opacity-70">- {day.name}</span>
            )}
          </Button>
        ))}
      </div>

      {activeDay?.description && (
        <div className="rounded-lg border bg-muted/50 px-4 py-3">
          <p className="text-sm text-muted-foreground">{activeDay.description}</p>
        </div>
      )}

      {activeDay && (
        <div className="space-y-3">
          {!todayLog && !activeWorkoutId ? (
            <Button onClick={handleStartWorkout} className="w-full" disabled={startWorkout.isPending}>
              {startWorkout.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
              {t("startWorkout")}
            </Button>
          ) : todayLog?.completed ? (
            <div className="text-center py-2">
              <Badge variant="secondary" className="text-sm">
                <Check className="mr-1 h-3 w-3" />
                {t("workoutCompleted")}
              </Badge>
            </div>
          ) : (
            <div className="space-y-2">
              <Textarea
                placeholder={t("workoutNotesPlaceholder")}
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                className="text-sm resize-none"
                rows={2}
              />
              <Button
                variant="secondary"
                className="w-full"
                disabled={completeWorkout.isPending}
                onClick={() => {
                  const id = activeWorkoutId ?? todayLog?.id;
                  if (id) completeWorkout.mutate({ id, notes: workoutNotes || undefined });
                }}
              >
                {completeWorkout.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                {t("completeWorkout")}
              </Button>
            </div>
          )}

          <div className="space-y-2">
            {activeDay.groups && activeDay.groups.length > 0
              ? activeDay.groups.map((group: ExerciseGroup) => {
                  const groupLabel =
                    group.group_type === "superset"
                      ? tr("supersetGroup")
                      : group.group_type === "triset"
                      ? tr("trisetGroup")
                      : group.group_type === "circuit"
                      ? `${tr("circuitGroup")} - ${group.rounds ?? 1} ${tr("roundsLabel").toLowerCase()}`
                      : group.group_type === "emom"
                      ? `${tr("emomGroup")} - ${Math.floor((group.time_limit_seconds ?? 0) / 60)} min`
                      : group.group_type === "amrap"
                      ? `${tr("amrapGroup")} - ${Math.floor((group.time_limit_seconds ?? 0) / 60)} min`
                      : null;

                  const isSolo = group.group_type === "solo";
                  const exercises = group.exercises ?? [];

                  if (isSolo) {
                    return exercises.map((ex) => (
                      <ExerciseCard
                        key={ex.id}
                        ex={ex}
                        exerciseData={exerciseData}
                        setExerciseData={setExerciseData}
                        activeWorkoutId={activeWorkoutId}
                        todayLog={todayLog}
                        logExercise={logExercise}
                        handleLogExercise={handleLogExercise}
                        startCountdown={startCountdown}
                        setSelectedExercise={setSelectedExercise}
                        locale={locale}
                        t={t}
                        te={te}
                      />
                    ));
                  }

                  return (
                    <div key={group.id} className="rounded-lg border-l-4 border-primary/40 bg-muted/30 p-2 space-y-2">
                      <div className="flex items-center gap-2 px-1">
                        <Badge variant="secondary" className="text-xs font-semibold">
                          {groupLabel}
                        </Badge>
                        {group.rest_between_rounds != null && group.rest_between_rounds > 0 && (
                          <span className="text-[10px] text-muted-foreground">
                            ({group.rest_between_rounds}s rest)
                          </span>
                        )}
                        {group.notes && (
                          <span className="text-[10px] text-muted-foreground italic">{group.notes}</span>
                        )}
                      </div>
                      {exercises.map((ex) => (
                        <ExerciseCard
                          key={ex.id}
                          ex={ex}
                          exerciseData={exerciseData}
                          setExerciseData={setExerciseData}
                          activeWorkoutId={activeWorkoutId}
                          todayLog={todayLog}
                          logExercise={logExercise}
                          handleLogExercise={handleLogExercise}
                          startCountdown={startCountdown}
                          setSelectedExercise={setSelectedExercise}
                          locale={locale}
                          t={t}
                          te={te}
                        />
                      ))}
                    </div>
                  );
                })
              : activeDay.exercises.map((ex) => (
                  <ExerciseCard
                    key={ex.id}
                    ex={ex}
                    exerciseData={exerciseData}
                    setExerciseData={setExerciseData}
                    activeWorkoutId={activeWorkoutId}
                    todayLog={todayLog}
                    logExercise={logExercise}
                    handleLogExercise={handleLogExercise}
                    startCountdown={startCountdown}
                    setSelectedExercise={setSelectedExercise}
                    locale={locale}
                    t={t}
                    te={te}
                  />
                ))}
          </div>
        </div>
      )}

      <RestTimer />

      <ExerciseDetailDialog
        exercise={selectedExercise}
        open={!!selectedExercise}
        onOpenChange={(open) => !open && setSelectedExercise(null)}
      />
    </div>
  );
}
