"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useMyRoutine, useWorkoutLogs, useProgressData, useMyMeasurements } from "@/hooks/use-client-app";
import type { WorkoutLog, WorkoutWithExercises } from "@/services/client-app.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ProgressCharts } from "@/components/progress/progress-charts";
import { BodyStatsChart } from "@/components/progress/body-stats-chart";
import { PersonalRecords } from "@/components/progress/personal-records";
import { StreakStats } from "@/components/progress/streak-stats";
import { WeekComparison } from "@/components/progress/week-comparison";
import { MuscleGroupChart } from "@/components/progress/muscle-group-chart";
import { BarChart3, Calendar, Check, ChevronDown, ChevronUp } from "lucide-react";

export default function MyProgressPage() {
  const t = useTranslations("clientApp");
  const { data: routine, isLoading: routineLoading } = useMyRoutine();
  const { data: logs, isLoading: logsLoading } = useWorkoutLogs(routine?.id ?? "");
  const { data: progressWorkouts } = useProgressData(routine?.id ?? "");
  const { data: measurements } = useMyMeasurements();

  const isLoading = routineLoading || logsLoading;

  const weeklyStats = useMemo(() => {
    if (!logs || !routine) return null;
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const thisWeekLogs = logs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= startOfWeek && log.completed;
    });

    const totalDays = routine.routine?.days_per_week ?? 0;
    const completedDays = thisWeekLogs.length;
    const percentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
    return { completedDays, totalDays, percentage };
  }, [logs, routine]);

  const logsByDate = useMemo(() => {
    if (!logs) return new Map<string, boolean>();
    const map = new Map<string, boolean>();
    for (const log of logs) {
      if (log.completed) map.set(log.date, true);
    }
    return map;
  }, [logs]);

  const calendarDays = useMemo(() => {
    const days: { date: string; day: number; completed: boolean; isToday: boolean }[] = [];
    const today = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      days.push({
        date: dateStr,
        day: d.getDate(),
        completed: logsByDate.has(dateStr),
        isToday: i === 0,
      });
    }
    return days;
  }, [logsByDate]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("myProgress")}</h1>

      {/* Streak & consistency stats */}
      {logs && logs.length > 0 && <StreakStats logs={logs} />}

      {/* Week vs week comparison */}
      {progressWorkouts && progressWorkouts.length > 0 && (
        <WeekComparison workouts={progressWorkouts} />
      )}

      {/* Weekly ring */}
      {weeklyStats ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("weeklyProgress")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20">
                <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-muted"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${weeklyStats.percentage}, 100`}
                    className="text-primary"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                  {weeklyStats.percentage}%
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("thisWeek")}</p>
                <p className="text-2xl font-bold">
                  {weeklyStats.completedDays}/{weeklyStats.totalDays}
                </p>
                <p className="text-xs text-muted-foreground">{t("completedDays")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <EmptyState icon={BarChart3} emoji={"\uD83D\uDCC5"} title={t("noWorkouts")} />
      )}

      {/* Personal Records */}
      {progressWorkouts && progressWorkouts.length > 0 && (
        <PersonalRecords workouts={progressWorkouts} />
      )}

      {/* Body stats (weight/fat) */}
      {measurements && measurements.length > 0 && (
        <BodyStatsChart measurements={measurements} />
      )}

      {/* Muscle group distribution */}
      {progressWorkouts && progressWorkouts.length > 0 && (
        <MuscleGroupChart workouts={progressWorkouts} />
      )}

      {/* Progress Charts (volume, weight progression, frequency) */}
      {progressWorkouts && progressWorkouts.length > 0 && (
        <ProgressCharts workouts={progressWorkouts} />
      )}

      {/* Calendar heatmap */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t("history")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(({ date, day, completed, isToday }) => (
              <div
                key={date}
                className={`h-9 w-full rounded-md flex items-center justify-center text-xs ${
                  completed
                    ? "bg-primary text-primary-foreground"
                    : isToday
                      ? "border-2 border-primary"
                      : "bg-muted/50"
                }`}
              >
                {completed ? <Check className="h-3 w-3" /> : day}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workout history */}
      {logs && logs.length > 0 && (
        <WorkoutHistory logs={logs} progressWorkouts={progressWorkouts ?? []} t={t} />
      )}
    </div>
  );
}

function WorkoutHistory({
  logs,
  progressWorkouts,
  t,
}: {
  logs: WorkoutLog[];
  progressWorkouts: WorkoutWithExercises[];
  t: ReturnType<typeof useTranslations<"clientApp">>;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const workoutMap = useMemo(() => {
    const map = new Map<string, WorkoutWithExercises>();
    for (const w of progressWorkouts) map.set(w.id, w);
    return map;
  }, [progressWorkouts]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t("history")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {logs.slice(0, 15).map((log) => {
          const workout = workoutMap.get(log.id);
          const isExpanded = expandedId === log.id;
          const hasExercises = workout && workout.exercise_logs.length > 0;

          return (
            <div key={log.id} className="border-b last:border-0">
              <button
                className="flex items-center justify-between w-full py-2 text-left"
                onClick={() => setExpandedId(isExpanded ? null : log.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{log.date}</span>
                  {log.notes && (
                    <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                      - {log.notes}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={log.completed ? "default" : "secondary"} className="text-xs">
                    {log.completed ? (
                      <>
                        <Check className="mr-1 h-3 w-3" />
                        {t("workoutCompleted")}
                      </>
                    ) : (
                      t("workoutInProgress")
                    )}
                  </Badge>
                  {hasExercises && (
                    isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                  )}
                </div>
              </button>
              {isExpanded && hasExercises && (
                <div className="pb-3 pl-2 space-y-1">
                  {workout.exercise_logs.map((el) => (
                    <div key={el.id} className="flex items-center justify-between text-xs text-muted-foreground py-0.5">
                      <span className="font-medium text-foreground">
                        {el.routine_exercise?.exercise?.name ?? t("exerciseDetails")}
                      </span>
                      <span>
                        {el.sets_completed}s
                        {el.reps_completed ? ` x ${el.reps_completed}` : ""}
                        {el.weight_used ? ` @ ${el.weight_used}kg` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
