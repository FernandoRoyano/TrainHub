"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, Weight, BarChart3 } from "lucide-react";
import type { WorkoutWithExercises } from "@/services/client-app.service";

interface ProgressChartsProps {
  workouts: WorkoutWithExercises[];
}

export function ProgressCharts({ workouts }: ProgressChartsProps) {
  const t = useTranslations("progress");
  const [selectedExercise, setSelectedExercise] = useState<string>("all");

  // Get unique exercises
  const exercises = useMemo(() => {
    const map = new Map<string, string>();
    for (const w of workouts) {
      for (const el of w.exercise_logs) {
        const name = el.routine_exercise?.exercise?.name;
        const id = el.routine_exercise_id;
        if (name && id) map.set(id, name);
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [workouts]);

  // Volume per workout (total sets * weight)
  const volumeData = useMemo(() => {
    return workouts.map((w) => {
      const logs =
        selectedExercise === "all"
          ? w.exercise_logs
          : w.exercise_logs.filter((el) => el.routine_exercise_id === selectedExercise);

      const totalVolume = logs.reduce((acc, el) => {
        return acc + el.sets_completed * (el.weight_used ?? 0);
      }, 0);

      const totalSets = logs.reduce((acc, el) => acc + el.sets_completed, 0);

      return {
        date: w.date,
        volume: Math.round(totalVolume),
        sets: totalSets,
      };
    });
  }, [workouts, selectedExercise]);

  // Weight progression per exercise
  const weightData = useMemo(() => {
    if (selectedExercise === "all") return [];

    return workouts
      .map((w) => {
        const log = w.exercise_logs.find(
          (el) => el.routine_exercise_id === selectedExercise
        );
        if (!log || !log.weight_used) return null;
        return {
          date: w.date,
          weight: log.weight_used,
          sets: log.sets_completed,
        };
      })
      .filter(Boolean) as { date: string; weight: number; sets: number }[];
  }, [workouts, selectedExercise]);

  // Weekly frequency
  const frequencyData = useMemo(() => {
    const weeks = new Map<string, number>();
    for (const w of workouts) {
      const date = new Date(w.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const key = weekStart.toISOString().split("T")[0];
      weeks.set(key, (weeks.get(key) ?? 0) + 1);
    }
    return Array.from(weeks.entries())
      .map(([week, count]) => ({ week, count }))
      .slice(-8);
  }, [workouts]);

  if (workouts.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Exercise filter */}
      <div className="flex items-center gap-2">
        <Select value={selectedExercise} onValueChange={setSelectedExercise}>
          <SelectTrigger className="w-full sm:w-[240px]">
            <SelectValue placeholder={t("allExercises")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allExercises")}</SelectItem>
            {exercises.map((ex) => (
              <SelectItem key={ex.id} value={ex.id}>
                {ex.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Volume Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t("totalVolume")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {volumeData.length > 1 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                  />
                  <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name={t("volume")}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t("needMoreData")}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Weight Progression Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Weight className="h-4 w-4" />
              {t("weightProgression")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weightData.length > 1 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                  />
                  <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="hsl(var(--chart-2, var(--primary)))"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name={t("weightKg")}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                {selectedExercise === "all"
                  ? t("selectExercise")
                  : t("needMoreData")}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Weekly Frequency */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t("weeklyFrequency")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {frequencyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={frequencyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    name={t("workouts")}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t("needMoreData")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
