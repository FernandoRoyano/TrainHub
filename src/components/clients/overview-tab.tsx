"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useClientRoutines, useCancelClientRoutine, useDeleteClientRoutine } from "@/hooks/use-routines";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import Link from "next/link";
import { useSessionNotes } from "@/hooks/use-session-notes";
import { useMeasurements } from "@/hooks/use-measurements";
import { useClientTimeline, useClientCompliance } from "@/hooks/use-clients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Dumbbell,
  StickyNote,
  Ruler,
  Calendar,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  ClipboardList,
  FileText,
  UserPlus,
  Check,
  X,
  Trash2,
} from "lucide-react";
import { STATUS_STYLES } from "@/lib/ui-tokens";

interface OverviewTabProps {
  clientId: string;
  onTabChange: (tab: string) => void;
}

const WEEKDAY_KEYS = [
  "weekday_mon",
  "weekday_tue",
  "weekday_wed",
  "weekday_thu",
  "weekday_fri",
  "weekday_sat",
  "weekday_sun",
] as const;

const timelineConfig: Record<
  string,
  { color: string; bgColor: string; icon: React.ElementType }
> = {
  routine_assigned: {
    color: "text-chart-2",
    bgColor: "bg-chart-2",
    icon: ClipboardList,
  },
  measurement_taken: {
    color: "text-chart-3",
    bgColor: "bg-chart-3",
    icon: Ruler,
  },
  note_added: {
    color: "text-chart-4",
    bgColor: "bg-chart-4",
    icon: FileText,
  },
  client_created: {
    color: "text-chart-1",
    bgColor: "bg-chart-1",
    icon: UserPlus,
  },
};

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return "ahora";
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 30) return `${diffDays}d`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo`;
}

export function OverviewTab({ clientId, onTabChange }: OverviewTabProps) {
  const t = useTranslations("overview");
  const tc = useTranslations("common");
  const tCal = useTranslations("calendar");
  const { data: routines, isLoading: loadingRoutines } =
    useClientRoutines(clientId);
  const cancelRoutine = useCancelClientRoutine();
  const deleteRoutine = useDeleteClientRoutine();
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: notes, isLoading: loadingNotes } = useSessionNotes(clientId);
  const { data: measurements, isLoading: loadingMeasurements } =
    useMeasurements(clientId);
  const { data: timeline } = useClientTimeline(clientId);
  const { data: compliance } = useClientCompliance(clientId);

  const isLoading = loadingRoutines || loadingNotes || loadingMeasurements;

  // Compute week days info for weekly tracking
  const weekDays = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay(); // 0=Sun, 1=Mon, ...
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    const days: { date: Date; label: string; isFuture: boolean; hasLog: boolean }[] = [];
    const logSet = new Set(compliance?.logs ?? []);

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);

      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);

      const isFuture = dayDate.getTime() > todayStart.getTime();

      const key = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, "0")}-${String(dayDate.getDate()).padStart(2, "0")}`;
      const hasLog = logSet.has(key);

      days.push({
        date: dayDate,
        label: tCal(WEEKDAY_KEYS[i]),
        isFuture,
        hasLog,
      });
    }

    return days;
  }, [compliance?.logs, tCal]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const recentNotes = (notes ?? []).slice(0, 3);

  // Measurements are ordered ascending by date, so last = most recent
  const sortedMeasurements = measurements ?? [];
  const latest =
    sortedMeasurements.length > 0
      ? sortedMeasurements[sortedMeasurements.length - 1]
      : null;
  const previous =
    sortedMeasurements.length > 1
      ? sortedMeasurements[sortedMeasurements.length - 2]
      : null;

  function renderDelta(current: number | null, prev: number | null) {
    if (current == null || prev == null) return null;
    const diff = current - prev;
    if (diff === 0) return null;
    const icon =
      diff > 0 ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      );
    return (
      <span
        className={`inline-flex items-center gap-0.5 text-xs ${diff > 0 ? "text-destructive" : "text-success"}`}
      >
        {icon} {diff > 0 ? "+" : ""}
        {diff.toFixed(1)}
      </span>
    );
  }

  // Body composition donut data
  const showBodyComposition =
    latest != null && latest.body_fat_pct != null;
  const donutData = showBodyComposition
    ? [
        { name: "fat", value: latest!.body_fat_pct! },
        { name: "lean", value: 100 - latest!.body_fat_pct! },
      ]
    : [];
  const DONUT_COLORS = ["hsl(var(--chart-4))", "hsl(var(--chart-1))"];

  // Timeline event description
  function getTimelineDescription(event: { type: string; description: string }) {
    switch (event.type) {
      case "routine_assigned":
        return t("eventRoutineAssigned", { name: event.description });
      case "measurement_taken":
        return t("eventMeasurementTaken");
      case "note_added":
        return t("eventNoteAdded", { title: event.description });
      case "client_created":
        return t("eventClientCreated");
      default:
        return event.description;
    }
  }

  return (
    <div className="space-y-4">
      {/* Assigned Routines */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            {t("assignedRoutines")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!routines || routines.length === 0 ? (
            <EmptyState
              icon={Dumbbell}
              title={t("noRoutines")}
              description={t("noRoutinesDescription")}
            />
          ) : (
            <div className="space-y-2">
              {routines.map((cr) => (
                <div
                  key={cr.id}
                  className="flex items-center justify-between gap-2 rounded-lg border p-3"
                >
                  <Link href={`/routines/${cr.routine_id}`} className="flex-1 min-w-0 hover:opacity-80 transition-opacity">
                    <p className="font-medium text-sm truncate text-primary underline-offset-2 hover:underline">
                      {cr.routine?.name ?? t("unknownRoutine")}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{cr.start_date}</span>
                      {cr.routine?.days_per_week && (
                        <span>
                          · {cr.routine.days_per_week} {t("daysPerWeek")}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="flex items-center gap-2 shrink-0">
                    {cr.routine?.difficulty && (
                      <Badge
                        variant="outline"
                        className={
                          STATUS_STYLES[cr.routine.difficulty] ?? ""
                        }
                      >
                        {tc(cr.routine.difficulty as "beginner" | "intermediate" | "advanced")}
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={STATUS_STYLES[cr.status] ?? ""}
                    >
                      {tc(cr.status as "active" | "completed" | "cancelled")}
                    </Badge>
                    {cr.status === "active" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => setCancelId(cr.id)}
                        title={t("cancelRoutine")}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {cr.status !== "active" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(cr.id)}
                        title={t("deleteRoutineAssignment")}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Session Notes */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <StickyNote className="h-4 w-4" />
              {t("recentNotes")}
            </CardTitle>
            {recentNotes.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => onTabChange("session-notes")}
              >
                {t("viewAll")} <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {recentNotes.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              {t("noNotes")}
            </p>
          ) : (
            <div className="space-y-2">
              {recentNotes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-lg border p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {note.title && (
                        <p className="font-medium text-sm">{note.title}</p>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {note.content}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {note.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Latest Measurements */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              {t("latestMeasurements")}
            </CardTitle>
            {latest && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => onTabChange("measurements")}
              >
                {t("viewHistory")} <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!latest ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              {t("noMeasurements")}
            </p>
          ) : (
            <div>
              <p className="text-xs text-muted-foreground mb-3">
                {t("measurementDate")}: {latest.date}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {latest.weight != null && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t("weight")}
                    </p>
                    <p className="text-lg font-semibold">
                      {latest.weight} kg
                    </p>
                    {previous && renderDelta(latest.weight, previous.weight)}
                  </div>
                )}
                {latest.body_fat_pct != null && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t("bodyFat")}
                    </p>
                    <p className="text-lg font-semibold">
                      {latest.body_fat_pct}%
                    </p>
                    {previous &&
                      renderDelta(latest.body_fat_pct, previous.body_fat_pct)}
                  </div>
                )}
                {latest.waist_cm != null && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t("waist")}
                    </p>
                    <p className="text-lg font-semibold">
                      {latest.waist_cm} cm
                    </p>
                    {previous &&
                      renderDelta(latest.waist_cm, previous.waist_cm)}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Body Composition Donut */}
      {showBodyComposition && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              {t("bodyComposition")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative w-[180px] h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      stroke="none"
                    >
                      {donutData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={DONUT_COLORS[index]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">
                    {latest!.weight ?? "—"}
                  </span>
                  <span className="text-xs text-muted-foreground">kg</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: "hsl(var(--chart-4))" }}
                  />
                  <span className="text-sm">
                    {t("fatMass")} — {latest!.body_fat_pct}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: "hsl(var(--chart-1))" }}
                  />
                  <span className="text-sm">
                    {t("leanMass")} — {(100 - latest!.body_fat_pct!).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Tracking */}
      {compliance && compliance.totalDays > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t("weeklyTracking")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between gap-2 mb-4">
              {weekDays.map((day) => (
                <div
                  key={day.label}
                  className="flex flex-col items-center gap-1.5"
                >
                  <span className="text-xs text-muted-foreground">
                    {day.label}
                  </span>
                  {day.hasLog ? (
                    <div className="flex items-center justify-center h-9 w-9 rounded-full bg-success/20 text-success">
                      <Check className="h-4 w-4" />
                    </div>
                  ) : day.isFuture ? (
                    <div className="flex items-center justify-center h-9 w-9 rounded-full border-2 border-muted" />
                  ) : (
                    <div className="flex items-center justify-center h-9 w-9 rounded-full bg-zinc-500/10 text-zinc-500">
                      <X className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {t("daysCompleted", {
                completed: compliance.completedDays,
                total: compliance.totalDays,
              })}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      {timeline && timeline.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t("timeline")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />

              <div className="space-y-4">
                {timeline.map((event) => {
                  const config = timelineConfig[event.type];
                  const Icon = config?.icon ?? Calendar;
                  return (
                    <div key={`${event.type}-${event.id}`} className="relative flex gap-3">
                      {/* Dot */}
                      <div
                        className={`relative z-10 flex items-center justify-center h-6 w-6 rounded-full ${config?.bgColor ?? "bg-zinc-500"} shrink-0`}
                      >
                        <Icon className="h-3 w-3 text-white" />
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-sm leading-tight">
                          {getTimelineDescription(event)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatRelativeTime(event.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <ConfirmDialog
        open={!!cancelId}
        onOpenChange={(open) => !open && setCancelId(null)}
        title={t("cancelRoutine")}
        description={t("cancelRoutineConfirm")}
        confirmLabel={t("cancelRoutineConfirmLabel")}
        cancelLabel={tc("cancel")}
        isLoading={cancelRoutine.isPending}
        onConfirm={() => {
          if (cancelId) {
            cancelRoutine.mutate(cancelId, {
              onSuccess: () => setCancelId(null),
            });
          }
        }}
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={t("deleteRoutineAssignment")}
        description={t("deleteRoutineAssignmentConfirm")}
        confirmLabel={tc("delete")}
        cancelLabel={tc("cancel")}
        isLoading={deleteRoutine.isPending}
        onConfirm={() => {
          if (deleteId) {
            deleteRoutine.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            });
          }
        }}
      />
    </div>
  );
}
