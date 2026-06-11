/**
 * Reporta ejercicios SIN referencia visual (ni video_url, ni thumbnail_url, ni images[]).
 * Dos vistas:
 *   1) Ejercicios USADOS en rutinas del trainer (lo que ve el cliente) — accionable.
 *   2) Ejercicios CUSTOM del trainer (su biblioteca) sin visual.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const get = (k) => env.match(new RegExp(`^${k}=(.*)$`, "m"))?.[1]?.trim();
const supa = createClient(get("NEXT_PUBLIC_SUPABASE_URL"), get("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });

const TRAINER = "3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f";

const hasVisual = (e) =>
  !!e.video_url || !!e.thumbnail_url || (Array.isArray(e.images) && e.images.length > 0);

// --- 1) Ejercicios usados en rutinas del trainer ---
const { data: routines } = await supa.from("routines").select("id, name").eq("trainer_id", TRAINER);
const routineName = new Map((routines ?? []).map((r) => [r.id, r.name]));
const routineIds = (routines ?? []).map((r) => r.id);

const { data: days } = await supa.from("routine_days").select("id, routine_id").in("routine_id", routineIds);
const dayRoutine = new Map((days ?? []).map((d) => [d.id, d.routine_id]));

const { data: rex } = await supa
  .from("routine_exercises")
  .select("exercise_id, routine_day_id")
  .in("routine_day_id", (days ?? []).map((d) => d.id));

// uso por ejercicio -> set de rutinas
const usage = new Map();
for (const r of rex ?? []) {
  if (!usage.has(r.exercise_id)) usage.set(r.exercise_id, { count: 0, routines: new Set() });
  const u = usage.get(r.exercise_id);
  u.count++;
  u.routines.add(routineName.get(dayRoutine.get(r.routine_day_id)) ?? "?");
}

const usedIds = [...usage.keys()];
const exercises = [];
for (let i = 0; i < usedIds.length; i += 200) {
  const { data } = await supa
    .from("exercises")
    .select("id, name, name_es, video_url, thumbnail_url, images, trainer_id, source")
    .in("id", usedIds.slice(i, i + 200));
  exercises.push(...(data ?? []));
}

const missing = exercises.filter((e) => !hasVisual(e));
missing.sort((a, b) => (usage.get(b.id)?.count ?? 0) - (usage.get(a.id)?.count ?? 0));

console.log(`\n=== 1) EJERCICIOS EN TUS RUTINAS SIN REFERENCIA VISUAL ===`);
console.log(`Usados en rutinas: ${exercises.length} | sin visual: ${missing.length}\n`);
for (const e of missing) {
  const u = usage.get(e.id);
  const nm = e.name_es && e.name_es !== e.name ? `${e.name_es}  (${e.name})` : e.name;
  console.log(`• ${nm}`);
  console.log(`    usos: ${u.count}  | rutinas: ${[...u.routines].join(", ")}  | origen: ${e.source}${e.trainer_id ? "/propio" : "/global"}`);
}

// --- 2) Biblioteca custom del trainer sin visual (aunque no se usen aún) ---
const { data: custom } = await supa
  .from("exercises")
  .select("id, name, name_es, video_url, thumbnail_url, images")
  .eq("trainer_id", TRAINER);
const customMissing = (custom ?? []).filter((e) => !hasVisual(e));
console.log(`\n=== 2) TU BIBLIOTECA CUSTOM SIN VISUAL ===`);
console.log(`Custom totales: ${custom?.length ?? 0} | sin visual: ${customMissing.length}\n`);
for (const e of customMissing) {
  const used = usage.has(e.id) ? `usado x${usage.get(e.id).count}` : "no usado";
  console.log(`• ${e.name_es && e.name_es !== e.name ? `${e.name_es} (${e.name})` : e.name}  — ${used}`);
}
process.exit(0);
