"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import {
  DEFAULT_EXERCISE_VALUES,
  type BatchDestination,
  type ExerciseDefaults,
} from "@/stores/routine-builder-store";

interface BatchActionsBarProps {
  count: number;
  // Oculta el selector de destino (cuando se añade a un grupo existente)
  hideDestination?: boolean;
  onAdd: (opts: { destination: BatchDestination; defaults: ExerciseDefaults }) => void;
  onClear: () => void;
}

// Barra de acciones del modo lote: defaults de series×reps×descanso + destino.
// Compartida entre ExercisePicker (móvil/grupos) y ExerciseSidebar (desktop).
export function BatchActionsBar({ count, hideDestination, onAdd, onClear }: BatchActionsBarProps) {
  const tr = useTranslations("routines");
  const [sets, setSets] = useState(DEFAULT_EXERCISE_VALUES.sets);
  const [reps, setReps] = useState(DEFAULT_EXERCISE_VALUES.reps);
  const [rest, setRest] = useState(DEFAULT_EXERCISE_VALUES.rest_seconds);
  const [destination, setDestination] = useState<BatchDestination>("solo");

  if (count === 0) return null;

  return (
    <div className="shrink-0 space-y-2 rounded-lg border bg-card p-2 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium">
          {tr("selectedCount", { count })}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={onClear}
        >
          <X className="mr-1 h-3 w-3" />
          {tr("clearSelection")}
        </Button>
      </div>

      <div className="flex items-end gap-2">
        <div className="grid flex-1 grid-cols-3 gap-1.5">
          <div>
            <label className="text-[10px] text-muted-foreground">{tr("sets")}</label>
            <Input
              type="number"
              min={1}
              max={20}
              value={sets}
              onChange={(e) => setSets(Number(e.target.value) || 1)}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground">{tr("reps")}</label>
            <Input
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground">{tr("rest")}</label>
            <Input
              type="number"
              min={0}
              max={600}
              value={rest}
              onChange={(e) => setRest(Number(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>
        </div>

        {!hideDestination && (
          <Select
            value={destination}
            onValueChange={(v) => setDestination(v as BatchDestination)}
          >
            <SelectTrigger className="h-8 w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solo">{tr("destinationSolo")}</SelectItem>
              <SelectItem value="superset">{tr("destinationSuperset")}</SelectItem>
              <SelectItem value="circuit">{tr("destinationCircuit")}</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <Button
        type="button"
        size="sm"
        className="h-8 w-full"
        onClick={() =>
          onAdd({ destination, defaults: { sets, reps, rest_seconds: rest } })
        }
      >
        <Plus className="mr-1 h-4 w-4" />
        {tr("addSelected", { count })}
      </Button>
    </div>
  );
}
