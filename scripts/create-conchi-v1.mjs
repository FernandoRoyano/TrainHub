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

// 1. Find Conchi
const { data: client } = await sb
  .from("clients")
  .select("id, trainer_id, full_name")
  .eq("email", "cl4camus@hotmail.com")
  .single();
if (!client) throw new Error("client not found");
log(`Conchi: ${client.id}, trainer: ${client.trainer_id}`);

// 2. Resolve exercises. For each planned exercise, pick best candidate.
async function findExercise(spec) {
  const { name, require = [], prefer = [], exclude = [] } = spec;
  const parts = [`name.ilike.%${name}%`];
  for (const r of require) parts.push(`name.ilike.%${r}%`);
  const orFilter = parts.join(",");
  const { data } = await sb
    .from("exercises")
    .select("id, name, primary_muscles, equipment, mechanics")
    .or(`name.ilike.%${name}%`)
    .limit(30);
  const filtered = (data ?? [])
    .filter((e) => require.every((r) => new RegExp(r, "i").test(e.name)))
    .filter((e) => !exclude.some((x) => new RegExp(x, "i").test(e.name)));
  if (!filtered.length) return null;
  // score by how many "prefer" tokens match
  const scored = filtered.map((e) => ({
    e,
    score: prefer.reduce((s, p) => s + (new RegExp(p, "i").test(e.name) ? 1 : 0), 0),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored[0].e;
}

const lookups = {
  sumoDL:       { name: "sumo deadlift", exclude: ["reverse", "bands", "chains", "high pull"] },
  gobletSquat:  { name: "goblet squat" },
  inclineDBPress: { name: "incline dumbbell press", exclude: ["smith"] },
  seatedRow:    { name: "seated cable row", prefer: ["close"] },
  facePull:     { name: "face pull" },
  gluteBridge:  { name: "glute bridge", prefer: ["barbell"] },
  deadBug:      { name: "dead bug" },
  dbRDL:        { name: "dumbbell romanian deadlift" },
  legPress:     { name: "leg press", exclude: ["single", "one"] },
  latPulldown:  { name: "lat pulldown", prefer: ["neutral", "close"] },
  landminePress:{ name: "landmine", require: ["press|landmine"], exclude: ["180", "jammer"] },
  bandPullApart:{ name: "pull apart", prefer: ["band"] },
  lateralRaise: { name: "lateral raise", prefer: ["dumbbell"] },
  birdDog:      { name: "bird dog" },
};

log(`\n=== RESOLVIENDO EJERCICIOS ===`);
const resolved = {};
for (const [key, spec] of Object.entries(lookups)) {
  const ex = await findExercise(spec);
  if (!ex) {
    log(`  ✗ ${key} "${spec.name}" → NO ENCONTRADO`);
    resolved[key] = null;
  } else {
    log(`  ✓ ${key} → "${ex.name}" [${ex.primary_muscles?.join(",")}] equip=${ex.equipment}`);
    resolved[key] = ex;
  }
}

const missing = Object.entries(resolved).filter(([, v]) => !v).map(([k]) => k);
if (missing.length) {
  log(`\n⚠ Faltan: ${missing.join(", ")} — revisa antes de aplicar`);
  if (APPLY) process.exit(1);
}

// 3. Build plan
const plan = {
  name: "Plan Abril 2026 - Conchi (Full Body 2d)",
  description:
    "Full body 2d/sem adaptado: hombro derecho limitado (sin overhead, agarres neutros, face pull correctivo), " +
    "lumbar débil (sumo/RDL mancuernas, estabilización anti-extensión/rotación), extremidades largas (goblet, prensa, sumo).",
  duration_weeks: 4,
  days_per_week: 2,
  difficulty: "beginner",
  target_gender: "female",
  is_template: false,
  days: [
    {
      day_number: 1,
      name: "Día A — Full Body (Bisagra + Empuje)",
      groups: [
        { type: "solo", order: 1, exs: [{ key: "sumoDL", sets: 3, reps: "8-10", rest: 90 }] },
        { type: "solo", order: 2, exs: [{ key: "gobletSquat", sets: 3, reps: "10-12", rest: 60 }] },
        { type: "solo", order: 3, exs: [{ key: "inclineDBPress", sets: 3, reps: "10-12", rest: 75 }] },
        { type: "superset", order: 4, exs: [
          { key: "seatedRow", sets: 3, reps: "10-12", rest: 0 },
          { key: "facePull",  sets: 3, reps: "15",    rest: 60 },
        ] },
        { type: "solo", order: 5, exs: [{ key: "gluteBridge", sets: 3, reps: "12-15", rest: 60 }] },
        { type: "solo", order: 6, exs: [{ key: "deadBug", sets: 2, reps: "10 por lado", rest: 30 }] },
      ],
    },
    {
      day_number: 2,
      name: "Día B — Full Body (Unilateral + Tirón)",
      groups: [
        { type: "solo", order: 1, exs: [{ key: "dbRDL", sets: 3, reps: "10-12", rest: 75 }] },
        { type: "solo", order: 2, exs: [{ key: "legPress", sets: 3, reps: "10-12", rest: 75 }] },
        { type: "solo", order: 3, exs: [{ key: "latPulldown", sets: 3, reps: "10-12", rest: 60 }] },
        { type: "solo", order: 4, exs: [{ key: "landminePress", sets: 3, reps: "10-12", rest: 75 }] },
        { type: "superset", order: 5, exs: [
          { key: "bandPullApart", sets: 3, reps: "15", rest: 0 },
          { key: "lateralRaise",  sets: 3, reps: "12", rest: 45 },
        ] },
        { type: "solo", order: 6, exs: [{ key: "birdDog", sets: 2, reps: "10 por lado", rest: 30 }] },
      ],
    },
  ],
};

log(`\n=== PLAN A ESCRIBIR ===`);
log(`Rutina: ${plan.name}`);
log(`Descripción: ${plan.description}`);
for (const d of plan.days) {
  log(`\n${d.name}`);
  for (const g of d.groups) {
    log(`  [${g.type}] order=${g.order}`);
    for (const ex of g.exs) {
      const res = resolved[ex.key];
      log(`    - ${res?.name ?? ex.key}: ${ex.sets}×${ex.reps} @ ${ex.rest}s`);
    }
  }
}

if (!APPLY) {
  log(`\n(dry-run) — re-run with --apply to write to DB`);
  process.exit(0);
}

// 4. Apply
log(`\n=== APPLYING ===`);
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
      .insert({ routine_day_id: newDay.id, group_type: g.type, order_index: g.order })
      .select()
      .single();
    if (gErr) throw gErr;

    for (let i = 0; i < g.exs.length; i++) {
      const ex = g.exs[i];
      const { error: eErr } = await sb.from("routine_exercises").insert({
        routine_day_id: newDay.id,
        exercise_group_id: newGroup.id,
        exercise_id: resolved[ex.key].id,
        order_index: g.order * 10 + i,
        sets: ex.sets,
        reps: ex.reps,
        rest_seconds: ex.rest,
      });
      if (eErr) throw eErr;
    }
  }
}

const today = new Date().toISOString().split("T")[0];
const { data: newAssign, error: aErr } = await sb
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
if (aErr) throw aErr;
log(`New assignment: ${newAssign.id}`);

log(`\n✓ DONE`);
