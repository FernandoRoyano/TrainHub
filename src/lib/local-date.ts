// Fechas de calendario en hora LOCAL del usuario. toISOString() convierte a
// UTC: en España (UTC+1/+2) entre las 00:00 y la 01:00/02:00 devuelve el día
// anterior, desplazando entrenos, semanas y ciclos al día equivocado.

/** Fecha local como YYYY-MM-DD */
export function localDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Lunes de la semana de `date` (semana empezando en lunes), como YYYY-MM-DD */
export function localWeekStartMonday(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay(); // 0 = domingo
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return localDateString(d);
}

/** Parsea una columna DATE (YYYY-MM-DD) como medianoche local, no UTC */
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Días completos entre dos fechas de calendario (positivo si b > a) */
export function daysBetweenLocal(a: Date, b: Date): number {
  const aMid = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bMid = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((bMid.getTime() - aMid.getTime()) / 86400000);
}
