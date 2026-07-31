/**
 * Rellena la rutina EXISTENTE y vacía "Roberto" (id fijo abajo) con un plan de
 * 5 días: 3 fuertes + 2 ligeros, sesiones ~80 min a ritmo tranquilo. Evolución
 * de "Roberto Ortiz - Progresión fuerza e hipertrofia (vacaciones 5 días)".
 *
 * Por defecto DRY-RUN (solo lectura). Para aplicar:
 *   node scripts/load-roberto-3x2.mjs --apply
 *
 * Con --apply: valida que la rutina destino NO está asignada, borra sus días
 * (cascade), actualiza la fila routines (5 días) e inserta días/grupos/ejercicios.
 * NO asigna a ningún cliente (no toca la rutina de vacaciones vigente).
 *
 * Particularidades de Roberto conservadas: cadera rígida (movilidad integrada),
 * codo sensible (curl martillo solo), hombro (press seguro), core cada día,
 * progresión en banca (Día 1) y dominadas (Día 2).
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
const ROUTINE_ID = "716213c0-cc0a-454f-a7c1-f167cfb040fa"; // la rutina vacía "Roberto"

const ROUTINE = {
  name: "Roberto",
  description:
    "Fuerza e hipertrofia · 3 días fuertes + 2 ligeros. Sesiones de ~1h20 a ritmo " +
    "tranquilo (descansos completos). Fuertes: Empuje / Tirón / Pierna. Ligeros: " +
    "Torso técnica y Full body movilidad (cargas −20%, sin fallo). Progresión en " +
    "banca (Día 1) y dominadas (Día 2), doble progresión en el resto. " +
    "Ojo cadera rígida: haz siempre la movilidad de cada día. Codo: el curl martillo " +
    "va suelto para no sobrecargarlo. Hombro: prioriza recorrido cómodo en los press.",
  difficulty: "intermediate",
  days_per_week: 5,
  duration_weeks: 6,
  target_gender: "male",
  is_template: false,
};

// grupos: { tipo:'solo'|'superset', label?, ej:[{n,s,r,d,nota}] }
//   n=nombre  s=series  r=reps(texto)  d=descanso(seg)  nota=texto
const DAYS = [
  { orden: 1, nombre: "Empuje FUERTE - Pecho, Hombros, Tríceps",
    desc: "Día de empujar. La banca con barra es el ejercicio estrella: más peso y menos reps, " +
      "series sólidas y con control (RIR 2-3), no busques cantidad. El resto complementa pecho, " +
      "hombro y tríceps. Calentamiento: 5 min de movilidad de hombro y torácica + 2 series " +
      "ascendentes de banca antes de la carga buena.",
    grupos: [
      { tipo: "solo", ej: [{ n: "Press Banca con Barra", s: 4, r: "5-8", d: 165, nota: "PRINCIPAL · progresión: más peso, menos reps. RIR 2-3" }] },
      { tipo: "solo", ej: [{ n: "Press Mancuernas en Banco Inclinado (30-45)", s: 4, r: "8-10", d: 120, nota: "Banco a 30°" }] },
      { tipo: "solo", ej: [{ n: "Press Militar con Mancuernas (De pie)", s: 3, r: "8-10", d: 120, nota: "Recorrido cómodo, seguro para el hombro" }] },
      { tipo: "superset", label: "Biserie A", ej: [
        { n: "Aperturas en Polea (Cable Fly)", s: 3, r: "12-15", d: 0, nota: "A1 · aprieta el pecho arriba" },
        { n: "Elevaciones Laterales en Polea", s: 3, r: "12-15", d: 75, nota: "A2 · deltoide lateral" },
      ]},
      { tipo: "solo", ej: [{ n: "Extension de Triceps en Polea (Cuerda)", s: 3, r: "12-15", d: 75, nota: "Codos pegados" }] },
      { tipo: "solo", ej: [{ n: "Plancha Frontal", s: 3, r: "40s", d: 30, nota: "Core · cuerpo en línea" }] },
    ]},
  { orden: 2, nombre: "Tirón FUERTE - Espalda, Bíceps",
    desc: "Día de tirar. Empieza con movilidad de cadera y torácica aunque no lo veas relacionado. " +
      "Las dominadas asistidas son el ejercicio clave: usa la asistencia que necesites pero baja un " +
      "poco cada semana. Los tres principales van solos con descanso completo; el bíceps al final, " +
      "y el curl martillo suelto para cuidar el codo.",
    grupos: [
      { tipo: "solo", ej: [{ n: "Dominadas Asistidas (Maquina)", s: 4, r: "5-8", d: 150, nota: "PRINCIPAL · reducir asistencia cada semana" }] },
      { tipo: "solo", ej: [{ n: "Remo con Barra", s: 4, r: "8-10", d: 120, nota: "Pausa en el pecho, espalda neutra" }] },
      { tipo: "solo", ej: [{ n: "Jalon al Pecho (Agarre Ancho)", s: 3, r: "10-12", d: 90, nota: "Lleva la barra al pecho apretando la espalda" }] },
      { tipo: "superset", label: "Biserie A", ej: [
        { n: "Remo Sentado en Polea (Agarre Estrecho)", s: 3, r: "12", d: 0, nota: "A1 · tira al ombligo" },
        { n: "Curl de Biceps con Barra", s: 3, r: "10-12", d: 75, nota: "A2 · antagonista, sin balanceo" },
      ]},
      { tipo: "solo", ej: [{ n: "Curl Martillo con Mancuernas", s: 3, r: "10 c/lado", d: 60, nota: "Solo · agarre neutro, evitar sobrecargar codo" }] },
      { tipo: "solo", ej: [{ n: "Face Pull", s: 3, r: "15", d: 60, nota: "Deltoide posterior + salud de hombro. Tira a la cara abriendo codos" }] },
    ]},
  { orden: 3, nombre: "Pierna FUERTE - Cuádriceps, Isquios, Glúteo",
    desc: "El día más exigente. Empieza SIEMPRE con 8 min de movilidad de cadera (World's Greatest " +
      "Stretch y sentadilla con pausa son los más importantes para ti). Los tres grandes van solos " +
      "con descanso completo, sin prisa. La prensa y el curl femoral se combinan en biserie " +
      "(músculos opuestos). Las zancadas van solas por ser unilaterales.",
    grupos: [
      { tipo: "solo", ej: [{ n: "Sentadilla con Barra", s: 4, r: "5-8", d: 180, nota: "PRINCIPAL · RIR 2-3, profundidad con control" }] },
      { tipo: "solo", ej: [{ n: "Peso Muerto Rumano con Barra", s: 4, r: "8-10", d: 120, nota: "Bisagra de cadera, espalda neutra" }] },
      { tipo: "solo", ej: [{ n: "Hip Thrust con Barra", s: 4, r: "10-12", d: 120, nota: "Subir carga progresivamente, aprieta arriba" }] },
      { tipo: "superset", label: "Biserie A", ej: [
        { n: "Prensa de Pierna", s: 3, r: "12", d: 0, nota: "A1 · sin bloquear la rodilla de golpe" },
        { n: "Curl Femoral Tumbada en Maquina", s: 3, r: "12", d: 75, nota: "A2 · talón al glúteo" },
      ]},
      { tipo: "solo", ej: [{ n: "Zancada Reversa con Mancuernas", s: 3, r: "10 c/lado", d: 90, nota: "Unilateral, paso atrás controlado" }] },
      { tipo: "solo", ej: [{ n: "Pallof Press (Anti-rotacion)", s: 3, r: "10 c/lado", d: 45, nota: "Core · resiste la rotación" }] },
    ]},
  { orden: 4, nombre: "LIGERO Torso - Técnica y pump (−20%)",
    desc: "Día suave de torso: cargas un 20% por debajo de lo habitual, sin llegar al fallo. El " +
      "objetivo es repasar los movimientos con calma, recorrido completo y conexión mente-músculo. " +
      "Los accesorios van en biseries para que fluya. Calentamiento breve de hombro.",
    grupos: [
      { tipo: "solo", ej: [{ n: "Press Mancuernas en Suelo (Agarre Neutro)", s: 3, r: "12", d: 75, nota: "−20% · rango limitado, seguro para el hombro" }] },
      { tipo: "solo", ej: [{ n: "Remo con Mancuerna a Una Mano", s: 3, r: "12 c/lado", d: 75, nota: "−20% · aprieta la espalda" }] },
      { tipo: "superset", label: "Biserie A", ej: [
        { n: "Pec Deck / Contractor de Pecho", s: 3, r: "15", d: 0, nota: "A1 · pump de pecho" },
        { n: "Elevaciones Laterales con Mancuernas", s: 3, r: "15", d: 60, nota: "A2 · deltoide lateral, sin balanceo" },
      ]},
      { tipo: "superset", label: "Biserie B", ej: [
        { n: "Curl de Biceps con Barra", s: 3, r: "15", d: 0, nota: "B1 · ligero" },
        { n: "Extension de Triceps en Polea (Cuerda)", s: 3, r: "15", d: 60, nota: "B2 · ligero" },
      ]},
      { tipo: "solo", ej: [{ n: "Plancha Lateral", s: 3, r: "30s c/lado", d: 30, nota: "Core lateral" }] },
    ]},
  { orden: 5, nombre: "LIGERO Full body + movilidad (−20%)",
    desc: "Cierre de semana suave enfocado en cadera. Cargas −20%, patrones con calma. Los " +
      "ejercicios van solos para concentrarte en cada uno. Termina con el estiramiento de isquios, " +
      "importante para tu cadera. Calentamiento: movilidad de cadera extendida.",
    grupos: [
      { tipo: "solo", ej: [{ n: "Hip Thrust a Una Pierna (Pie Elevado)", s: 3, r: "12 c/lado", d: 60, nota: "−20% · unilateral, glúteo" }] },
      { tipo: "solo", ej: [{ n: "Sentadilla Goblet con Mancuerna", s: 3, r: "12", d: 75, nota: "−20% · técnica, tronco firme" }] },
      { tipo: "solo", ej: [{ n: "Curl Femoral Tumbada en Maquina", s: 3, r: "15", d: 60, nota: "−20% · control" }] },
      { tipo: "solo", ej: [{ n: "Jalon al Pecho (Agarre Ancho)", s: 3, r: "12", d: 60, nota: "−20% · agarre neutro, cómodo" }] },
      { tipo: "solo", ej: [{ n: "Bird Dog", s: 3, r: "8 c/lado", d: 30, nota: "Core · estabilidad, sin rotar cadera" }] },
      { tipo: "solo", ej: [{ n: "Estiramiento isquiotibial 90/90", s: 2, r: "40s c/lado", d: 0, nota: "Movilidad · cadera e isquios, respira" }] },
    ]},
];

// --- Normalización para matching ---
const norm = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[()]/g, " ").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

// Mapa curado para los ejercicios NUEVOS (los demás salen de la rutina de Roberto
// y se resuelven por coincidencia exacta). Se elige la fila CON imagen.
const REUSE = {
  "Face Pull": "Face pull",
  "Sentadilla Goblet con Mancuerna": "Goblet Squat",
  "Elevaciones Laterales con Mancuernas": "Dumbbell Lateral Raises",
  "Estiramiento isquiotibial 90/90": "90/90 Hamstring",
};

const { data: catalog } = await supa
  .from("exercises").select("id, name, name_es, images")
  .or(`trainer_id.is.null,trainer_id.eq.${TRAINER}`).is("archived_at", null);

const catIndex = (catalog ?? []).map((e) => ({
  id: e.id, name: e.name, name_es: e.name_es, hasImg: (e.images?.length ?? 0) > 0,
  keys: [norm(e.name), e.name_es ? norm(e.name_es) : null].filter(Boolean),
}));

function findExact(name) {
  const n = norm(name);
  // preferir una coincidencia CON imagen si hay varias (duplicados de catálogo)
  const all = catIndex.filter((c) => c.keys.includes(n));
  return all.find((c) => c.hasImg) || all[0];
}
function candidates(name) {
  const tok = new Set(norm(name).split(" "));
  return catIndex.map((c) => {
    const ct = new Set(c.keys[0].split(" "));
    const inter = [...tok].filter((t) => ct.has(t)).length;
    return { name: c.name, id: c.id, score: inter / Math.max(tok.size, ct.size) };
  }).filter((c) => c.score >= 0.5).sort((a, b) => b.score - a.score).slice(0, 3);
}

// Lista única de ejercicios (con su primer grupo para saber order)
const uniq = new Map();
for (const d of DAYS) for (const g of d.grupos) for (const e of g.ej) if (!uniq.has(e.n)) uniq.set(e.n, e);

console.log(`\n=== RELLENAR RUTINA "Roberto" (${ROUTINE_ID}) — modo ${APPLY ? "APPLY" : "DRY-RUN"} ===\n`);
const resolution = new Map();
for (const [nombre] of uniq) {
  const forced = REUSE[nombre] && catIndex.find((c) => c.name === REUSE[nombre]);
  if (REUSE[nombre] && !forced) console.log(`⚠ REUSE no encontrado: "${nombre}" -> "${REUSE[nombre]}"`);
  const hit = forced || findExact(nombre);
  if (hit) {
    resolution.set(nombre, { action: "REUSE", id: hit.id, name: hit.name });
    console.log(`${hit.hasImg ? "🖼️" : "  "} REUSE  "${nombre}"  ->  ${hit.name}`);
  } else {
    resolution.set(nombre, { action: "CREATE" });
    const c = candidates(nombre);
    console.log(`+  CREATE "${nombre}"` + (c.length ? `   candidatos: ${c.map((x) => `${x.name}[${x.score.toFixed(2)}]`).join(", ")}` : ""));
  }
}

const total = DAYS.reduce((a, d) => a + d.grupos.reduce((x, g) => x + g.ej.length, 0), 0);
console.log(`\nConteo por día: ${DAYS.map((d) => `D${d.orden}=${d.grupos.reduce((x, g) => x + g.ej.length, 0)}`).join(", ")}`);
console.log(`Total ejercicios: ${total} · REUSE: ${[...resolution.values()].filter((r) => r.action === "REUSE").length} · CREATE: ${[...resolution.values()].filter((r) => r.action === "CREATE").length}`);

if (!APPLY) {
  console.log("\n(DRY-RUN: no se ha escrito nada. Revisa el mapeo y ejecuta con --apply.)");
  process.exit(0);
}

// =================== APLICAR ===================
console.log("\n=== APLICANDO ===");

// Guard: la rutina destino debe existir, ser del trainer y NO estar asignada.
const { data: routine } = await supa.from("routines").select("id, name, trainer_id").eq("id", ROUTINE_ID).maybeSingle();
if (!routine) { console.error(`✗ No existe la rutina ${ROUTINE_ID}.`); process.exit(1); }
if (routine.trainer_id !== TRAINER) { console.error("✗ La rutina no pertenece a este trainer. Aborto."); process.exit(1); }
const { count: assignedCount } = await supa.from("client_routines").select("id", { count: "exact", head: true }).eq("routine_id", ROUTINE_ID);
if ((assignedCount ?? 0) > 0) { console.error(`✗ La rutina está asignada a ${assignedCount} cliente(s). Aborto por seguridad.`); process.exit(1); }
console.log(`  · destino OK: "${routine.name}" sin asignaciones`);

// 1. Crear ejercicios faltantes
for (const [nombre, r] of resolution) {
  if (r.action !== "CREATE") continue;
  const { data: ins, error } = await supa.from("exercises").insert({
    trainer_id: TRAINER, name: nombre, name_es: nombre, source: "custom",
    difficulty: "intermediate", category: "strength",
  }).select("id").single();
  if (error) { console.error(`✗ crear ejercicio "${nombre}":`, error.message); process.exit(1); }
  r.id = ins.id;
  console.log(`  + ejercicio creado: ${nombre}`);
}

// 2. Limpiar días previos (cascade borra grupos y ejercicios)
const { error: delErr } = await supa.from("routine_days").delete().eq("routine_id", ROUTINE_ID);
if (delErr) { console.error("✗ limpiar días:", delErr.message); process.exit(1); }
console.log("  · días previos eliminados");

// 3. Actualizar la fila routines
const { error: updErr } = await supa.from("routines").update({
  name: ROUTINE.name, description: ROUTINE.description, difficulty: ROUTINE.difficulty,
  days_per_week: ROUTINE.days_per_week, duration_weeks: ROUTINE.duration_weeks,
  target_gender: ROUTINE.target_gender, is_template: ROUTINE.is_template,
}).eq("id", ROUTINE_ID);
if (updErr) { console.error("✗ actualizar rutina:", updErr.message); process.exit(1); }
console.log("  · rutina actualizada (5 días)");

// 4. Insertar días + grupos + ejercicios
for (const d of DAYS) {
  const { data: day, error: dErr } = await supa.from("routine_days").insert({
    routine_id: ROUTINE_ID, day_number: d.orden, name: `Día ${d.orden} · ${d.nombre}`, description: d.desc,
  }).select("id").single();
  if (dErr) { console.error(`✗ día ${d.orden}:`, dErr.message); process.exit(1); }

  let exOrder = 1;
  for (let gi = 0; gi < d.grupos.length; gi++) {
    const g = d.grupos[gi];
    const { data: grp, error: gErr } = await supa.from("exercise_groups").insert({
      routine_day_id: day.id, group_type: g.tipo, order_index: gi + 1, label: g.label ?? null,
    }).select("id").single();
    if (gErr) { console.error(`✗ grupo día ${d.orden}:`, gErr.message); process.exit(1); }

    for (const e of g.ej) {
      const r = resolution.get(e.n);
      const { error: exErr } = await supa.from("routine_exercises").insert({
        routine_day_id: day.id, exercise_group_id: grp.id, exercise_id: r.id,
        order_index: exOrder++, sets: e.s, reps: e.r, rest_seconds: e.d, notes: e.nota ?? null,
      });
      if (exErr) { console.error(`✗ ejercicio "${e.n}":`, exErr.message); process.exit(1); }
    }
  }
  console.log(`  + Día ${d.orden}: ${d.grupos.reduce((x, g) => x + g.ej.length, 0)} ejercicios`);
}

console.log("\n✓ Rutina 'Roberto' rellenada (5 días, sin asignar).");
console.log(`ROUTINE_ID=${ROUTINE_ID}`);
process.exit(0);
