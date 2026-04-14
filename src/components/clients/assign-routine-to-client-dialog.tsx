"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRoutines, useAssignRoutine } from "@/hooks/use-routines";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Search, Dumbbell, Calendar, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssignRoutineToClientDialogProps {
  clientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Tab = "my-routines" | "templates";

export function AssignRoutineToClientDialog({
  clientId,
  open,
  onOpenChange,
}: AssignRoutineToClientDialogProps) {
  const t = useTranslations("planTab");
  const tr = useTranslations("routines");
  const tc = useTranslations("common");

  const [tab, setTab] = useState<Tab>("my-routines");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);

  const debouncedSearch = useDebounce(search, 300);

  const { data: routinesData, isLoading } = useRoutines({
    search: debouncedSearch,
    is_template: tab === "templates",
    pageSize: 50,
  });

  const assignRoutine = useAssignRoutine();

  const routines = routinesData?.data ?? [];
  const selectedRoutine = routines.find((r) => r.id === selectedId);
  const durationWeeks = selectedRoutine?.duration_weeks ?? 4;

  const endDate = useMemo(() => {
    if (!startDate) return "";
    const start = new Date(startDate);
    start.setDate(start.getDate() + durationWeeks * 7);
    return start.toISOString().split("T")[0];
  }, [startDate, durationWeeks]);

  const handleAssign = () => {
    if (!selectedId) return;
    assignRoutine.mutate(
      {
        client_id: clientId,
        routine_id: selectedId,
        start_date: startDate,
        notes: `end_date:${endDate}`,
      },
      {
        onSuccess: async () => {
          await fetch("/api/update-routine-dates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              routineId: selectedId,
              clientId,
              endDate,
              reviewDate: null,
            }),
          }).catch(() => {});
          onOpenChange(false);
          setSelectedId(null);
          setSearch("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            {t("assignRoutineTitle")}
          </DialogTitle>
          <DialogDescription>{t("assignRoutineDesc")}</DialogDescription>
        </DialogHeader>

        {/* Tabs: Mis rutinas / Plantillas */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <Button
            variant={tab === "my-routines" ? "default" : "ghost"}
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={() => {
              setTab("my-routines");
              setSelectedId(null);
            }}
          >
            {t("myRoutines")}
          </Button>
          <Button
            variant={tab === "templates" ? "default" : "ghost"}
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={() => {
              setTab("templates");
              setSelectedId(null);
            }}
          >
            {t("templates")}
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={tc("search") + "..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto min-h-0 space-y-1">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))
          ) : routines.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              {tc("noResults")}
            </div>
          ) : (
            routines.map((routine) => (
              <button
                key={routine.id}
                type="button"
                onClick={() => setSelectedId(routine.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                  selectedId === routine.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-accent"
                )}
              >
                <div
                  className={cn(
                    "h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center",
                    selectedId === routine.id
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  )}
                >
                  {selectedId === routine.id && (
                    <Check className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{routine.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {routine.difficulty && (
                      <Badge variant="outline" className="text-[10px] px-1 py-0">
                        {tr(`difficulty_${routine.difficulty}` as Parameters<typeof tr>[0])}
                      </Badge>
                    )}
                    <span className="text-[11px] text-muted-foreground">
                      {routine.duration_weeks}{" "}
                      {tr("weeks").toLowerCase()} · {routine.days_per_week}{" "}
                      {t("daysPerWeek")}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Start date (only visible when something selected) */}
        {selectedId && (
          <div className="space-y-2 border-t pt-3">
            <Label className="flex items-center gap-1 text-xs">
              <Calendar className="h-3.5 w-3.5" />
              {tr("startDate")}
            </Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-9"
            />
            <p className="text-[11px] text-muted-foreground">
              {tr("durationInfo", { weeks: durationWeeks })} · {tr("endDate")}: {endDate}
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {tc("cancel")}
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedId || assignRoutine.isPending}
          >
            {assignRoutine.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("assignRoutine")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
