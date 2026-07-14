// Espeja las imágenes de ejercicios hotlinkeadas a GitHub (free-exercise-db)
// al bucket público `exercises` de Supabase Storage, y actualiza images[] y
// thumbnail_url. El path <Folder>/<n>.jpg se conserva para que la regex de
// alternancia 0↔1 de exercise-animation.tsx siga funcionando.
//
// Uso: node scripts/mirror-images-to-storage.mjs                (dry-run)
//      node scripts/mirror-images-to-storage.mjs --apply        (sube + actualiza BD)
//      node scripts/mirror-images-to-storage.mjs --upload-only  (solo sube, no toca BD)
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "fs";

const APPLY = process.argv.includes("--apply");
const UPLOAD_ONLY = process.argv.includes("--upload-only");

const env = {};
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const supabase = createClient(URL_, env.SUPABASE_SERVICE_ROLE_KEY);

const GITHUB_HOST = "raw.githubusercontent.com/yuhonas/free-exercise-db";
const STORAGE_BASE = `${URL_}/storage/v1/object/public/exercises`;
// Mismo shape que espera exercise-animation.tsx: .../exercises/<Folder>/<n>.jpg
const PATH_RE = /\/exercises\/([^/]+\/\d+\.jpg)$/;

// 1. Leer todos los ejercicios con URLs de GitHub (paginado)
async function fetchAffected() {
  const rows = [];
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("exercises")
      .select("id, name, images, thumbnail_url")
      .range(from, from + pageSize - 1);
    if (error) throw error;
    rows.push(...(data ?? []));
    if (!data || data.length < pageSize) break;
  }
  return rows.filter(
    (e) =>
      (e.images ?? []).some((u) => u?.includes(GITHUB_HOST)) ||
      e.thumbnail_url?.includes(GITHUB_HOST)
  );
}

const affected = await fetchAffected();

// 2. Deduplicar archivos (carpetas compartidas entre ejercicios)
const files = new Map(); // path relativo → URL GitHub
for (const e of affected) {
  for (const u of [...(e.images ?? []), e.thumbnail_url]) {
    if (!u || !u.includes(GITHUB_HOST)) continue;
    const m = u.match(PATH_RE);
    if (m) files.set(decodeURIComponent(m[1]), u);
  }
}

console.log(`Ejercicios con imágenes de GitHub: ${affected.length}`);
console.log(`Archivos únicos a espejar: ${files.size} (~${Math.round((files.size * 45) / 1024)}MB estimados)`);

if (!APPLY && !UPLOAD_ONLY) {
  console.log("\nDRY-RUN (usa --apply). Muestra de archivos:");
  let i = 0;
  for (const [path] of files) {
    console.log(`  ${path}`);
    if (++i >= 10) break;
  }
  process.exit(0);
}

// 3. Descargar y subir con concurrencia limitada
const entries = Array.from(files.entries());
const uploaded = new Set(); // paths confirmados en Storage
const failed = new Map(); // path → motivo
let idx = 0;

async function worker() {
  for (;;) {
    const i = idx++;
    if (i >= entries.length) return;
    const [path, sourceUrl] = entries[i];

    let buf = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const r = await fetch(sourceUrl);
        if (r.status === 404) {
          failed.set(path, "404 en GitHub");
          break;
        }
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        buf = Buffer.from(await r.arrayBuffer());
        break;
      } catch (err) {
        if (attempt === 2) failed.set(path, err.message);
        else await new Promise((res) => setTimeout(res, 500 * (attempt + 1)));
      }
    }
    if (!buf) continue;

    const { error } = await supabase.storage
      .from("exercises")
      .upload(path, buf, { contentType: "image/jpeg", upsert: true });
    if (error) failed.set(path, `upload: ${error.message}`);
    else uploaded.add(path);

    const doneCount = uploaded.size + failed.size;
    if (doneCount % 200 === 0) console.log(`  ${doneCount}/${entries.length}…`);
  }
}
await Promise.all(Array.from({ length: 6 }, worker));

console.log(`Subidos OK: ${uploaded.size} | Fallidos: ${failed.size}`);
if (failed.size > 0) {
  const failFile = `mirror-failed-${Date.now()}.json`;
  writeFileSync(failFile, JSON.stringify(Object.fromEntries(failed), null, 2));
  console.log(`Fallidos listados en ${failFile} (candidatos a fix-image-mismatch)`);
}

if (UPLOAD_ONLY) {
  console.log("Modo --upload-only: BD sin tocar.");
  process.exit(0);
}

// 4. Actualizar BD SOLO con URLs cuya subida se confirmó
const toStorageUrl = (githubUrl) => {
  const m = githubUrl?.match(PATH_RE);
  if (!m) return null;
  const rel = decodeURIComponent(m[1]);
  return uploaded.has(rel) ? `${STORAGE_BASE}/${rel}` : null;
};

const updates = [];
for (const e of affected) {
  const newImages = (e.images ?? []).map((u) =>
    u?.includes(GITHUB_HOST) ? (toStorageUrl(u) ?? u) : u
  );
  const newThumb = e.thumbnail_url?.includes(GITHUB_HOST)
    ? (toStorageUrl(e.thumbnail_url) ?? e.thumbnail_url)
    : e.thumbnail_url;
  const changed =
    JSON.stringify(newImages) !== JSON.stringify(e.images ?? []) || newThumb !== e.thumbnail_url;
  if (changed) {
    updates.push({
      id: e.id,
      name: e.name,
      images: newImages,
      thumbnail_url: newThumb,
      images_prev: e.images,
      thumbnail_url_prev: e.thumbnail_url,
    });
  }
}

const rollbackFile = `mirror-rollback-${Date.now()}.json`;
writeFileSync(
  rollbackFile,
  JSON.stringify(
    updates.map(({ id, images_prev, thumbnail_url_prev }) => ({ id, images_prev, thumbnail_url_prev })),
    null,
    2
  )
);
console.log(`Rollback guardado en ${rollbackFile}. Actualizando ${updates.length} ejercicios…`);

let done = 0;
let errors = 0;
for (const u of updates) {
  const { error } = await supabase
    .from("exercises")
    .update({ images: u.images, thumbnail_url: u.thumbnail_url })
    .eq("id", u.id);
  if (error) {
    errors++;
    console.error(`ERROR ${u.name}: ${error.message}`);
  } else done++;
  if (done % 200 === 0) console.log(`  ${done}/${updates.length}…`);
}
console.log(`BD actualizada: ${done} ejercicios, ${errors} errores.`);
