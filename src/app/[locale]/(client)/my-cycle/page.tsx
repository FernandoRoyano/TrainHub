"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  useMenstrualSettings,
  useUpdateMenstrualSettings,
  useMenstrualMonthLogs,
  useCycleInfo,
  useLogMenstrualDay,
  useMenstrualDayLog,
} from "@/hooks/use-menstrual";
import type { FlowLevel, MoodLevel, CyclePhase } from "@/services/menstrual.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Heart, ChevronLeft, ChevronRight, Settings, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import { localDateString } from "@/lib/local-date";
import { CyclePrivacySettings } from "@/components/cycle-training/cycle-privacy-settings";

const PHASE_COLORS: Record<CyclePhase, string> = {
  menstrual: "bg-destructive",
  follicular: "bg-chart-5",
  ovulation: "bg-chart-3",
  luteal: "bg-chart-2",
};

const PHASE_TEXT_COLORS: Record<CyclePhase, string> = {
  menstrual: "text-destructive",
  follicular: "text-chart-5",
  ovulation: "text-chart-3",
  luteal: "text-chart-2",
};

const SYMPTOMS = [
  "cramps",
  "headache",
  "bloating",
  "fatigue",
  "breast_tenderness",
  "acne",
  "insomnia",
  "cravings",
  "nausea",
  "back_pain",
  "mood_swings",
] as const;

const FLOWS: FlowLevel[] = ["none", "light", "medium", "heavy", "spotting"];
const MOODS: MoodLevel[] = ["great", "good", "neutral", "low", "bad"];

function toDateString(d: Date): string {
  // Fecha LOCAL: con toISOString() el marcador de "hoy" y la fecha
  // seleccionada caían en el día anterior entre las 00:00 y la 01:00/02:00
  return localDateString(d);
}

