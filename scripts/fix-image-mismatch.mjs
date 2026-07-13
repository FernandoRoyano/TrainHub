/**
 * Corrige ejercicios cuya imagen NO corresponde con su nombre/descripción.
 * DRY-RUN por defecto; --apply para ejecutar. Guarda rollback JSON.
 *
 * Fuente de verdad: free-exercise-db (las carpetas de imagen llevan el nombre
 * inglés del ejercicio). Revisión semántica hecha caso a caso sobre el volcado
 * de audit-image-mismatch.mjs.
 *
 *   FIXES  — id ejercicio -> carpeta correcta de free-exercise-db
 *   CLEARS — imagen engañosa y sin equivalente en el catálogo: se quita
 *            (candidatos para el flujo de imágenes IA de
 *            docs/prompts-ejercicios-sin-imagen.md)
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "node:fs";
const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const get = (k) => env.match(new RegExp(`^${k}=(.*)$`, "m"))?.[1]?.trim();
const supa = createClient(get("NEXT_PUBLIC_SUPABASE_URL"), get("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });

const APPLY = process.argv.includes("--apply");
const IMAGE_BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";
const EXERCISES_JSON_URL = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";

// id -> carpeta correcta en free-exercise-db
const FIXES = {
  "25284d7a-67ba-48a3-91c7-9d5e1029277f": "Kettlebell_Pistol_Squat", // Sentadilla pistola (tenía sentadilla normal)
  "c0cebffb-678a-4a38-a4dc-6b9bb40af6cf": "Kettlebell_One-Legged_Deadlift", // Peso muerto a una pierna
  "83599af1-7879-4aa1-87cf-7a251ecf5825": "Kettlebell_One-Legged_Deadlift", // PM a una pierna con kettlebell
  "05dbd6d3-47db-4d5f-8ae6-a086038a5aff": "Stiff-Legged_Dumbbell_Deadlift", // PM rumano mancuernas (¡tenía press banca!)
  "12cd7466-fa72-4e1b-b458-7806c2193c0c": "Romanian_Deadlift", // Peso muerto rumano
  "2cf5b06e-66b2-444f-aeb4-195168fa57a2": "Deficit_Deadlift", // Peso muerto déficit
  "5cdbe170-f517-48ca-a50e-22f09188a390": "Trap_Bar_Deadlift", // PM barra hexagonal
  "46974281-058c-47c8-87ef-9a2d5f0eca1a": "Trap_Bar_Deadlift", // PM trap bar
  "aea5c13e-bba0-4916-800c-cc686f44bdaf": "Smith_Machine_Stiff-Legged_Deadlift", // PM en Smith
  "0ed95ea3-6622-496a-aa4b-e50918f7d565": "Face_Pull", // Cable Face Pull (tenía elevación lateral)
  "c60f15a8-40c0-4e30-8dab-e31f216095de": "Face_Pull", // Face pull
  "c8242907-7733-4973-8ca4-c7efce4073fc": "Dead_Bug", // Dead bug (tenía Cocoons)
  "612149f9-f9ca-48a9-b91b-2cd4d209dea1": "Stairmaster", // Escaladora (tenía elíptica)
  "a0000001-0000-0000-0000-000000000013": "Cross_Over_-_With_Bands", // Band Chest Fly (tenía apertura INVERSA)
  "a0000001-0000-0000-0000-000000000014": "Seated_Cable_Rows", // Band Seated Row (tenía remo con barra)
  "a4a7caf9-bcf5-4b75-a4f4-1be8cfb6496e": "Tricep_Dumbbell_Kickback", // Kickback con mancuerna (tenía pushdown)
  "02fe31ba-2b9a-4c58-a740-ca5ceec8cd63": "Incline_Cable_Flye", // Aperturas en cable inclinado
  "bd982671-808e-4ab6-bd9a-a4f7f492c56a": "Low_Cable_Crossover", // Aperturas en polea baja
  "a76b6128-b239-4146-8e40-87c9975886b5": "Natural_Glute_Ham_Raise", // Curl nórdico (tenía máquina femoral)
  "1f034105-71db-4cd0-93f5-20046a914f75": "V-Bar_Pullup", // Dominadas neutras
  "471f9eae-c299-4b2a-acbe-b17de5de0a96": "Standing_Low-Pulley_Deltoid_Raise", // Elev. laterales en polea
  "0441003f-4fb6-4827-99c0-bf2170b37d82": "Standing_Low-Pulley_Deltoid_Raise", // Elev. laterales con cable
  "461b6d84-89b2-4639-896f-50d9f397e90e": "Standing_Cable_Wood_Chop", // Woodchop con cable (tenía russian twist)
  "b148151e-0eec-4d4d-99ef-5a8caa23bec9": "Standing_Cable_Wood_Chop", // Woodchop inverso con cable
  "4ae3c6af-4c64-499c-aaf5-81b54d6d82d4": "Pallof_Press", // Pallof press (tenía russian twist)
  "d75dbfb8-ea0c-45bc-b2c6-3bee2dd44d24": "Side_Bridge", // Plancha lateral seed (tenía plancha frontal)
  "254399d7-b836-4318-8ff8-e0b77a621de7": "Side_Bridge", // Plancha lateral custom
  "14ae6651-f9ca-4aa3-9a5c-03715a82c2d7": "Split_Squat_with_Dumbbells", // Sentadilla búlgara (tenía sentadilla normal)
  "31221870-9835-4533-9f03-a0db67dd149e": "Scissors_Jump", // Zancada con salto (tenía zancada estática)
  "13812cb4-927b-4f0c-b1be-36246052353b": "Squats_-_With_Bands", // Sentadilla con banda (tenía barra)
  "30e28d82-6b6c-4fc2-8b77-8547753a9d90": "Bench_Press_-_With_Bands", // Press de pecho con banda
  "21687498-fc6e-4506-98da-6ebc22a659ef": "Lying_Dumbbell_Tricep_Extension", // Ext. tríceps acostado mancuernas
  "24f6c6f1-fb34-4c46-b537-b034e5268f4a": "Standing_Dumbbell_Triceps_Extension", // Ext. tríceps sobre cabeza mancuerna
  "5876c042-1a64-477c-8cac-8b6d280d4eb4": "Seated_Triceps_Press", // Dumbbell French Press (carpeta inexistente)
  "eaa79de4-2f0f-4904-883b-f5eaa3f7af15": "Standing_Barbell_Press_Behind_Neck", // Press militar tras nuca
  "3de3e415-bcfd-41e8-ab45-e70f15f7c6c6": "Triceps_Stretch", // Estiramiento tríceps (tenía estiramiento de pecho)
  "8293b800-9cc8-46df-af1b-4d7da3164777": "Kneeling_Hip_Flexor", // Estiramiento psoas
  "d2d6d72c-79ce-45ef-aaa7-00968296de27": "Lying_Glute", // Estiramiento glúteos
  "8b537c37-34a5-40c0-be53-6972583fb390": "Shoulder_Stretch", // Estiramiento hombro cruzado
  "634733a2-96e2-416d-a7b4-b67768f1d87d": "Standing_Toe_Touches", // Tocar puntas de pie
  "ab9e2131-0be2-48cf-adbe-3873cca4ebed": "Push-Ups_-_Close_Triceps_Position", // Flexiones diamante
  "6174de3e-cd51-4417-88d7-bb824c000eb9": "Plyo_Push-up", // Flexiones pliométricas
  "6dec418d-0cfb-42e7-9a4a-f78983892bae": "Suspended_Push-Up", // Flexiones TRX
  "d1096352-55ee-4b23-a3db-27f82d91a716": "Two-Arm_Kettlebell_Military_Press", // Press con kettlebell
  "62408e82-1b2c-495a-8c0c-d914f699f217": "Kettlebell_Thruster", // Thruster (tenía sentadilla frontal)
  "d20af623-e47a-4324-83ab-129fd1d23428": "Single-Leg_Lateral_Hop", // Skater jumps
  "ab1a73a2-59e8-43b8-a451-f6e3830048e6": "Monster_Walk", // Monster walk (tenía máquina abductora)
};

// El repo free-exercise-db renombró carpetas (sin paréntesis/comas) y otras
// nunca existieron: estas URLs devuelven 404. Se corrigen POR CARPETA
// (afecta a cualquier ejercicio que apunte a ellas).
const BROKEN_FIXES = {
  "Box_Jump_(Multiple_Response)": "Box_Jump_Multiple_Response",
  "Bicycling,_Stationary": "Bicycling_Stationary",
  "Running,_Treadmill": "Running_Treadmill",
  "Rowing,_Stationary": "Rowing_Stationary",
  "Machine_Shoulder_(Military)_Press": "Machine_Shoulder_Military_Press",
  "Hyperextensions_(Back_Extensions)": "Hyperextensions_Back_Extensions",
  "Upper_Back-SMR": "Rhomboids-SMR",
  "Quad-SMR": "Quadriceps-SMR",
  "Romanian_Deadlift_With_Dumbbells": "Stiff-Legged_Dumbbell_Deadlift",
  "Dumbbell_Lunges_Walking": "Dumbbell_Lunges",
  "Dumbbell_Walking_Lunges": "Dumbbell_Lunges",
  "Single_Leg_Split_Squat": "Split_Squat_with_Dumbbells", // Sentadilla búlgara
  "Side_Plank": "Side_Bridge",
  "Lying_Leg_Raises": "Flat_Bench_Lying_Leg_Raise",
  "Machine-Assisted_Pull-Up": "Band_Assisted_Pull-Up",
  "Cable_Lateral_Raise": "Standing_Low-Pulley_Deltoid_Raise",
  "Single_Leg_Deadlift": "Kettlebell_One-Legged_Deadlift",
  "Kettlebell_Sumo_Deadlift_High_Pull": "One-Arm_Kettlebell_Swings", // Swing con kettlebell
};
// Carpetas 404 sin equivalente en el catálogo -> quitar visual
const BROKEN_CLEARS = ["Jumping_Jacks", "Bird_Dog", "Burpees", "Side_Lunge"];

// Imagen engañosa sin equivalente en el catálogo -> quitar visual
const CLEARS = {
  "e0122983-0bc8-42fc-9dba-84f1eb6bdf98": "Bird Dog (tenía Superman)",
  "a5a896bd-ddf9-418e-8d42-404695c9b352": "Bird dog (tenía Superman)",
  "994093bd-3879-4278-b21b-bf8dba6d3cab": "Hollow hold (tenía Plank)",
  "6cead121-416a-4d74-87fb-7339da9acc13": "Dragon flag (tenía Hanging Leg Raise)",
  "b30e0a37-4486-4e9e-9e8d-939f4e46344a": "Clamshell con banda (tenía máquina aductora)",
};

// --- Catálogo free-exercise-db: id -> array de rutas de imagen reales ---
const fedbPath = process.argv.find((a) => a.startsWith("--fedb="))?.slice(7);
let fedb;
if (fedbPath) {
  fedb = JSON.parse(readFileSync(fedbPath, "utf8"));
} else {
  const res = await fetch(EXERCISES_JSON_URL);
  if (!res.ok) { console.error(`No se pudo descargar exercises.json (${res.status}). Usa --fedb=<ruta>`); process.exit(1); }
  fedb = await res.json();
}
const catalog = new Map(fedb.map((e) => [e.id, e.images]));
console.log(`Catálogo free-exercise-db: ${catalog.size} ejercicios\n`);

// Validar que todas las carpetas destino existen y tienen imágenes
let bad = false;
for (const folder of [...Object.values(FIXES), ...Object.values(BROKEN_FIXES)]) {
  const imgs = catalog.get(folder);
  if (!imgs?.length) { console.error(`✗ Carpeta destino inexistente en catálogo: ${folder}`); bad = true; }
}
if (bad) process.exit(1);

// --- Plan ---
const ids = [...Object.keys(FIXES), ...Object.keys(CLEARS)];
const { data: rows, error } = await supa
  .from("exercises")
  .select("id, name, name_es, thumbnail_url, images")
  .in("id", ids);
if (error) { console.error(error.message); process.exit(1); }
const byId = new Map(rows.map((r) => [r.id, r]));

console.log(`=== PLAN — modo ${APPLY ? "APPLY" : "DRY-RUN"} ===\n`);
const plan = [];
for (const [id, folder] of Object.entries(FIXES)) {
  const row = byId.get(id);
  if (!row) { console.warn(`⚠ No existe en BD: ${id} — se omite`); continue; }
  const imageUrls = catalog.get(folder).map((p) => `${IMAGE_BASE}/${p}`);
  plan.push({ id, update: { images: imageUrls, thumbnail_url: imageUrls[0] }, prev: row });
  console.log(`FIX   ${row.name_es ?? row.name}`);
  console.log(`      ${(row.thumbnail_url ?? "(sin imagen)").replace(IMAGE_BASE + "/", "")}  ->  ${folder} (${imageUrls.length} frames)`);
}
for (const [id, why] of Object.entries(CLEARS)) {
  const row = byId.get(id);
  if (!row) { console.warn(`⚠ No existe en BD: ${id} — se omite`); continue; }
  plan.push({ id, update: { images: [], thumbnail_url: null }, prev: row });
  console.log(`CLEAR ${row.name_es ?? row.name} — ${why}`);
}
// --- Imágenes de GitHub con carpeta inexistente (404 seguro): fix/clear por carpeta ---
const all = [];
for (let from = 0; ; from += 1000) {
  const { data } = await supa.from("exercises").select("id, name, name_es, thumbnail_url, images, archived_at").range(from, from + 999);
  all.push(...(data ?? []));
  if (!data || data.length < 1000) break;
}
let unknownBroken = 0;
for (const e of all) {
  if (e.archived_at || !e.thumbnail_url?.startsWith(IMAGE_BASE) || ids.includes(e.id)) continue;
  const m = e.thumbnail_url.match(/\/exercises\/([^/]+)\//);
  const folder = m ? decodeURIComponent(m[1]) : null;
  if (!folder || catalog.has(folder)) continue;
  if (BROKEN_FIXES[folder]) {
    const imageUrls = catalog.get(BROKEN_FIXES[folder]).map((p) => `${IMAGE_BASE}/${p}`);
    plan.push({ id: e.id, update: { images: imageUrls, thumbnail_url: imageUrls[0] }, prev: e });
    console.log(`FIX   ${e.name_es ?? e.name} (imagen rota)`);
    console.log(`      ${folder}  ->  ${BROKEN_FIXES[folder]}`);
  } else if (BROKEN_CLEARS.includes(folder)) {
    plan.push({ id: e.id, update: { images: [], thumbnail_url: null }, prev: e });
    console.log(`CLEAR ${e.name_es ?? e.name} — carpeta 404 sin equivalente (${folder})`);
  } else {
    console.log(`⚠ ROTA SIN MAPEO: ${e.name_es ?? e.name}  ->  ${folder}`);
    unknownBroken++;
  }
}
console.log(`\nTotal: ${plan.length} ejercicios a corregir${unknownBroken ? ` | ${unknownBroken} rotas sin mapeo (revisar)` : ""}`);

if (!APPLY) { console.log("\n(DRY-RUN: no se ha escrito nada. Ejecuta con --apply para aplicar.)"); process.exit(0); }

// --- Aplicar ---
console.log("\n=== APLICANDO ===");
const rollback = { ts: new Date().toISOString(), changes: [] };
for (const { id, update, prev } of plan) {
  const { error: e1 } = await supa.from("exercises").update(update).eq("id", id);
  if (e1) { console.error(`✗ ${id}: ${e1.message}`); process.exit(1); }
  rollback.changes.push({ id, prev: { thumbnail_url: prev.thumbnail_url, images: prev.images } });
  console.log(`  ✓ ${prev.name_es ?? prev.name}`);
}
const rbPath = new URL(`../image-fix-rollback-${Date.now()}.json`, import.meta.url);
writeFileSync(rbPath, JSON.stringify(rollback, null, 2));
console.log(`\n✓ ${plan.length} ejercicios corregidos. Rollback en: ${rbPath.pathname}`);
process.exit(0);
