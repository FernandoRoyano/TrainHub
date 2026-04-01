"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useClientWorkoutHistory, useClientCompliance } from "@/hooks/use-clients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Dumbbell,
  Calendar,
  Check,
  Clock,
  Target,
} from "lucide-react";

interface TrackingTabProps {
  clientId: string;
}

export function TrackingTab({ clientId }: TrackingTabProps) {
  const t = useTranslations("trackingTab");
  const tc = useTranslations("clientApp");
  const tCal = useTranslations("calendar");
  const { data: history, isLoading: loadingHistory } = useClientWorkoutHistory(clientId);
  const { data: compliance, isLoading: loadingCompliance } = useClientCompliance(clientId);

  const stats = useMemo(() => {
    if (!history || history.length === 0) {
      return { totalSessions: 0, completionRate: 0 };
    }
    const totalSessions = history.length;
    const completedSessions = history.filter((w) => w.completed).length;
    const completionRate = totalSessions > 0
      ? Math.round((completedSessions / totalSessions) * 100)
      : 0;
    return { totalSessions, completionRate };
  }, [history]);

  // Build a calendar grid for the current month showing workout days
  const calendarGrid = useMemo(() => {
    if (!compliance?.logs) return [];
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Monday-based

    const logDates = new Set(
      compliance.logs.map((d) => {
        const date = new Date(d);
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      })
    );

    const days: { day: number | null; hasWorkout: boolean; isToday: boolean }[] = [];

    // Empty cells before first day
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ day: null, hasWorkout: false, isToday: false });
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const key = `${year}-${month}-${d}`;
      days.push({
        day: d,
        hasWorkout: logDates.has(key),
        isToday: d === now.getDate(),
      });
    }

    return days;
  }, [compliance?.logs]);

  const isLoading = loadingHistory || loadingCompliance;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const WEEKDAY_KEYS = ["weekday_mon", "weekday_tue", "weekday_wed", "weekday_thu", "weekday_fri", "weekday_sat", "weekday_sun"] as const;

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Dumbbell className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-2xl font-bold">{stats.totalSessions}</p>
            <p className="text-xs text-muted-foreground">{t("totalSessions")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Check className="h-5 w-5 mx-auto mb-1 text-emerald-400" />
            <p className="text-2xl font-bold">{stats.completionRate}%</p>
            <p className="text-xs text-muted-foreground">{t("completionRate")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Target className="h-5 w-5 mx-auto mb-1 text-blue-400" />
            <p className="text-2xl font-bold">{compliance?.completedDays ?? 0}</p>
            <p className="text-xs text-muted-foreground">{t("thisWeek")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Grid */}
      {calendarGrid.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" }).replace(/^\w/, (c) => c.toUpperCase())}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAY_KEYS.map((key) => (
                <div key={key} className="text-center text-[10px] text-muted-foreground font-medium">
                  {tCal(key)}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarGrid.map((cell, i) => (
                <div
                  key={i}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs transition-all ${
                    cell.day == null
                      ? ""
                      : cell.hasWorkout
                        ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-semibold"
                        : cell.isToday
                          ? "bg-primary/10 border border-primary/30 font-bold"
                          : "bg-muted/30"
                  }`}
                >
                  {cell.day != null && (
                    <>
                      <span>{cell.day}</span>
                      {cell.hasWorkout && (
                        <Dumbbell className="h-2.5 w-2.5 mt-0.5" />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Workout Logs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t("recentWorkouts")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!history || history.length === 0 ? (
            <EmptyState
              icon={Dumbbell}
              title={t("noWorkouts")}
            />
          ) : (
            <div className="space-y-2">
              {history.slice(0, 10).map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {new Date(workout.date + "T00:00:00").toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {workout.exercise_logs.length} {t("exercises")}
                    </span>
                  </div>
                  <Badge
                    variant={workout.completed ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {workout.completed ? (
                      <>
                        <Check className="mr-1 h-3 w-3" />
                        {tc("workoutCompleted")}
                      </>
                    ) : (
                      tc("workoutInProgress")
                    )}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
