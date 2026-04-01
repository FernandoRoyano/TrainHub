"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Heart, Calendar, Dumbbell } from "lucide-react";

interface CycleTabProps {
  clientId: string;
}

const phaseColors: Record<string, string> = {
  menstrual: "bg-red-500",
  follicular: "bg-pink-400",
  ovulation: "bg-purple-500",
  luteal: "bg-blue-400",
};

const phaseLabels: Record<string, string> = {
  menstrual: "Menstrual",
  follicular: "Folicular",
  ovulation: "Ovulación",
  luteal: "Lútea",
};

const phaseTips: Record<string, string> = {
  menstrual: "Reducir intensidad. Cardio ligero, yoga, estiramientos.",
  follicular: "Buen momento para subir pesos e intensidad.",
  ovulation: "Rendimiento máximo. Ideal para marcas personales.",
  luteal: "Intensidad moderada. Foco en técnica.",
};

export function CycleTab({ clientId }: CycleTabProps) {
  const t = useTranslations("menstrual");

  const { data: settings, isLoading: loadingSettings } = useQuery({
    queryKey: ["client-menstrual-settings", clientId],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("menstrual_settings")
        .select("*")
        .eq("client_id", clientId)
        .maybeSingle();
      return data;
    },
    enabled: !!clientId,
  });

  const now = new Date();
  const { data: monthLogs, isLoading: loadingLogs } = useQuery({
    queryKey: ["client-menstrual-logs", clientId, now.getFullYear(), now.getMonth()],
    queryFn: async () => {
      const supabase = createClient();
      const start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
      const end = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-31`;
      const { data } = await supabase
        .from("menstrual_logs")
        .select("*")
        .eq("client_id", clientId)
        .gte("date", start)
        .lte("date", end)
        .order("date");
      return data ?? [];
    },
    enabled: !!clientId,
  });

  // Calculate current phase
  const currentPhase = useMemo(() => {
    if (!settings?.last_period_start) return null;
    const lastStart = new Date(settings.last_period_start);
    const daysSincePeriod = Math.floor((now.getTime() - lastStart.getTime()) / 86400000);
    const cycleDay = (daysSincePeriod % (settings.average_cycle_length || 28)) + 1;
    const periodLen = settings.average_period_length || 5;
    const cycleLen = settings.average_cycle_length || 28;

    let phase: string;
    if (cycleDay <= periodLen) phase = "menstrual";
    else if (cycleDay <= Math.floor(cycleLen * 0.5)) phase = "follicular";
    else if (cycleDay <= Math.floor(cycleLen * 0.5) + 2) phase = "ovulation";
    else phase = "luteal";

    const daysUntilNext = cycleLen - cycleDay + 1;

    return { phase, cycleDay, daysUntilNext };
  }, [settings]);

  // Calendar grid
  const calendarGrid = useMemo(() => {
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const logMap = new Map<string, string>();
    for (const log of monthLogs ?? []) {
      if (log.phase) logMap.set(log.date, log.phase);
    }

    const days: { day: number | null; phase: string | null; isToday: boolean }[] = [];
    for (let i = 0; i < startDow; i++) days.push({ day: null, phase: null, isToday: false });

    const today = now.getDate();
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ day: d, phase: logMap.get(dateStr) || null, isToday: d === today });
    }
    return days;
  }, [monthLogs]);

  const isLoading = loadingSettings || loadingLogs;

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  return (
    <div className="space-y-4">
      {/* Current Phase */}
      {currentPhase ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-full ${phaseColors[currentPhase.phase]} flex items-center justify-center`}>
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold">{phaseLabels[currentPhase.phase]}</p>
                <p className="text-sm text-muted-foreground">
                  Día {currentPhase.cycleDay} · {currentPhase.daysUntilNext} días hasta siguiente período
                </p>
              </div>
            </div>
            <div className="mt-3 p-2 rounded-lg bg-muted/50 flex items-start gap-2">
              <Dumbbell className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">{phaseTips[currentPhase.phase]}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <EmptyState icon={Heart} title={t("title")} description="La clienta no ha configurado el seguimiento de ciclo." />
          </CardContent>
        </Card>
      )}

      {/* Calendar */}
      {calendarGrid.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {now.toLocaleDateString("es-ES", { month: "long", year: "numeric" }).replace(/^\w/, (c) => c.toUpperCase())}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
                <div key={d} className="text-center text-[10px] text-muted-foreground font-medium">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarGrid.map((cell, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs ${
                    cell.day == null ? "" :
                    cell.phase ? `${phaseColors[cell.phase]}/20 border border-${cell.phase === "menstrual" ? "red" : cell.phase === "follicular" ? "pink" : cell.phase === "ovulation" ? "purple" : "blue"}-500/40 font-semibold` :
                    cell.isToday ? "bg-primary/10 border border-primary/30 font-bold" :
                    "bg-muted/30"
                  }`}
                >
                  {cell.day != null && (
                    <>
                      <span>{cell.day}</span>
                      {cell.phase && (
                        <span className={`absolute bottom-0.5 h-1.5 w-1.5 rounded-full ${phaseColors[cell.phase]}`} />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-3 text-[10px] text-muted-foreground">
              {Object.entries(phaseLabels).map(([key, label]) => (
                <span key={key} className="flex items-center gap-1">
                  <span className={`h-2.5 w-2.5 rounded-full ${phaseColors[key]}`} />
                  {label}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Logs */}
      {monthLogs && monthLogs.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Registros del mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {monthLogs.slice(-7).reverse().map((log) => (
                <div key={log.id} className="flex items-center justify-between text-xs p-2 rounded border">
                  <span className="font-medium">{new Date(log.date + "T00:00:00").toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}</span>
                  <div className="flex items-center gap-2">
                    {log.phase && <Badge variant="outline" className="text-[10px]">{phaseLabels[log.phase]}</Badge>}
                    {log.mood && <span>{log.mood === "great" ? "😄" : log.mood === "good" ? "🙂" : log.mood === "neutral" ? "😐" : log.mood === "low" ? "😔" : "😢"}</span>}
                    {log.energy_level && <span>⚡{log.energy_level}/5</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
