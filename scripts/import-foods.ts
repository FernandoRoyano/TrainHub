/**
 * Import foods from Open Food Facts API into Supabase.
 *
 * Usage:
 *   npx tsx scripts/import-foods.ts
 *
 * Required env vars (reads from .env.local automatically):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { FOOD_CATEGORY_QUERIES, FOOD_NAME_OVERRIDES } from "./food-mappings";

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
interface OFFProduct {
  code: string;
  product_name?: string;
  product_name_en?: string;
  product_name_es?: string;
  nutriments: {
    "energy-kcal_100g"?: number;
    "proteins_100g"?: number;
    "carbohydrates_100g"?: number;
    "fat_100g"?: number;
  };
}

interface OFFSearchResponse {
  products: OFFProduct[];
}

// ---------- helpers ----------
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function round1(n: number | undefined): number {
  return Math.round((n ?? 0) * 10) / 10;
}

// ---------- main ----------
async function main() {
  console.log("Starting Open Food Facts import...\n");

  // Step 1: Load existing foods for dedup
  const { data: existing, error: fetchError } = await supabase
    .from("foods")
    .select("source_id")
    .eq("source", "open_food_facts");

  if (fetchError) {
    console.error("Failed to fetch existing foods:", fetchError.message);
    process.exit(1);
  }

  const dedupSet = new Set<string>((existing ?? []).map((e) => e.source_id));
  console.log(`Already imported: ${dedupSet.size} foods from Open Food Facts\n`);

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  // Step 2: Iterate over category queries
  for (let qi = 0; qi < FOOD_CATEGORY_QUERIES.length; qi++) {
    const entry = FOOD_CATEGORY_QUERIES[qi];
    const { query, category, maxResults } = entry;

    console.log(`[${qi + 1}/${FOOD_CATEGORY_QUERIES.length}] Fetching: ${query} (category: ${category}, max: ${maxResults})`);

    const url = `https://world.openfoodfacts.org/api/v2/search?categories_tags=${encodeURIComponent(query)}&fields=code,product_name,product_name_en,product_name_es,nutriments&page_size=${maxResults}&sort_by=unique_scans_n`;

    let products: OFFProduct[] = [];
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`  [HTTP ${res.status}] Failed to fetch for query: ${query}`);
        errors++;
        await sleep(600);
        continue;
      }
      const json: OFFSearchResponse = await res.json();
      products = json.products ?? [];
    } catch (err) {
      console.error(`  [FETCH ERROR] ${query}:`, err);
      errors++;
      await sleep(600);
      continue;
    }

    console.log(`  Found ${products.length} products`);

    for (const product of products) {
      const nutriments = product.nutriments;

      // Skip if nutriments object is missing entirely
      if (!nutriments) {
        skipped++;
        continue;
      }

      // Skip if missing essential nutriment data
      if (nutriments["energy-kcal_100g"] == null || nutriments["proteins_100g"] == null) {
        skipped++;
        continue;
      }

      // Sanity check: skip unrealistic calorie values
      const kcal = nutriments["energy-kcal_100g"];
      if (kcal < 1 || kcal > 1000) {
        skipped++;
        continue;
      }

      // Skip if already imported
      if (dedupSet.has(product.code)) {
        skipped++;
        continue;
      }

      // Resolve names with fallback chain
      const override = FOOD_NAME_OVERRIDES[query];
      const name_en =
        product.product_name_en ||
        product.product_name ||
        override?.en ||
        "Unknown";
      const name_es =
        product.product_name_es ||
        override?.es ||
        null;

      const slug = slugify(name_en);

      const row = {
        name: name_en,
        name_es: name_es,
        slug: slug,
        category: category,
        calories_per_100g: Math.round(kcal),
        protein_per_100g: round1(nutriments["proteins_100g"]),
        carbs_per_100g: round1(nutriments["carbohydrates_100g"]),
        fat_per_100g: round1(nutriments["fat_100g"]),
        source: "open_food_facts" as const,
        source_id: product.code,
        is_public: true,
        trainer_id: null,
      };

      const { error: insertError } = await supabase.from("foods").insert(row);
      if (insertError) {
        console.error(`  [ERROR] ${name_en} (${product.code}): ${insertError.message}`);
        errors++;
      } else {
        inserted++;
        dedupSet.add(product.code);
      }
    }

    // Rate limit between API requests
    await sleep(600);
  }

  // Step 3: Summary
  console.log("\n========= IMPORT COMPLETE =========");
  console.log(`Queries processed:      ${FOOD_CATEGORY_QUERIES.length}`);
  console.log(`Inserted:               ${inserted}`);
  console.log(`Skipped (dedup/invalid):${skipped}`);
  console.log(`Errors:                 ${errors}`);
  console.log("====================================");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
