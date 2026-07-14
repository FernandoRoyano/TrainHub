"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Zap, Dumbbell } from "lucide-react";
import type { WorkoutLog } from "@/services/client-app.service";

interface StreakStatsProps {
  logs: WorkoutLog[];
}

export function StreakStats({ logs }: StreakStatsProps) {
  const t = useTranslations("progress");

  const stats = useMemo(() => {
    const completedDates = new Set(
      logs.filter((l) => l.completed).map((l) => l.date)
    );

    const sortedDates = Array.from(completedDates).sort().reverse();

    // Current streak: consecutive days from today backwards
    let currentStreak = 0;
    if (sortedDates.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if most recent workout was today or yesterday
      const lastDate = new Date(sortedDates[0] + "T00:00:00");
      const diffDays = Math.floor(
        (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays <= 1) {
        // Count consecutive days (allowing 1-day gaps for rest days)
        let prevDate = lastDate;
        currentStreak = 1;

        for (let i = 1; i < sortedDates.length; i++) {
          const d = new Date(sortedDates[i] + "T00:00:00");
          const gap = Math.floor(
            (prevDate.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (gap <= 2) {
            currentStreak++;
            prevDate = d;
          } else {
            break;
          }
        }
      }
    }

    // Best streak
    let bestStreak = 0;
    let tempStreak = 1;
    const ascDates = Array.from(completedDates).sort();

    for (let i = 1; i < ascDates.length; i++) {
      const prev = new Date(ascDates[i - 1] + "T00:00:00");
      const curr = new Date(ascDates[i] + "T00:00:00");
      const gap = Math.floor(
        (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (gap <= 2) {
        tempStreak++;
      } else {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak);
    if (ascDates.length === 0) bestStreak = 0;

    return {
      currentStreak,
      bestStreak,
      totalWorkouts: completedDates.size,
    };
  }, [logs]);

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card>
        <CardContent className="pt-4 pb-4 text-center">
          <Flame className="h-5 w-5 mx-auto mb-1 text-warning" />
          <p className="text-2xl font-bold">{stats.currentStreak}</p>
          <p className="text-xs text-muted-foreground">{t("streak")}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4 pb-4 text-center">
          <Zap className="h-5 w-5 mx-auto mb-1 text-warning" />
          <p className="text-2xl font-bold">{stats.bestStreak}</p>
          <p className="text-xs text-muted-foreground">{t("bestStreak")}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4 pb-4 text-center">
          <Dumbbell className="h-5 w-5 mx-auto mb-1 text-primary" />
          <p className="text-2xl font-bold">{stats.totalWorkouts}</p>
          <p className="text-xs text-muted-foreground">{t("totalWorkouts")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
