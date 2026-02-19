"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useMyRoutine, useWorkoutLogs, useProgressData } from "@/hooks/use-client-app";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ProgressCharts } from "@/components/progress/progress-charts";
import { BarChart3, Calendar, Check } from "lucide-react";

export default function MyProgressPage() {
  const t = useTranslations("clientApp");
  const { data: routine, isLoading: routineLoading } = useMyRoutine();
  const { data: logs, isLoading: logsLoading } = useWorkoutLogs(routine?.id ?? "");
  const { data: progressWorkouts } = useProgressData(routine?.id ?? "");

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
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("myProgress")}</h1>

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
        <EmptyState icon={BarChart3} title={t("noWorkouts")} />
      )}

      {/* Progress Charts */}
      {progressWorkouts && progressWorkouts.length > 0 && (
        <ProgressCharts workouts={progressWorkouts} />
      )}

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

      {logs && logs.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("history")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {logs.slice(0, 10).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <span className="text-sm">{log.date}</span>
                <Badge variant={log.completed ? "default" : "secondary"}>
                  {log.completed ? (
                    <>
                      <Check className="mr-1 h-3 w-3" />
                      {t("workoutCompleted")}
                    </>
                  ) : (
                    t("workoutInProgress")
                  )}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
