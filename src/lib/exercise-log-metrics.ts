import type { SetLog } from "@/services/client-app.service";

// Métricas de progresión a partir de un exercise_log. weight_used guarda la
// MEDIA de las series (agregado para históricos); para progresión y récords
// usamos la serie más pesada del detalle por serie (set_logs) cuando existe.

interface LogLike {
  routine_exercise_id: string;
  sets_completed: number;
  weight_used: number | null;
  set_logs?: SetLog[] | null;
  routine_exercise?: { exercise_id?: string | null } | null;
}

/** Clave estable del ejercicio: sobrevive a reasignar rutina (nuevo routine_exercise_id). */
export function exerciseKey(el: LogLike): string {
  return el.routine_exercise?.exercise_id || el.routine_exercise_id;
}

/** Peso de la serie más pesada en kg (fallback: weight_used en logs antiguos). */
export function topSetWeightKg(el: LogLike): number | null {
  const weights = (el.set_logs ?? [])
    .map((s) => s.weight)
    .filter((w): w is number => typeof w === "number" && w > 0);
  if (weights.length > 0) return Math.max(...weights);
  return el.weight_used && el.weight_used > 0 ? el.weight_used : null;
}

/** Volumen en kg: suma reps×peso por serie; fallback series×peso medio. */
export function volumeKg(el: LogLike): number {
  const sets = el.set_logs ?? [];
  if (sets.length > 0) {
    return sets.reduce((acc, s) => {
      const reps = parseInt(s.reps, 10);
      return acc + (s.weight && !Number.isNaN(reps) ? reps * s.weight : 0);
    }, 0);
  }
  return el.sets_completed * (el.weight_used ?? 0);
}
