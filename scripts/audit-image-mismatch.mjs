/**
 * Audita ejercicios cuya imagen NO corresponde con su nombre/descripción.
 * Solo lectura — no escribe nada.
 *
 * Método: las imágenes de free-exercise-db llevan el nombre inglés del
 * ejercicio en la carpeta de la URL (.../exercises/Barbell_Bench_Press/0.jpg).
 * Comparamos esa carpeta con name / name_es del ejercicio.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "node:fs";
const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const get = (k) => env.match(new RegExp(`^${k}=(.*)$`, "m"))?.[1]?.trim();
const supa = createClient(get("NEXT_PUBLIC_SUPABASE_URL"), get("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });

const norm = (s) =>
  (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

// Extrae la carpeta de una URL de imagen: .../exercises/<Folder>/0.jpg
const folderOf = (url) => {
  const m = (url || "").match(/\/exercises\/([^/]+)\/\d+\.(jpg|png|webp)/i);
  return m ? m[1] : null;
};
const folderName = (f) => norm((f || "").replace(/_/g, " "));

// Similitud simple por tokens compartidos
const tokens = (s) => new Set(norm(s).split(" ").filter((t) => t.length > 2));
const overlap = (a, b) => {
  const ta = tokens(a), tb = tokens(b);
  if (!ta.size || !tb.size) return 0;
  let hit = 0;
  for (const t of ta) if (tb.has(t)) hit++;
  return hit / Math.min(ta.size, tb.size);
};

// Traer TODOS los ejercicios con alguna imagen (paginado)
const all = [];
for (let from = 0; ; from += 1000) {
  const { data, error } = await supa
    .from("exercises")
    .select("id, name, name_es, slug, source, source_id, trainer_id, thumbnail_url, images, archived_at")
    .range(from, from + 999);
  if (error) { console.error(error.message); process.exit(1); }
  all.push(...(data ?? []));
  if (!data || data.length < 1000) break;
}

const withImg = all.filter((e) => !e.archived_at && (e.thumbnail_url || (e.images?.length ?? 0) > 0));
console.log(`Ejercicios totales: ${all.length} | activos con imagen: ${withImg.length}\n`);

const issues = { folderMismatch: [], thumbVsImages: [], noFolder: [] };

for (const e of withImg) {
  const thumbFolder = folderOf(e.thumbnail_url);
  const imgFolders = [...new Set((e.images ?? []).map(folderOf).filter(Boolean))];

  // 1) thumbnail apunta a carpeta distinta que images[]
  if (thumbFolder && imgFolders.length && !imgFolders.includes(thumbFolder)) {
    issues.thumbVsImages.push({ e, thumbFolder, imgFolders });
  }

  // 2) carpeta de la imagen no se parece al nombre del ejercicio
  const folder = thumbFolder ?? imgFolders[0];
  if (!folder) { issues.noFolder.push({ e }); continue; }
  const fname = folderName(folder);
  const simEn = overlap(fname, e.name);
  const simSlug = e.source_id ? overlap(fname, e.source_id.replace(/[_-]/g, " ")) : 0;
  const sim = Math.max(simEn, simSlug);
  if (sim < 0.5) {
    issues.folderMismatch.push({ e, folder, fname, simEn });
  }
}

const show = (e) => `${e.name_es && e.name_es !== e.name ? `${e.name_es} (${e.name})` : e.name} [${e.source ?? "?"}${e.trainer_id ? "/propio" : "/global"}] ${e.id.slice(0, 8)}`;

console.log(`=== 1) IMAGEN DE OTRA CARPETA QUE EL NOMBRE (probable foto equivocada): ${issues.folderMismatch.length} ===`);
for (const { e, folder } of issues.folderMismatch.slice(0, 60)) {
  console.log(`• ${show(e)}`);
  console.log(`    imagen: ${folder}`);
}
if (issues.folderMismatch.length > 60) console.log(`  ... y ${issues.folderMismatch.length - 60} más`);

console.log(`\n=== 2) thumbnail_url ≠ images[] (frames de ejercicios distintos): ${issues.thumbVsImages.length} ===`);
for (const { e, thumbFolder, imgFolders } of issues.thumbVsImages.slice(0, 40)) {
  console.log(`• ${show(e)}`);
  console.log(`    thumb: ${thumbFolder} | images: ${imgFolders.join(", ")}`);
}

console.log(`\n=== 3) Imagen sin patrón /exercises/<carpeta>/n.jpg (no auditable por nombre): ${issues.noFolder.length} ===`);
for (const { e } of issues.noFolder.slice(0, 20)) {
  console.log(`• ${show(e)}  thumb=${(e.thumbnail_url ?? e.images?.[0] ?? "").slice(0, 90)}`);
}
if (issues.noFolder.length > 20) console.log(`  ... y ${issues.noFolder.length - 20} más`);

// Volcado completo para el paso de corrección
const dump = {
  ts: new Date().toISOString(),
  folderMismatch: issues.folderMismatch.map(({ e, folder }) => ({ id: e.id, name: e.name, name_es: e.name_es, source: e.source, source_id: e.source_id, trainer_id: e.trainer_id, folder, thumbnail_url: e.thumbnail_url, images: e.images })),
  thumbVsImages: issues.thumbVsImages.map(({ e, thumbFolder, imgFolders }) => ({ id: e.id, name: e.name, thumbFolder, imgFolders, thumbnail_url: e.thumbnail_url, images: e.images })),
  noFolder: issues.noFolder.map(({ e }) => ({ id: e.id, name: e.name, name_es: e.name_es, thumbnail_url: e.thumbnail_url, images: e.images })),
};
writeFileSync(new URL("../audit-image-mismatch.json", import.meta.url), JSON.stringify(dump, null, 2));
console.log(`\n✓ Detalle completo en trainhub/audit-image-mismatch.json`);
process.exit(0);
