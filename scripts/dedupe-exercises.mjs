/**
 * Deduplica ejercicios del catálogo del trainer.
 * DRY-RUN por defecto; --apply para ejecutar.
 *
 * Por cada grupo de duplicados (mismo nombre normalizado, sin archivar):
 *   - Elige canónico: con visual > más usado > con name_es > más antiguo.
 *   - Repunta routine_exercises y block_exercises de los duplicados al canónico.
 *   - Archiva (archived_at) los duplicados — soft delete, reversible.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const get = (k) => env.match(new RegExp(`^${k}=(.*)$`, "m"))?.[1]?.trim();
const supa = createClient(get("NEXT_PUBLIC_SUPABASE_URL"), get("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });

const APPLY = process.argv.includes("--apply");
const TRAINER = "3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f";

const norm = (s) =>
  (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[()]/g, " ").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const hasVisual = (e) => !!e.video_url || !!e.thumbnail_url || (Array.isArray(e.images) && e.images.length > 0);

// Catálogo custom no archivado
const { data: ex } = await supa
  .from("exercises")
  .select("id, name, name_es, video_url, thumbnail_url, images, created_at, archived_at")
  .eq("trainer_id", TRAINER)
  .is("archived_at", null);

// Conteo de usos (routine_exercises + block_exercises)
const ids = ex.map((e) => e.id);
const usage = new Map(ids.map((id) => [id, { rex: 0, blk: 0 }]));
for (let i = 0; i < ids.length; i += 150) {
  const slice = ids.slice(i, i + 150);
  const { data: rx } = await supa.from("routine_exercises").select("exercise_id").in("exercise_id", slice);
  for (const r of rx ?? []) usage.get(r.exercise_id).rex++;
  const { data: bx } = await supa.from("block_exercises").select("exercise_id").in("exercise_id", slice);
  for (const b of bx ?? []) usage.get(b.exercise_id).blk++;
}

// Agrupar por nombre normalizado
const groups = new Map();
for (const e of ex) {
  const key = norm(e.name);
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(e);
}
const dups = [...groups.values()].filter((g) => g.length > 1);

function pickCanonical(g) {
  return [...g].sort((a, b) => {
    if (hasVisual(a) !== hasVisual(b)) return hasVisual(a) ? -1 : 1;
    const ua = usage.get(a.id), ub = usage.get(b.id);
    const ta = ua.rex + ua.blk, tb = ub.rex + ub.blk;
    if (ta !== tb) return tb - ta;
    if (!!a.name_es !== !!b.name_es) return a.name_es ? -1 : 1;
    return new Date(a.created_at) - new Date(b.created_at);
  })[0];
}

console.log(`\n=== DEDUP EJERCICIOS (custom del trainer) — modo ${APPLY ? "APPLY" : "DRY-RUN"} ===`);
console.log(`Custom no archivados: ${ex.length} | grupos duplicados: ${dups.length}\n`);

let totalArchive = 0, totalRepoint = 0;
const plan = [];
for (const g of dups.sort((a, b) => b.length - a.length)) {
  const canon = pickCanonical(g);
  const losers = g.filter((e) => e.id !== canon.id);
  console.log(`▸ "${canon.name}"  (${g.length} copias)`);
  console.log(`   CANÓNICO  ${canon.id.slice(0, 8)}  visual=${hasVisual(canon) ? "sí" : "NO"}  usos=${usage.get(canon.id).rex + usage.get(canon.id).blk}  name_es="${canon.name_es ?? ""}"`);
  for (const l of losers) {
    const u = usage.get(l.id);
    console.log(`   archivar  ${l.id.slice(0, 8)}  visual=${hasVisual(l) ? "sí" : "NO"}  usos=${u.rex + u.blk} (rex ${u.rex}/blk ${u.blk})  -> repunta a canónico`);
    totalRepoint += u.rex + u.blk;
    totalArchive++;
    plan.push({ canonId: canon.id, loserId: l.id });
  }
}

console.log(`\nResumen: ${totalArchive} duplicados a archivar | ${totalRepoint} referencias a repuntar`);

if (!APPLY) {
  console.log("\n(DRY-RUN: no se ha escrito nada. Ejecuta con --apply para aplicar.)");
  process.exit(0);
}

console.log("\n=== APLICANDO ===");
const rollback = { ts: new Date().toISOString(), repointed: [], archived: [] };
for (const { canonId, loserId } of plan) {
  // Capturar filas afectadas ANTES de repuntar (para rollback)
  const { data: rxRows } = await supa.from("routine_exercises").select("id").eq("exercise_id", loserId);
  const { data: bxRows } = await supa.from("block_exercises").select("id").eq("exercise_id", loserId);
  for (const r of rxRows ?? []) rollback.repointed.push({ table: "routine_exercises", id: r.id, from: loserId, to: canonId });
  for (const b of bxRows ?? []) rollback.repointed.push({ table: "block_exercises", id: b.id, from: loserId, to: canonId });

  const { error: e1 } = await supa.from("routine_exercises").update({ exercise_id: canonId }).eq("exercise_id", loserId);
  if (e1) { console.error(`✗ repunta routine_exercises ${loserId}:`, e1.message); process.exit(1); }
  const { error: e2 } = await supa.from("block_exercises").update({ exercise_id: canonId }).eq("exercise_id", loserId);
  if (e2) { console.error(`✗ repunta block_exercises ${loserId}:`, e2.message); process.exit(1); }
  const { error: e3 } = await supa.from("exercises").update({ archived_at: rollback.ts }).eq("id", loserId);
  if (e3) { console.error(`✗ archivar ${loserId}:`, e3.message); process.exit(1); }
  rollback.archived.push(loserId);
  console.log(`  ✓ ${loserId.slice(0, 8)} repuntado y archivado`);
}
const { writeFileSync } = await import("node:fs");
const rbPath = new URL(`../dedupe-rollback-${Date.now()}.json`, import.meta.url);
writeFileSync(rbPath, JSON.stringify(rollback, null, 2));
console.log(`\n✓ Dedup completado: ${totalArchive} archivados, ${rollback.repointed.length} referencias repuntadas.`);
console.log(`  Rollback guardado en: ${rbPath.pathname}`);
process.exit(0);
