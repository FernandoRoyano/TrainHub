"use client";

import { useTranslations } from "next-intl";
import { useClientRoutines } from "@/hooks/use-routines";
import { useSessionNotes } from "@/hooks/use-session-notes";
import { useMeasurements } from "@/hooks/use-measurements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Dumbbell,
  StickyNote,
  Ruler,
  Calendar,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface OverviewTabProps {
  clientId: string;
  onTabChange: (tab: string) => void;
}

const routineStatusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  cancelled: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-400 border-green-500/20",
  intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  advanced: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function OverviewTab({ clientId, onTabChange }: OverviewTabProps) {
  const t = useTranslations("overview");
  const tc = useTranslations("common");
  const { data: routines, isLoading: loadingRoutines } =
    useClientRoutines(clientId);
  const { data: notes, isLoading: loadingNotes } = useSessionNotes(clientId);
  const { data: measurements, isLoading: loadingMeasurements } =
    useMeasurements(clientId);

  const isLoading = loadingRoutines || loadingNotes || loadingMeasurements;

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
        className={`inline-flex items-center gap-0.5 text-xs ${diff > 0 ? "text-red-400" : "text-emerald-400"}`}
      >
        {icon} {diff > 0 ? "+" : ""}
        {diff.toFixed(1)}
      </span>
    );
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
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
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
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {cr.routine?.difficulty && (
                      <Badge
                        variant="outline"
                        className={
                          difficultyColors[cr.routine.difficulty] ?? ""
                        }
                      >
                        {tc(cr.routine.difficulty as "beginner" | "intermediate" | "advanced")}
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={routineStatusColors[cr.status] ?? ""}
                    >
                      {tc(cr.status as "active" | "completed" | "cancelled")}
                    </Badge>
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
    </div>
  );
}
