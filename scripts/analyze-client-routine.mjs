import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const env = fs.readFileSync(".env.local", "utf8").split("\n").reduce((a, l) => {
  const m = l.match(/^([^=]+)=(.*)$/);
  if (m) a[m[1].trim()] = m[2].trim().replace(/^"|"$/g, "");
  return a;
}, {});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const email = process.argv[2];
if (!email) { console.error("usage: node scripts/analyze-client-routine.mjs <email>"); process.exit(1); }

const { data: client } = await supabase
  .from("clients")
  .select("id, full_name, email, gender, profile_data, created_at")
  .eq("email", email)
  .maybeSingle();
if (!client) { console.error("client not found"); process.exit(1); }

const { data: assignments } = await supabase
  .from("client_routines")
  .select("id, routine_id, status, start_date, end_date, created_at")
  .eq("client_id", client.id)
  .order("created_at", { ascending: false });

const active = (assignments ?? []).find((a) => a.status === "active") ?? assignments?.[0];
if (!active) { console.log("no routine assignments"); process.exit(0); }

const { data: routine } = await supabase
  .from("routines")
  .select("*")
  .eq("id", active.routine_id)
  .single();

const { data: days } = await supabase
  .from("routine_days")
  .select("*")
  .eq("routine_id", routine.id)
  .order("day_number");

const dayIds = (days ?? []).map((d) => d.id);

const { data: groups } = await supabase
  .from("exercise_groups")
  .select("*")
  .in("routine_day_id", dayIds)
  .order("order_index");

const { data: exercises } = await supabase
  .from("routine_exercises")
  .select("id, routine_day_id, exercise_group_id, exercise_id, order_index, sets, reps, rest_seconds, notes, exercise:exercises(name, primary_muscles, secondary_muscles, category, equipment, mechanics)")
  .in("routine_day_id", dayIds)
  .order("order_index");

const { data: logs } = await supabase
  .from("workout_logs")
  .select("id, date, completed, routine_day_id")
  .eq("client_id", client.id)
  .order("date", { ascending: false })
  .limit(40);

const { data: exLogs } = await supabase
  .from("exercise_logs")
  .select("id, workout_log_id, routine_exercise_id, sets_completed, weight_used, reps_completed, feedback, created_at")
  .in("workout_log_id", (logs ?? []).map((l) => l.id));

const logsById = new Map((logs ?? []).map((l) => [l.id, l]));

// Group exercise logs by routine_exercise_id, sorted desc by date
const logsByExercise = new Map();
for (const el of exLogs ?? []) {
  const wl = logsById.get(el.workout_log_id);
  if (!wl) continue;
  if (!logsByExercise.has(el.routine_exercise_id)) logsByExercise.set(el.routine_exercise_id, []);
  logsByExercise.get(el.routine_exercise_id).push({ ...el, date: wl.date });
}
for (const arr of logsByExercise.values()) arr.sort((a, b) => (a.date < b.date ? 1 : -1));

console.log("=".repeat(80));
console.log(`CLIENT: ${client.full_name} (${client.email})`);
console.log(`Gender: ${client.gender ?? "?"}`);
console.log(`Routine: "${routine.name}" — ${routine.duration_weeks}w, ${routine.days_per_week}d/w, ${routine.difficulty ?? "?"}`);
console.log(`Assignment: ${active.start_date} → ${active.end_date ?? "?"} (${active.status})`);
console.log("=".repeat(80));

// STRUCTURE BY DAY
console.log("\n### ESTRUCTURA POR DÍA\n");
const muscleVolumePerDay = {};
for (const day of days ?? []) {
  const dayEx = (exercises ?? []).filter((e) => e.routine_day_id === day.id);
  const orphans = dayEx.filter((e) => !e.exercise_group_id);
  const dayGroups = (groups ?? []).filter((g) => g.routine_day_id === day.id);

  console.log(`Día ${day.day_number} — "${day.name ?? "(sin nombre)"}"`);
  console.log(`  Grupos: ${dayGroups.length} | Ejercicios: ${dayEx.length}${orphans.length ? ` | Huérfanos: ${orphans.length}` : ""}`);

  const muscleVolume = {};
  for (const ex of dayEx) {
    const pm = (Array.isArray(ex.exercise?.primary_muscles) ? ex.exercise.primary_muscles[0] : ex.exercise?.primary_muscles) ?? "?";
    muscleVolume[pm] = (muscleVolume[pm] ?? 0) + (ex.sets ?? 0);
  }
  muscleVolumePerDay[day.day_number] = muscleVolume;
  const sorted = Object.entries(muscleVolume).sort((a, b) => b[1] - a[1]);
  console.log(`  Volumen por músculo: ${sorted.map(([m, v]) => `${m}=${v}`).join(", ")}`);

  for (const ex of dayEx.sort((a, b) => a.order_index - b.order_index)) {
    const groupType = ex.exercise_group_id
      ? dayGroups.find((g) => g.id === ex.exercise_group_id)?.group_type ?? "?"
      : "ORPHAN";
    const name = ex.exercise?.name ?? "?";
    const muscle = (Array.isArray(ex.exercise?.primary_muscles) ? ex.exercise.primary_muscles[0] : ex.exercise?.primary_muscles) ?? "?";
    console.log(`    - [${groupType}] ${name} (${muscle}) — ${ex.sets}x${ex.reps} @ ${ex.rest_seconds}s`);
  }
  console.log();
}

