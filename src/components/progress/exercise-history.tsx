"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Dumbbell } from "lucide-react";
import type { WorkoutWithExercises } from "@/services/client-app.service";

interface ExerciseHistoryProps {
  workouts: WorkoutWithExercises[];
}

interface ExerciseSummary {
  id: string;
  name: string;
  entries: { date: string; weight: number; sets: number }[];
  lastWeight: number;
  bestWeight: number;
  trend: "up" | "down" | "same";
}

export function ExerciseHistory({ workouts }: ExerciseHistoryProps) {
  const t = useTranslations("progress");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const exercises = useMemo<ExerciseSummary[]>(() => {
    const map = new Map<string, { name: string; entries: { date: string; weight: number; sets: number }[] }>();

    for (const w of workouts) {
      for (const el of w.exercise_logs) {
        const name = el.routine_exercise?.exercise?.name;
        const id = el.routine_exercise_id;
        if (!name || !id || !el.weight_used) continue;

        if (!map.has(id)) map.set(id, { name, entries: [] });
        map.get(id)!.entries.push({
          date: w.date,
          weight: el.weight_used,
          sets: el.sets_completed,
        });
      }
    }

    return Array.from(map.entries())
      .map(([id, { name, entries }]) => {
        const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
        const lastWeight = sorted[sorted.length - 1]?.weight ?? 0;
        const prevWeight = sorted[sorted.length - 2]?.weight ?? lastWeight;
        const bestWeight = Math.max(...sorted.map((e) => e.weight));

        const trend: "up" | "down" | "same" =
          lastWeight > prevWeight ? "up" : lastWeight < prevWeight ? "down" : "same";

        return { id, name, entries: sorted, lastWeight, bestWeight, trend };
      })
      .filter((e) => e.entries.length > 0)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [workouts]);

  if (exercises.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Dumbbell className="h-4 w-4" />
          {t("exerciseHistory")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {exercises.map((ex) => {
          const isExpanded = expandedId === ex.id;
          const TrendIcon =
            ex.trend === "up" ? TrendingUp : ex.trend === "down" ? TrendingDown : Minus;
          const trendColor =
            ex.trend === "up"
              ? "text-green-500"
              : ex.trend === "down"
              ? "text-red-500"
              : "text-muted-foreground";

          return (
            <div key={ex.id} className="border rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors text-left"
                onClick={() => setExpandedId(isExpanded ? null : ex.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="font-medium text-sm truncate">{ex.name}</span>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {ex.entries.length} {t("sessions")}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">{t("lastWeight")}</p>
                    <p className="text-sm font-semibold">{ex.lastWeight} kg</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">{t("bestWeight")}</p>
                    <p className="text-sm font-semibold">{ex.bestWeight} kg</p>
                  </div>
                  <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Mobile stats */}
              <div className="flex gap-4 px-3 pb-2 sm:hidden">
                <div>
                  <p className="text-xs text-muted-foreground">{t("lastWeight")}</p>
                  <p className="text-sm font-semibold">{ex.lastWeight} kg</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("bestWeight")}</p>
                  <p className="text-sm font-semibold">{ex.bestWeight} kg</p>
                </div>
              </div>

              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t">
                  {ex.entries.length > 1 ? (
                    <ResponsiveContainer width="100%" height={160}>
                      <LineChart data={ex.entries}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 10 }}
                          className="text-muted-foreground"
                          tickFormatter={(v) => v.slice(5)}
                        />
                        <YAxis
                          tick={{ fontSize: 10 }}
                          className="text-muted-foreground"
                          domain={["auto", "auto"]}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            fontSize: 12,
                          }}
                          formatter={(value) => [`${value} kg`, t("weightKg")]}
                          labelFormatter={(label) => label}
                        />
                        <Line
                          type="monotone"
                          dataKey="weight"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {t("needMoreData")}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
