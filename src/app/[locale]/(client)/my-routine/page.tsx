"use client";

// Esta vista maneja datos de entrenamiento con forma dinámica (logs por serie,
// feedback ad-hoc del cliente); tipar cada estructura no aporta seguridad real
// aquí, así que se permite `any` de forma acotada a este archivo.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FeatureGate } from "@/components/shared/feature-gate";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Exercise } from "@/services/exercises.service";
import type { ExerciseGroup } from "@/services/routines.service";
import { ExerciseDetailDialog } from "@/components/workout/exercise-detail-dialog";
import { ExerciseAnimation } from "@/components/workout/exercise-animation";
import { useMyRoutine, useMyRoutineRealtime, useMyClient, useWorkoutLogs, useStartWorkout, useCompleteWorkout, useLogExercise } from "@/hooks/use-client-app";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Dumbbell, Check, Play, Timer, Loader2, MessageSquare, Plus, X } from "lucide-react";
import { RestTimer } from "@/components/workout/rest-timer";
import { WorkoutTimer } from "@/components/workout/workout-timer";
import { useRestTimerStore } from "@/stores/rest-timer-store";
import { useWorkoutSessionStore, type SetDetail, type ExerciseEntry } from "@/stores/workout-session-store";
import { cn } from "@/lib/utils";
import { localDateString } from "@/lib/local-date";
import { AdaptiveTrainingCard } from "@/components/cycle-training/adaptive-training-card";

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
}: {
  ex: any;
  exerciseData: Record<string, ExerciseEntry>;
  setExerciseData: React.Dispatch<React.SetStateAction<Record<string, ExerciseEntry>>>;
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
}) {
  const totalSets = ex.sets || 3;
  const emptySet = (): SetDetail => ({ reps: "", weight: "", note: "", rir: "", rest: "" });
  const exData: ExerciseEntry = exerciseData[ex.id] ?? {
    sets: totalSets,
    weight: "",
    reps: ex.reps ?? "",
    feedback: "",
    setDetails: Array.from({ length: totalSets }, emptySet),
  };
  // Ensure setDetails exists and has correct length
  const setDetails: SetDetail[] = exData.setDetails ?? Array.from({ length: totalSets }, emptySet);

  const commitSets = (nd: SetDetail[]) =>
    setExerciseData((prev) => ({
      ...prev,
      [ex.id]: {
        ...exData,
        setDetails: nd,
        sets: nd.length,
        reps: nd.map((s) => s.reps).filter(Boolean).join("/") || exData.reps,
        weight: nd.filter((s) => s.weight).pop()?.weight || exData.weight,
      },
    }));

  const addSet = () => commitSets([...setDetails, emptySet()]);
  const removeSet = (idx: number) => commitSets(setDetails.filter((_, i) => i !== idx));

  return (
    <Card
      key={ex.id}
      className={cn(
        "transition-all duration-300 relative",
        isLogged
          ? "border-2 border-primary bg-primary/10 opacity-70"
          : "border border-border"
      )}
    >
      {isLogged && (
        <div className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
          <Check className="h-4 w-4" strokeWidth={3} />
        </div>
      )}
      <CardContent className="p-3 md:p-4 space-y-3">
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
                {(locale === "es" ? ex.exercise?.name_es : null) ?? ex.exercise?.name ?? ""}
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
              <p className="text-xs md:text-xs text-primary/70 mt-0.5 truncate">
                {t("lastTime")}: {lastExerciseLog.sets_completed}x{lastExerciseLog.reps_completed || "?"} · {lastExerciseLog.weight_used ? `${lastExerciseLog.weight_used}kg` : "—"}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Per-set inputs (only during active workout) */}
        {(activeWorkoutId || (todayLog && !todayLog.completed)) && (
          <div className="space-y-2">
            <div className="flex gap-1.5 text-[11px] text-muted-foreground px-1 font-medium">
              <span className="w-6 text-center">#</span>
              <span className="flex-1 text-center">{t("repsShort")}</span>
              <span className="flex-1 text-center">{t("weightShort")}</span>
              <span className="w-12 text-center">{t("rirShort")}</span>
              <span className="w-14 text-center">{t("restShort")}</span>
              <span className="w-6" />
            </div>
            {setDetails.map((set, si) => {
              const updateField = (field: keyof SetDetail, value: string) => {
                const nd = [...setDetails];
                nd[si] = { ...nd[si], [field]: value };
                commitSets(nd);
              };
              return (
                <div key={si} className="space-y-1 rounded-lg bg-muted/30 p-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 text-center text-xs font-bold text-muted-foreground bg-muted rounded-md py-1">{si + 1}</span>
                    <Input
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={set.reps}
                      onChange={(e) => updateField("reps", e.target.value)}
                      className="h-11 text-base text-center flex-1 font-semibold px-1"
                      placeholder={ex.reps ?? ""}
                    />
                    <Input
                      type="number"
                      inputMode="decimal"
                      step="0.5"
                      value={set.weight}
                      onChange={(e) => updateField("weight", e.target.value)}
                      className="h-11 text-base text-center flex-1 font-semibold px-1"
                      placeholder="kg"
                    />
                    <Input
                      type="number"
                      inputMode="numeric"
                      value={set.rir}
                      onChange={(e) => updateField("rir", e.target.value)}
                      className="h-11 text-base text-center w-12 font-semibold px-1"
                      placeholder="RIR"
                    />
                    <Input
                      type="number"
                      inputMode="numeric"
                      value={set.rest}
                      onChange={(e) => updateField("rest", e.target.value)}
                      className="h-11 text-base text-center w-14 font-semibold px-1"
                      placeholder={ex.rest_seconds > 0 ? String(ex.rest_seconds) : "s"}
                    />
                    <button
                      type="button"
                      onClick={() => removeSet(si)}
                      disabled={setDetails.length <= 1}
                      className="w-6 flex items-center justify-center text-muted-foreground hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed"
                      title={t("removeSet")}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="pl-[30px] pr-8">
                    <Input
                      type="text"
                      value={set.note}
                      onChange={(e) => updateField("note", e.target.value)}
                      className="h-8 text-xs text-muted-foreground"
                      placeholder={t("setNotePlaceholder")}
                    />
                  </div>
                </div>
              );
            })}
            <Button
              size="sm"
              variant="outline"
              className="w-full h-9"
              onClick={addSet}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              {t("addSet")}
            </Button>
            <Button
              size="sm"
              variant="default"
              className="w-full mt-1 h-9 active:scale-[0.98] transition-all"
              disabled={logExercise.isPending}
              onClick={() => handleLogExercise(ex.id)}
            >
              {logExercise.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Check className="h-4 w-4 mr-1.5" />}
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
                setExerciseData((prev: Record<string, ExerciseEntry>) => ({
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

function MyRoutinePageContent() {
  const t = useTranslations("clientApp");
  const tr = useTranslations("routines");
  const locale = useLocale();
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const { data: routine, isLoading } = useMyRoutine();
  const { data: client } = useMyClient();
  const { data: logs } = useWorkoutLogs(routine?.id ?? "");
  useMyRoutineRealtime(
    routine?.routine_id,
    routine?.id,
    routine?.routine?.days?.map((d) => d.id)
  );
  const startWorkout = useStartWorkout();
  const completeWorkout = useCompleteWorkout();
  const logExercise = useLogExercise();

  const startCountdown = useRestTimerStore((s) => s.startCountdown);

  // Persisted workout session (survives navigation)
  const activeWorkoutId = useWorkoutSessionStore((s) => s.activeWorkoutId);
  const workoutStartedAt = useWorkoutSessionStore((s) => s.workoutStartedAt);
  const exerciseData = useWorkoutSessionStore((s) => s.exerciseData);
  const workoutNotes = useWorkoutSessionStore((s) => s.workoutNotes);
  const loggedExercises = useWorkoutSessionStore((s) => s.loggedExercises);
  const storedDayIndex = useWorkoutSessionStore((s) => s.selectedDayIndex);
  const sessionStart = useWorkoutSessionStore((s) => s.startSession);
  const sessionEnd = useWorkoutSessionStore((s) => s.endSession);
  const storeSetExerciseData = useWorkoutSessionStore((s) => s.setExerciseData);
  const storeSetWorkoutNotes = useWorkoutSessionStore((s) => s.setWorkoutNotes);
  const storeMarkLogged = useWorkoutSessionStore((s) => s.markExerciseLogged);
  const setSelectedDayIndex = useWorkoutSessionStore((s) => s.setSelectedDayIndex);

  const [simpleView, setSimpleView] = useState(false);
  const today = localDateString();
  const [completionDate, setCompletionDate] = useState<string>(today);

  // El índice persiste en localStorage: si la nueva rutina tiene menos días
  // que la anterior, quedaba fuera de rango y la página no mostraba ejercicios
  const dayCount = routine?.routine?.days?.length ?? 0;
  const selectedDayIndex = dayCount > 0 ? Math.min(storedDayIndex, dayCount - 1) : 0;

  // Clear stale session: if no active workout and store has leftover data, clean up
  useEffect(() => {
    if (!isLoading && routine) {
      const todayLogForCleanup = logs?.find(
        (l) => l.date === today && l.routine_day_id === (routine.routine?.days ?? [])[selectedDayIndex]?.id
      );
      const hasActiveWorkout = activeWorkoutId || (todayLogForCleanup && !todayLogForCleanup.completed);
      if (!hasActiveWorkout && loggedExercises.length > 0) {
        sessionEnd();
      }
    }
  }, [isLoading, routine, logs, today, selectedDayIndex]);

  // Helper to match old Set-based API
  const setExerciseData: React.Dispatch<React.SetStateAction<typeof exerciseData>> = (action) => {
    if (typeof action === "function") {
      const next = action(exerciseData);
      for (const [id, data] of Object.entries(next)) {
        storeSetExerciseData(id, data);
      }
    } else {
      for (const [id, data] of Object.entries(action)) {
        storeSetExerciseData(id, data);
      }
    }
  };
  const setWorkoutNotes = storeSetWorkoutNotes;

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

  const todayLog = logs?.find(
    (l) => l.date === today && l.routine_day_id === activeDay?.id
  );

  // Build set of truly logged exercise IDs from server data + local store
  const serverLoggedIds = new Set(
    (todayLog as any)?.exercise_logs?.map((el: any) => el.routine_exercise_id) ?? []
  );
  const isExerciseLogged = (exId: string) =>
    serverLoggedIds.has(exId) || loggedExercises.includes(exId);

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
          sessionStart(log.id);
        },
      }
    );
  };

  const handleLogExercise = (routineExerciseId: string) => {
    const workoutId = activeWorkoutId ?? todayLog?.id;
    if (!workoutId) return;
    const data = exerciseData[routineExerciseId];
    const details = data?.setDetails?.filter((s) => s.reps || s.weight || s.rir || s.rest) ?? [];
    const repsStr = details.length > 0
      ? details.map((s) => `${s.reps || "?"}@${s.weight || "?"}kg${s.rir ? ` RIR${s.rir}` : ""}${s.note ? ` (${s.note})` : ""}`).join(" / ")
      : data?.reps || undefined;
    const weighted = details.filter((s) => s.weight);
    const avgWeight = weighted.length > 0
      ? weighted.reduce((sum, s) => sum + (parseFloat(s.weight) || 0), 0) / weighted.length
      : data?.weight ? parseFloat(data.weight) : undefined;

    // Detalle estructurado por serie (RIR/descanso/series extra). Se guarda en
    // set_logs (JSONB); num/null para que sea consultable a futuro.
    const num = (v: string) => (v.trim() === "" ? null : Number(v));
    const setLogs = details.map((s, i) => ({
      set: i + 1,
      reps: s.reps,
      weight: num(s.weight),
      rir: num(s.rir),
      rest_seconds: num(s.rest),
      note: s.note,
    }));

    logExercise.mutate(
      {
        workoutLogId: workoutId,
        routineExerciseId,
        data: {
          sets_completed: details.length > 0 ? details.length : (data?.sets ?? 0),
          weight_used: avgWeight || undefined,
          reps_completed: repsStr,
          feedback: data?.feedback || undefined,
          set_logs: setLogs,
        },
      },
      {
        onSuccess: () => {
          storeMarkLogged(routineExerciseId);
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">{t("myRoutine")}</h1>
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

      {/* Cycle-aware training suggestion (only for female clients) */}
      {client?.gender === "female" && <AdaptiveTrainingCard />}

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
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">{t("workoutDate")}</label>
                <Input
                  type="date"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  max={today}
                  className="text-sm h-9"
                />
              </div>
              <Button
                variant="secondary"
                className="w-full"
                disabled={completeWorkout.isPending}
                onClick={() => {
                  const id = activeWorkoutId ?? todayLog?.id;
                  if (id) completeWorkout.mutate({ id, notes: workoutNotes || undefined, customDate: completionDate }, {
                    onSuccess: () => {
                      sessionEnd();
                      setCompletionDate(today);
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
                          <p className="text-xs text-muted-foreground">{ex.sets}x{ex.reps}{ex.rest_seconds > 0 ? ` · ${ex.rest_seconds}s` : ""}</p>
                          {lastExLog && (
                            <p className="text-xs text-primary/70">{t("lastTime")}: {lastExLog.weight_used ? `${lastExLog.weight_used}kg` : "—"}</p>
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
                              className="h-8 w-full text-xs text-center"
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
                              className="h-8 w-full text-xs text-center"
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
                              className="h-8 w-full text-xs text-center"
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
                              onClick={() => handleLogExercise(ex.id)}
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
                        isLogged={isExerciseLogged(ex.id)}
                        logExercise={logExercise}
                        handleLogExercise={handleLogExercise}
                        startCountdown={startCountdown}
                        setSelectedExercise={setSelectedExercise}
                        locale={locale}
                        t={t}
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
                          <span className="text-xs text-muted-foreground">
                            ({group.rest_between_rounds}s {t("restShort")})
                          </span>
                        )}
                        {group.notes && (
                          <span className="text-xs text-muted-foreground italic">{group.notes}</span>
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
                          isLogged={isExerciseLogged(ex.id)}
                          logExercise={logExercise}
                          handleLogExercise={handleLogExercise}
                          startCountdown={startCountdown}
                          setSelectedExercise={setSelectedExercise}
                          locale={locale}
                          t={t}
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
                    isLogged={isExerciseLogged(ex.id)}
                    logExercise={logExercise}
                    handleLogExercise={handleLogExercise}
                    startCountdown={startCountdown}
                    setSelectedExercise={setSelectedExercise}
                    locale={locale}
                    t={t}
                  />
                ))}
          </div>
          )}
        </div>
      )}

      {/* Apuntes del entrenador: recomendaciones de la rutina fuera del gym */}
      {routine.routine?.final_notes && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
          <p className="text-sm font-semibold mb-1">{t("trainerNotes")}</p>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {routine.routine.final_notes}
          </p>
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

export default function MyRoutinePage() {
  return (
    <FeatureGate feature="training">
      <MyRoutinePageContent />
    </FeatureGate>
  );
}
