// Peso de ejercicio: el almacenamiento canónico en DB es siempre kg
// (exercise_logs.weight_used, exercise_logs.set_logs[].weight). Estas
// funciones convierten solo en las fronteras de entrada/visualización.

export type WeightUnit = "kg" | "lb";

const KG_TO_LB = 2.2046226218;

export function kgToLb(kg: number): number {
  return kg * KG_TO_LB;
}

export function lbToKg(lb: number): number {
  return lb / KG_TO_LB;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Convierte kg (almacenamiento) al valor numérico a mostrar en `unit`, redondeado a 1 decimal. */
export function toDisplayWeight(
  kg: number | null | undefined,
  unit: WeightUnit
): number | null {
  if (kg == null || Number.isNaN(kg)) return null;
  return round1(unit === "lb" ? kgToLb(kg) : kg);
}

/** Convierte un valor introducido por el usuario en `unit` a kg, redondeado a 2 decimales
 *  (precisión de la columna DECIMAL(6,2)). Acepta string para leer directo de un <input>. */
export function toStoredWeightKg(
  value: number | string | null | undefined,
  unit: WeightUnit
): number | null {
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (n == null || Number.isNaN(n)) return null;
  const kg = unit === "lb" ? lbToKg(n) : n;
  return Math.round(kg * 100) / 100;
}

/** Texto legible: "82.5kg" / "182lb". Símbolo de unidad no traducido (idéntico en ES/EN). */
export function formatWeight(
  kg: number | null | undefined,
  unit: WeightUnit
): string {
  const display = toDisplayWeight(kg, unit);
  return display == null ? "—" : `${display}${unit}`;
}
