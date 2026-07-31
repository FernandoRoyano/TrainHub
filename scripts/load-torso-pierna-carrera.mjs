/**
 * Carga la rutina "Torso/Pierna (empuje-tracción) + carrera" en el catálogo del
 * entrenador. Por defecto corre en DRY-RUN (solo lectura). Para aplicar:
 *   node scripts/load-torso-pierna-carrera.mjs --apply
 *
 * Estructura (4 días de fuerza ROTATIVOS, no atados al día de la semana):
 *   Día 1 · Torso Empuje   (pecho, hombro, tríceps)
 *   Día 2 · Pierna A        (foco cuádriceps)
 *   Día 3 · Torso Tracción  (espalda, bíceps, deltoide posterior)
 *   Día 4 · Pierna B        (foco cadena posterior / glúteo)
 * Rotación: se sigue el orden 1->2->3->4 y se retoma donde se dejó. Si un día
 * no se entrena, NO se salta ese bloque: la siguiente sesión es la que tocaba.
 * Así no se acaba saltando siempre el mismo día (p. ej. la pierna del final).
 * La carrera NO es un día fijo: se corre a veces antes de entrenar, a primera
 * hora, según cómo se llegue. Va documentada en la descripción y en las notas
 * de cada día, no como sesión aparte.
 *
 * Mapea el vocabulario del plan al esquema real:
 *   routines / routine_days / exercise_groups(solo) / routine_exercises
 * Los campos sin columna (rir, alternativa, progresión) se consolidan en
 * routine_exercises.notes.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const get = (k) => env.match(new RegExp(`^${k}=(.*)$`, "m"))?.[1]?.trim();
const supa = createClient(get("NEXT_PUBLIC_SUPABASE_URL"), get("SUPABASE_SERVICE_ROLE_KEY"), {
  auth: { persistSession: false },
});

const APPLY = process.argv.includes("--apply");
const TRAINER = "3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f";

const ROTACION_NOTA =
  "Días ROTATIVOS: sigue el orden Día 1 -> 2 -> 3 -> 4 y vuelve a empezar. NO " +
  "están atados a un día concreto de la semana. Si un día no entrenas, no saltes " +
  "ese bloque: en la siguiente sesión haces el que tocaba. Ej.: si te quedas en el " +
  "Día 3 y un día no vas, la próxima vez empiezas por el Día 4, luego 1, 2, 3... " +
  "Así no acabas saltando siempre el mismo día (normalmente la pierna del final).";

const CARRERA_NOTA =
  "Carrera (opcional y flexible): si te apetece, corre a primera hora antes de " +
  "entrenar, no es obligatorio ni fijo. Ritmo cómodo tipo Zona 2 (podrías hablar). " +
  "20-35 min. Si el día toca pierna y vas a correr, deja la carrera suave para no " +
  "llegar cargado a las series buenas. Anota tiempo y sensaciones para ir viendo.";

const ROUTINE = {
  name: "Torso/Pierna (empuje-tracción) + carrera",
  description:
    "Rutina de 4 días rotativos: torso empuje, pierna, torso tracción, pierna. " +
    "Base de ~4 sesiones por semana, pero los días rotan y no se atan al " +
    "calendario. Progresión: doble progresión (sube reps dentro del rango y luego " +
    "carga). RIR 1-3 en compuestos, 0-1 en aislados. " +
    ROTACION_NOTA + " " + CARRERA_NOTA,
  difficulty: "intermediate",
  days_per_week: 4,
  duration_weeks: 8,
};

const REFS = {
  warm_upper: "Calentamiento: 5 min de remo o elíptica + movilidad de hombro + 1-2 series ligeras del primer empuje/tracción.",
  warm_leg: "Calentamiento: 5 min de bici suave + movilidad de cadera y tobillo + 2 series ascendentes del primer ejercicio antes de la carga buena.",
  cool_upper: "Enfriamiento: 3-5 min de respiración + estiramiento suave de hombro, pecho y dorsal.",
  cool_leg: "Enfriamiento: 3-5 min andando suave + estiramiento de glúteo, isquios y cuádriceps.",
};

const DAYS = [
  { orden: 1, dia: "Día 1", nombre: "Torso Empuje", desc: "Pecho, hombro y tríceps. Empieza fuerte en el press y suma volumen con el resto.", warm: "warm_upper", cool: "cool_upper", carrera: true, ejercicios: [
    { nombre: "Press de banca con barra", series: 4, reps: "6-8", rir: "1-2", descanso: "2-3 min", alt: "Press de banca con mancuernas", desc: "Baja la barra al pecho controlando y empuja sin despegar los glúteos del banco.", prog: "Sube reps hasta 8; luego añade carga." },
    { nombre: "Press inclinado con mancuernas", series: 3, reps: "8-10", rir: "2", descanso: "2 min", alt: "Press inclinado en máquina", desc: "Banco a 30°. Empuja las mancuernas arriba juntándolas ligeramente y baja hasta sentir el pecho.", prog: "Doble progresión." },
    { nombre: "Press de hombros con mancuernas", series: 3, reps: "8-10", rir: "2", descanso: "2 min", alt: "Press de hombro en máquina", desc: "Empuja por encima de la cabeza sin arquear la espalda. Baja a la altura de las orejas.", prog: "Doble progresión." },
    { nombre: "Elevaciones laterales", series: 3, reps: "12-15", rir: "1", descanso: "60 s", alt: "Elevaciones laterales en polea", desc: "Sube los brazos a los lados hasta la altura del hombro, como vertiendo agua. Baja despacio.", prog: "Sube reps o carga." },
    { nombre: "Fondos en paralelas", series: 3, reps: "8-12", rir: "1-2", descanso: "90 s", alt: "Fondos asistidos en máquina", desc: "Ligera inclinación al frente para llevar pecho y tríceps. Baja controlando y sube sin bloquear de golpe.", prog: "Cuando pases de 12, añade lastre." },
    { nombre: "Extensión de tríceps en polea", series: 3, reps: "10-12", rir: "1", descanso: "60 s", alt: "Extensión de tríceps con mancuerna sobre la cabeza", desc: "Codos pegados al cuerpo, estira los brazos hacia abajo y vuelve con control.", prog: "Sube reps o carga." },
  ]},
  { orden: 2, dia: "Día 2", nombre: "Pierna A - foco cuádriceps", desc: "Día de rodilla dominante. La sentadilla manda; el resto suma cuádriceps y estabilidad.", warm: "warm_leg", cool: "cool_leg", carrera: true, ejercicios: [
    { nombre: "Sentadilla con barra", series: 4, reps: "6-8", rir: "1-2", descanso: "2-3 min", alt: "Sentadilla en multipower o hack", desc: "Pies a la anchura de los hombros, baja al menos hasta paralela con la espalda firme y sube empujando el suelo.", prog: "Sube reps hasta 8; luego añade carga." },
    { nombre: "Prensa de pierna", series: 3, reps: "10-12", rir: "2", descanso: "2 min", alt: "Sentadilla goblet con mancuerna", desc: "Pies a la anchura de la cadera, baja controlando y empuja sin bloquear de golpe la rodilla.", prog: "Doble progresión." },
    { nombre: "Sentadilla búlgara con mancuernas", series: 3, reps: "10-12 por pierna", rir: "2", descanso: "90 s", alt: "Zancadas caminando", desc: "Pie de atrás en el banco, baja la rodilla hacia el suelo manteniendo el tronco firme. Trabaja una pierna cada vez.", prog: "Doble progresión." },
    { nombre: "Extensión de cuádriceps", series: 3, reps: "12-15", rir: "1", descanso: "60 s", alt: "Extensión a una pierna", desc: "Estira la rodilla hasta arriba y aprieta un segundo el cuádriceps. Baja despacio.", prog: "Sube reps o carga." },
    { nombre: "Curl femoral tumbado", series: 3, reps: "10-12", rir: "2", descanso: "90 s", alt: "Curl femoral sentado", desc: "Lleva el talón hacia el glúteo apretando la parte de atrás del muslo. Baja con control.", prog: "Doble progresión." },
    { nombre: "Elevación de gemelo", series: 3, reps: "12-15", rir: "1", descanso: "60 s", alt: "De pie o en prensa", desc: "Sube de puntillas todo lo que puedas y baja estirando bien el gemelo.", prog: "Sube reps o carga." },
  ]},
  { orden: 3, dia: "Día 3", nombre: "Torso Tracción", desc: "Espalda, bíceps y deltoide posterior. Tira con la espalda, no con los brazos.", warm: "warm_upper", cool: "cool_upper", carrera: true, ejercicios: [
    { nombre: "Dominadas", series: 4, reps: "6-10", rir: "1-2", descanso: "2-3 min", alt: "Jalón al pecho", desc: "Sube llevando el pecho hacia la barra apretando la espalda. Baja controlando hasta estirar del todo.", prog: "Cuando pases de 10, añade lastre; si aún no salen, usa el jalón." },
    { nombre: "Remo con barra", series: 4, reps: "8-10", rir: "2", descanso: "2 min", alt: "Remo con mancuerna a una mano", desc: "Tronco inclinado y espalda recta. Tira la barra hacia el abdomen juntando los omóplatos.", prog: "Doble progresión." },
    { nombre: "Remo en polea baja", series: 3, reps: "10-12", rir: "2", descanso: "90 s", alt: "Remo en máquina", desc: "Tira hacia el ombligo juntando los omóplatos, pecho arriba. Vuelve controlando.", prog: "Doble progresión." },
    { nombre: "Elevaciones posteriores de hombro (pájaros)", series: 3, reps: "12-15", rir: "1", descanso: "60 s", alt: "Aperturas posteriores en máquina", desc: "Inclínate hacia delante y abre los brazos a los lados apretando la parte de atrás del hombro.", prog: "Sube reps o carga." },
    { nombre: "Curl de bíceps con barra", series: 3, reps: "8-12", rir: "1", descanso: "60 s", alt: "Curl con barra Z", desc: "Sube sin balancear el cuerpo y baja del todo en cada repetición.", prog: "Sube reps o carga." },
    { nombre: "Curl martillo con mancuernas", series: 3, reps: "10-12", rir: "1", descanso: "60 s", alt: "Curl martillo en polea con cuerda", desc: "Agarre neutro (pulgares arriba). Sube controlando y aprieta arriba, trabaja braquial y antebrazo.", prog: "Sube reps o carga." },
  ]},
  { orden: 4, dia: "Día 4", nombre: "Pierna B - foco cadena posterior", desc: "Cadera dominante: femoral y glúteo. Al ser el último de la rotación es el que más se salta: si un día no entrenas, retómalo la próxima sesión antes de volver al Día 1.", warm: "warm_leg", cool: "cool_leg", carrera: true, ejercicios: [
    { nombre: "Peso muerto rumano", series: 4, reps: "8-10", rir: "1-2", descanso: "2-3 min", alt: "Peso muerto rumano con mancuernas", desc: "Lleva la cadera hacia atrás con la espalda recta. Notas el estiramiento detrás del muslo y subes apretando el glúteo.", prog: "Doble progresión." },
    { nombre: "Empuje de cadera con barra", series: 3, reps: "8-12", rir: "2", descanso: "2 min", alt: "Empuje de cadera en máquina", desc: "Espalda apoyada en el banco, barra sobre la cadera, empuja con el glúteo hasta arriba y aprieta un segundo.", prog: "Doble progresión." },
    { nombre: "Zancadas caminando con mancuernas", series: 3, reps: "10-12 por pierna", rir: "2", descanso: "90 s", alt: "Zancada estática o prensa a una pierna", desc: "Da un paso largo y baja la rodilla de atrás hacia el suelo con el tronco firme. Alterna piernas avanzando. Trabaja cuádriceps y glúteo.", prog: "Doble progresión." },
    { nombre: "Curl femoral sentado", series: 3, reps: "12-15", rir: "2", descanso: "90 s", alt: "Curl femoral tumbado", desc: "Lleva el talón hacia atrás apretando el isquio y vuelve despacio.", prog: "Sube reps o carga." },
    { nombre: "Abducción de cadera en máquina", series: 3, reps: "15-20", rir: "1", descanso: "60 s", alt: "Abducción de cadera con banda elástica", desc: "Abre las piernas contra la resistencia y vuelve despacio. Busca quemazón en el lateral del glúteo.", prog: "Sube reps o carga." },
    { nombre: "Elevación de gemelo sentado", series: 3, reps: "15-20", rir: "1", descanso: "60 s", alt: "Elevación de gemelo de pie", desc: "Sentado, sube de puntillas apretando arriba y baja estirando el gemelo. Trabaja el sóleo.", prog: "Sube reps o carga." },
  ]},
];

// --- Resolución de descanso a segundos ---
function restToSeconds(d) {
  if (!d) return 0;
  const nums = d.match(/\d+/g)?.map(Number) ?? [];
  if (nums.length === 0) return 60;
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  return /min/.test(d) ? Math.round(avg * 60) : Math.round(avg);
}

// --- Normalización para matching ---
const norm = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[()]/g, " ").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

// Mapa curado: nombre del plan -> nombre EXACTO en catálogo a reutilizar.
// Se eligen a propósito las filas que TIENEN imagen/animación (hay duplicados
// en el catálogo: la entrada en español sin foto vs. la de free-exercise-db
// con animación; forzamos la que tiene imagen).
const REUSE = {
  "Press inclinado con mancuernas": "Incline Dumbbell Press",
  "Press de hombros con mancuernas": "Dumbbell Shoulder Press",
  "Fondos en paralelas": "Parallel Bar Dip",
  "Extensión de tríceps en polea": "Triceps Pushdown",
  "Sentadilla con barra": "Barbell Full Squat",
  "Extensión de cuádriceps": "Leg Extensions",
  "Elevación de gemelo": "Standing Calf Raises",
  "Elevación de gemelo sentado": "Seated Calf Raise",
  "Dominadas": "Pullups",
  "Remo con barra": "Bent Over Barbell Row",
  "Remo en polea baja": "Seated Cable Rows",
  "Elevaciones posteriores de hombro (pájaros)": "Seated Bent-Over Rear Delt Raise",
  "Curl de bíceps con barra": "Wide-Grip Standing Barbell Curl",
  "Curl martillo con mancuernas": "Hammer Curls",
  "Peso muerto rumano": "Romanian Deadlift",
  "Empuje de cadera con barra": "Barbell Hip Thrust",
  "Zancadas caminando con mancuernas": "Dumbbell Walking Lunge",
  "Abducción de cadera en máquina": "Thigh Abductor",
};

const { data: catalog } = await supa
  .from("exercises")
  .select("id, name, name_es")
  .or(`trainer_id.is.null,trainer_id.eq.${TRAINER}`);

const catIndex = (catalog ?? []).map((e) => ({
  id: e.id,
  name: e.name,
  name_es: e.name_es,
  keys: [norm(e.name), e.name_es ? norm(e.name_es) : null].filter(Boolean),
}));

function findExact(name) {
  const n = norm(name);
  return catIndex.find((c) => c.keys.includes(n));
}
function candidates(name) {
  const tok = new Set(norm(name).split(" "));
  return catIndex
    .map((c) => {
      const ct = new Set(c.keys[0].split(" "));
      const inter = [...tok].filter((t) => ct.has(t)).length;
      const score = inter / Math.max(tok.size, ct.size);
      return { name: c.name, id: c.id, score };
    })
    .filter((c) => c.score >= 0.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

// Lista única de ejercicios
const uniq = new Map();
for (const d of DAYS) for (const e of d.ejercicios) if (!uniq.has(e.nombre)) uniq.set(e.nombre, e);

console.log(`\n=== MAPEO DE EJERCICIOS (${uniq.size} únicos) — modo ${APPLY ? "APPLY" : "DRY-RUN"} ===\n`);
const resolution = new Map(); // nombre -> {action, id?, name}
for (const [nombre, e] of uniq) {
  const forced = REUSE[nombre] && catIndex.find((c) => c.name === REUSE[nombre]);
  if (REUSE[nombre] && !forced) {
    console.log(`⚠ REUSE objetivo no encontrado para "${nombre}" -> "${REUSE[nombre]}" (reviso match automático)`);
  }
  const exact = forced || findExact(nombre);
  if (exact) {
    const shown = exact.name_es || exact.name;
    resolution.set(nombre, { action: "REUSE", id: exact.id, name: exact.name });
    console.log(`✓ REUSE  "${nombre}"  ->  ${exact.name}  (cliente ve: "${shown}")`);
  } else {
    const cands = candidates(nombre);
    resolution.set(nombre, { action: "CREATE", cardio: !!e.cardio });
    console.log(`+ CREATE "${nombre}"  (cardio=${!!e.cardio})` +
      (cands.length ? `   candidatos: ${cands.map((c) => `${c.name}[${c.score.toFixed(2)}]`).join(", ")}` : "   (sin candidatos)"));
  }
}

const counts = DAYS.map((d) => `${d.dia}=${d.ejercicios.length}`).join(", ");
console.log(`\nConteo por día: ${counts}`);
console.log(`Total routine_exercises a insertar: ${DAYS.reduce((a, d) => a + d.ejercicios.length, 0)}`);
console.log(`Ejercicios a CREAR: ${[...resolution.values()].filter((r) => r.action === "CREATE").length}`);
console.log(`Ejercicios a REUTILIZAR: ${[...resolution.values()].filter((r) => r.action === "REUSE").length}`);

if (!APPLY) {
  console.log("\n(DRY-RUN: no se ha escrito nada. Revisa el mapeo y ejecuta con --apply.)");
  process.exit(0);
}

// =================== APLICAR ===================
console.log("\n=== APLICANDO ===");

// Idempotencia: ¿ya existe la rutina?
const { data: existingRoutine } = await supa
  .from("routines").select("id").eq("trainer_id", TRAINER).eq("name", ROUTINE.name).maybeSingle();
if (existingRoutine) {
  console.error(`✗ Ya existe una rutina "${ROUTINE.name}" (${existingRoutine.id}). Aborto para no duplicar.`);
  process.exit(1);
}

// 1. Crear ejercicios faltantes
for (const [nombre, r] of resolution) {
  if (r.action !== "CREATE") continue;
  const { data: ins, error } = await supa.from("exercises").insert({
    trainer_id: TRAINER, name: nombre, name_es: nombre, source: "custom",
    difficulty: "intermediate", category: r.cardio ? "cardio" : "strength",
  }).select("id").single();
  if (error) { console.error(`✗ crear ejercicio "${nombre}":`, error.message); process.exit(1); }
  r.id = ins.id;
  console.log(`  + ejercicio creado: ${nombre}`);
}

// 2. Crear rutina
const { data: routine, error: rErr } = await supa.from("routines").insert({
  trainer_id: TRAINER, name: ROUTINE.name, description: ROUTINE.description,
  difficulty: ROUTINE.difficulty, days_per_week: ROUTINE.days_per_week,
  duration_weeks: ROUTINE.duration_weeks, target_gender: "unisex", is_template: false,
}).select("id").single();
if (rErr) { console.error("✗ crear rutina:", rErr.message); process.exit(1); }
console.log(`  + rutina creada: ${routine.id}`);

// 3. Días + grupos solo + ejercicios
for (const d of DAYS) {
  const descParts = [d.desc, ROTACION_NOTA];
  if (d.warm && REFS[d.warm]) descParts.push(REFS[d.warm]);
  if (d.cool && REFS[d.cool]) descParts.push(REFS[d.cool]);
  if (d.carrera) descParts.push(CARRERA_NOTA);

  const { data: day, error: dErr } = await supa.from("routine_days").insert({
    routine_id: routine.id, day_number: d.orden, name: `${d.dia} · ${d.nombre}`,
    description: descParts.join("\n\n"),
  }).select("id").single();
  if (dErr) { console.error(`✗ crear día ${d.dia}:`, dErr.message); process.exit(1); }

  for (let i = 0; i < d.ejercicios.length; i++) {
    const e = d.ejercicios[i];
    const r = resolution.get(e.nombre);
    const { data: grp, error: gErr } = await supa.from("exercise_groups").insert({
      routine_day_id: day.id, group_type: "solo", order_index: i + 1,
    }).select("id").single();
    if (gErr) { console.error(`✗ grupo:`, gErr.message); process.exit(1); }

    const noteParts = [e.desc];
    if (e.rir) noteParts.push(`RIR ${e.rir}`);
    if (e.prog) noteParts.push(`Progresión: ${e.prog}`);
    if (e.alt) noteParts.push(`Alternativa: ${e.alt}`);

    const { error: exErr } = await supa.from("routine_exercises").insert({
      routine_day_id: day.id, exercise_id: r.id, exercise_group_id: grp.id,
      order_index: i + 1, sets: e.series, reps: e.reps,
      rest_seconds: restToSeconds(e.descanso), notes: noteParts.join(" · "),
    });
    if (exErr) { console.error(`✗ ejercicio ${e.nombre}:`, exErr.message); process.exit(1); }
  }
  console.log(`  + día ${d.dia}: ${d.ejercicios.length} ejercicios`);
}

console.log("\n✓ Rutina creada como plantilla del entrenador (sin asignar todavía).");
console.log(`ROUTINE_ID=${routine.id}`);
process.exit(0);