export default function MyCyclePage() {
  const t = useTranslations("menstrual");
  const locale = useLocale();
  const tc = useTranslations("common");

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<string>(toDateString(today));
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Form state
  const [flow, setFlow] = useState<FlowLevel | "">("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState<MoodLevel | "">("");
  const [energy, setEnergy] = useState<number>(3);
  const [notes, setNotes] = useState("");

  // Settings form
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodLength, setPeriodLength] = useState<number>(5);
  const [lastPeriodStart, setLastPeriodStart] = useState<string>("");

  const { data: settings, isLoading: settingsLoading } = useMenstrualSettings();
  const updateSettings = useUpdateMenstrualSettings();
  const { data: cycleInfo } = useCycleInfo();
  const { data: monthLogs } = useMenstrualMonthLogs(viewYear, viewMonth);
  const { data: dayLog } = useMenstrualDayLog(selectedDate);
  const logDay = useLogMenstrualDay();

  // Sync settings form
  useMemo(() => {
    if (settings) {
      setCycleLength(settings.average_cycle_length);
      setPeriodLength(settings.average_period_length);
      setLastPeriodStart(settings.last_period_start ?? "");
    }
  }, [settings]);

  // Sync day log form
  useMemo(() => {
    if (dayLog) {
      setFlow(dayLog.flow ?? "");
      setSelectedSymptoms(dayLog.symptoms ?? []);
      setMood(dayLog.mood ?? "");
      setEnergy(dayLog.energy_level ?? 3);
      setNotes(dayLog.notes ?? "");
    } else {
      setFlow("");
      setSelectedSymptoms([]);
      setMood("");
      setEnergy(3);
      setNotes("");
    }
  }, [dayLog]);

  // Calendar data
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth - 1, 1);
    const lastDay = new Date(viewYear, viewMonth, 0);
    const startOffset = firstDay.getDay();
    const days: { date: string; day: number; inMonth: boolean; phase?: CyclePhase; hasLog: boolean }[] = [];

    // Build log map
    const logMap = new Map<string, CyclePhase | undefined>();
    for (const log of monthLogs ?? []) {
      logMap.set(log.date, log.phase ?? undefined);
    }

    for (let i = 0; i < startOffset; i++) {
      days.push({ date: "", day: 0, inMonth: false, hasLog: false });
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateStr = `${viewYear}-${String(viewMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({
        date: dateStr,
        day: d,
        inMonth: true,
        phase: logMap.get(dateStr),
        hasLog: logMap.has(dateStr),
      });
    }

    return days;
  }, [viewYear, viewMonth, monthLogs]);

  const prevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleLogDay = () => {
    logDay.mutate({
      date: selectedDate,
      data: {
        flow: flow || undefined,
        symptoms: selectedSymptoms,
        mood: mood || undefined,
        energy_level: energy,
        notes: notes || undefined,
      },
    });
  };

  const handleSaveSettings = () => {
    updateSettings.mutate({
      average_cycle_length: cycleLength,
      average_period_length: periodLength,
      last_period_start: lastPeriodStart || undefined,
    });
    setSettingsOpen(false);
  };

  const trainingTipKey = cycleInfo?.currentPhase
    ? `trainingTips.${cycleInfo.currentPhase}`
    : null;

  if (settingsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const monthName = new Date(viewYear, viewMonth - 1).toLocaleString(locale, { month: "long" });
  // Iniciales de los días según el idioma activo (semana empezando en domingo)
  const weekdayLetters = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: "narrow" }).format(new Date(2024, 0, 7 + i))
  );

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-chart-5" />
          <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
        </div>
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("settings")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>{t("avgCycleLength")}</Label>
                <Input
                  type="number"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(Number(e.target.value))}
                  min={20}
                  max={45}
                />
              </div>
              <div>
                <Label>{t("avgPeriodLength")}</Label>
                <Input
                  type="number"
                  value={periodLength}
                  onChange={(e) => setPeriodLength(Number(e.target.value))}
                  min={2}
                  max={10}
                />
              </div>
              <div>
                <Label>{t("lastPeriodStart")}</Label>
                <Input
                  type="date"
                  value={lastPeriodStart}
                  onChange={(e) => setLastPeriodStart(e.target.value)}
                />
              </div>
              <Button onClick={handleSaveSettings} className="w-full">
                {tc("save")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cycle info */}
      {cycleInfo && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", PHASE_COLORS[cycleInfo.currentPhase])}>
                <span className="text-white text-lg font-bold">{cycleInfo.cycleDay}</span>
              </div>
              <div className="flex-1">
                <p className={cn("font-semibold", PHASE_TEXT_COLORS[cycleInfo.currentPhase])}>
                  {t(`phases.${cycleInfo.currentPhase}`)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("cycleDay")} {cycleInfo.cycleDay} &middot;{" "}
                  {t("daysUntilPeriod", { days: cycleInfo.daysUntilNextPeriod })}
                </p>
              </div>
            </div>

            {/* Training tip */}
            {trainingTipKey && (
              <div className="mt-4 p-3 rounded-lg bg-muted/50 flex items-start gap-2">
                <Dumbbell className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-primary mb-0.5">{t("trainingTip")}</p>
                  <p className="text-sm">{t(trainingTipKey)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Calendar */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-base capitalize">
              {monthName} {viewYear}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-center">
            {weekdayLetters.map((d, i) => (
              <div key={i} className="text-xs font-medium text-muted-foreground py-1">
                {d}
              </div>
            ))}
            {calendarDays.map((day, i) => (
              <button
                key={i}
                disabled={!day.inMonth}
                onClick={() => day.date && setSelectedDate(day.date)}
                className={cn(
                  "relative h-9 w-full rounded-md text-sm transition-colors",
                  !day.inMonth && "invisible",
                  day.date === selectedDate && "ring-2 ring-primary",
                  day.date === toDateString(today) && "font-bold"
                )}
              >
                {day.day > 0 && day.day}
                {day.hasLog && day.phase && (
                  <span
                    className={cn(
                      "absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full",
                      PHASE_COLORS[day.phase]
                    )}
                  />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily log form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("logDay")} - {selectedDate}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Flow */}
          <div>
            <Label>{t("flow")}</Label>
            <Select value={flow} onValueChange={(v) => setFlow(v as FlowLevel)}>
              <SelectTrigger>
                <SelectValue placeholder="-" />
              </SelectTrigger>
              <SelectContent>
                {FLOWS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {t(`flows.${f}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Symptoms */}
          <div>
            <Label>{t("symptoms")}</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {SYMPTOMS.map((s) => (
                <Badge
                  key={s}
                  variant={selectedSymptoms.includes(s) ? "default" : "outline"}
                  className="cursor-pointer select-none"
                  onClick={() => toggleSymptom(s)}
                >
                  {t(`symptomsList.${s}`)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div>
            <Label>{t("mood")}</Label>
            <Select value={mood} onValueChange={(v) => setMood(v as MoodLevel)}>
              <SelectTrigger>
                <SelectValue placeholder="-" />
              </SelectTrigger>
              <SelectContent>
                {MOODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {t(`moods.${m}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Energy */}
          <div>
            <Label>{t("energy")} ({energy}/5)</Label>
            <input
              type="range"
              min={1}
              max={5}
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>

          {/* Notes */}
          <div>
            <Label>{t("notes")}</Label>
            <Textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button
            onClick={handleLogDay}
            disabled={logDay.isPending}
            className="w-full"
          >
            {tc("save")}
          </Button>
        </CardContent>
      </Card>

      {/* Privacy settings */}
      <CyclePrivacySettings />
    </div>
  );
}
