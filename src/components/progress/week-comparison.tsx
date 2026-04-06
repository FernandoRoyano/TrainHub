"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { WorkoutWithExercises } from "@/services/client-app.service";

interface WeekComparisonProps {
  workouts: WorkoutWithExercises[];
}

export function WeekComparison({ workouts }: WeekComparisonProps) {
  const t = useTranslations("progress");

  const comparison = useMemo(() => {
    const now = new Date();
    const startOfThisWeek = new Date(now);
    const dayOfWeek = now.getDay();
    // Monday-based week (Mon=1, Sun=0→treat as 7)
    startOfThisWeek.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    let thisWeekSessions = 0;
    let thisWeekVolume = 0;
    let lastWeekSessions = 0;
    let lastWeekVolume = 0;

    for (const w of workouts) {
      const d = new Date(w.date + "T00:00:00");
      const volume = w.exercise_logs.reduce(
        (acc, el) => acc + el.sets_completed * (el.weight_used ?? 0),
        0
      );

      if (d >= startOfThisWeek) {
        thisWeekSessions++;
        thisWeekVolume += volume;
      } else if (d >= startOfLastWeek && d < startOfThisWeek) {
        lastWeekSessions++;
        lastWeekVolume += volume;
      }
    }

    return {
      thisWeekSessions,
      thisWeekVolume: Math.round(thisWeekVolume),
      lastWeekSessions,
      lastWeekVolume: Math.round(lastWeekVolume),
      sessionsDiff: thisWeekSessions - lastWeekSessions,
      volumeDiff: thisWeekVolume - lastWeekVolume,
    };
  }, [workouts]);

  const SessionIcon =
    comparison.sessionsDiff > 0
      ? TrendingUp
      : comparison.sessionsDiff < 0
        ? TrendingDown
        : Minus;

  const VolumeIcon =
    comparison.volumeDiff > 0
      ? TrendingUp
      : comparison.volumeDiff < 0
        ? TrendingDown
        : Minus;

  const sessionColor =
    comparison.sessionsDiff > 0
      ? "text-green-500"
      : comparison.sessionsDiff < 0
        ? "text-red-500"
        : "text-muted-foreground";

  const volumeColor =
    comparison.volumeDiff > 0
      ? "text-green-500"
      : comparison.volumeDiff < 0
        ? "text-red-500"
        : "text-muted-foreground";

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">{t("sessions")}</p>
            <SessionIcon className={`h-4 w-4 ${sessionColor}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{comparison.thisWeekSessions}</span>
            <span className="text-xs text-muted-foreground">
              / {comparison.lastWeekSessions} {t("lastWeek")}
            </span>
          </div>
          <p className={`text-xs mt-1 ${sessionColor}`}>
            {comparison.sessionsDiff > 0
              ? `+${comparison.sessionsDiff} ${t("sessionsUp")}`
              : comparison.sessionsDiff < 0
                ? `${comparison.sessionsDiff} ${t("sessionsDown")}`
                : t("sessionsSame")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">{t("totalVolumeShort")}</p>
            <VolumeIcon className={`h-4 w-4 ${volumeColor}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">
              {comparison.thisWeekVolume.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">kg</span>
          </div>
          <p className={`text-xs mt-1 ${volumeColor}`}>
            {comparison.volumeDiff > 0
              ? `+${comparison.volumeDiff.toLocaleString()}kg ${t("volumeUp")}`
              : comparison.volumeDiff < 0
                ? `${comparison.volumeDiff.toLocaleString()}kg ${t("volumeDown")}`
                : t("volumeSame")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
