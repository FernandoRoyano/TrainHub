"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import type { WorkoutWithExercises } from "@/services/client-app.service";

interface PersonalRecordsProps {
  workouts: WorkoutWithExercises[];
}

interface PR {
  exerciseName: string;
  weight: number;
  date: string;
}

export function PersonalRecords({ workouts }: PersonalRecordsProps) {
  const t = useTranslations("progress");

  const records = useMemo(() => {
    const prMap = new Map<string, PR>();

    for (const w of workouts) {
      for (const el of w.exercise_logs) {
        const name = el.routine_exercise?.exercise?.name;
        if (!name || !el.weight_used) continue;

        const existing = prMap.get(name);
        if (!existing || el.weight_used > existing.weight) {
          prMap.set(name, {
            exerciseName: name,
            weight: el.weight_used,
            date: w.date,
          });
        }
      }
    }

    return Array.from(prMap.values()).sort((a, b) => b.weight - a.weight);
  }, [workouts]);

  if (records.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="h-4 w-4 text-warning" />
          {t("personalRecords")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2">
          {records.slice(0, 8).map((pr) => (
            <div
              key={pr.exerciseName}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{pr.exerciseName}</p>
                <p className="text-xs text-muted-foreground">{pr.date}</p>
              </div>
              <div className="ml-2 text-right">
                <p className="text-lg font-bold text-primary">{pr.weight}</p>
                <p className="text-xs text-muted-foreground">kg</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
