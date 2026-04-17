import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const env = fs.readFileSync(".env.local", "utf8").split("\n").reduce((a, l) => {
  const m = l.match(/^([^=]+)=(.*)$/);
  if (m) a[m[1].trim()] = m[2].trim().replace(/^"|"$/g, "");
  return a;
}, {});

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const APPLY = process.argv.includes("--apply");
const log = (...a) => console.log(...a);

// 1. Find Mary
const { data: client } = await sb
  .from("clients")
  .select("id, trainer_id, full_name")
  .eq("email", "marybornaghi@gmail.com")
  .single();
if (!client) throw new Error("client not found");
log(`Mary: ${client.id}, trainer: ${client.trainer_id}`);

// 2. Find current active assignment + routine
const { data: currentAssign } = await sb
  .from("client_routines")
  .select("id, routine_id, start_date")
  .eq("client_id", client.id)
  .eq("status", "active")
  .maybeSingle();
if (!currentAssign) throw new Error("no active routine for Mary");
log(`Current assignment: ${currentAssign.id}, routine: ${currentAssign.routine_id}`);

// 3. Pull current routine_exercises to get exercise_id mapping by name
const { data: currentDays } = await sb.from("routine_days").select("id").eq("routine_id", currentAssign.routine_id);
const { data: currentEx } = await sb
  .from("routine_exercises")
  .select("exercise_id, exercise:exercises(name)")
  .in("routine_day_id", currentDays.map((d) => d.id));

const exByName = new Map();
for (const e of currentEx ?? []) {
  if (e.exercise?.name && !exByName.has(e.exercise.name)) exByName.set(e.exercise.name, e.exercise_id);
}
log(`Reusable exercises (${exByName.size}):`);
for (const [n, id] of exByName) log(`  - ${n} -> ${id}`);

// 4. Find Cable Glute Kickback
const { data: kickbackCandidates } = await sb
  .from("exercises")
  .select("id, name, primary_muscles, equipment")
  .or("name.ilike.%glute kickback%,name.ilike.%cable kickback%,name.ilike.%hip extension%")
  .limit(10);
log(`\nKickback candidates (${kickbackCandidates?.length}):`);
for (const k of kickbackCandidates ?? []) log(`  - ${k.name} [${k.primary_muscles?.join(",")}] equip=${k.equipment} id=${k.id}`);

const kickback =
  (kickbackCandidates ?? []).find((k) => /cable\s+glute\s+kickback/i.test(k.name))
  ?? (kickbackCandidates ?? []).find((k) => k.equipment === "cable" && /kickback/i.test(k.name))
  ?? (kickbackCandidates ?? [])[0];
if (!kickback) throw new Error("no kickback exercise found — need to create or pick a different one");
log(`→ using: ${kickback.name} (${kickback.id})`);

// 5. Build the new routine plan in memory
// Helper for naming
function needEx(name) {
  const id = exByName.get(name);
  if (!id) throw new Error(`exercise not found in current routine: ${name}`);
  return id;
}

const plan = {
  name: "Plan Abril 2026 - Mary (Sobrecarga)",
  description: "Progresión del Plan Marzo: +1 serie en compuestos, rangos más pesados, +volumen glúteo, menos core.",
  duration_weeks: 4,
  days_per_week: 3,
  difficulty: "intermediate",
  target_gender: "female",
  is_template: false,
  days: [
    {
      day_number: 1,
      name: "Día A — Pierna Dominante + Empuje Horizontal",
      groups: [
        { type: "solo", order: 1, exs: [{ name: "Barbell Hip Thrust", sets: 4, reps: "8-10", rest: 90 }] },
        { type: "solo", order: 2, exs: [{ name: "Dumbbell Bench Press", sets: 4, reps: "8-10", rest: 90 }] },
        { type: "superset", order: 3, exs: [
          { name: "Wide Grip Lat Pulldown", sets: 4, reps: "10-12", rest: 0 },
          { name: "Cable Tricep Pushdown (Rope)", sets: 4, reps: "12-15", rest: 60 },
        ] },
        { type: "solo", order: 4, exs: [{ name: "Front Plank", sets: 2, reps: "45s", rest: 45 }] },
      ],
    },
    {
      day_number: 2,
      name: "Día B — Bisagra de Cadera + Tirón + Hombro",
      groups: [
        { type: "solo", order: 1, exs: [{ name: "Dumbbell Romanian Deadlift", sets: 4, reps: "8-10", rest: 90 }] },
        { type: "solo", order: 2, exs: [{ name: "Dumbbell Walking Lunge", sets: 3, reps: "10 por pierna", rest: 90 }] },
        { type: "solo", order: 3, exs: [{ name: "Single-Arm Dumbbell Row", sets: 4, reps: "8-10 por lado", rest: 75 }] },
        { type: "superset", order: 4, exs: [
          { name: "Standing Dumbbell Overhead Press", sets: 4, reps: "8-10", rest: 0 },
          { name: "Cable Face Pull", sets: 4, reps: "12-15", rest: 60 },
        ] },
        { type: "solo", order: 5, exs: [{ name: "Alternating Dumbbell Bicep Curl", sets: 4, reps: "10 por brazo", rest: 60 }] },
        { type: "solo", order: 6, exs: [{ name: "Pallof Press", sets: 2, reps: "10 por lado", rest: 45 }] },
      ],
    },
    {
      day_number: 3,
      name: "Día C — Unilateral Pierna + Empuje Inclinado + Glúteos",
      groups: [
        { type: "solo", order: 1, exs: [{ name: "Dumbbell Bulgarian Split Squat", sets: 4, reps: "8 por pierna", rest: 90 }] },
        { type: "solo", order: 2, exs: [{ name: "Barbell Glute Bridge", sets: 4, reps: "10-12", rest: 75 }] },
        { type: "solo", order: 3, exs: [{ name: "Incline Dumbbell Press", sets: 4, reps: "8-10", rest: 90 }] },
        { type: "solo", order: 4, exs: [{ name: "Seated Cable Row (Close Grip)", sets: 4, reps: "10-12", rest: 60 }] },
        { type: "solo", order: 5, exs: [{ name: "Bird Dog", sets: 2, reps: "10 por lado", rest: 30 }] },
        { type: "solo", order: 6, exs: [{ name: "__KICKBACK__", sets: 3, reps: "12 por pierna", rest: 60 }] },
      ],
    },
  ],
};

