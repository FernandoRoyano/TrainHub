"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  useActiveFast,
  useFastingSettings,
  useFastingHistory,
  useFastingStats,
  useStartFast,
  useEndFast,
  useDeleteFast,
  useUpdateFastingSettings,
} from "@/hooks/use-fasting";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Timer, Play, Square, Flame, TrendingUp, Target, Trophy, Trash2 } from "lucide-react";

const PROTOCOLS: Record<string, number> = {
  "16_8": 16,
  "18_6": 18,
  "20_4": 20,
  "23_1": 23,
  "24": 24,
  "36": 36,
  "48": 48,
  "72": 72,
  "custom": 0,
};

function ProgressRing({
  progress,
  elapsed,
  target,
}: {
  progress: number;
  elapsed: string;
  target: string;
}) {
  const radius = 90;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const clampedProgress = Math.min(progress, 1);
  const strokeDashoffset = circumference - clampedProgress * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="-rotate-90">
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-muted/30"
        />
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={clampedProgress >= 1 ? "text-green-500" : "text-primary"}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold tabular-nums">{elapsed}</span>
        <span className="text-sm text-muted-foreground">/ {target}</span>
      </div>
    </div>
  );
}

function formatHoursMinutes(totalHours: number): string {
  const h = Math.floor(totalHours);
  const m = Math.floor((totalHours - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function MyFastingPage() {
  const t = useTranslations("fasting");
  const tc = useTranslations("common");

  const { data: activeFast, isLoading: fastLoading } = useActiveFast();
  const { data: settings, isLoading: settingsLoading } = useFastingSettings();
  const { data: history } = useFastingHistory();
  const { data: stats } = useFastingStats();

  const startFast = useStartFast();
  const endFast = useEndFast();
  const deleteFast = useDeleteFast();
  const updateSettings = useUpdateFastingSettings();

  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
  const [customHours, setCustomHours] = useState<number>(24);
  // Tick periódico: sin él, el tiempo transcurrido y el anillo se quedaban
  // congelados (el refetch devuelve el mismo objeto y no re-renderiza)
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!activeFast) return;
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, [activeFast]);

  const protocol = selectedProtocol ?? settings?.default_protocol ?? "16_8";

  const elapsedHours = useMemo(() => {
    if (!activeFast) return 0;
    const start = new Date(activeFast.fast_start).getTime();
    return (now - start) / (1000 * 60 * 60);
  }, [activeFast, now]);

  const targetHours = activeFast?.target_hours ?? PROTOCOLS[protocol] ?? 16;
  const progress = targetHours > 0 ? elapsedHours / targetHours : 0;

  const handleStart = () => {
    const hours = protocol === "custom" ? customHours : (PROTOCOLS[protocol] ?? 16);
    startFast.mutate({ protocol, targetHours: hours });
    if (protocol !== settings?.default_protocol) {
      updateSettings.mutate({ default_protocol: protocol, custom_hours: protocol === "custom" ? customHours : undefined });
    }
  };

  const handleEnd = () => {
    if (activeFast) {
      endFast.mutate(activeFast.id);
    }
  };

  if (fastLoading || settingsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="flex items-center gap-2">
        <Timer className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">{t("title")}</h1>
      </div>

      {/* Timer card */}
      <Card>
        <CardContent className="pt-6 flex flex-col items-center gap-4">
          <ProgressRing
            progress={activeFast ? progress : 0}
            elapsed={activeFast ? formatHoursMinutes(elapsedHours) : "00:00"}
            target={formatHoursMinutes(targetHours)}
          />

          <p className="text-sm text-muted-foreground">
            {activeFast ? t("fastingNow") : t("notFasting")}
          </p>

          {!activeFast && (
            <div className="flex flex-col items-center gap-2 w-full max-w-xs">
              <Select value={protocol} onValueChange={setSelectedProtocol}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16_8">{t("protocols.16_8")}</SelectItem>
                  <SelectItem value="18_6">{t("protocols.18_6")}</SelectItem>
                  <SelectItem value="20_4">{t("protocols.20_4")}</SelectItem>
                  <SelectItem value="23_1">{t("protocols.23_1")}</SelectItem>
                  <SelectItem value="24">{t("protocols.24")}</SelectItem>
                  <SelectItem value="36">{t("protocols.36")}</SelectItem>
                  <SelectItem value="48">{t("protocols.48")}</SelectItem>
                  <SelectItem value="72">{t("protocols.72")}</SelectItem>
                  <SelectItem value="custom">{t("protocols.custom")}</SelectItem>
                </SelectContent>
              </Select>
              {protocol === "custom" && (
                <div className="flex items-center gap-2 w-full">
                  <Input
                    type="number"
                    min={1}
                    max={168}
                    value={customHours}
                    onChange={(e) => setCustomHours(parseInt(e.target.value) || 24)}
                    className="h-9 text-center"
                  />
                  <span className="text-sm text-muted-foreground shrink-0">{t("hours")}</span>
                </div>
              )}
            </div>
          )}

          {activeFast ? (
            <Button
              onClick={handleEnd}
              variant="destructive"
              size="lg"
              disabled={endFast.isPending}
              className="w-48"
            >
              <Square className="h-4 w-4 mr-2" />
              {t("endFast")}
            </Button>
          ) : (
            <Button
              onClick={handleStart}
              size="lg"
              disabled={startFast.isPending}
              className="w-48"
            >
              <Play className="h-4 w-4 mr-2" />
              {t("startFast")}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      {stats && stats.totalFasts > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="pt-4 flex flex-col items-center">
              <Flame className="h-5 w-5 text-orange-500 mb-1" />
              <span className="text-2xl font-bold">{stats.totalFasts}</span>
              <span className="text-xs text-muted-foreground">{t("stats.totalFasts")}</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 flex flex-col items-center">
              <TrendingUp className="h-5 w-5 text-blue-500 mb-1" />
              <span className="text-2xl font-bold">{stats.avgHours}h</span>
              <span className="text-xs text-muted-foreground">{t("stats.avgDuration")}</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 flex flex-col items-center">
              <Trophy className="h-5 w-5 text-yellow-500 mb-1" />
              <span className="text-2xl font-bold">{stats.currentStreak}</span>
              <span className="text-xs text-muted-foreground">{t("stats.streak")}</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 flex flex-col items-center">
              <Target className="h-5 w-5 text-green-500 mb-1" />
              <span className="text-2xl font-bold">{stats.completionRate}%</span>
              <span className="text-xs text-muted-foreground">{t("stats.completionRate")}</span>
            </CardContent>
          </Card>
        </div>
      )}

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("history")}</CardTitle>
        </CardHeader>
        <CardContent>
          {!history || history.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">{t("noHistory")}</p>
          ) : (
            <div className="space-y-3">
              {history.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">
                      {t(`protocols.${log.protocol}`)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.fast_start).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm tabular-nums">
                      {log.actual_hours ? `${log.actual_hours.toFixed(1)}h` : "-"}
                    </span>
                    <Badge variant={log.completed ? "default" : "secondary"}>
                      {log.completed ? t("completed") : t("cancelled")}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => deleteFast.mutate(log.id)}
                      disabled={deleteFast.isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
