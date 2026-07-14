"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, ChevronLeft, ChevronRight, Check, Clock } from "lucide-react";
import type { WorkoutLog } from "@/services/client-app.service";

interface WorkoutCalendarProps {
  logs: WorkoutLog[];
}

const WEEKDAYS_ES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function WorkoutCalendar({ logs }: WorkoutCalendarProps) {
  const [monthOffset, setMonthOffset] = useState(0);

  const { year, month, monthName, grid } = useMemo(() => {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const y = target.getFullYear();
    const m = target.getMonth();
    const lastDay = new Date(y, m + 1, 0);
    const startDow = target.getDay() === 0 ? 6 : target.getDay() - 1;

    const logDates = new Map<string, { completed: boolean; duration?: number }>();
    for (const log of logs) {
      const key = log.date;
      if (!logDates.has(key) || log.completed) {
        logDates.set(key, {
          completed: log.completed,
          duration: (log as any).duration_minutes ?? undefined,
        });
      }
    }

    const days: {
      day: number | null;
      date: string | null;
      hasWorkout: boolean;
      completed: boolean;
      duration?: number;
      isToday: boolean;
      isFuture: boolean;
    }[] = [];

    for (let i = 0; i < startDow; i++) {
      days.push({ day: null, date: null, hasWorkout: false, completed: false, isToday: false, isFuture: false });
    }

    const today = now.toISOString().split("T")[0];

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const logData = logDates.get(dateStr);
      days.push({
        day: d,
        date: dateStr,
        hasWorkout: !!logData,
        completed: logData?.completed ?? false,
        duration: logData?.duration,
        isToday: dateStr === today,
        isFuture: dateStr > today,
      });
    }

    const name = target.toLocaleDateString("es-ES", { month: "long", year: "numeric" });

    return { year: y, month: m, monthName: name.charAt(0).toUpperCase() + name.slice(1), grid: days };
  }, [logs, monthOffset]);

  const canGoForward = monthOffset < 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMonthOffset((p) => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-base">{monthName}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setMonthOffset((p) => p + 1)}
            disabled={!canGoForward}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1.5 mb-1.5">
          {WEEKDAYS_ES.map((d) => (
            <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {grid.map((cell, i) => (
            <div
              key={i}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-all ${
                cell.day == null
                  ? ""
                  : cell.completed
                    ? "bg-success/20 border-2 border-success/50 text-success"
                    : cell.hasWorkout && !cell.completed
                      ? "bg-warning/20 border-2 border-warning/50 text-warning"
                      : cell.isToday
                        ? "bg-primary/10 border-2 border-primary/40 font-bold"
                        : cell.isFuture
                          ? "bg-transparent text-muted-foreground/30"
                          : "bg-muted/40"
              }`}
            >
              {cell.day != null && (
                <>
                  <span className={cell.completed ? "font-bold" : ""}>{cell.day}</span>
                  {cell.completed && <Check className="h-3 w-3 mt-0.5" />}
                  {cell.hasWorkout && !cell.completed && <Clock className="h-3 w-3 mt-0.5" />}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded bg-success/30 border border-success/50" />
            Completado
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded bg-warning/30 border border-warning/50" />
            En progreso
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded bg-primary/10 border border-primary/40" />
            Hoy
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