// Resolve exercise ids, allow kickback substitution
for (const d of plan.days) {
  for (const g of d.groups) {
    for (const ex of g.exs) {
      if (ex.name === "__KICKBACK__") { ex.exercise_id = kickback.id; ex._displayName = kickback.name; }
      else { ex.exercise_id = needEx(ex.name); ex._displayName = ex.name; }
    }
  }
}

log("\n=== PLAN A ESCRIBIR ===");
log(`Rutina: ${plan.name}`);
log(`Descripción: ${plan.description}`);
for (const d of plan.days) {
  log(`\n${d.name}`);
  for (const g of d.groups) {
    log(`  [${g.type}] order=${g.order}`);
    for (const ex of g.exs) log(`    - ${ex._displayName}: ${ex.sets}×${ex.reps} @ ${ex.rest}s`);
  }
}

if (!APPLY) {
  log("\n(dry-run) — re-run with --apply to write to DB");
  process.exit(0);
}

// 6. APPLY: insert routine, days, groups, exercises
log("\n=== APPLYING ===");

const { data: newRoutine, error: rErr } = await sb
  .from("routines")
  .insert({
    trainer_id: client.trainer_id,
    name: plan.name,
    description: plan.description,
    duration_weeks: plan.duration_weeks,
    days_per_week: plan.days_per_week,
    difficulty: plan.difficulty,
    target_gender: plan.target_gender,
    is_template: plan.is_template,
  })
  .select()
  .single();
if (rErr) throw rErr;
log(`Created routine: ${newRoutine.id}`);

for (const day of plan.days) {
  const { data: newDay, error: dErr } = await sb
    .from("routine_days")
    .insert({ routine_id: newRoutine.id, day_number: day.day_number, name: day.name })
    .select()
    .single();
  if (dErr) throw dErr;
  log(`  Day ${day.day_number}: ${newDay.id}`);

  for (const g of day.groups) {
    const { data: newGroup, error: gErr } = await sb
      .from("exercise_groups")
      .insert({
        routine_day_id: newDay.id,
        group_type: g.type,
        order_index: g.order,
      })
      .select()
      .single();
    if (gErr) throw gErr;

    for (let i = 0; i < g.exs.length; i++) {
      const ex = g.exs[i];
      const { error: eErr } = await sb
        .from("routine_exercises")
        .insert({
          routine_day_id: newDay.id,
          exercise_group_id: newGroup.id,
          exercise_id: ex.exercise_id,
          order_index: g.order * 10 + i,
          sets: ex.sets,
          reps: ex.reps,
          rest_seconds: ex.rest,
        });
      if (eErr) throw eErr;
    }
  }
}

// 7. Mark old assignment as completed, create new active one
const today = new Date().toISOString().split("T")[0];
const { error: cErr } = await sb
  .from("client_routines")
  .update({ status: "completed", end_date: today })
  .eq("id", currentAssign.id);
if (cErr) throw cErr;
log(`Old assignment ${currentAssign.id} -> completed`);

const { data: newAssign, error: nErr } = await sb
  .from("client_routines")
  .insert({
    client_id: client.id,
    routine_id: newRoutine.id,
    trainer_id: client.trainer_id,
    start_date: today,
    status: "active",
  })
  .select()
  .single();
if (nErr) throw nErr;
log(`New assignment: ${newAssign.id}`);

log("\n✓ DONE");