// WEEKLY MUSCLE VOLUME TOTAL
console.log("### VOLUMEN SEMANAL TOTAL (sets por músculo)\n");
const weeklyVolume = {};
for (const day of days ?? []) {
  for (const [m, v] of Object.entries(muscleVolumePerDay[day.day_number] ?? {})) {
    weeklyVolume[m] = (weeklyVolume[m] ?? 0) + v;
  }
}
const sortedWeekly = Object.entries(weeklyVolume).sort((a, b) => b[1] - a[1]);
for (const [m, v] of sortedWeekly) {
  const bar = "█".repeat(Math.min(v, 30));
  console.log(`  ${m.padEnd(20)} ${String(v).padStart(3)} ${bar}`);
}

// PROGRESSION ANALYSIS PER EXERCISE
console.log("\n### ANÁLISIS DE CARGA Y PROGRESIÓN POR EJERCICIO\n");

function trend(arr) {
  // arr sorted DESC by date. arr[0] = most recent
  if (arr.length === 0) return { status: "NUNCA REGISTRADO", last: null, prev: null };
  if (arr.length === 1) return { status: "PRIMERA VEZ", last: arr[0], prev: null };
  const last = arr[0];
  // find prev with a weight to compare
  const prev = arr.slice(1).find((a) => a.weight_used != null) ?? arr[1];
  if (last.weight_used == null || prev?.weight_used == null) {
    return { status: "SIN PESO REGISTRADO", last, prev };
  }
  const diff = last.weight_used - prev.weight_used;
  let status;
  if (diff > 0) status = `↑ SUBIÓ +${diff}kg`;
  else if (diff < 0) status = `↓ BAJÓ ${diff}kg`;
  else status = "= ESTANCADO";
  return { status, last, prev };
}

const exAnalysis = [];
for (const day of days ?? []) {
  const dayEx = (exercises ?? []).filter((e) => e.routine_day_id === day.id);
  for (const ex of dayEx) {
    const log = logsByExercise.get(ex.id) ?? [];
    const t = trend(log);
    exAnalysis.push({
      day: day.day_number,
      name: ex.exercise?.name ?? "?",
      muscle: (Array.isArray(ex.exercise?.primary_muscles) ? ex.exercise.primary_muscles[0] : ex.exercise?.primary_muscles) ?? "?",
      prescribed: `${ex.sets}x${ex.reps}`,
      ...t,
      logCount: log.length,
    });
  }
}

for (const day of days ?? []) {
  const dayItems = exAnalysis.filter((e) => e.day === day.day_number);
  if (!dayItems.length) continue;
  console.log(`Día ${day.day_number}:`);
  for (const item of dayItems) {
    const lastStr = item.last
      ? `${item.last.weight_used ?? "?"}kg x ${item.last.reps_completed ?? "?"} (${item.last.date})`
      : "—";
    console.log(`  ${item.name.padEnd(32)} ${item.prescribed.padEnd(7)} | último: ${lastStr.padEnd(32)} | ${item.status}`);
  }
  console.log();
}

// OVERALL SUMMARY
const untouched = exAnalysis.filter((e) => e.logCount === 0);
const stagnant = exAnalysis.filter((e) => e.status === "= ESTANCADO");
const progressed = exAnalysis.filter((e) => e.status.startsWith("↑"));
const regressed = exAnalysis.filter((e) => e.status.startsWith("↓"));

console.log("### RESUMEN\n");
console.log(`Total ejercicios en rutina: ${exAnalysis.length}`);
console.log(`  Progresando (↑): ${progressed.length}`);
console.log(`  Estancados (=): ${stagnant.length}`);
console.log(`  Bajando (↓):     ${regressed.length}`);
console.log(`  Sin registro:    ${untouched.length}`);
console.log(`Workout logs recientes: ${logs?.length ?? 0}`);
if (logs?.length) {
  console.log(`  Último: ${logs[0].date} (${logs[0].completed ? "completo" : "pendiente"})`);
}
