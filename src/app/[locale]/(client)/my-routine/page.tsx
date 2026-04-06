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
import { Dumbbell, Check, Play, Timer, Loader2, MessageSquare } from "lucide-react";
import { RestTimer } from "@/components/workout/rest-timer";
import { WorkoutTimer } from "@/components/workout/workout-timer";
import { useRestTimerStore } from "@/stores/rest-timer-store";

/* eslint-disable @typescript-eslint/no-explicit-any */
function ExerciseCard({
  ex,
  exerciseData,
  setExerciseData,
  activeWorkoutId,
  todayLog,
  lastExerciseLog,
  isLogged,
  logExercise,
  handleLogExercise,
  startCountdown,
  setSelectedExercise,
  locale,
  t,
  te,
}: {
  ex: any;
  exerciseData: Record<string, { sets: number; weight: string; reps: string; feedback: string; setDetails?: { reps: string; weight: string }[] }>;
  setExerciseData: React.Dispatch<React.SetStateAction<Record<string, { sets: number; weight: string; reps: string; feedback: string; setDetails?: { reps: string; weight: string }[] }>>>;
  activeWorkoutId: string | null;
  todayLog: any;
  lastExerciseLog: any;
  isLogged: boolean;
  logExercise: any;
  handleLogExercise: (id: string, rest?: number, name?: string) => void;
  startCountdown: (seconds: number, name?: string) => void;
  setSelectedExercise: (e: Exercise | null) => void;
  locale: string;
  t: any;
  te: any;
}) {
  const totalSets = ex.sets || 3;
  const exData = exerciseData[ex.id] ?? {
    sets: totalSets,
    weight: "",
    reps: ex.reps ?? "",
    feedback: "",
    setDetails: Array.from({ length: totalSets }, () => ({ reps: "", weight: "" })),
  };
  // Ensure setDetails exists and has correct length
  const setDetails: { reps: string; weight: string }[] = exData.setDetails ?? Array.from({ length: totalSets }, () => ({ reps: "", weight: "" }));

  return (
    <Card key={ex.id} className={isLogged ? "border-emerald-500/50 bg-emerald-500/5" : ""}>
      <CardContent className="p-3 space-y-2">
        {/* Row 1: Image + Name + Info */}
        <div className="flex items-start gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => ex.exercise && setSelectedExercise(ex.exercise as Exercise)}
            className="shrink-0"
          >
            <ExerciseAnimation
              thumbnailUrl={ex.exercise?.thumbnail_url}
              alt={ex.exercise?.name}
              className="w-14 h-14 md:w-20 md:h-20 rounded-md md:rounded-lg object-cover hover:opacity-80 transition-opacity"
            />
          </button>
          <div className="flex-1 min-w-0">
            <button
              type="button"
              onClick={() => ex.exercise && setSelectedExercise(ex.exercise as Exercise)}
              className="text-left"
            >
              <p className="font-medium text-sm md:text-base hover:text-primary transition-colors leading-tight">
                {(locale === "es" ? ex.exercise?.name_es : null) ?? ex.exercise?.name ?? "Exercise"}
              </p>
            </button>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs md:text-sm text-muted-foreground">
                {ex.sets}x{ex.reps}
                {ex.rest_seconds > 0 && ` · ${ex.rest_seconds}s`}
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
            {lastExerciseLog && (
              <p className="text-[10px] md:text-xs text-primary/70 mt-0.5 truncate">
                {t("lastTime")}: {lastExerciseLog.sets_completed}x{lastExerciseLog.reps_completed || "?"} · {lastExerciseLog.weight_used ? `${lastExerciseLog.weight_used}kg` : "—"}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Per-set inputs (only during active workout) */}
        {(activeWorkoutId || (todayLog && !todayLog.completed)) && (
          <div className="space-y-1">
            <div className="flex gap-2 text-[10px] text-muted-foreground px-1">
              <span className="w-7 text-center">#</span>
              <span className="flex-1 text-center">Reps</span>
              <span className="flex-1 text-center">Peso (kg)</span>
            </div>
            {setDetails.map((set, si) => (
              <div key={si} className="flex items-center gap-2">
                <span className="w-7 text-center text-xs font-mono text-muted-foreground">{si + 1}</span>
                <Input
                  type="text"
                  value={set.reps}
                  onChange={(e) => {
                    const nd = [...setDetails];
                    nd[si] = { ...nd[si], reps: e.target.value };
                    setExerciseData((prev) => ({
                      ...prev,
                      [ex.id]: { ...exData, setDetails: nd, sets: totalSets, reps: nd.map((s) => s.reps).filter(Boolean).join("/") || exData.reps },
                    }));
                  }}
                  className="h-8 text-xs text-center flex-1"
                  placeholder={ex.reps ?? ""}
                />
                <Input
                  type="number"
                  step="0.5"
                  value={set.weight}
                  onChange={(e) => {
                    const nd = [...setDetails];
                    nd[si] = { ...nd[si], weight: e.target.value };
                    setExerciseData((prev) => ({
                      ...prev,
                      [ex.id]: { ...exData, setDetails: nd, sets: totalSets, weight: nd.filter((s) => s.weight).pop()?.weight || exData.weight },
                    }));
                  }}
                  className="h-8 text-xs text-center flex-1"
                  placeholder="kg"
                />
              </div>
            ))}
            <Button
              size="sm"
              variant="default"
              className="w-full mt-1"
              disabled={logExercise.isPending}
              onClick={() => handleLogExercise(ex.id, ex.rest_seconds, (ex.exercise as any)?.name)}
            >
              {logExercise.isPending ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Check className="h-3 w-3 mr-1" />}
              {t("logExercise")}
            </Button>
          </div>
        )}

        {/* Feedback field */}
        {(activeWorkoutId || (todayLog && !todayLog.completed)) && (
          <div className="flex items-start gap-2">
            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground mt-2 shrink-0" />
            <Input
              value={exData.feedback}
              onChange={(e) =>
                setExerciseData((prev: Record<string, { sets: number; weight: string; reps: string; feedback: string; setDetails?: { reps: string; weight: string }[] }>) => ({
                  ...prev,
                  [ex.id]: { ...exData, feedback: e.target.value },
                }))
              }
              placeholder={t("exerciseFeedbackPlaceholder")}
              className="h-8 text-xs"
            />
          </div>
        )}
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
  const [simpleView, setSimpleView] = useState(false);
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);
  const [workoutStartedAt, setWorkoutStartedAt] = useState<string | null>(null);
  const [exerciseData, setExerciseData] = useState<
    Record<string, { sets: number; weight: string; reps: string; feedback: string; setDetails?: { reps: string; weight: string }[] }>
  >({});
  const [workoutNotes, setWorkoutNotes] = useState("");
  const [loggedExercises, setLoggedExercises] = useState<Set<string>>(new Set());

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

  // Last completed log for this day (not today) — to show previous weights
  const lastLog = logs
    ?.filter((l) => l.routine_day_id === activeDay?.id && l.completed && l.date !== today)
    .sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;

  const handleStartWorkout = () => {
    if (!client || !activeDay) return;
    startWorkout.mutate(
      {
        clientId: client.id,
        clientRoutineId: routine.id,
        routineDayId: activeDay.id,
      },
      {
        onSuccess: (log) => {
          setActiveWorkoutId(log.id);
          setWorkoutStartedAt(new Date().toISOString());
        },
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
    const details = data?.setDetails?.filter((s) => s.reps || s.weight) ?? [];
    const repsStr = details.length > 0
      ? details.map((s) => `${s.reps || "?"}@${s.weight || "?"}kg`).join(" / ")
      : data?.reps || undefined;
    const avgWeight = details.length > 0
      ? details.reduce((sum, s) => sum + (parseFloat(s.weight) || 0), 0) / details.filter((s) => s.weight).length
      : data?.weight ? parseFloat(data.weight) : undefined;

    logExercise.mutate(
      {
        workoutLogId: workoutId,
        routineExerciseId,
        data: {
          sets_completed: details.length > 0 ? details.length : (data?.sets ?? 0),
          weight_used: avgWeight || undefined,
          reps_completed: repsStr,
          feedback: data?.feedback || undefined,
        },
      },
      {
        onSuccess: () => {
          setLoggedExercises((prev) => new Set(prev).add(routineExerciseId));
          if (restSeconds && restSeconds > 0) {
            startCountdown(restSeconds, exerciseName);
          }
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("myRoutine")}</h1>
          <p className="text-muted-foreground text-sm">{routine.routine?.name}</p>
        </div>
        <Button
          variant={simpleView ? "default" : "outline"}
          size="sm"
          onClick={() => setSimpleView(!simpleView)}
        >
          {simpleView ? t("fullView") : t("simpleView")}
        </Button>
      </div>

      {/* Day selector */}
      <div className="flex flex-wrap gap-2">
        {days.map((day, i) => (
          <Button
            key={day.id}
            variant={i === selectedDayIndex ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDayIndex(i)}
            className="text-xs"
          >
            {tr("day", { number: day.day_number })}
          </Button>
        ))}
      </div>
      {activeDay?.name && (
        <p className="text-sm font-medium text-muted-foreground -mt-1">{activeDay.name}</p>
      )}

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
            <div className="text-center py-2 space-y-1">
              <Badge variant="secondary" className="text-sm">
                <Check className="mr-1 h-3 w-3" />
                {t("workoutCompleted")}
              </Badge>
              {(todayLog as any)?.duration_minutes != null && (
                <p className="text-xs text-muted-foreground">
                  {t("duration")}: {(todayLog as any).duration_minutes} min
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {/* Workout Timer */}
              <div className="flex items-center justify-between">
                <WorkoutTimer startedAt={workoutStartedAt || (todayLog as any)?.started_at || new Date().toISOString()} />
                <Badge variant="outline" className="text-xs text-primary animate-pulse">
                  {t("inProgress")}
                </Badge>
              </div>

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
                  if (id) completeWorkout.mutate({ id, notes: workoutNotes || undefined }, {
                    onSuccess: () => {
                      setActiveWorkoutId(null);
                      setWorkoutStartedAt(null);
                      setWorkoutNotes("");
                    },
                  });
                }}
              >
                {completeWorkout.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                {t("completeWorkout")}
              </Button>
            </div>
          )}

          {/* Simple table view */}
          {simpleView ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 text-xs text-muted-foreground">
                    <th className="text-left p-2 font-medium">{t("exercise")}</th>
                    <th className="text-center p-2 font-medium w-14">{t("setsShort")}</th>
                    <th className="text-center p-2 font-medium w-14">{t("repsShort")}</th>
                    <th className="text-center p-2 font-medium w-16">{t("weightShort")}</th>
                    {(activeWorkoutId || (todayLog && !todayLog.completed)) && (
                      <th className="text-center p-2 font-medium w-10">✓</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {activeDay.exercises.map((ex) => {
                    const exData = exerciseData[ex.id] ?? { sets: ex.sets, weight: "", reps: ex.reps ?? "", feedback: "" };
                    const name = (locale === "es" ? (ex.exercise as any)?.name_es : null) ?? (ex.exercise as any)?.name ?? "?";
                    const lastExLog = lastLog?.exercise_logs?.find((el: any) => el.routine_exercise_id === ex.id);
                    const isWorkoutActive = !!(activeWorkoutId || (todayLog && !todayLog.completed));

                    return (
                      <tr key={ex.id} className="border-t border-border/30 hover:bg-muted/20">
                        <td className="p-2">
                          <p className="font-medium text-xs leading-tight">{name}</p>
                          <p className="text-[10px] text-muted-foreground">{ex.sets}x{ex.reps}{ex.rest_seconds > 0 ? ` · ${ex.rest_seconds}s` : ""}</p>
                          {lastExLog && (
                            <p className="text-[10px] text-primary/70">{t("lastTime")}: {lastExLog.weight_used ? `${lastExLog.weight_used}kg` : "—"}</p>
                          )}
                        </td>
                        <td className="p-1 text-center">
                          {isWorkoutActive ? (
                            <Input
                              type="number"
                              min={0}
                              max={20}
                              value={exData.sets}
                              onChange={(e) => setExerciseData((prev) => ({ ...prev, [ex.id]: { ...exData, sets: parseInt(e.target.value) || 0 } }))}
                              className="h-7 w-full text-xs text-center"
                            />
                          ) : (
                            <span className="text-xs">{ex.sets}</span>
                          )}
                        </td>
                        <td className="p-1 text-center">
                          {isWorkoutActive ? (
                            <Input
                              type="text"
                              value={exData.reps}
                              onChange={(e) => setExerciseData((prev) => ({ ...prev, [ex.id]: { ...exData, reps: e.target.value } }))}
                              className="h-7 w-full text-xs text-center"
                              placeholder={ex.reps ?? ""}
                            />
                          ) : (
                            <span className="text-xs">{ex.reps}</span>
                          )}
                        </td>
                        <td className="p-1 text-center">
                          {isWorkoutActive ? (
                            <Input
                              type="number"
                              step="0.5"
                              value={exData.weight}
                              onChange={(e) => setExerciseData((prev) => ({ ...prev, [ex.id]: { ...exData, weight: e.target.value } }))}
                              className="h-7 w-full text-xs text-center"
                              placeholder="kg"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        {isWorkoutActive && (
                          <td className="p-1 text-center">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              disabled={logExercise.isPending}
                              onClick={() => handleLogExercise(ex.id, ex.rest_seconds, (ex.exercise as any)?.name)}
                            >
                              {logExercise.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                            </Button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
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
                        lastExerciseLog={lastLog?.exercise_logs?.find((el: any) => el.routine_exercise_id === ex.id) ?? null}
                        isLogged={loggedExercises.has(ex.id)}
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
                          lastExerciseLog={lastLog?.exercise_logs?.find((el: any) => el.routine_exercise_id === ex.id) ?? null}
                          isLogged={loggedExercises.has(ex.id)}
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
                    lastExerciseLog={lastLog?.exercise_logs?.find((el: any) => el.routine_exercise_id === ex.id) ?? null}
                    isLogged={loggedExercises.has(ex.id)}
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
          )}
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
