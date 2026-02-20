/**
 * Import ~870 exercises from Free Exercise DB into Supabase.
 *
 * Usage:
 *   npx tsx scripts/import-exercises.ts
 *
 * Required env vars (reads from .env.local automatically):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import {
  MUSCLE_MAP,
  EQUIPMENT_MAP,
  CATEGORY_MAP,
  DIFFICULTY_MAP,
  MECHANICS_MAP,
  FORCE_MAP,
  uniqueMuscles,
} from "./mappings";

// ---------- env ----------
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ---------- types ----------
interface FreeExercise {
  id: string;
  name: string;
  force: string | null;
  level: string;
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
}

interface WgerSuggestion {
  value: string;
  data: {
    id: number;
    base_id: number;
    name: string;
    category: string;
    image: string | null;
    image_thumbnail: string | null;
  };
}

// ---------- helpers ----------
const IMAGE_BASE =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";

const EXERCISES_JSON_URL =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function mapMuscles(muscles: string[]): string[] {
  // Free Exercise DB uses lowercase: "abdominals", "chest", etc.
  // Our MUSCLE_MAP keys are title case: "Abdominals", "Chest", etc.
  return uniqueMuscles(muscles.map(titleCase));
}

function mapEquipment(equipment: string | null): string[] {
  if (!equipment) return ["bodyweight"];
  // Free Exercise DB uses lowercase: "body only"
  // Our EQUIPMENT_MAP keys are title case: "Body Only"
  const titleEquip = equipment
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const mapped = EQUIPMENT_MAP[titleEquip];
  return mapped ? [mapped] : ["bodyweight"];
}

function mapCategory(category: string): { category: string; exercise_type: string } {
  // Free Exercise DB uses lowercase: "strength"
  const titleCat = titleCase(category);
  return CATEGORY_MAP[titleCat] ?? { category: "strength", exercise_type: "compound" };
}

function mapDifficulty(level: string): string {
  return DIFFICULTY_MAP[titleCase(level)] ?? "intermediate";
}

function mapMechanics(mechanic: string | null): string | null {
  if (!mechanic) return null;
  return MECHANICS_MAP[titleCase(mechanic)] ?? null;
}

function mapForce(force: string | null): string | null {
  if (!force) return null;
  return FORCE_MAP[titleCase(force)] ?? null;
}

// ---------- Wger translation ----------
async function fetchSpanishName(englishName: string): Promise<string | null> {
  try {
    const url = `https://wger.de/api/v2/exercise/search/?term=${encodeURIComponent(englishName)}&language=es&format=json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = (await res.json()) as { suggestions: WgerSuggestion[] };
    if (json.suggestions && json.suggestions.length > 0) {
      return json.suggestions[0].data.name;
    }
    return null;
  } catch {
    return null;
  }
}

// ---------- main ----------
async function main() {
  console.log("Fetching exercises from Free Exercise DB...");
  const res = await fetch(EXERCISES_JSON_URL);
  if (!res.ok) {
    console.error(`Failed to fetch exercises.json: ${res.status}`);
    process.exit(1);
  }
  const exercises: FreeExercise[] = await res.json();
  console.log(`Found ${exercises.length} exercises in Free Exercise DB`);

  // Check which are already imported
  const { data: existing } = await supabase
    .from("exercises")
    .select("source_id")
    .eq("source", "free_exercise_db");

  const existingIds = new Set((existing ?? []).map((e) => e.source_id));
  console.log(`Already imported: ${existingIds.size} exercises\n`);

  let inserted = 0;
  let skipped = 0;
  let errors = 0;
  let translationsFound = 0;

  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i];

    // Skip if already imported
    if (existingIds.has(ex.id)) {
      skipped++;
      continue;
    }

    // Map fields
    const primaryMapped = mapMuscles(ex.primaryMuscles);
    const secondaryMapped = mapMuscles(ex.secondaryMuscles);
    const allMuscles = Array.from(new Set([...primaryMapped, ...secondaryMapped]));
    const equipmentMapped = mapEquipment(ex.equipment);
    const catMap = mapCategory(ex.category);
    const imageUrls = ex.images.map((img) => `${IMAGE_BASE}/${img}`);

    // Fetch Spanish translation (with rate limiting)
    const nameEs = await fetchSpanishName(ex.name);
    if (nameEs) translationsFound++;
    await sleep(300);

    const row = {
      trainer_id: null,
      name: ex.name,
      name_es: nameEs,
      slug: slugify(ex.name),
      source: "free_exercise_db",
      source_id: ex.id,
      description: null,
      description_es: null,
      instructions: ex.instructions.join("\n\n"),
      instructions_es: null,
      video_url: null,
      thumbnail_url: imageUrls[0] ?? null,
      muscle_groups: allMuscles,
      equipment: equipmentMapped,
      difficulty: mapDifficulty(ex.level),
      category: catMap.category,
      primary_muscles: primaryMapped,
      secondary_muscles: secondaryMapped,
      exercise_type: catMap.exercise_type,
      mechanics: mapMechanics(ex.mechanic),
      force: mapForce(ex.force),
      images: imageUrls,
      is_public: true,
    };

    const { error } = await supabase.from("exercises").insert(row);
    if (error) {
      console.error(`  [ERROR] ${ex.name}: ${error.message}`);
      errors++;
    } else {
      inserted++;
    }

    // Progress log every 50
    if ((i + 1) % 50 === 0) {
      console.log(
        `  Progress: ${i + 1}/${exercises.length} | Inserted: ${inserted} | Skipped: ${skipped} | Errors: ${errors} | Translations: ${translationsFound}`
      );
    }
  }

  console.log("\n========= IMPORT COMPLETE =========");
  console.log(`Total exercises in DB:  ${exercises.length}`);
  console.log(`Inserted:               ${inserted}`);
  console.log(`Skipped (existing):     ${skipped}`);
  console.log(`Errors:                 ${errors}`);
  console.log(`Spanish translations:   ${translationsFound}`);
  console.log("====================================");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
