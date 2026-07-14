"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Target } from "lucide-react";
import type { WorkoutWithExercises } from "@/services/client-app.service";
import { CHART_COLORS } from "@/lib/ui-tokens";

interface MuscleGroupChartProps {
  workouts: WorkoutWithExercises[];
}

const COLORS = [...CHART_COLORS, "hsl(var(--primary))", ...CHART_COLORS.slice(0, 2)];

// Map common exercise names to muscle groups
function inferMuscleGroup(exerciseName: string): string {
  const name = exerciseName.toLowerCase();

  if (name.includes("bench") || name.includes("press") && (name.includes("chest") || name.includes("pec"))) return "Chest";
  if (name.includes("squat") || name.includes("sentadilla") || name.includes("leg press") || name.includes("prensa")) return "Legs";
  if (name.includes("deadlift") || name.includes("peso muerto")) return "Back";
  if (name.includes("curl") && (name.includes("bicep") || name.includes("biceps"))) return "Biceps";
  if (name.includes("tricep") || name.includes("extension") || name.includes("pushdown")) return "Triceps";
  if (name.includes("shoulder") || name.includes("hombro") || name.includes("lateral raise") || name.includes("elevacion")) return "Shoulders";
  if (name.includes("row") || name.includes("remo") || name.includes("pulldown") || name.includes("pull-up") || name.includes("jalon") || name.includes("dominada")) return "Back";
  if (name.includes("lunge") || name.includes("zancada") || name.includes("leg") || name.includes("pierna") || name.includes("hamstring") || name.includes("femoral") || name.includes("calf") || name.includes("pantorrilla") || name.includes("glute") || name.includes("gluteo") || name.includes("hip thrust")) return "Legs";
  if (name.includes("crunch") || name.includes("plank") || name.includes("plancha") || name.includes("abs") || name.includes("abdominal") || name.includes("core")) return "Core";
  if (name.includes("press") || name.includes("fly") || name.includes("aperturas") || name.includes("chest") || name.includes("pecho") || name.includes("pec")) return "Chest";
  if (name.includes("face pull") || name.includes("rear delt") || name.includes("deltoides posterior")) return "Shoulders";

  return "Other";
}

export function MuscleGroupChart({ workouts }: MuscleGroupChartProps) {
  const t = useTranslations("progress");

  const data = useMemo(() => {
    const groups = new Map<string, number>();

    for (const w of workouts) {
      for (const el of w.exercise_logs) {
        const name = el.routine_exercise?.exercise?.name;
        if (!name) continue;

        const group = inferMuscleGroup(name);
        groups.set(group, (groups.get(group) ?? 0) + el.sets_completed);
      }
    }

    return Array.from(groups.entries())
      .map(([name, sets]) => ({ name, sets }))
      .sort((a, b) => b.sets - a.sets);
  }, [workouts]);

  if (data.length === 0) return null;

  const total = data.reduce((acc, d) => acc + d.sets, 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="h-4 w-4" />
          {t("muscleGroups")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <ResponsiveContainer width="100%" height={180} className="max-w-[200px]">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={2}
                dataKey="sets"
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
                formatter={(value) => [`${value} sets`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1 w-full">
            {data.map((group, i) => (
              <div key={group.name} className="flex items-center gap-2 text-sm">
                <div
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="truncate">{group.name}</span>
                <span className="text-muted-foreground ml-auto text-xs">
                  {Math.round((group.sets / total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
