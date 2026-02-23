/**
 * Seed ~200 hand-curated fitness foods with verified macros into Supabase.
 *
 * Usage:
 *   npx tsx scripts/seed-foods.ts
 *
 * Required env vars (reads from .env.local automatically):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";

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
interface SeedFood {
  name: string;
  name_es: string;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
}

// ---------- helpers ----------
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

const BATCH_SIZE = 50;

// ---------- seed data (~200 foods, macros per 100 g, USDA-level accuracy) ----------
const SEED_FOODS: SeedFood[] = [
  // ═══════════════════════════════════════════════════
  // PROTEIN (~40 items)
  // ═══════════════════════════════════════════════════
  { name: "Chicken Breast (Raw)", name_es: "Pechuga de Pollo (Cruda)", category: "protein", calories_per_100g: 120, protein_per_100g: 22.5, carbs_per_100g: 0, fat_per_100g: 2.6 },
  { name: "Chicken Breast (Cooked)", name_es: "Pechuga de Pollo (Cocida)", category: "protein", calories_per_100g: 165, protein_per_100g: 31, carbs_per_100g: 0, fat_per_100g: 3.6 },
  { name: "Chicken Thigh (Raw)", name_es: "Muslo de Pollo (Crudo)", category: "protein", calories_per_100g: 177, protein_per_100g: 18.5, carbs_per_100g: 0, fat_per_100g: 11 },
  { name: "Chicken Thigh (Cooked)", name_es: "Muslo de Pollo (Cocido)", category: "protein", calories_per_100g: 209, protein_per_100g: 26, carbs_per_100g: 0, fat_per_100g: 11 },
  { name: "Chicken Drumstick", name_es: "Pierna de Pollo", category: "protein", calories_per_100g: 172, protein_per_100g: 28.3, carbs_per_100g: 0, fat_per_100g: 5.7 },
  { name: "Chicken Wing (Raw)", name_es: "Ala de Pollo (Cruda)", category: "protein", calories_per_100g: 203, protein_per_100g: 18.3, carbs_per_100g: 0, fat_per_100g: 14 },
  { name: "Ground Chicken", name_es: "Pollo Molido", category: "protein", calories_per_100g: 143, protein_per_100g: 17.4, carbs_per_100g: 0, fat_per_100g: 8.1 },
  { name: "Turkey Breast", name_es: "Pechuga de Pavo", category: "protein", calories_per_100g: 104, protein_per_100g: 23.5, carbs_per_100g: 0, fat_per_100g: 0.7 },
  { name: "Ground Turkey (93/7)", name_es: "Pavo Molido (93/7)", category: "protein", calories_per_100g: 150, protein_per_100g: 21, carbs_per_100g: 0, fat_per_100g: 7 },
  { name: "Ground Beef (90/10)", name_es: "Carne Molida de Res (90/10)", category: "protein", calories_per_100g: 176, protein_per_100g: 20, carbs_per_100g: 0, fat_per_100g: 10 },
  { name: "Ground Beef (80/20)", name_es: "Carne Molida de Res (80/20)", category: "protein", calories_per_100g: 254, protein_per_100g: 17.2, carbs_per_100g: 0, fat_per_100g: 20 },
  { name: "Sirloin Steak", name_es: "Bistec de Sirloin", category: "protein", calories_per_100g: 183, protein_per_100g: 27, carbs_per_100g: 0, fat_per_100g: 8 },
  { name: "Ribeye Steak", name_es: "Bistec Ribeye", category: "protein", calories_per_100g: 291, protein_per_100g: 24, carbs_per_100g: 0, fat_per_100g: 21 },
  { name: "Flank Steak", name_es: "Bistec de Falda", category: "protein", calories_per_100g: 194, protein_per_100g: 27.4, carbs_per_100g: 0, fat_per_100g: 8.7 },
  { name: "Beef Tenderloin", name_es: "Lomo de Res", category: "protein", calories_per_100g: 218, protein_per_100g: 26, carbs_per_100g: 0, fat_per_100g: 12 },
  { name: "Pork Loin", name_es: "Lomo de Cerdo", category: "protein", calories_per_100g: 143, protein_per_100g: 26, carbs_per_100g: 0, fat_per_100g: 3.5 },
  { name: "Pork Chop", name_es: "Chuleta de Cerdo", category: "protein", calories_per_100g: 172, protein_per_100g: 25, carbs_per_100g: 0, fat_per_100g: 7.7 },
  { name: "Pork Tenderloin", name_es: "Solomillo de Cerdo", category: "protein", calories_per_100g: 120, protein_per_100g: 22.2, carbs_per_100g: 0, fat_per_100g: 3 },
  { name: "Bacon", name_es: "Tocino", category: "protein", calories_per_100g: 541, protein_per_100g: 37, carbs_per_100g: 1.4, fat_per_100g: 42 },
  { name: "Ham (Deli)", name_es: "Jamón (Fiambre)", category: "protein", calories_per_100g: 145, protein_per_100g: 21, carbs_per_100g: 1.5, fat_per_100g: 5.5 },
  { name: "Salmon", name_es: "Salmón", category: "protein", calories_per_100g: 208, protein_per_100g: 20, carbs_per_100g: 0, fat_per_100g: 13 },
  { name: "Tuna Canned in Water", name_es: "Atún en Lata al Agua", category: "protein", calories_per_100g: 116, protein_per_100g: 25.5, carbs_per_100g: 0, fat_per_100g: 0.8 },
  { name: "Tuna Canned in Oil", name_es: "Atún en Lata al Aceite", category: "protein", calories_per_100g: 198, protein_per_100g: 29.1, carbs_per_100g: 0, fat_per_100g: 8.2 },
  { name: "Tuna Fresh Steak", name_es: "Filete de Atún Fresco", category: "protein", calories_per_100g: 144, protein_per_100g: 23.3, carbs_per_100g: 0, fat_per_100g: 4.9 },
  { name: "Cod", name_es: "Bacalao", category: "protein", calories_per_100g: 82, protein_per_100g: 18, carbs_per_100g: 0, fat_per_100g: 0.7 },
  { name: "Shrimp", name_es: "Camarones", category: "protein", calories_per_100g: 99, protein_per_100g: 24, carbs_per_100g: 0, fat_per_100g: 0.3 },
  { name: "Tilapia", name_es: "Tilapia", category: "protein", calories_per_100g: 96, protein_per_100g: 20, carbs_per_100g: 0, fat_per_100g: 1.7 },
  { name: "Sardines Canned in Oil", name_es: "Sardinas en Lata al Aceite", category: "protein", calories_per_100g: 208, protein_per_100g: 25, carbs_per_100g: 0, fat_per_100g: 11 },
  { name: "Sea Bass", name_es: "Lubina", category: "protein", calories_per_100g: 97, protein_per_100g: 18.4, carbs_per_100g: 0, fat_per_100g: 2 },
  { name: "Smoked Salmon", name_es: "Salmón Ahumado", category: "protein", calories_per_100g: 117, protein_per_100g: 18.3, carbs_per_100g: 0, fat_per_100g: 4.3 },
  { name: "Whole Egg", name_es: "Huevo Entero", category: "protein", calories_per_100g: 155, protein_per_100g: 13, carbs_per_100g: 1.1, fat_per_100g: 11 },
  { name: "Egg Whites", name_es: "Claras de Huevo", category: "protein", calories_per_100g: 52, protein_per_100g: 11, carbs_per_100g: 0.7, fat_per_100g: 0.2 },
  { name: "Hard-Boiled Egg", name_es: "Huevo Duro", category: "protein", calories_per_100g: 155, protein_per_100g: 12.6, carbs_per_100g: 1.1, fat_per_100g: 10.6 },
  { name: "Firm Tofu", name_es: "Tofu Firme", category: "protein", calories_per_100g: 144, protein_per_100g: 17, carbs_per_100g: 3, fat_per_100g: 9 },
  { name: "Silken Tofu", name_es: "Tofu Sedoso", category: "protein", calories_per_100g: 55, protein_per_100g: 4.8, carbs_per_100g: 2.6, fat_per_100g: 2.7 },
  { name: "Tempeh", name_es: "Tempeh", category: "protein", calories_per_100g: 192, protein_per_100g: 20, carbs_per_100g: 7.6, fat_per_100g: 11 },
  { name: "Seitan", name_es: "Seitán", category: "protein", calories_per_100g: 370, protein_per_100g: 75, carbs_per_100g: 14, fat_per_100g: 2 },
  { name: "Beef Jerky", name_es: "Cecina de Res", category: "protein", calories_per_100g: 410, protein_per_100g: 33, carbs_per_100g: 11, fat_per_100g: 25 },
  { name: "Turkey Breast Deli Slices", name_es: "Pechuga de Pavo en Rebanadas", category: "protein", calories_per_100g: 104, protein_per_100g: 18, carbs_per_100g: 2, fat_per_100g: 2.4 },

  // ═══════════════════════════════════════════════════
  // DAIRY (~20 items)
  // ═══════════════════════════════════════════════════
  { name: "Whole Milk", name_es: "Leche Entera", category: "dairy", calories_per_100g: 61, protein_per_100g: 3.2, carbs_per_100g: 4.8, fat_per_100g: 3.3 },
  { name: "Skim Milk", name_es: "Leche Descremada", category: "dairy", calories_per_100g: 34, protein_per_100g: 3.4, carbs_per_100g: 5, fat_per_100g: 0.1 },
  { name: "2% Milk", name_es: "Leche al 2%", category: "dairy", calories_per_100g: 50, protein_per_100g: 3.3, carbs_per_100g: 4.8, fat_per_100g: 2 },
  { name: "Greek Yogurt (Plain, Nonfat)", name_es: "Yogur Griego (Natural, Descremado)", category: "dairy", calories_per_100g: 59, protein_per_100g: 10, carbs_per_100g: 3.6, fat_per_100g: 0.4 },
  { name: "Greek Yogurt (Plain, Whole)", name_es: "Yogur Griego (Natural, Entero)", category: "dairy", calories_per_100g: 97, protein_per_100g: 9, carbs_per_100g: 3.9, fat_per_100g: 5 },
  { name: "Regular Yogurt (Plain)", name_es: "Yogur Regular (Natural)", category: "dairy", calories_per_100g: 63, protein_per_100g: 5.3, carbs_per_100g: 7.7, fat_per_100g: 1.6 },
  { name: "Cottage Cheese", name_es: "Queso Cottage", category: "dairy", calories_per_100g: 98, protein_per_100g: 11, carbs_per_100g: 3.4, fat_per_100g: 4.3 },
  { name: "Cottage Cheese (Low-Fat)", name_es: "Queso Cottage Bajo en Grasa", category: "dairy", calories_per_100g: 72, protein_per_100g: 10.5, carbs_per_100g: 2.7, fat_per_100g: 1 },
  { name: "Cheddar Cheese", name_es: "Queso Cheddar", category: "dairy", calories_per_100g: 403, protein_per_100g: 25, carbs_per_100g: 1.3, fat_per_100g: 33 },
  { name: "Mozzarella Cheese", name_es: "Queso Mozzarella", category: "dairy", calories_per_100g: 280, protein_per_100g: 28, carbs_per_100g: 3.1, fat_per_100g: 17 },
  { name: "Parmesan Cheese", name_es: "Queso Parmesano", category: "dairy", calories_per_100g: 431, protein_per_100g: 38, carbs_per_100g: 4, fat_per_100g: 29 },
  { name: "Cream Cheese", name_es: "Queso Crema", category: "dairy", calories_per_100g: 342, protein_per_100g: 6, carbs_per_100g: 4, fat_per_100g: 34 },
  { name: "Ricotta Cheese", name_es: "Queso Ricotta", category: "dairy", calories_per_100g: 174, protein_per_100g: 11, carbs_per_100g: 3, fat_per_100g: 13 },
  { name: "Skyr", name_es: "Skyr", category: "dairy", calories_per_100g: 63, protein_per_100g: 11, carbs_per_100g: 4, fat_per_100g: 0.2 },
  { name: "Whipped Cream", name_es: "Crema Batida", category: "dairy", calories_per_100g: 257, protein_per_100g: 3, carbs_per_100g: 13, fat_per_100g: 22 },
  { name: "Sour Cream", name_es: "Crema Agria", category: "dairy", calories_per_100g: 198, protein_per_100g: 2.4, carbs_per_100g: 4.6, fat_per_100g: 19.4 },
  { name: "Feta Cheese", name_es: "Queso Feta", category: "dairy", calories_per_100g: 264, protein_per_100g: 14, carbs_per_100g: 4, fat_per_100g: 21 },
  { name: "Swiss Cheese", name_es: "Queso Suizo", category: "dairy", calories_per_100g: 380, protein_per_100g: 27, carbs_per_100g: 5.4, fat_per_100g: 28 },
  { name: "Provolone Cheese", name_es: "Queso Provolone", category: "dairy", calories_per_100g: 351, protein_per_100g: 25, carbs_per_100g: 2.1, fat_per_100g: 27 },
  { name: "Goat Cheese", name_es: "Queso de Cabra", category: "dairy", calories_per_100g: 364, protein_per_100g: 22, carbs_per_100g: 0.1, fat_per_100g: 30 },

  // ═══════════════════════════════════════════════════
  // GRAINS & STARCHES (~25 items)
  // ═══════════════════════════════════════════════════
  { name: "White Rice (Cooked)", name_es: "Arroz Blanco (Cocido)", category: "grain", calories_per_100g: 130, protein_per_100g: 2.7, carbs_per_100g: 28.2, fat_per_100g: 0.3 },
  { name: "Brown Rice (Cooked)", name_es: "Arroz Integral (Cocido)", category: "grain", calories_per_100g: 123, protein_per_100g: 2.7, carbs_per_100g: 25.6, fat_per_100g: 1 },
  { name: "Jasmine Rice (Cooked)", name_es: "Arroz Jazmín (Cocido)", category: "grain", calories_per_100g: 129, protein_per_100g: 2.5, carbs_per_100g: 28, fat_per_100g: 0.3 },
  { name: "Basmati Rice (Cooked)", name_es: "Arroz Basmati (Cocido)", category: "grain", calories_per_100g: 121, protein_per_100g: 3.5, carbs_per_100g: 25.2, fat_per_100g: 0.4 },
  { name: "Oats (Dry)", name_es: "Avena (Seca)", category: "grain", calories_per_100g: 389, protein_per_100g: 16.9, carbs_per_100g: 66.3, fat_per_100g: 6.9 },
  { name: "Oatmeal (Cooked)", name_es: "Avena (Cocida)", category: "grain", calories_per_100g: 68, protein_per_100g: 2.4, carbs_per_100g: 12, fat_per_100g: 1.4 },
  { name: "Whole Wheat Pasta (Cooked)", name_es: "Pasta Integral (Cocida)", category: "grain", calories_per_100g: 124, protein_per_100g: 5.3, carbs_per_100g: 26.5, fat_per_100g: 0.5 },
  { name: "White Pasta (Cooked)", name_es: "Pasta Blanca (Cocida)", category: "grain", calories_per_100g: 131, protein_per_100g: 5, carbs_per_100g: 25, fat_per_100g: 1.1 },
  { name: "White Bread", name_es: "Pan Blanco", category: "grain", calories_per_100g: 265, protein_per_100g: 9, carbs_per_100g: 49, fat_per_100g: 3.2 },
  { name: "Whole Wheat Bread", name_es: "Pan Integral", category: "grain", calories_per_100g: 247, protein_per_100g: 13, carbs_per_100g: 41, fat_per_100g: 3.4 },
  { name: "Sourdough Bread", name_es: "Pan de Masa Madre", category: "grain", calories_per_100g: 274, protein_per_100g: 10.6, carbs_per_100g: 51, fat_per_100g: 2.4 },
  { name: "Quinoa (Cooked)", name_es: "Quinoa (Cocida)", category: "grain", calories_per_100g: 120, protein_per_100g: 4.4, carbs_per_100g: 21.3, fat_per_100g: 1.9 },
  { name: "Sweet Potato (Cooked)", name_es: "Camote (Cocido)", category: "grain", calories_per_100g: 90, protein_per_100g: 2, carbs_per_100g: 20.7, fat_per_100g: 0.1 },
  { name: "Potato (Boiled)", name_es: "Papa (Hervida)", category: "grain", calories_per_100g: 87, protein_per_100g: 1.9, carbs_per_100g: 20.1, fat_per_100g: 0.1 },
  { name: "Potato (Baked)", name_es: "Papa (Horneada)", category: "grain", calories_per_100g: 93, protein_per_100g: 2.5, carbs_per_100g: 21.2, fat_per_100g: 0.1 },
  { name: "Corn Tortilla", name_es: "Tortilla de Maíz", category: "grain", calories_per_100g: 218, protein_per_100g: 5.7, carbs_per_100g: 44, fat_per_100g: 2.8 },
  { name: "Flour Tortilla", name_es: "Tortilla de Harina", category: "grain", calories_per_100g: 312, protein_per_100g: 8.2, carbs_per_100g: 52, fat_per_100g: 8 },
  { name: "Couscous (Cooked)", name_es: "Cuscús (Cocido)", category: "grain", calories_per_100g: 112, protein_per_100g: 3.8, carbs_per_100g: 23.2, fat_per_100g: 0.2 },
  { name: "Bulgur Wheat (Cooked)", name_es: "Trigo Bulgur (Cocido)", category: "grain", calories_per_100g: 83, protein_per_100g: 3.1, carbs_per_100g: 18.6, fat_per_100g: 0.2 },
  { name: "Granola", name_es: "Granola", category: "grain", calories_per_100g: 471, protein_per_100g: 10, carbs_per_100g: 64, fat_per_100g: 20 },
  { name: "Rice Noodles (Cooked)", name_es: "Fideos de Arroz (Cocidos)", category: "grain", calories_per_100g: 109, protein_per_100g: 0.9, carbs_per_100g: 25.5, fat_per_100g: 0.2 },
  { name: "Corn (Boiled)", name_es: "Maíz (Hervido)", category: "grain", calories_per_100g: 96, protein_per_100g: 3.4, carbs_per_100g: 21, fat_per_100g: 1.5 },
  { name: "Mashed Potatoes", name_es: "Puré de Papa", category: "grain", calories_per_100g: 113, protein_per_100g: 2, carbs_per_100g: 16.8, fat_per_100g: 4.2 },
  { name: "Bagel (Plain)", name_es: "Bagel (Natural)", category: "grain", calories_per_100g: 257, protein_per_100g: 10, carbs_per_100g: 50, fat_per_100g: 1.6 },
  { name: "English Muffin", name_es: "Muffin Inglés", category: "grain", calories_per_100g: 227, protein_per_100g: 8.7, carbs_per_100g: 44, fat_per_100g: 1.8 },

  // ═══════════════════════════════════════════════════
  // VEGETABLES (~25 items)
  // ═══════════════════════════════════════════════════
  { name: "Broccoli", name_es: "Brócoli", category: "vegetable", calories_per_100g: 34, protein_per_100g: 2.8, carbs_per_100g: 7, fat_per_100g: 0.4 },
  { name: "Spinach (Raw)", name_es: "Espinaca (Cruda)", category: "vegetable", calories_per_100g: 23, protein_per_100g: 2.9, carbs_per_100g: 3.6, fat_per_100g: 0.4 },
  { name: "Spinach (Cooked)", name_es: "Espinaca (Cocida)", category: "vegetable", calories_per_100g: 23, protein_per_100g: 3, carbs_per_100g: 3.8, fat_per_100g: 0.3 },
  { name: "Tomato", name_es: "Tomate", category: "vegetable", calories_per_100g: 18, protein_per_100g: 0.9, carbs_per_100g: 3.9, fat_per_100g: 0.2 },
  { name: "Cherry Tomatoes", name_es: "Tomates Cherry", category: "vegetable", calories_per_100g: 18, protein_per_100g: 0.9, carbs_per_100g: 3.9, fat_per_100g: 0.2 },
  { name: "Carrot", name_es: "Zanahoria", category: "vegetable", calories_per_100g: 41, protein_per_100g: 0.9, carbs_per_100g: 9.6, fat_per_100g: 0.2 },
  { name: "Bell Pepper", name_es: "Pimiento", category: "vegetable", calories_per_100g: 31, protein_per_100g: 1, carbs_per_100g: 6, fat_per_100g: 0.3 },
  { name: "Asparagus", name_es: "Espárrago", category: "vegetable", calories_per_100g: 20, protein_per_100g: 2.2, carbs_per_100g: 3.9, fat_per_100g: 0.1 },
  { name: "Green Beans", name_es: "Ejotes", category: "vegetable", calories_per_100g: 31, protein_per_100g: 1.8, carbs_per_100g: 7, fat_per_100g: 0.1 },
  { name: "Zucchini", name_es: "Calabacín", category: "vegetable", calories_per_100g: 17, protein_per_100g: 1.2, carbs_per_100g: 3.1, fat_per_100g: 0.3 },
  { name: "Cauliflower", name_es: "Coliflor", category: "vegetable", calories_per_100g: 25, protein_per_100g: 1.9, carbs_per_100g: 5, fat_per_100g: 0.3 },
  { name: "Cucumber", name_es: "Pepino", category: "vegetable", calories_per_100g: 15, protein_per_100g: 0.7, carbs_per_100g: 3.6, fat_per_100g: 0.1 },
  { name: "Lettuce (Romaine)", name_es: "Lechuga (Romana)", category: "vegetable", calories_per_100g: 15, protein_per_100g: 1.4, carbs_per_100g: 2.9, fat_per_100g: 0.2 },
  { name: "Kale", name_es: "Col Rizada", category: "vegetable", calories_per_100g: 49, protein_per_100g: 4.3, carbs_per_100g: 8.8, fat_per_100g: 0.9 },
  { name: "Onion", name_es: "Cebolla", category: "vegetable", calories_per_100g: 40, protein_per_100g: 1.1, carbs_per_100g: 9.3, fat_per_100g: 0.1 },
  { name: "Mushrooms (White)", name_es: "Champiñones (Blancos)", category: "vegetable", calories_per_100g: 22, protein_per_100g: 3.1, carbs_per_100g: 3.3, fat_per_100g: 0.3 },
  { name: "Eggplant", name_es: "Berenjena", category: "vegetable", calories_per_100g: 25, protein_per_100g: 1, carbs_per_100g: 6, fat_per_100g: 0.2 },
  { name: "Cabbage", name_es: "Repollo", category: "vegetable", calories_per_100g: 25, protein_per_100g: 1.3, carbs_per_100g: 5.8, fat_per_100g: 0.1 },
  { name: "Celery", name_es: "Apio", category: "vegetable", calories_per_100g: 14, protein_per_100g: 0.7, carbs_per_100g: 3, fat_per_100g: 0.2 },
  { name: "Brussels Sprouts", name_es: "Coles de Bruselas", category: "vegetable", calories_per_100g: 43, protein_per_100g: 3.4, carbs_per_100g: 9, fat_per_100g: 0.3 },
  { name: "Artichoke", name_es: "Alcachofa", category: "vegetable", calories_per_100g: 47, protein_per_100g: 3.3, carbs_per_100g: 11, fat_per_100g: 0.2 },
  { name: "Beets", name_es: "Remolacha", category: "vegetable", calories_per_100g: 43, protein_per_100g: 1.6, carbs_per_100g: 9.6, fat_per_100g: 0.2 },
  { name: "Garlic", name_es: "Ajo", category: "vegetable", calories_per_100g: 149, protein_per_100g: 6.4, carbs_per_100g: 33, fat_per_100g: 0.5 },
  { name: "Sweet Corn (Canned)", name_es: "Elote (Enlatado)", category: "vegetable", calories_per_100g: 67, protein_per_100g: 2, carbs_per_100g: 15.4, fat_per_100g: 0.5 },
  { name: "Radish", name_es: "Rábano", category: "vegetable", calories_per_100g: 16, protein_per_100g: 0.7, carbs_per_100g: 3.4, fat_per_100g: 0.1 },

  // ═══════════════════════════════════════════════════
  // FRUITS (~20 items)
  // ═══════════════════════════════════════════════════
  { name: "Banana", name_es: "Plátano", category: "fruit", calories_per_100g: 89, protein_per_100g: 1.1, carbs_per_100g: 22.8, fat_per_100g: 0.3 },
  { name: "Apple", name_es: "Manzana", category: "fruit", calories_per_100g: 52, protein_per_100g: 0.3, carbs_per_100g: 13.8, fat_per_100g: 0.2 },
  { name: "Strawberry", name_es: "Fresa", category: "fruit", calories_per_100g: 32, protein_per_100g: 0.7, carbs_per_100g: 7.7, fat_per_100g: 0.3 },
  { name: "Blueberry", name_es: "Arándano", category: "fruit", calories_per_100g: 57, protein_per_100g: 0.7, carbs_per_100g: 14.5, fat_per_100g: 0.3 },
  { name: "Avocado", name_es: "Aguacate", category: "fruit", calories_per_100g: 160, protein_per_100g: 2, carbs_per_100g: 8.5, fat_per_100g: 14.7 },
  { name: "Orange", name_es: "Naranja", category: "fruit", calories_per_100g: 47, protein_per_100g: 0.9, carbs_per_100g: 11.8, fat_per_100g: 0.1 },
  { name: "Mango", name_es: "Mango", category: "fruit", calories_per_100g: 60, protein_per_100g: 0.8, carbs_per_100g: 15, fat_per_100g: 0.4 },
  { name: "Pineapple", name_es: "Piña", category: "fruit", calories_per_100g: 50, protein_per_100g: 0.5, carbs_per_100g: 13.1, fat_per_100g: 0.1 },
  { name: "Watermelon", name_es: "Sandía", category: "fruit", calories_per_100g: 30, protein_per_100g: 0.6, carbs_per_100g: 7.6, fat_per_100g: 0.2 },
  { name: "Grapes", name_es: "Uvas", category: "fruit", calories_per_100g: 69, protein_per_100g: 0.7, carbs_per_100g: 18.1, fat_per_100g: 0.2 },
  { name: "Kiwi", name_es: "Kiwi", category: "fruit", calories_per_100g: 61, protein_per_100g: 1.1, carbs_per_100g: 14.7, fat_per_100g: 0.5 },
  { name: "Pear", name_es: "Pera", category: "fruit", calories_per_100g: 57, protein_per_100g: 0.4, carbs_per_100g: 15.2, fat_per_100g: 0.1 },
  { name: "Peach", name_es: "Durazno", category: "fruit", calories_per_100g: 39, protein_per_100g: 0.9, carbs_per_100g: 9.5, fat_per_100g: 0.3 },
  { name: "Papaya", name_es: "Papaya", category: "fruit", calories_per_100g: 43, protein_per_100g: 0.5, carbs_per_100g: 11, fat_per_100g: 0.3 },
  { name: "Raspberries", name_es: "Frambuesas", category: "fruit", calories_per_100g: 52, protein_per_100g: 1.2, carbs_per_100g: 12, fat_per_100g: 0.7 },
  { name: "Cherries", name_es: "Cerezas", category: "fruit", calories_per_100g: 63, protein_per_100g: 1.1, carbs_per_100g: 16, fat_per_100g: 0.2 },
  { name: "Plum", name_es: "Ciruela", category: "fruit", calories_per_100g: 46, protein_per_100g: 0.7, carbs_per_100g: 11.4, fat_per_100g: 0.3 },
  { name: "Cantaloupe", name_es: "Melón", category: "fruit", calories_per_100g: 34, protein_per_100g: 0.8, carbs_per_100g: 8.2, fat_per_100g: 0.2 },
  { name: "Grapefruit", name_es: "Toronja", category: "fruit", calories_per_100g: 42, protein_per_100g: 0.8, carbs_per_100g: 10.7, fat_per_100g: 0.1 },
  { name: "Coconut Meat (Fresh)", name_es: "Coco Fresco (Pulpa)", category: "fruit", calories_per_100g: 354, protein_per_100g: 3.3, carbs_per_100g: 15, fat_per_100g: 33 },

  // ═══════════════════════════════════════════════════
  // LEGUMES (~12 items)
  // ═══════════════════════════════════════════════════
  { name: "Lentils (Cooked)", name_es: "Lentejas (Cocidas)", category: "legume", calories_per_100g: 116, protein_per_100g: 9, carbs_per_100g: 20, fat_per_100g: 0.4 },
  { name: "Chickpeas (Cooked)", name_es: "Garbanzos (Cocidos)", category: "legume", calories_per_100g: 164, protein_per_100g: 8.9, carbs_per_100g: 27.4, fat_per_100g: 2.6 },
  { name: "Black Beans (Cooked)", name_es: "Frijoles Negros (Cocidos)", category: "legume", calories_per_100g: 132, protein_per_100g: 8.9, carbs_per_100g: 23.7, fat_per_100g: 0.5 },
  { name: "Kidney Beans (Cooked)", name_es: "Frijoles Rojos (Cocidos)", category: "legume", calories_per_100g: 127, protein_per_100g: 8.7, carbs_per_100g: 22.8, fat_per_100g: 0.5 },
  { name: "Pinto Beans (Cooked)", name_es: "Frijoles Pintos (Cocidos)", category: "legume", calories_per_100g: 143, protein_per_100g: 9, carbs_per_100g: 26.2, fat_per_100g: 0.6 },
  { name: "Edamame", name_es: "Edamame", category: "legume", calories_per_100g: 121, protein_per_100g: 11, carbs_per_100g: 8.9, fat_per_100g: 5.2 },
  { name: "Green Peas", name_es: "Chícharos", category: "legume", calories_per_100g: 81, protein_per_100g: 5.4, carbs_per_100g: 14.5, fat_per_100g: 0.4 },
  { name: "Soybeans (Cooked)", name_es: "Soya (Cocida)", category: "legume", calories_per_100g: 173, protein_per_100g: 17, carbs_per_100g: 10, fat_per_100g: 9 },
  { name: "Hummus", name_es: "Hummus", category: "legume", calories_per_100g: 166, protein_per_100g: 8, carbs_per_100g: 14.3, fat_per_100g: 9.6 },
  { name: "Navy Beans (Cooked)", name_es: "Frijoles Navy (Cocidos)", category: "legume", calories_per_100g: 140, protein_per_100g: 8.2, carbs_per_100g: 26, fat_per_100g: 0.6 },
  { name: "Lima Beans (Cooked)", name_es: "Habas de Lima (Cocidas)", category: "legume", calories_per_100g: 115, protein_per_100g: 7.8, carbs_per_100g: 21, fat_per_100g: 0.4 },
  { name: "Refried Beans", name_es: "Frijoles Refritos", category: "legume", calories_per_100g: 108, protein_per_100g: 5.7, carbs_per_100g: 15.4, fat_per_100g: 2.8 },

  // ═══════════════════════════════════════════════════
  // NUTS & SEEDS (~18 items)
  // ═══════════════════════════════════════════════════
  { name: "Almonds", name_es: "Almendras", category: "nut_seed", calories_per_100g: 579, protein_per_100g: 21, carbs_per_100g: 22, fat_per_100g: 49.9 },
  { name: "Walnuts", name_es: "Nueces", category: "nut_seed", calories_per_100g: 654, protein_per_100g: 15, carbs_per_100g: 14, fat_per_100g: 65 },
  { name: "Peanuts (Roasted)", name_es: "Cacahuates (Tostados)", category: "nut_seed", calories_per_100g: 567, protein_per_100g: 26, carbs_per_100g: 16, fat_per_100g: 49 },
  { name: "Peanut Butter", name_es: "Crema de Cacahuate", category: "nut_seed", calories_per_100g: 588, protein_per_100g: 25, carbs_per_100g: 20, fat_per_100g: 50 },
  { name: "Almond Butter", name_es: "Crema de Almendra", category: "nut_seed", calories_per_100g: 614, protein_per_100g: 21, carbs_per_100g: 19, fat_per_100g: 56 },
  { name: "Cashews", name_es: "Anacardos", category: "nut_seed", calories_per_100g: 553, protein_per_100g: 18, carbs_per_100g: 30, fat_per_100g: 44 },
  { name: "Chia Seeds", name_es: "Semillas de Chía", category: "nut_seed", calories_per_100g: 486, protein_per_100g: 17, carbs_per_100g: 42, fat_per_100g: 31 },
  { name: "Flaxseeds", name_es: "Semillas de Linaza", category: "nut_seed", calories_per_100g: 534, protein_per_100g: 18, carbs_per_100g: 29, fat_per_100g: 42 },
  { name: "Sunflower Seeds", name_es: "Semillas de Girasol", category: "nut_seed", calories_per_100g: 584, protein_per_100g: 21, carbs_per_100g: 20, fat_per_100g: 51 },
  { name: "Pumpkin Seeds", name_es: "Semillas de Calabaza", category: "nut_seed", calories_per_100g: 559, protein_per_100g: 30, carbs_per_100g: 11, fat_per_100g: 49 },
  { name: "Pistachios", name_es: "Pistachos", category: "nut_seed", calories_per_100g: 562, protein_per_100g: 20, carbs_per_100g: 28, fat_per_100g: 45 },
  { name: "Macadamia Nuts", name_es: "Nueces de Macadamia", category: "nut_seed", calories_per_100g: 718, protein_per_100g: 8, carbs_per_100g: 14, fat_per_100g: 76 },
  { name: "Hazelnuts", name_es: "Avellanas", category: "nut_seed", calories_per_100g: 628, protein_per_100g: 15, carbs_per_100g: 17, fat_per_100g: 61 },
  { name: "Tahini", name_es: "Tahini", category: "nut_seed", calories_per_100g: 595, protein_per_100g: 17, carbs_per_100g: 21, fat_per_100g: 54 },
  { name: "Shredded Coconut (Dried)", name_es: "Coco Rallado (Seco)", category: "nut_seed", calories_per_100g: 660, protein_per_100g: 6, carbs_per_100g: 24, fat_per_100g: 65 },
  { name: "Brazil Nuts", name_es: "Nueces de Brasil", category: "nut_seed", calories_per_100g: 659, protein_per_100g: 14, carbs_per_100g: 12, fat_per_100g: 67 },
  { name: "Pecans", name_es: "Pecanas", category: "nut_seed", calories_per_100g: 691, protein_per_100g: 9, carbs_per_100g: 14, fat_per_100g: 72 },
  { name: "Hemp Seeds", name_es: "Semillas de Cáñamo", category: "nut_seed", calories_per_100g: 553, protein_per_100g: 32, carbs_per_100g: 9, fat_per_100g: 49 },

  // ═══════════════════════════════════════════════════
  // OILS & FATS (~8 items)
  // ═══════════════════════════════════════════════════
  { name: "Olive Oil", name_es: "Aceite de Oliva", category: "oil_fat", calories_per_100g: 884, protein_per_100g: 0, carbs_per_100g: 0, fat_per_100g: 100 },
  { name: "Coconut Oil", name_es: "Aceite de Coco", category: "oil_fat", calories_per_100g: 862, protein_per_100g: 0, carbs_per_100g: 0, fat_per_100g: 100 },
  { name: "Butter", name_es: "Mantequilla", category: "oil_fat", calories_per_100g: 717, protein_per_100g: 0.9, carbs_per_100g: 0.1, fat_per_100g: 81 },
  { name: "Ghee", name_es: "Ghee (Mantequilla Clarificada)", category: "oil_fat", calories_per_100g: 900, protein_per_100g: 0, carbs_per_100g: 0, fat_per_100g: 100 },
  { name: "Avocado Oil", name_es: "Aceite de Aguacate", category: "oil_fat", calories_per_100g: 884, protein_per_100g: 0, carbs_per_100g: 0, fat_per_100g: 100 },
  { name: "Lard", name_es: "Manteca de Cerdo", category: "oil_fat", calories_per_100g: 902, protein_per_100g: 0, carbs_per_100g: 0, fat_per_100g: 100 },
  { name: "Sesame Oil", name_es: "Aceite de Sésamo", category: "oil_fat", calories_per_100g: 884, protein_per_100g: 0, carbs_per_100g: 0, fat_per_100g: 100 },
  { name: "Flaxseed Oil", name_es: "Aceite de Linaza", category: "oil_fat", calories_per_100g: 884, protein_per_100g: 0, carbs_per_100g: 0, fat_per_100g: 100 },

  // ═══════════════════════════════════════════════════
  // SUPPLEMENTS (~10 items)
  // ═══════════════════════════════════════════════════
  { name: "Whey Protein Concentrate", name_es: "Proteína de Suero Concentrada", category: "supplement", calories_per_100g: 412, protein_per_100g: 80, carbs_per_100g: 7, fat_per_100g: 7 },
  { name: "Whey Protein Isolate", name_es: "Proteína de Suero Aislada", category: "supplement", calories_per_100g: 370, protein_per_100g: 90, carbs_per_100g: 2, fat_per_100g: 1 },
  { name: "Casein Protein", name_es: "Proteína de Caseína", category: "supplement", calories_per_100g: 360, protein_per_100g: 80, carbs_per_100g: 4, fat_per_100g: 1.5 },
  { name: "Plant Protein Blend", name_es: "Proteína Vegetal", category: "supplement", calories_per_100g: 375, protein_per_100g: 75, carbs_per_100g: 10, fat_per_100g: 5 },
  { name: "Creatine Monohydrate", name_es: "Creatina Monohidratada", category: "supplement", calories_per_100g: 0, protein_per_100g: 0, carbs_per_100g: 0, fat_per_100g: 0 },
  { name: "BCAA Powder", name_es: "BCAA en Polvo", category: "supplement", calories_per_100g: 0, protein_per_100g: 0, carbs_per_100g: 0, fat_per_100g: 0 },
  { name: "Mass Gainer", name_es: "Ganador de Masa", category: "supplement", calories_per_100g: 400, protein_per_100g: 20, carbs_per_100g: 70, fat_per_100g: 5 },
  { name: "Pre-Workout Powder", name_es: "Pre-Entreno en Polvo", category: "supplement", calories_per_100g: 10, protein_per_100g: 0, carbs_per_100g: 2, fat_per_100g: 0 },
  { name: "Collagen Peptides", name_es: "Péptidos de Colágeno", category: "supplement", calories_per_100g: 360, protein_per_100g: 90, carbs_per_100g: 0, fat_per_100g: 0 },
  { name: "Egg White Protein Powder", name_es: "Proteína de Clara de Huevo", category: "supplement", calories_per_100g: 380, protein_per_100g: 82, carbs_per_100g: 5, fat_per_100g: 1 },

  // ═══════════════════════════════════════════════════
  // BEVERAGES (~8 items)
  // ═══════════════════════════════════════════════════
  { name: "Orange Juice", name_es: "Jugo de Naranja", category: "beverage", calories_per_100g: 45, protein_per_100g: 0.7, carbs_per_100g: 10.4, fat_per_100g: 0.2 },
  { name: "Coconut Water", name_es: "Agua de Coco", category: "beverage", calories_per_100g: 19, protein_per_100g: 0.7, carbs_per_100g: 3.7, fat_per_100g: 0.2 },
  { name: "Almond Milk (Unsweetened)", name_es: "Leche de Almendra (Sin Azúcar)", category: "beverage", calories_per_100g: 13, protein_per_100g: 0.4, carbs_per_100g: 0.3, fat_per_100g: 1.1 },
  { name: "Oat Milk", name_es: "Leche de Avena", category: "beverage", calories_per_100g: 47, protein_per_100g: 1, carbs_per_100g: 7, fat_per_100g: 1.5 },
  { name: "Soy Milk (Unsweetened)", name_es: "Leche de Soya (Sin Azúcar)", category: "beverage", calories_per_100g: 33, protein_per_100g: 2.9, carbs_per_100g: 1.6, fat_per_100g: 1.8 },
  { name: "Apple Juice", name_es: "Jugo de Manzana", category: "beverage", calories_per_100g: 46, protein_per_100g: 0.1, carbs_per_100g: 11.3, fat_per_100g: 0.1 },
  { name: "Cranberry Juice (Unsweetened)", name_es: "Jugo de Arándano (Sin Azúcar)", category: "beverage", calories_per_100g: 46, protein_per_100g: 0.4, carbs_per_100g: 12.2, fat_per_100g: 0.1 },
  { name: "Chocolate Milk (Whole)", name_es: "Leche con Chocolate (Entera)", category: "beverage", calories_per_100g: 83, protein_per_100g: 3.2, carbs_per_100g: 10.7, fat_per_100g: 3.4 },

  // ═══════════════════════════════════════════════════
  // SNACKS (~8 items)
  // ═══════════════════════════════════════════════════
  { name: "Rice Cakes", name_es: "Tortitas de Arroz", category: "snack", calories_per_100g: 387, protein_per_100g: 8, carbs_per_100g: 82, fat_per_100g: 2.8 },
  { name: "Dark Chocolate (70%)", name_es: "Chocolate Negro (70%)", category: "snack", calories_per_100g: 598, protein_per_100g: 8, carbs_per_100g: 46, fat_per_100g: 43 },
  { name: "Granola Bar", name_es: "Barra de Granola", category: "snack", calories_per_100g: 471, protein_per_100g: 10, carbs_per_100g: 64, fat_per_100g: 20 },
  { name: "Trail Mix", name_es: "Mix de Frutos Secos", category: "snack", calories_per_100g: 462, protein_per_100g: 14, carbs_per_100g: 47, fat_per_100g: 28 },
  { name: "Protein Bar", name_es: "Barra de Proteína", category: "snack", calories_per_100g: 350, protein_per_100g: 30, carbs_per_100g: 35, fat_per_100g: 10 },
  { name: "Dried Mango", name_es: "Mango Deshidratado", category: "snack", calories_per_100g: 319, protein_per_100g: 1, carbs_per_100g: 79, fat_per_100g: 0.8 },
  { name: "Raisins", name_es: "Pasas", category: "snack", calories_per_100g: 299, protein_per_100g: 3.1, carbs_per_100g: 79, fat_per_100g: 0.5 },
  { name: "Popcorn (Air-Popped)", name_es: "Palomitas (Sin Aceite)", category: "snack", calories_per_100g: 387, protein_per_100g: 13, carbs_per_100g: 78, fat_per_100g: 4.5 },

  // ═══════════════════════════════════════════════════
  // CONDIMENTS (~8 items)
  // ═══════════════════════════════════════════════════
  { name: "Honey", name_es: "Miel", category: "condiment", calories_per_100g: 304, protein_per_100g: 0.3, carbs_per_100g: 82, fat_per_100g: 0 },
  { name: "Maple Syrup", name_es: "Jarabe de Arce", category: "condiment", calories_per_100g: 260, protein_per_100g: 0, carbs_per_100g: 67, fat_per_100g: 0 },
  { name: "Soy Sauce", name_es: "Salsa de Soya", category: "condiment", calories_per_100g: 53, protein_per_100g: 8, carbs_per_100g: 5, fat_per_100g: 0 },
  { name: "Hot Sauce", name_es: "Salsa Picante", category: "condiment", calories_per_100g: 11, protein_per_100g: 0.6, carbs_per_100g: 2, fat_per_100g: 0.1 },
  { name: "Balsamic Vinegar", name_es: "Vinagre Balsámico", category: "condiment", calories_per_100g: 88, protein_per_100g: 0.5, carbs_per_100g: 17, fat_per_100g: 0 },
  { name: "Mustard", name_es: "Mostaza", category: "condiment", calories_per_100g: 66, protein_per_100g: 4, carbs_per_100g: 6, fat_per_100g: 3.3 },
  { name: "Ketchup", name_es: "Kétchup", category: "condiment", calories_per_100g: 112, protein_per_100g: 1.7, carbs_per_100g: 26, fat_per_100g: 0.1 },
  { name: "Salsa", name_es: "Salsa", category: "condiment", calories_per_100g: 36, protein_per_100g: 1.5, carbs_per_100g: 7, fat_per_100g: 0.2 },
];

// ---------- main ----------
async function main() {
  console.log("========= SEED FOODS =========");
  console.log(`Total foods to seed: ${SEED_FOODS.length}\n`);

  // Check which foods are already seeded (dedup by source='seed')
  const { data: existing, error: fetchError } = await supabase
    .from("foods")
    .select("slug")
    .eq("source", "seed");

  if (fetchError) {
    console.error("Error fetching existing foods:", fetchError.message);
    process.exit(1);
  }

  const existingSlugs = new Set((existing ?? []).map((f) => f.slug));
  console.log(`Already seeded: ${existingSlugs.size} foods\n`);

  // Filter out already-seeded foods
  const toInsert = SEED_FOODS.filter((food) => {
    const slug = slugify(food.name);
    return !existingSlugs.has(slug);
  });

  if (toInsert.length === 0) {
    console.log("All foods are already seeded. Nothing to do.");
    return;
  }

  console.log(`Foods to insert: ${toInsert.length}\n`);

  let inserted = 0;
  let errors = 0;

  // Insert in batches
  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    const batch = toInsert.slice(i, i + BATCH_SIZE);

    const rows = batch.map((food) => ({
      name: food.name,
      name_es: food.name_es,
      slug: slugify(food.name),
      category: food.category,
      calories_per_100g: food.calories_per_100g,
      protein_per_100g: food.protein_per_100g,
      carbs_per_100g: food.carbs_per_100g,
      fat_per_100g: food.fat_per_100g,
      source: "seed",
      is_public: true,
    }));

    const { error: insertError } = await supabase.from("foods").insert(rows);

    if (insertError) {
      console.error(`  [ERROR] Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${insertError.message}`);
      errors += batch.length;
    } else {
      inserted += batch.length;
    }

    console.log(
      `  Progress: ${Math.min(i + BATCH_SIZE, toInsert.length)}/${toInsert.length} | Inserted: ${inserted} | Errors: ${errors}`
    );
  }

  // Summary by category
  const categoryCounts: Record<string, number> = {};
  for (const food of SEED_FOODS) {
    categoryCounts[food.category] = (categoryCounts[food.category] ?? 0) + 1;
  }

  console.log("\n========= SEED COMPLETE =========");
  console.log(`Total seed foods:       ${SEED_FOODS.length}`);
  console.log(`Inserted:               ${inserted}`);
  console.log(`Skipped (existing):     ${toInsert.length === 0 ? SEED_FOODS.length : SEED_FOODS.length - toInsert.length}`);
  console.log(`Errors:                 ${errors}`);
  console.log("\nBreakdown by category:");
  for (const [cat, count] of Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat.padEnd(15)} ${count}`);
  }
  console.log("==================================");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
