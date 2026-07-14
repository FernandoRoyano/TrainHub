// Lista los ejercicios de plataforma sin traducción al español (read-only).
// Uso: node scripts/find-untranslated.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "fs";

const env = {};
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Paginado: PostgREST corta a 1000 filas por request
async function fetchAll() {
  const rows = [];
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("exercises")
      .select("id, name, name_es, source")
      .is("trainer_id", null)
      .is("archived_at", null)
      .order("name")
      .range(from, from + pageSize - 1);
    if (error) throw error;
    rows.push(...(data ?? []));
    if (!data || data.length < pageSize) break;
  }
  return rows;
}

const all = await fetchAll();
const untranslated = all.filter((e) => !e.name_es || e.name_es.trim() === "" || e.name_es === e.name);

console.log(`Total plataforma (no archivados): ${all.length}`);
console.log(`Sin traducir (name_es null/vacío/igual al name): ${untranslated.length}`);

const out = untranslated.map(({ id, name, source }) => ({ id, name, source }));
const file = `untranslated-${Date.now()}.json`;
writeFileSync(file, JSON.stringify(out, null, 2));
console.log(`Guardado en ${file}`);
for (const e of out.slice(0, 20)) console.log(` - ${e.name}`);
if (out.length > 20) console.log(` … y ${out.length - 20} más`);
