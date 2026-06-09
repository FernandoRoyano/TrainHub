/**
 * Carga la rutina "Recomposición - foco glúteo, femoral y hombro" en el perfil
 * de Kathy Ramos. Por defecto corre en DRY-RUN (solo lectura). Para aplicar:
 *   node scripts/load-kathy-gluteo.mjs --apply
 *
 * Mapea el vocabulario del JSON al esquema real:
 *   routines / routine_days / exercise_groups(solo) / routine_exercises
 * Los campos sin columna (rir, alternativa, progresión, consideraciones) se
 * consolidan en routine_exercises.notes. Las alternativas van como texto.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const get = (k) => env.match(new RegExp(`^${k}=(.*)$`, "m"))?.[1]?.trim();
const supa = createClient(get("NEXT_PUBLIC_SUPABASE_URL"), get("SUPABASE_SERVICE_ROLE_KEY"), {
  auth: { persistSession: false },
});

const APPLY = process.argv.includes("--apply");
const KATHY_CLIENT = "5e5438a8-8cf8-48c0-a368-0dcb7c1d2d80";
const TRAINER = "3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f";

const ROUTINE = {
  name: "Recomposición - foco glúteo, femoral y hombro",
  description:
    "Objetivo: pérdida de grasa (-10 kg) conservando músculo, déficit moderado. " +
    "Estructura: 4 días de fuerza (2 pierna + 2 torso) + 2-3 de cardio. " +
    "Progresión: doble progresión (sube reps en el rango y luego carga). " +
    "Descarga cada 5-7 semanas: mitad de series y peso suave. " +
    "Nutrición objetivo: 1750 kcal · 145 g proteína · 60 g grasa · 155 g carbohidrato.",
  difficulty: "intermediate",
  days_per_week: 6,
  duration_weeks: 6,
};

const REFS = {
  warm_leg: "Calentamiento: 5 min de bici suave + movilidad de cadera y tobillo + 2 series ligeras del primer ejercicio antes de la carga buena.",
  warm_upper: "Calentamiento: 5 min de remo o elíptica + movilidad de hombro + 1-2 series ligeras del primer empuje/tracción.",
  cooldown_leg: "Enfriamiento: 3-5 min andando suave + estiramiento de glúteo, isquios y cuádriceps.",
  cooldown_upper: "Enfriamiento: 3-5 min de respiración + estiramiento suave de hombro y dorsal.",
};

const DAYS = [
  { orden: 1, dia: "Lunes", nombre: "Pierna - foco glúteo", desc: "Día fuerte de glúteo. Carga de verdad en el empuje de cadera; el resto suma volumen.", warm: "warm_leg", cool: "cooldown_leg", ejercicios: [
    { nombre: "Empuje de cadera con barra", series: 4, reps: "6-10", rir: "1-2", descanso: "2-3 min", alt: "Empuje de cadera en máquina", desc: "Apoya la espalda en el banco, barra sobre la cadera y empuja con el glúteo hasta arriba. Aprieta un segundo y baja con control.", prog: "Sube primero reps; al llegar a 10 con buena técnica, añade carga." },
    { nombre: "Prensa de pierna", series: 3, reps: "8-10", rir: "2", descanso: "2 min", alt: "Sentadilla goblet con mancuerna", desc: "Pies a la anchura de la cadera, baja controlando y empuja sin bloquear de golpe la rodilla.", prog: "Doble progresión." },
    { nombre: "Peso muerto rumano", series: 3, reps: "8-10", rir: "2", descanso: "2 min", alt: "Peso muerto rumano con mancuernas", desc: "Lleva la cadera hacia atrás manteniendo la espalda recta. Notarás el estiramiento detrás del muslo. Sube apretando el glúteo.", prog: "Doble progresión." },
    { nombre: "Prensa de pierna a una pierna", series: 3, reps: "10-12 por pierna", rir: "2", descanso: "90 s", alt: "Sentadilla dividida con apoyo en rack o TRX", desc: "Una pierna cada vez. Trabaja igual de fuerte sin tener que mantener el equilibrio.", prog: "Doble progresión.", clin: "Elegido para evitar la demanda de equilibrio de zancadas y búlgaras." },
    { nombre: "Abducción de cadera en máquina", series: 3, reps: "15-20", rir: "1", descanso: "60 s", alt: "Abducción de cadera con banda elástica", desc: "Abre las piernas contra la resistencia y vuelve despacio. Busca quemazón en el lateral del glúteo.", prog: "Sube reps o carga." },
    { nombre: "Elevación de gemelo", series: 2, reps: "12-15", rir: "1", descanso: "60 s", alt: "De pie o en prensa", desc: "Sube de puntillas todo lo que puedas y baja estirando bien el gemelo.", prog: "Sube reps o carga." },
  ]},
  { orden: 2, dia: "Martes", nombre: "Torso A - empuje + tracción + core", desc: "Equilibrio de empuje y tracción. El hombro ancho marca más la cintura.", warm: "warm_upper", cool: "cooldown_upper", nota: "Cardio opcional al terminar: 15-20 min de caminata inclinada a ritmo conversacional.", ejercicios: [
    { nombre: "Press de hombro con mancuernas", series: 3, reps: "8-12", rir: "2", descanso: "2 min", alt: "Press de hombro en máquina", desc: "Empuja las mancuernas hacia arriba sin arquear la espalda. Baja con control a la altura de las orejas.", prog: "Doble progresión." },
    { nombre: "Jalón al pecho", series: 3, reps: "8-12", rir: "2", descanso: "2 min", alt: "Dominada asistida", desc: "Lleva la barra hacia el pecho apretando la espalda, no los brazos. Sube controlando.", prog: "Doble progresión." },
    { nombre: "Remo sentado en polea", series: 3, reps: "10-12", rir: "2", descanso: "90 s", alt: "Remo con mancuerna a una mano", desc: "Tira hacia el ombligo juntando los omóplatos. Pecho arriba.", prog: "Doble progresión." },
    { nombre: "Elevaciones laterales", series: 3, reps: "12-15", rir: "1", descanso: "60 s", alt: null, desc: "Sube los brazos a los lados hasta la altura del hombro, como si vertieras agua. Baja despacio.", prog: "Sube reps o carga." },
    { nombre: "Curl de bíceps con mancuernas", series: 2, reps: "10-12", rir: "1", descanso: "60 s", alt: null, desc: "Sube sin balancear el cuerpo y baja del todo en cada repetición.", prog: "Sube reps o carga." },
    { nombre: "Plancha frontal", series: 3, reps: "30-40 s", rir: null, descanso: "45 s", alt: "Empuje antirrotacional con polea o banda", desc: "Cuerpo en línea recta, abdomen apretado. Sin dejar caer la cadera.", prog: "Aumenta el tiempo poco a poco." },
  ]},
  { orden: 3, dia: "Miércoles", nombre: "Cardio", desc: "Cardio suave para sumar gasto sin pisar la recuperación de las piernas.", warm: null, cool: null, ejercicios: [
    { nombre: "Caminata inclinada en cinta", cardio: true, series: 1, reps: "25-35 min", rir: null, descanso: null, alt: "Bici o elíptica", desc: "Ritmo en el que aún podrías mantener una conversación (Zona 2).", prog: "Suma 8.000-10.000 pasos al día además del cardio." },
  ]},
  { orden: 4, dia: "Jueves", nombre: "Pierna - foco femoral y glúteo", desc: "Día de cadena posterior. Bisagra de cadera como protagonista.", warm: "warm_leg", cool: "cooldown_leg", ejercicios: [
    { nombre: "Peso muerto rumano", series: 4, reps: "8-10", rir: "1-2", descanso: "2-3 min", alt: "Buenos días con barra (ligero)", desc: "Cadera atrás, espalda recta. Notas el estiramiento detrás del muslo y subes apretando el glúteo.", prog: "Doble progresión." },
    { nombre: "Empuje de cadera a una pierna", series: 3, reps: "10-12 por pierna", rir: "2", descanso: "90 s", alt: "Empuje de cadera con banda", desc: "Una pierna cada vez, empuja con el glúteo hasta arriba. Tumbada y estable.", prog: "Doble progresión." },
    { nombre: "Curl femoral tumbado", series: 3, reps: "10-12", rir: "2", descanso: "90 s", alt: "Curl femoral sentado", desc: "Lleva el talón hacia el glúteo apretando la parte de atrás del muslo. Baja con control.", prog: "Doble progresión." },
    { nombre: "Extensión de cadera con polea baja", series: 3, reps: "12-15", rir: "1", descanso: "90 s", alt: "Patada de glúteo en polea", desc: "Empuja la cadera hacia delante con la cuerda entre las piernas. Todo el movimiento sale del glúteo.", prog: "Sube reps o carga." },
    { nombre: "Abducción de cadera en máquina", series: 3, reps: "15-20", rir: "1", descanso: "60 s", alt: "Abducción de cadera con banda elástica", desc: "Abre contra la resistencia y vuelve despacio buscando quemazón en el lateral del glúteo.", prog: "Sube reps o carga." },
  ]},
  { orden: 5, dia: "Viernes", nombre: "Torso B - hombro + tríceps + core", desc: "Más foco en hombro y tríceps para rematar la semana de torso.", warm: "warm_upper", cool: "cooldown_upper", ejercicios: [
    { nombre: "Press militar con barra o mancuernas", series: 3, reps: "8-10", rir: "2", descanso: "2 min", alt: "Press de hombro en máquina", desc: "Empuja por encima de la cabeza sin arquear la espalda. Aprieta el abdomen.", prog: "Doble progresión." },
    { nombre: "Elevaciones laterales", series: 3, reps: "12-15", rir: "0-1", descanso: "60 s", alt: null, desc: "En la última serie, cuando no puedas más, baja el peso y sigue sin parar unas reps más.", prog: "Sube reps o carga." },
    { nombre: "Elevaciones posteriores de hombro (pájaros)", series: 3, reps: "12-15", rir: "1", descanso: "60 s", alt: "Aperturas posteriores en máquina", desc: "Inclínate hacia delante y abre los brazos a los lados apretando la parte de atrás del hombro.", prog: "Sube reps o carga." },
    { nombre: "Extensión de tríceps en polea", series: 3, reps: "10-12", rir: "1", descanso: "60 s", alt: null, desc: "Codos pegados al cuerpo, estira los brazos hacia abajo y vuelve con control.", prog: "Sube reps o carga." },
    { nombre: "Extensión de tríceps sobre la cabeza", series: 2, reps: "10-12", rir: "1", descanso: "60 s", alt: "Con mancuerna o polea", desc: "Brazos arriba, baja el peso por detrás de la cabeza y estira sintiendo el tríceps.", prog: "Sube reps o carga." },
    { nombre: "Elevación de piernas", series: 3, reps: "12-15", rir: null, descanso: "45 s", alt: "Colgada o tumbada", desc: "Sube las piernas controlando con el abdomen, sin impulso. Baja despacio.", prog: "Aumenta reps poco a poco." },
  ]},
  { orden: 6, dia: "Sábado", nombre: "Cardio opcional", desc: "Recuperación activa. Opcional según cómo llegue la semana.", warm: null, cool: null, ejercicios: [
    { nombre: "Caminata o actividad ligera", cardio: true, series: 1, reps: "30-40 min", rir: null, descanso: null, alt: "Paseo o bici suave", desc: "Algo que te apetezca y te mueva sin fatigarte.", prog: null },
  ]},
  { orden: 7, dia: "Domingo", nombre: "Descanso total", desc: "Descanso y recuperación. Tan importante como entrenar.", warm: null, cool: null, ejercicios: [] },
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

// Mapa curado: nombre JSON -> nombre EXACTO en catálogo a reutilizar.
const REUSE = {
  "Empuje de cadera con barra": "Barbell Hip Thrust",
  "Abducción de cadera en máquina": "Thigh Abductor",
  "Elevación de gemelo": "Elevacion de gemelos",
  "Press de hombro con mancuernas": "Press de hombros con mancuernas",
  "Remo sentado en polea": "Remo en polea baja",
  "Empuje de cadera a una pierna": "Single Leg Hip Thrust (Elevated)",
  "Extensión de cadera con polea baja": "Extension de cadera polea",
  "Press militar con barra o mancuernas": "Press militar",
  "Elevaciones posteriores de hombro (pájaros)": "Elevaciones posteriores con mancuernas inclinado",
  "Elevación de piernas": "Lying Leg Raise",
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
  duration_weeks: ROUTINE.duration_weeks, target_gender: "female", is_template: false,
}).select("id").single();
if (rErr) { console.error("✗ crear rutina:", rErr.message); process.exit(1); }
console.log(`  + rutina creada: ${routine.id}`);

// 3. Días + grupos solo + ejercicios
for (const d of DAYS) {
  const descParts = [d.desc];
  if (d.warm && REFS[d.warm]) descParts.push(REFS[d.warm]);
  if (d.cool && REFS[d.cool]) descParts.push(REFS[d.cool]);
  if (d.nota) descParts.push(d.nota);

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
    if (e.clin) noteParts.push(`Nota clínica: ${e.clin}`);

    const { error: exErr } = await supa.from("routine_exercises").insert({
      routine_day_id: day.id, exercise_id: r.id, exercise_group_id: grp.id,
      order_index: i + 1, sets: e.series, reps: e.reps,
      rest_seconds: restToSeconds(e.descanso), notes: noteParts.join(" · "),
    });
    if (exErr) { console.error(`✗ ejercicio ${e.nombre}:`, exErr.message); process.exit(1); }
  }
  console.log(`  + día ${d.dia}: ${d.ejercicios.length} ejercicios`);
}

console.log("\n✓ Rutina creada. (Asignación a Kathy: pendiente según tu decisión.)");
console.log(`ROUTINE_ID=${routine.id}`);
process.exit(0);
