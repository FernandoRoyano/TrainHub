/**
 * Import ~25 pre-built meal plan templates into Supabase.
 *
 * Creates platform-level templates (trainer_id: null, is_template: true)
 * across the meal_plans, meal_plan_meals, and meal_foods tables.
 *
 * Usage:
 *   npx tsx scripts/import-recipe-templates.ts
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
interface TemplateFood {
  name: string;
  name_es: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface TemplateMeal {
  name: string;
  meal_type: string;
  foods: TemplateFood[];
}

interface MealPlanTemplate {
  name: string;
  name_es: string;
  description: string;
  description_es: string;
  goal: "loss" | "maintenance" | "gain" | "performance" | "health";
  daily_calories: number;
  daily_protein: number;
  daily_carbs: number;
  daily_fat: number;
  meals: TemplateMeal[];
}

// ---------- helpers ----------
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ==========================================================================
// TEMPLATE DATA
// ==========================================================================

const TEMPLATES: MealPlanTemplate[] = [
  // ===================================================================
  // WEIGHT LOSS / CUTTING (~5 templates)
  // ===================================================================

  // Template 1: High Protein Cutting Day (FULL)
  {
    name: "High Protein Cutting Day",
    name_es: "Dia de Definicion Alta Proteina",
    description: "A high-protein, calorie-controlled plan ideal for fat loss while preserving muscle mass.",
    description_es: "Plan alto en proteina y controlado en calorias, ideal para perder grasa manteniendo masa muscular.",
    goal: "loss",
    daily_calories: 1800,
    daily_protein: 180,
    daily_carbs: 130,
    daily_fat: 60,
    meals: [
      {
        name: "Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Egg whites", name_es: "Claras de huevo", quantity: 200, unit: "g", calories: 104, protein: 22, carbs: 1.4, fat: 0.4 },
          { name: "Oats", name_es: "Avena", quantity: 40, unit: "g", calories: 156, protein: 5.4, carbs: 26.8, fat: 2.8 },
          { name: "Banana", name_es: "Platano", quantity: 80, unit: "g", calories: 71, protein: 0.9, carbs: 18.2, fat: 0.3 },
        ],
      },
      {
        name: "Morning Snack",
        meal_type: "morning_snack",
        foods: [
          { name: "Greek yogurt (nonfat)", name_es: "Yogur griego descremado", quantity: 170, unit: "g", calories: 100, protein: 17, carbs: 6, fat: 0.7 },
          { name: "Blueberries", name_es: "Arandanos", quantity: 80, unit: "g", calories: 46, protein: 0.6, carbs: 11.6, fat: 0.3 },
        ],
      },
      {
        name: "Lunch",
        meal_type: "lunch",
        foods: [
          { name: "Grilled chicken breast", name_es: "Pechuga de pollo a la plancha", quantity: 180, unit: "g", calories: 297, protein: 53.4, carbs: 0, fat: 6.5 },
          { name: "Brown rice (cooked)", name_es: "Arroz integral (cocido)", quantity: 120, unit: "g", calories: 142, protein: 3, carbs: 29.4, fat: 1.2 },
          { name: "Broccoli (steamed)", name_es: "Brocoli al vapor", quantity: 150, unit: "g", calories: 52, protein: 4.2, carbs: 7.2, fat: 0.6 },
        ],
      },
      {
        name: "Afternoon Snack",
        meal_type: "afternoon_snack",
        foods: [
          { name: "Whey protein shake", name_es: "Batido de proteina de suero", quantity: 1, unit: "scoop", calories: 120, protein: 24, carbs: 3, fat: 1.5 },
          { name: "Apple", name_es: "Manzana", quantity: 150, unit: "g", calories: 78, protein: 0.4, carbs: 20.7, fat: 0.3 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Salmon fillet (baked)", name_es: "Filete de salmon al horno", quantity: 170, unit: "g", calories: 354, protein: 38.3, carbs: 0, fat: 21.6 },
          { name: "Asparagus", name_es: "Esparragos", quantity: 150, unit: "g", calories: 30, protein: 3.3, carbs: 3.7, fat: 0.2 },
          { name: "Mixed salad greens", name_es: "Ensalada mixta", quantity: 100, unit: "g", calories: 20, protein: 1.5, carbs: 2.5, fat: 0.3 },
          { name: "Olive oil (dressing)", name_es: "Aceite de oliva (aderezo)", quantity: 10, unit: "ml", calories: 88, protein: 0, carbs: 0, fat: 10 },
        ],
      },
    ],
  },

  // Template 2: Low Carb Fat Loss (FULL)
  {
    name: "Low Carb Fat Loss",
    name_es: "Baja en Carbohidratos",
    description: "A low-carbohydrate plan emphasizing proteins and healthy fats for accelerated fat loss.",
    description_es: "Plan bajo en carbohidratos que prioriza proteinas y grasas saludables para perdida de grasa acelerada.",
    goal: "loss",
    daily_calories: 1600,
    daily_protein: 160,
    daily_carbs: 80,
    daily_fat: 65,
    meals: [
      {
        name: "Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Whole eggs", name_es: "Huevos enteros", quantity: 3, unit: "unit", calories: 216, protein: 18.9, carbs: 1.1, fat: 14.4 },
          { name: "Spinach (sauteed)", name_es: "Espinaca salteada", quantity: 80, unit: "g", calories: 18, protein: 2.3, carbs: 2.9, fat: 0.3 },
          { name: "Avocado", name_es: "Aguacate", quantity: 50, unit: "g", calories: 80, protein: 1, carbs: 4.3, fat: 7.3 },
        ],
      },
      {
        name: "Morning Snack",
        meal_type: "morning_snack",
        foods: [
          { name: "Turkey breast slices", name_es: "Pechuga de pavo en rebanadas", quantity: 80, unit: "g", calories: 88, protein: 17.6, carbs: 1.6, fat: 1.2 },
          { name: "Celery sticks", name_es: "Palitos de apio", quantity: 100, unit: "g", calories: 16, protein: 0.7, carbs: 3, fat: 0.2 },
        ],
      },
      {
        name: "Lunch",
        meal_type: "lunch",
        foods: [
          { name: "Grilled steak (sirloin)", name_es: "Bistec de sirloin a la plancha", quantity: 170, unit: "g", calories: 306, protein: 43.5, carbs: 0, fat: 13.6 },
          { name: "Mixed green salad", name_es: "Ensalada verde mixta", quantity: 150, unit: "g", calories: 27, protein: 2, carbs: 4.5, fat: 0.4 },
          { name: "Olive oil dressing", name_es: "Aderezo de aceite de oliva", quantity: 10, unit: "ml", calories: 88, protein: 0, carbs: 0, fat: 10 },
        ],
      },
      {
        name: "Afternoon Snack",
        meal_type: "afternoon_snack",
        foods: [
          { name: "Cottage cheese (low-fat)", name_es: "Queso cottage bajo en grasa", quantity: 150, unit: "g", calories: 109, protein: 18.3, carbs: 5.3, fat: 1.5 },
          { name: "Almonds", name_es: "Almendras", quantity: 15, unit: "g", calories: 87, protein: 3.2, carbs: 3.3, fat: 7.5 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Baked cod fillet", name_es: "Filete de bacalao al horno", quantity: 200, unit: "g", calories: 166, protein: 36, carbs: 0, fat: 1.4 },
          { name: "Zucchini (grilled)", name_es: "Calabacin a la plancha", quantity: 200, unit: "g", calories: 34, protein: 2.4, carbs: 6.2, fat: 0.6 },
          { name: "Cherry tomatoes", name_es: "Tomates cherry", quantity: 100, unit: "g", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
          { name: "Lemon juice", name_es: "Jugo de limon", quantity: 15, unit: "ml", calories: 3, protein: 0.1, carbs: 1, fat: 0 },
        ],
      },
    ],
  },

  // Template 3: Intermittent Fasting 16:8
  {
    name: "Intermittent Fasting 16:8",
    name_es: "Ayuno Intermitente 16:8",
    description: "A 16:8 intermittent fasting plan with two large meals and one snack during the 8-hour eating window.",
    description_es: "Plan de ayuno intermitente 16:8 con dos comidas grandes y una merienda durante la ventana de 8 horas.",
    goal: "loss",
    daily_calories: 1700,
    daily_protein: 150,
    daily_carbs: 120,
    daily_fat: 55,
    meals: [
      {
        name: "First Meal (12:00 PM)",
        meal_type: "lunch",
        foods: [
          { name: "Grilled chicken breast", name_es: "Pechuga de pollo a la plancha", quantity: 200, unit: "g", calories: 330, protein: 62, carbs: 0, fat: 7.2 },
          { name: "Sweet potato (baked)", name_es: "Batata al horno", quantity: 200, unit: "g", calories: 180, protein: 4, carbs: 41.4, fat: 0.2 },
          { name: "Broccoli", name_es: "Brocoli", quantity: 150, unit: "g", calories: 52, protein: 4.2, carbs: 7.2, fat: 0.6 },
        ],
      },
      {
        name: "Snack (4:00 PM)",
        meal_type: "afternoon_snack",
        foods: [
          { name: "Greek yogurt (nonfat)", name_es: "Yogur griego descremado", quantity: 200, unit: "g", calories: 118, protein: 20, carbs: 7, fat: 0.8 },
          { name: "Walnuts", name_es: "Nueces", quantity: 20, unit: "g", calories: 131, protein: 3, carbs: 2.7, fat: 13.1 },
          { name: "Strawberries", name_es: "Fresas", quantity: 100, unit: "g", calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 },
        ],
      },
      {
        name: "Last Meal (7:30 PM)",
        meal_type: "dinner",
        foods: [
          { name: "Salmon fillet", name_es: "Filete de salmon", quantity: 180, unit: "g", calories: 375, protein: 40.5, carbs: 0, fat: 23 },
          { name: "Quinoa (cooked)", name_es: "Quinoa (cocida)", quantity: 130, unit: "g", calories: 156, protein: 5.6, carbs: 27.4, fat: 2.5 },
          { name: "Asparagus (roasted)", name_es: "Esparragos asados", quantity: 120, unit: "g", calories: 24, protein: 2.6, carbs: 2.8, fat: 0.2 },
          { name: "Olive oil", name_es: "Aceite de oliva", quantity: 8, unit: "ml", calories: 70, protein: 0, carbs: 0, fat: 8 },
        ],
      },
    ],
  },

  // Template 4: Mediterranean Cutting (FULL)
  {
    name: "Mediterranean Cutting",
    name_es: "Mediterranea de Definicion",
    description: "A Mediterranean-inspired cutting plan rich in lean proteins, vegetables, and healthy fats.",
    description_es: "Plan de definicion inspirado en la dieta mediterranea, rico en proteinas magras, vegetales y grasas saludables.",
    goal: "loss",
    daily_calories: 1900,
    daily_protein: 140,
    daily_carbs: 150,
    daily_fat: 70,
    meals: [
      {
        name: "Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Greek yogurt (full-fat)", name_es: "Yogur griego entero", quantity: 150, unit: "g", calories: 148, protein: 13.5, carbs: 5.7, fat: 7.5 },
          { name: "Honey", name_es: "Miel", quantity: 10, unit: "g", calories: 30, protein: 0.1, carbs: 8.2, fat: 0 },
          { name: "Mixed berries", name_es: "Frutos rojos mixtos", quantity: 100, unit: "g", calories: 45, protein: 0.9, carbs: 10.2, fat: 0.4 },
          { name: "Walnuts (chopped)", name_es: "Nueces picadas", quantity: 15, unit: "g", calories: 98, protein: 2.3, carbs: 2.1, fat: 9.8 },
        ],
      },
      {
        name: "Morning Snack",
        meal_type: "morning_snack",
        foods: [
          { name: "Hummus", name_es: "Hummus", quantity: 60, unit: "g", calories: 107, protein: 4.9, carbs: 9.6, fat: 5.7 },
          { name: "Carrot sticks", name_es: "Palitos de zanahoria", quantity: 100, unit: "g", calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2 },
        ],
      },
      {
        name: "Lunch",
        meal_type: "lunch",
        foods: [
          { name: "Grilled sea bass", name_es: "Lubina a la plancha", quantity: 180, unit: "g", calories: 198, protein: 36, carbs: 0, fat: 5.4 },
          { name: "Whole wheat couscous", name_es: "Cuscus integral", quantity: 80, unit: "g", calories: 280, protein: 9.6, carbs: 56.8, fat: 1.6 },
          { name: "Roasted bell peppers", name_es: "Pimientos asados", quantity: 120, unit: "g", calories: 38, protein: 1.2, carbs: 7.2, fat: 0.4 },
          { name: "Extra virgin olive oil", name_es: "Aceite de oliva extra virgen", quantity: 10, unit: "ml", calories: 88, protein: 0, carbs: 0, fat: 10 },
        ],
      },
      {
        name: "Afternoon Snack",
        meal_type: "afternoon_snack",
        foods: [
          { name: "Almonds", name_es: "Almendras", quantity: 20, unit: "g", calories: 116, protein: 4.2, carbs: 4.4, fat: 10 },
          { name: "Orange", name_es: "Naranja", quantity: 150, unit: "g", calories: 70, protein: 1.4, carbs: 17.6, fat: 0.2 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Grilled chicken thigh (skinless)", name_es: "Muslo de pollo a la plancha (sin piel)", quantity: 150, unit: "g", calories: 254, protein: 37.5, carbs: 0, fat: 10.5 },
          { name: "Roasted eggplant", name_es: "Berenjena asada", quantity: 150, unit: "g", calories: 37, protein: 1.5, carbs: 8.7, fat: 0.2 },
          { name: "Cherry tomatoes", name_es: "Tomates cherry", quantity: 100, unit: "g", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
          { name: "Feta cheese", name_es: "Queso feta", quantity: 20, unit: "g", calories: 53, protein: 2.8, carbs: 0.8, fat: 4.3 },
          { name: "Olive oil", name_es: "Aceite de oliva", quantity: 5, unit: "ml", calories: 44, protein: 0, carbs: 0, fat: 5 },
        ],
      },
    ],
  },

  // Template 5: Female Weight Loss
  {
    name: "Female Weight Loss",
    name_es: "Perdida de Peso Femenino",
    description: "A balanced, calorie-controlled plan designed for women aiming to lose weight while maintaining energy and nutrition.",
    description_es: "Plan equilibrado y controlado en calorias, disenado para mujeres que buscan perder peso manteniendo energia y nutricion.",
    goal: "loss",
    daily_calories: 1400,
    daily_protein: 120,
    daily_carbs: 100,
    daily_fat: 50,
    meals: [
      {
        name: "Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Oats", name_es: "Avena", quantity: 35, unit: "g", calories: 137, protein: 4.7, carbs: 23.5, fat: 2.4 },
          { name: "Almond milk (unsweetened)", name_es: "Leche de almendra (sin azucar)", quantity: 150, unit: "ml", calories: 20, protein: 0.6, carbs: 0.3, fat: 1.5 },
          { name: "Banana (half)", name_es: "Platano (medio)", quantity: 50, unit: "g", calories: 45, protein: 0.5, carbs: 11.5, fat: 0.2 },
        ],
      },
      {
        name: "Morning Snack",
        meal_type: "morning_snack",
        foods: [
          { name: "Greek yogurt (nonfat)", name_es: "Yogur griego descremado", quantity: 120, unit: "g", calories: 70, protein: 12, carbs: 4.2, fat: 0.5 },
          { name: "Strawberries", name_es: "Fresas", quantity: 80, unit: "g", calories: 26, protein: 0.5, carbs: 6.2, fat: 0.2 },
        ],
      },
      {
        name: "Lunch",
        meal_type: "lunch",
        foods: [
          { name: "Grilled chicken breast", name_es: "Pechuga de pollo a la plancha", quantity: 150, unit: "g", calories: 248, protein: 46.5, carbs: 0, fat: 5.4 },
          { name: "Mixed salad greens", name_es: "Ensalada mixta", quantity: 120, unit: "g", calories: 22, protein: 1.6, carbs: 3.2, fat: 0.3 },
          { name: "Quinoa (cooked)", name_es: "Quinoa (cocida)", quantity: 80, unit: "g", calories: 96, protein: 3.4, carbs: 16.8, fat: 1.5 },
          { name: "Lemon olive oil dressing", name_es: "Aderezo de limon y aceite de oliva", quantity: 8, unit: "ml", calories: 70, protein: 0, carbs: 0, fat: 8 },
        ],
      },
      {
        name: "Afternoon Snack",
        meal_type: "afternoon_snack",
        foods: [
          { name: "Rice cakes", name_es: "Tortitas de arroz", quantity: 2, unit: "unit", calories: 70, protein: 1.4, carbs: 15, fat: 0.5 },
          { name: "Peanut butter", name_es: "Mantequilla de cacahuate", quantity: 10, unit: "g", calories: 59, protein: 2.5, carbs: 2, fat: 5 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Baked tilapia", name_es: "Tilapia al horno", quantity: 150, unit: "g", calories: 162, protein: 33.8, carbs: 0, fat: 2.7 },
          { name: "Steamed broccoli", name_es: "Brocoli al vapor", quantity: 150, unit: "g", calories: 52, protein: 4.2, carbs: 7.2, fat: 0.6 },
          { name: "Sweet potato (small)", name_es: "Batata (pequena)", quantity: 100, unit: "g", calories: 90, protein: 2, carbs: 20.7, fat: 0.1 },
          { name: "Olive oil", name_es: "Aceite de oliva", quantity: 7, unit: "ml", calories: 62, protein: 0, carbs: 0, fat: 7 },
        ],
      },
    ],
  },

  // ===================================================================
  // MUSCLE GAIN / BULKING (~5 templates)
  // ===================================================================

  // Template 6: Clean Bulk 3000kcal
  {
    name: "Clean Bulk 3000kcal",
    name_es: "Volumen Limpio 3000kcal",
    description: "A clean bulking plan with 3000 calories focused on whole foods and lean protein sources.",
    description_es: "Plan de volumen limpio de 3000 calorias enfocado en alimentos naturales y fuentes de proteina magra.",
    goal: "gain",
    daily_calories: 3000,
    daily_protein: 200,
    daily_carbs: 350,
    daily_fat: 90,
    meals: [
      {
        name: "Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Whole eggs", name_es: "Huevos enteros", quantity: 3, unit: "unit", calories: 216, protein: 18.9, carbs: 1.1, fat: 14.4 },
          { name: "Oats", name_es: "Avena", quantity: 80, unit: "g", calories: 312, protein: 10.8, carbs: 53.6, fat: 5.6 },
          { name: "Banana", name_es: "Platano", quantity: 120, unit: "g", calories: 107, protein: 1.3, carbs: 27.4, fat: 0.4 },
          { name: "Whole milk", name_es: "Leche entera", quantity: 200, unit: "ml", calories: 124, protein: 6.4, carbs: 9.4, fat: 6.6 },
        ],
      },
      {
        name: "Morning Snack",
        meal_type: "morning_snack",
        foods: [
          { name: "Whey protein shake", name_es: "Batido de proteina", quantity: 1, unit: "scoop", calories: 120, protein: 24, carbs: 3, fat: 1.5 },
          { name: "Peanut butter on toast", name_es: "Pan con mantequilla de cacahuate", quantity: 2, unit: "slice", calories: 290, protein: 11.4, carbs: 28, fat: 14 },
        ],
      },
      {
        name: "Lunch",
        meal_type: "lunch",
        foods: [
          { name: "Grilled chicken breast", name_es: "Pechuga de pollo a la plancha", quantity: 220, unit: "g", calories: 363, protein: 65.3, carbs: 0, fat: 7.9 },
          { name: "White rice (cooked)", name_es: "Arroz blanco (cocido)", quantity: 250, unit: "g", calories: 325, protein: 6.5, carbs: 71.2, fat: 0.5 },
          { name: "Broccoli", name_es: "Brocoli", quantity: 120, unit: "g", calories: 41, protein: 3.4, carbs: 5.8, fat: 0.5 },
        ],
      },
      {
        name: "Afternoon Snack",
        meal_type: "afternoon_snack",
        foods: [
          { name: "Greek yogurt", name_es: "Yogur griego", quantity: 200, unit: "g", calories: 118, protein: 20, carbs: 7, fat: 0.8 },
          { name: "Granola", name_es: "Granola", quantity: 40, unit: "g", calories: 180, protein: 4, carbs: 26, fat: 6 },
          { name: "Almonds", name_es: "Almendras", quantity: 20, unit: "g", calories: 116, protein: 4.2, carbs: 4.4, fat: 10 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Salmon fillet", name_es: "Filete de salmon", quantity: 200, unit: "g", calories: 416, protein: 45, carbs: 0, fat: 25.4 },
          { name: "Sweet potato (baked)", name_es: "Batata al horno", quantity: 250, unit: "g", calories: 225, protein: 5, carbs: 51.8, fat: 0.3 },
          { name: "Green beans", name_es: "Ejotes", quantity: 100, unit: "g", calories: 31, protein: 1.8, carbs: 7, fat: 0.2 },
          { name: "Olive oil", name_es: "Aceite de oliva", quantity: 10, unit: "ml", calories: 88, protein: 0, carbs: 0, fat: 10 },
        ],
      },
    ],
  },

  // Template 7: Lean Bulk Day
  {
    name: "Lean Bulk Day",
    name_es: "Volumen Magro",
    description: "A moderate surplus plan for lean muscle gains without excess fat accumulation.",
    description_es: "Plan con superavit moderado para ganancia muscular magra sin exceso de grasa.",
    goal: "gain",
    daily_calories: 2700,
    daily_protein: 180,
    daily_carbs: 300,
    daily_fat: 80,
    meals: [
      {
        name: "Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Oats", name_es: "Avena", quantity: 70, unit: "g", calories: 273, protein: 9.5, carbs: 46.9, fat: 4.9 },
          { name: "Whey protein", name_es: "Proteina de suero", quantity: 1, unit: "scoop", calories: 120, protein: 24, carbs: 3, fat: 1.5 },
          { name: "Banana", name_es: "Platano", quantity: 100, unit: "g", calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
        ],
      },
      {
        name: "Lunch",
        meal_type: "lunch",
        foods: [
          { name: "Grilled chicken breast", name_es: "Pechuga de pollo a la plancha", quantity: 200, unit: "g", calories: 330, protein: 62, carbs: 0, fat: 7.2 },
          { name: "Jasmine rice (cooked)", name_es: "Arroz jazmin (cocido)", quantity: 200, unit: "g", calories: 260, protein: 5.2, carbs: 57, fat: 0.4 },
          { name: "Mixed vegetables", name_es: "Vegetales mixtos", quantity: 150, unit: "g", calories: 55, protein: 3, carbs: 10, fat: 0.5 },
        ],
      },
      {
        name: "Afternoon Snack",
        meal_type: "afternoon_snack",
        foods: [
          { name: "Cottage cheese", name_es: "Queso cottage", quantity: 200, unit: "g", calories: 145, protein: 24.4, carbs: 7, fat: 2 },
          { name: "Peanut butter", name_es: "Mantequilla de cacahuate", quantity: 20, unit: "g", calories: 118, protein: 5, carbs: 4, fat: 10 },
          { name: "Rice cakes", name_es: "Tortitas de arroz", quantity: 3, unit: "unit", calories: 105, protein: 2.1, carbs: 22.5, fat: 0.8 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Ground beef (90/10)", name_es: "Carne molida 90/10", quantity: 180, unit: "g", calories: 306, protein: 37.8, carbs: 0, fat: 16.2 },
          { name: "Whole wheat pasta (cooked)", name_es: "Pasta integral (cocida)", quantity: 200, unit: "g", calories: 274, protein: 10.6, carbs: 54.4, fat: 2.4 },
          { name: "Tomato sauce", name_es: "Salsa de tomate", quantity: 80, unit: "g", calories: 29, protein: 1.3, carbs: 6.2, fat: 0.2 },
        ],
      },
      {
        name: "Evening Snack",
        meal_type: "evening_snack",
        foods: [
          { name: "Greek yogurt", name_es: "Yogur griego", quantity: 150, unit: "g", calories: 88, protein: 15, carbs: 5.3, fat: 0.6 },
          { name: "Walnuts", name_es: "Nueces", quantity: 25, unit: "g", calories: 163, protein: 3.8, carbs: 3.4, fat: 16.3 },
        ],
      },
    ],
  },

  // Template 8: Mass Gainer Student
  {
    name: "Mass Gainer Student",
    name_es: "Masa para Estudiantes",
    description: "A budget-friendly, high-calorie plan for students looking to gain muscle mass with simple, accessible foods.",
    description_es: "Plan economico y alto en calorias para estudiantes que buscan ganar masa muscular con alimentos simples y accesibles.",
    goal: "gain",
    daily_calories: 3200,
    daily_protein: 180,
    daily_carbs: 400,
    daily_fat: 100,
    meals: [
      {
        name: "Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Whole eggs (scrambled)", name_es: "Huevos revueltos", quantity: 4, unit: "unit", calories: 288, protein: 25.2, carbs: 1.4, fat: 19.2 },
          { name: "White toast", name_es: "Pan blanco tostado", quantity: 3, unit: "slice", calories: 234, protein: 7.2, carbs: 44.4, fat: 3 },
          { name: "Orange juice", name_es: "Jugo de naranja", quantity: 250, unit: "ml", calories: 112, protein: 1.8, carbs: 25.8, fat: 0.5 },
        ],
      },
      {
        name: "Lunch",
        meal_type: "lunch",
        foods: [
          { name: "Chicken thigh (grilled)", name_es: "Muslo de pollo a la plancha", quantity: 200, unit: "g", calories: 340, protein: 40, carbs: 0, fat: 18 },
          { name: "White rice (cooked)", name_es: "Arroz blanco (cocido)", quantity: 300, unit: "g", calories: 390, protein: 7.8, carbs: 85.5, fat: 0.6 },
          { name: "Black beans", name_es: "Frijoles negros", quantity: 100, unit: "g", calories: 132, protein: 8.9, carbs: 23.7, fat: 0.5 },
        ],
      },
      {
        name: "Afternoon Snack",
        meal_type: "afternoon_snack",
        foods: [
          { name: "Peanut butter sandwich", name_es: "Sandwich de mantequilla de cacahuate", quantity: 1, unit: "unit", calories: 350, protein: 13, carbs: 40, fat: 17 },
          { name: "Banana", name_es: "Platano", quantity: 120, unit: "g", calories: 107, protein: 1.3, carbs: 27.4, fat: 0.4 },
          { name: "Whole milk", name_es: "Leche entera", quantity: 250, unit: "ml", calories: 155, protein: 8, carbs: 11.8, fat: 8.3 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Ground beef (80/20)", name_es: "Carne molida 80/20", quantity: 200, unit: "g", calories: 410, protein: 36, carbs: 0, fat: 28 },
          { name: "Spaghetti (cooked)", name_es: "Espagueti (cocido)", quantity: 250, unit: "g", calories: 393, protein: 13.8, carbs: 78.5, fat: 2.3 },
          { name: "Parmesan cheese", name_es: "Queso parmesano", quantity: 20, unit: "g", calories: 80, protein: 7.2, carbs: 0.6, fat: 5.3 },
        ],
      },
      {
        name: "Evening Snack",
        meal_type: "evening_snack",
        foods: [
          { name: "Greek yogurt", name_es: "Yogur griego", quantity: 200, unit: "g", calories: 118, protein: 20, carbs: 7, fat: 0.8 },
          { name: "Granola", name_es: "Granola", quantity: 50, unit: "g", calories: 225, protein: 5, carbs: 32.5, fat: 7.5 },
        ],
      },
    ],
  },

  // Template 9: Vegan Bulk
  {
    name: "Vegan Bulk",
    name_es: "Volumen Vegano",
    description: "A plant-based bulking plan providing complete amino acids through strategic food combinations.",
    description_es: "Plan de volumen basado en plantas que proporciona aminoacidos completos mediante combinaciones estrategicas de alimentos.",
    goal: "gain",
    daily_calories: 2800,
    daily_protein: 150,
    daily_carbs: 380,
    daily_fat: 85,
    meals: [
      {
        name: "Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Oats", name_es: "Avena", quantity: 80, unit: "g", calories: 312, protein: 10.8, carbs: 53.6, fat: 5.6 },
          { name: "Soy milk", name_es: "Leche de soya", quantity: 250, unit: "ml", calories: 105, protein: 8.8, carbs: 9.3, fat: 4.3 },
          { name: "Banana", name_es: "Platano", quantity: 120, unit: "g", calories: 107, protein: 1.3, carbs: 27.4, fat: 0.4 },
          { name: "Peanut butter", name_es: "Mantequilla de cacahuate", quantity: 25, unit: "g", calories: 147, protein: 6.3, carbs: 5, fat: 12.5 },
        ],
      },
      {
        name: "Lunch",
        meal_type: "lunch",
        foods: [
          { name: "Firm tofu (grilled)", name_es: "Tofu firme a la plancha", quantity: 200, unit: "g", calories: 186, protein: 20, carbs: 3.6, fat: 10 },
          { name: "Brown rice (cooked)", name_es: "Arroz integral (cocido)", quantity: 250, unit: "g", calories: 288, protein: 6.3, carbs: 60, fat: 2.3 },
          { name: "Black beans", name_es: "Frijoles negros", quantity: 120, unit: "g", calories: 158, protein: 10.7, carbs: 28.4, fat: 0.6 },
        ],
      },
      {
        name: "Afternoon Snack",
        meal_type: "afternoon_snack",
        foods: [
          { name: "Plant protein shake", name_es: "Batido de proteina vegetal", quantity: 1, unit: "scoop", calories: 130, protein: 22, carbs: 5, fat: 2.5 },
          { name: "Trail mix (nuts & dried fruit)", name_es: "Mix de frutos secos", quantity: 50, unit: "g", calories: 235, protein: 6, carbs: 24, fat: 14 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Lentil stew", name_es: "Guiso de lentejas", quantity: 250, unit: "g", calories: 288, protein: 18, carbs: 40, fat: 5 },
          { name: "Quinoa (cooked)", name_es: "Quinoa (cocida)", quantity: 180, unit: "g", calories: 216, protein: 7.9, carbs: 38, fat: 3.4 },
          { name: "Avocado", name_es: "Aguacate", quantity: 70, unit: "g", calories: 112, protein: 1.4, carbs: 6, fat: 10.2 },
        ],
      },
      {
        name: "Evening Snack",
        meal_type: "evening_snack",
        foods: [
          { name: "Whole wheat bread", name_es: "Pan integral", quantity: 2, unit: "slice", calories: 160, protein: 7.2, carbs: 28, fat: 2.4 },
          { name: "Almond butter", name_es: "Mantequilla de almendra", quantity: 20, unit: "g", calories: 120, protein: 4.2, carbs: 4, fat: 10 },
          { name: "Soy milk", name_es: "Leche de soya", quantity: 200, unit: "ml", calories: 84, protein: 7, carbs: 7.4, fat: 3.4 },
        ],
      },
    ],
  },

  // Template 10: High Protein Bulk
  {
    name: "High Protein Bulk",
    name_es: "Volumen Alta Proteina",
    description: "A high-protein bulking plan for maximizing muscle protein synthesis during a gaining phase.",
    description_es: "Plan de volumen alto en proteina para maximizar la sintesis de proteina muscular durante una fase de ganancia.",
    goal: "gain",
    daily_calories: 3100,
    daily_protein: 220,
    daily_carbs: 320,
    daily_fat: 95,
    meals: [
      {
        name: "Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Whole eggs", name_es: "Huevos enteros", quantity: 4, unit: "unit", calories: 288, protein: 25.2, carbs: 1.4, fat: 19.2 },
          { name: "Oats", name_es: "Avena", quantity: 60, unit: "g", calories: 234, protein: 8.1, carbs: 40.2, fat: 4.2 },
          { name: "Whole milk", name_es: "Leche entera", quantity: 250, unit: "ml", calories: 155, protein: 8, carbs: 11.8, fat: 8.3 },
        ],
      },
      {
        name: "Morning Snack",
        meal_type: "morning_snack",
        foods: [
          { name: "Whey protein shake", name_es: "Batido de proteina", quantity: 2, unit: "scoop", calories: 240, protein: 48, carbs: 6, fat: 3 },
          { name: "Apple", name_es: "Manzana", quantity: 150, unit: "g", calories: 78, protein: 0.4, carbs: 20.7, fat: 0.3 },
        ],
      },
      {
        name: "Lunch",
        meal_type: "lunch",
        foods: [
          { name: "Grilled chicken breast", name_es: "Pechuga de pollo a la plancha", quantity: 250, unit: "g", calories: 413, protein: 77.5, carbs: 0, fat: 9 },
          { name: "White rice (cooked)", name_es: "Arroz blanco (cocido)", quantity: 250, unit: "g", calories: 325, protein: 6.5, carbs: 71.2, fat: 0.5 },
          { name: "Broccoli", name_es: "Brocoli", quantity: 100, unit: "g", calories: 34, protein: 2.8, carbs: 4.8, fat: 0.4 },
        ],
      },
      {
        name: "Afternoon Snack",
        meal_type: "afternoon_snack",
        foods: [
          { name: "Greek yogurt", name_es: "Yogur griego", quantity: 200, unit: "g", calories: 118, protein: 20, carbs: 7, fat: 0.8 },
          { name: "Almonds", name_es: "Almendras", quantity: 30, unit: "g", calories: 174, protein: 6.3, carbs: 6.6, fat: 15 },
          { name: "Honey", name_es: "Miel", quantity: 15, unit: "g", calories: 46, protein: 0.1, carbs: 12.4, fat: 0 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Beef steak (sirloin)", name_es: "Bistec de sirloin", quantity: 220, unit: "g", calories: 396, protein: 56.1, carbs: 0, fat: 17.6 },
          { name: "Baked potato", name_es: "Papa al horno", quantity: 250, unit: "g", calories: 213, protein: 5, carbs: 48.8, fat: 0.3 },
          { name: "Butter", name_es: "Mantequilla", quantity: 10, unit: "g", calories: 72, protein: 0.1, carbs: 0, fat: 8.1 },
          { name: "Green beans", name_es: "Ejotes", quantity: 100, unit: "g", calories: 31, protein: 1.8, carbs: 7, fat: 0.2 },
        ],
      },
    ],
  },

  // ===================================================================
  // MAINTENANCE (~5 templates)
  // ===================================================================

  // Template 11: Balanced 2200kcal
  {
    name: "Balanced 2200kcal",
    name_es: "Equilibrado 2200kcal",
    description: "A balanced daily nutrition plan at maintenance calories with adequate macronutrient distribution.",
    description_es: "Plan de nutricion diaria equilibrado en calorias de mantenimiento con distribucion adecuada de macronutrientes.",
    goal: "maintenance",
    daily_calories: 2200,
    daily_protein: 150,
    daily_carbs: 220,
    daily_fat: 75,
    meals: [
      {
        name: "Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Whole eggs", name_es: "Huevos enteros", quantity: 2, unit: "unit", calories: 144, protein: 12.6, carbs: 0.7, fat: 9.6 },
          { name: "Whole wheat toast", name_es: "Pan integral tostado", quantity: 2, unit: "slice", calories: 160, protein: 7.2, carbs: 28, fat: 2.4 },
          { name: "Avocado", name_es: "Aguacate", quantity: 40, unit: "g", calories: 64, protein: 0.8, carbs: 3.4, fat: 5.9 },
        ],
      },
      {
        name: "Morning Snack",
        meal_type: "morning_snack",
        foods: [
          { name: "Greek yogurt", name_es: "Yogur griego", quantity: 150, unit: "g", calories: 88, protein: 15, carbs: 5.3, fat: 0.6 },
          { name: "Mixed berries", name_es: "Frutos rojos mixtos", quantity: 80, unit: "g", calories: 36, protein: 0.7, carbs: 8.2, fat: 0.3 },
        ],
      },
      {
        name: "Lunch",
        meal_type: "lunch",
        foods: [
          { name: "Grilled chicken breast", name_es: "Pechuga de pollo a la plancha", quantity: 180, unit: "g", calories: 297, protein: 55.8, carbs: 0, fat: 6.5 },
          { name: "Brown rice (cooked)", name_es: "Arroz integral (cocido)", quantity: 180, unit: "g", calories: 207, protein: 4.5, carbs: 43.2, fat: 1.6 },
          { name: "Mixed salad", name_es: "Ensalada mixta", quantity: 100, unit: "g", calories: 20, protein: 1.5, carbs: 2.5, fat: 0.3 },
          { name: "Olive oil", name_es: "Aceite de oliva", quantity: 10, unit: "ml", calories: 88, protein: 0, carbs: 0, fat: 10 },
        ],
      },
      {
        name: "Afternoon Snack",
        meal_type: "afternoon_snack",
        foods: [
          { name: "Apple", name_es: "Manzana", quantity: 150, unit: "g", calories: 78, protein: 0.4, carbs: 20.7, fat: 0.3 },
          { name: "Almonds", name_es: "Almendras", quantity: 20, unit: "g", calories: 116, protein: 4.2, carbs: 4.4, fat: 10 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Baked salmon", name_es: "Salmon al horno", quantity: 170, unit: "g", calories: 354, protein: 38.3, carbs: 0, fat: 21.6 },
          { name: "Quinoa (cooked)", name_es: "Quinoa (cocida)", quantity: 150, unit: "g", calories: 180, protein: 6.6, carbs: 31.5, fat: 2.9 },
          { name: "Steamed asparagus", name_es: "Esparragos al vapor", quantity: 120, unit: "g", calories: 24, protein: 2.6, carbs: 2.8, fat: 0.2 },
        ],
      },
    ],
  },

  // Template 12: Mediterranean Maintenance
  {
    name: "Mediterranean Maintenance",
    name_es: "Mediterraneo Mantenimiento",
    description: "A Mediterranean-style maintenance plan emphasizing whole grains, fish, olive oil, and fresh vegetables.",
    description_es: "Plan de mantenimiento estilo mediterraneo con enfasis en granos enteros, pescado, aceite de oliva y vegetales frescos.",
    goal: "maintenance",
    daily_calories: 2100,
    daily_protein: 130,
    daily_carbs: 230,
    daily_fat: 70,
    meals: [
      {
        name: "Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Greek yogurt with honey", name_es: "Yogur griego con miel", quantity: 170, unit: "g", calories: 168, protein: 15.3, carbs: 14, fat: 6 },
          { name: "Walnuts", name_es: "Nueces", quantity: 15, unit: "g", calories: 98, protein: 2.3, carbs: 2.1, fat: 9.8 },
          { name: "Fresh figs", name_es: "Higos frescos", quantity: 80, unit: "g", calories: 59, protein: 0.6, carbs: 15.4, fat: 0.2 },
        ],
      },
      {
        name: "Lunch",
        meal_type: "lunch",
        foods: [
          { name: "Grilled sardines", name_es: "Sardinas a la plancha", quantity: 150, unit: "g", calories: 260, protein: 30.8, carbs: 0, fat: 14.5 },
          { name: "Whole wheat pita", name_es: "Pan pita integral", quantity: 60, unit: "g", calories: 157, protein: 5.8, carbs: 31.2, fat: 1.2 },
          { name: "Tomato cucumber salad", name_es: "Ensalada de tomate y pepino", quantity: 150, unit: "g", calories: 30, protein: 1.5, carbs: 5.5, fat: 0.5 },
          { name: "Olive oil", name_es: "Aceite de oliva", quantity: 12, unit: "ml", calories: 106, protein: 0, carbs: 0, fat: 12 },
        ],
      },
      {
        name: "Afternoon Snack",
        meal_type: "afternoon_snack",
        foods: [
          { name: "Hummus", name_es: "Hummus", quantity: 60, unit: "g", calories: 107, protein: 4.9, carbs: 9.6, fat: 5.7 },
          { name: "Whole wheat crackers", name_es: "Galletas integrales", quantity: 30, unit: "g", calories: 125, protein: 3.3, carbs: 20, fat: 3.5 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Chicken breast (roasted)", name_es: "Pechuga de pollo al horno", quantity: 180, unit: "g", calories: 297, protein: 53.4, carbs: 0, fat: 6.5 },
          { name: "Roasted vegetables (zucchini, eggplant, peppers)", name_es: "Vegetales asados (calabacin, berenjena, pimientos)", quantity: 200, unit: "g", calories: 60, protein: 2.5, carbs: 12, fat: 0.8 },
          { name: "Brown rice (cooked)", name_es: "Arroz integral (cocido)", quantity: 150, unit: "g", calories: 173, protein: 3.8, carbs: 36, fat: 1.4 },
          { name: "Olive oil", name_es: "Aceite de oliva", quantity: 8, unit: "ml", calories: 70, protein: 0, carbs: 0, fat: 8 },
        ],
      },
    ],
  },

  // Template 13: High Protein Maintenance
  {
    name: "High Protein Maintenance",
    name_es: "Mantenimiento Alta Proteina",
    description: "A maintenance plan with elevated protein to support muscle retention and recovery.",
    description_es: "Plan de mantenimiento con proteina elevada para apoyar la retencion muscular y la recuperacion.",
    goal: "maintenance",
    daily_calories: 2300,
    daily_protein: 180,
    daily_carbs: 200,
    daily_fat: 75,
    meals: [
      {
        name: "Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Egg whites", name_es: "Claras de huevo", quantity: 150, unit: "g", calories: 78, protein: 16.5, carbs: 1.1, fat: 0.3 },
          { name: "Whole egg", name_es: "Huevo entero", quantity: 1, unit: "unit", calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8 },
          { name: "Oats", name_es: "Avena", quantity: 50, unit: "g", calories: 195, protein: 6.8, carbs: 33.5, fat: 3.5 },
          { name: "Blueberries", name_es: "Arandanos", quantity: 80, unit: "g", calories: 46, protein: 0.6, carbs: 11.6, fat: 0.3 },
        ],
      },
      {
        name: "Lunch",
        meal_type: "lunch",
        foods: [
          { name: "Turkey breast (grilled)", name_es: "Pechuga de pavo a la plancha", quantity: 200, unit: "g", calories: 248, protein: 50, carbs: 0, fat: 3.6 },
          { name: "Sweet potato", name_es: "Batata", quantity: 180, unit: "g", calories: 162, protein: 3.6, carbs: 37.3, fat: 0.2 },
          { name: "Spinach salad", name_es: "Ensalada de espinaca", quantity: 100, unit: "g", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
          { name: "Olive oil", name_es: "Aceite de oliva", quantity: 10, unit: "ml", calories: 88, protein: 0, carbs: 0, fat: 10 },
        ],
      },
      {
        name: "Afternoon Snack",
        meal_type: "afternoon_snack",
        foods: [
          { name: "Whey protein shake", name_es: "Batido de proteina", quantity: 1, unit: "scoop", calories: 120, protein: 24, carbs: 3, fat: 1.5 },
          { name: "Banana", name_es: "Platano", quantity: 100, unit: "g", calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Grilled salmon", name_es: "Salmon a la plancha", quantity: 180, unit: "g", calories: 375, protein: 40.5, carbs: 0, fat: 23 },
          { name: "Quinoa (cooked)", name_es: "Quinoa (cocida)", quantity: 120, unit: "g", calories: 144, protein: 5.3, carbs: 25.2, fat: 2.3 },
          { name: "Roasted broccoli", name_es: "Brocoli asado", quantity: 150, unit: "g", calories: 52, protein: 4.2, carbs: 7.2, fat: 0.6 },
          { name: "Olive oil", name_es: "Aceite de oliva", quantity: 8, unit: "ml", calories: 70, protein: 0, carbs: 0, fat: 8 },
        ],
      },
    ],
  },

  // Template 14: Vegetarian Balanced
  {
    name: "Vegetarian Balanced",
    name_es: "Vegetariano Equilibrado",
    description: "A balanced vegetarian plan providing complete proteins through strategic food pairing.",
    description_es: "Plan vegetariano equilibrado que proporciona proteinas completas mediante combinaciones estrategicas de alimentos.",
    goal: "maintenance",
    daily_calories: 2000,
    daily_protein: 100,
    daily_carbs: 260,
    daily_fat: 65,
    meals: [
      {
        name: "Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Oats", name_es: "Avena", quantity: 60, unit: "g", calories: 234, protein: 8.1, carbs: 40.2, fat: 4.2 },
          { name: "Soy milk", name_es: "Leche de soya", quantity: 200, unit: "ml", calories: 84, protein: 7, carbs: 7.4, fat: 3.4 },
          { name: "Chia seeds", name_es: "Semillas de chia", quantity: 15, unit: "g", calories: 73, protein: 2.5, carbs: 6.3, fat: 4.7 },
          { name: "Mixed berries", name_es: "Frutos rojos mixtos", quantity: 100, unit: "g", calories: 45, protein: 0.9, carbs: 10.2, fat: 0.4 },
        ],
      },
      {
        name: "Lunch",
        meal_type: "lunch",
        foods: [
          { name: "Chickpea curry", name_es: "Curry de garbanzos", quantity: 200, unit: "g", calories: 240, protein: 12, carbs: 32, fat: 8 },
          { name: "Brown rice (cooked)", name_es: "Arroz integral (cocido)", quantity: 200, unit: "g", calories: 230, protein: 5, carbs: 48, fat: 1.8 },
          { name: "Cucumber raita", name_es: "Raita de pepino", quantity: 60, unit: "g", calories: 36, protein: 2.4, carbs: 2.4, fat: 1.8 },
        ],
      },
      {
        name: "Afternoon Snack",
        meal_type: "afternoon_snack",
        foods: [
          { name: "Hummus", name_es: "Hummus", quantity: 60, unit: "g", calories: 107, protein: 4.9, carbs: 9.6, fat: 5.7 },
          { name: "Carrot and celery sticks", name_es: "Palitos de zanahoria y apio", quantity: 120, unit: "g", calories: 38, protein: 1, carbs: 8.4, fat: 0.2 },
          { name: "Almonds", name_es: "Almendras", quantity: 15, unit: "g", calories: 87, protein: 3.2, carbs: 3.3, fat: 7.5 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Grilled tofu", name_es: "Tofu a la plancha", quantity: 180, unit: "g", calories: 168, protein: 18, carbs: 3.2, fat: 9 },
          { name: "Whole wheat pasta (cooked)", name_es: "Pasta integral (cocida)", quantity: 180, unit: "g", calories: 246, protein: 9.5, carbs: 49, fat: 2.2 },
          { name: "Marinara sauce", name_es: "Salsa marinara", quantity: 80, unit: "g", calories: 52, protein: 1.6, carbs: 8.4, fat: 1.6 },
          { name: "Olive oil", name_es: "Aceite de oliva", quantity: 10, unit: "ml", calories: 88, protein: 0, carbs: 0, fat: 10 },
        ],
      },
    ],
  },

  // Template 15: Active Lifestyle
  {
    name: "Active Lifestyle",
    name_es: "Estilo de Vida Activo",
    description: "A maintenance plan for active individuals who exercise regularly and need sustained energy throughout the day.",
    description_es: "Plan de mantenimiento para personas activas que se ejercitan regularmente y necesitan energia sostenida durante el dia.",
    goal: "maintenance",
    daily_calories: 2500,
    daily_protein: 160,
    daily_carbs: 280,
    daily_fat: 80,
    meals: [
      {
        name: "Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Oats", name_es: "Avena", quantity: 70, unit: "g", calories: 273, protein: 9.5, carbs: 46.9, fat: 4.9 },
          { name: "Whole milk", name_es: "Leche entera", quantity: 200, unit: "ml", calories: 124, protein: 6.4, carbs: 9.4, fat: 6.6 },
          { name: "Banana", name_es: "Platano", quantity: 120, unit: "g", calories: 107, protein: 1.3, carbs: 27.4, fat: 0.4 },
          { name: "Peanut butter", name_es: "Mantequilla de cacahuate", quantity: 15, unit: "g", calories: 88, protein: 3.8, carbs: 3, fat: 7.5 },
        ],
      },
      {
        name: "Lunch",
        meal_type: "lunch",
        foods: [
          { name: "Grilled chicken breast", name_es: "Pechuga de pollo a la plancha", quantity: 200, unit: "g", calories: 330, protein: 62, carbs: 0, fat: 7.2 },
          { name: "Sweet potato (baked)", name_es: "Batata al horno", quantity: 200, unit: "g", calories: 180, protein: 4, carbs: 41.4, fat: 0.2 },
          { name: "Mixed green salad", name_es: "Ensalada verde mixta", quantity: 100, unit: "g", calories: 20, protein: 1.5, carbs: 2.5, fat: 0.3 },
          { name: "Olive oil", name_es: "Aceite de oliva", quantity: 10, unit: "ml", calories: 88, protein: 0, carbs: 0, fat: 10 },
        ],
      },
      {
        name: "Post-Workout Snack",
        meal_type: "post_workout",
        foods: [
          { name: "Whey protein shake", name_es: "Batido de proteina", quantity: 1, unit: "scoop", calories: 120, protein: 24, carbs: 3, fat: 1.5 },
          { name: "Rice cakes", name_es: "Tortitas de arroz", quantity: 3, unit: "unit", calories: 105, protein: 2.1, carbs: 22.5, fat: 0.8 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Beef steak (sirloin)", name_es: "Bistec de sirloin", quantity: 180, unit: "g", calories: 324, protein: 46, carbs: 0, fat: 14.4 },
          { name: "Brown rice (cooked)", name_es: "Arroz integral (cocido)", quantity: 200, unit: "g", calories: 230, protein: 5, carbs: 48, fat: 1.8 },
          { name: "Steamed broccoli", name_es: "Brocoli al vapor", quantity: 150, unit: "g", calories: 52, protein: 4.2, carbs: 7.2, fat: 0.6 },
        ],
      },
      {
        name: "Evening Snack",
        meal_type: "evening_snack",
        foods: [
          { name: "Cottage cheese", name_es: "Queso cottage", quantity: 150, unit: "g", calories: 109, protein: 18.3, carbs: 5.3, fat: 1.5 },
          { name: "Walnuts", name_es: "Nueces", quantity: 20, unit: "g", calories: 131, protein: 3, carbs: 2.7, fat: 13.1 },
        ],
      },
    ],
  },

  // ===================================================================
  // PERFORMANCE (~5 templates)
  // ===================================================================

  // Template 16: Pre-Competition Athlete
  {
    name: "Pre-Competition Athlete",
    name_es: "Pre-Competicion Atleta",
    description: "A carb-loaded plan for athletes preparing for competition with optimal glycogen storage.",
    description_es: "Plan alto en carbohidratos para atletas preparandose para competicion con almacenamiento optimo de glucogeno.",
    goal: "performance",
    daily_calories: 2800,
    daily_protein: 170,
    daily_carbs: 350,
    daily_fat: 70,
    meals: [
      {
        name: "Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Oats", name_es: "Avena", quantity: 80, unit: "g", calories: 312, protein: 10.8, carbs: 53.6, fat: 5.6 },
          { name: "Banana", name_es: "Platano", quantity: 120, unit: "g", calories: 107, protein: 1.3, carbs: 27.4, fat: 0.4 },
          { name: "Honey", name_es: "Miel", quantity: 15, unit: "g", calories: 46, protein: 0.1, carbs: 12.4, fat: 0 },
          { name: "Whole egg", name_es: "Huevo entero", quantity: 2, unit: "unit", calories: 144, protein: 12.6, carbs: 0.7, fat: 9.6 },
        ],
      },
      {
        name: "Lunch",
        meal_type: "lunch",
        foods: [
          { name: "Grilled chicken breast", name_es: "Pechuga de pollo a la plancha", quantity: 200, unit: "g", calories: 330, protein: 62, carbs: 0, fat: 7.2 },
          { name: "White rice (cooked)", name_es: "Arroz blanco (cocido)", quantity: 300, unit: "g", calories: 390, protein: 7.8, carbs: 85.5, fat: 0.6 },
          { name: "Steamed vegetables", name_es: "Vegetales al vapor", quantity: 150, unit: "g", calories: 45, protein: 3, carbs: 8, fat: 0.5 },
        ],
      },
      {
        name: "Afternoon Snack",
        meal_type: "afternoon_snack",
        foods: [
          { name: "Whey protein shake", name_es: "Batido de proteina", quantity: 1, unit: "scoop", calories: 120, protein: 24, carbs: 3, fat: 1.5 },
          { name: "Rice cakes with jam", name_es: "Tortitas de arroz con mermelada", quantity: 3, unit: "unit", calories: 165, protein: 2.1, carbs: 35.5, fat: 0.8 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Baked salmon", name_es: "Salmon al horno", quantity: 180, unit: "g", calories: 375, protein: 40.5, carbs: 0, fat: 23 },
          { name: "Whole wheat pasta (cooked)", name_es: "Pasta integral (cocida)", quantity: 200, unit: "g", calories: 274, protein: 10.6, carbs: 54.4, fat: 2.4 },
          { name: "Marinara sauce", name_es: "Salsa marinara", quantity: 80, unit: "g", calories: 52, protein: 1.6, carbs: 8.4, fat: 1.6 },
        ],
      },
      {
        name: "Evening Snack",
        meal_type: "evening_snack",
        foods: [
          { name: "Greek yogurt", name_es: "Yogur griego", quantity: 150, unit: "g", calories: 88, protein: 15, carbs: 5.3, fat: 0.6 },
          { name: "Granola", name_es: "Granola", quantity: 30, unit: "g", calories: 135, protein: 3, carbs: 19.5, fat: 4.5 },
        ],
      },
    ],
  },

  // Template 17: Endurance Training Day
  {
    name: "Endurance Training Day",
    name_es: "Dia de Entrenamiento de Resistencia",
    description: "A high-carbohydrate plan optimized for endurance athletes with long training sessions.",
    description_es: "Plan alto en carbohidratos optimizado para atletas de resistencia con sesiones de entrenamiento largas.",
    goal: "performance",
    daily_calories: 3000,
    daily_protein: 140,
    daily_carbs: 420,
    daily_fat: 70,
    meals: [
      {
        name: "Pre-Training Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Oats", name_es: "Avena", quantity: 100, unit: "g", calories: 390, protein: 13.5, carbs: 67, fat: 7 },
          { name: "Banana", name_es: "Platano", quantity: 150, unit: "g", calories: 134, protein: 1.6, carbs: 34.2, fat: 0.5 },
          { name: "Honey", name_es: "Miel", quantity: 20, unit: "g", calories: 61, protein: 0.1, carbs: 16.6, fat: 0 },
        ],
      },
      {
        name: "Post-Training Recovery",
        meal_type: "post_workout",
        foods: [
          { name: "Whey protein shake", name_es: "Batido de proteina", quantity: 1, unit: "scoop", calories: 120, protein: 24, carbs: 3, fat: 1.5 },
          { name: "White rice (cooked)", name_es: "Arroz blanco (cocido)", quantity: 200, unit: "g", calories: 260, protein: 5.2, carbs: 57, fat: 0.4 },
          { name: "Orange juice", name_es: "Jugo de naranja", quantity: 250, unit: "ml", calories: 112, protein: 1.8, carbs: 25.8, fat: 0.5 },
        ],
      },
      {
        name: "Lunch",
        meal_type: "lunch",
        foods: [
          { name: "Grilled chicken breast", name_es: "Pechuga de pollo a la plancha", quantity: 180, unit: "g", calories: 297, protein: 55.8, carbs: 0, fat: 6.5 },
          { name: "Pasta (cooked)", name_es: "Pasta (cocida)", quantity: 250, unit: "g", calories: 393, protein: 13.8, carbs: 78.5, fat: 2.3 },
          { name: "Tomato sauce", name_es: "Salsa de tomate", quantity: 80, unit: "g", calories: 29, protein: 1.3, carbs: 6.2, fat: 0.2 },
        ],
      },
      {
        name: "Afternoon Snack",
        meal_type: "afternoon_snack",
        foods: [
          { name: "Granola bar", name_es: "Barra de granola", quantity: 2, unit: "unit", calories: 200, protein: 4, carbs: 34, fat: 6 },
          { name: "Apple", name_es: "Manzana", quantity: 150, unit: "g", calories: 78, protein: 0.4, carbs: 20.7, fat: 0.3 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Baked cod", name_es: "Bacalao al horno", quantity: 180, unit: "g", calories: 149, protein: 32.4, carbs: 0, fat: 1.3 },
          { name: "Sweet potato (baked)", name_es: "Batata al horno", quantity: 300, unit: "g", calories: 270, protein: 6, carbs: 62.1, fat: 0.3 },
          { name: "Steamed green beans", name_es: "Ejotes al vapor", quantity: 120, unit: "g", calories: 37, protein: 2.2, carbs: 8.4, fat: 0.2 },
          { name: "Olive oil", name_es: "Aceite de oliva", quantity: 8, unit: "ml", calories: 70, protein: 0, carbs: 0, fat: 8 },
        ],
      },
    ],
  },

  // Template 18: Strength Training Day
  {
    name: "Strength Training Day",
    name_es: "Dia de Entrenamiento de Fuerza",
    description: "A high-protein plan designed for heavy lifting days with adequate carbs for performance.",
    description_es: "Plan alto en proteina disenado para dias de levantamiento pesado con carbohidratos adecuados para rendimiento.",
    goal: "performance",
    daily_calories: 2700,
    daily_protein: 200,
    daily_carbs: 280,
    daily_fat: 80,
    meals: [
      {
        name: "Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Whole eggs", name_es: "Huevos enteros", quantity: 3, unit: "unit", calories: 216, protein: 18.9, carbs: 1.1, fat: 14.4 },
          { name: "Whole wheat toast", name_es: "Pan integral tostado", quantity: 2, unit: "slice", calories: 160, protein: 7.2, carbs: 28, fat: 2.4 },
          { name: "Avocado", name_es: "Aguacate", quantity: 50, unit: "g", calories: 80, protein: 1, carbs: 4.3, fat: 7.3 },
        ],
      },
      {
        name: "Pre-Workout",
        meal_type: "pre_workout",
        foods: [
          { name: "Banana", name_es: "Platano", quantity: 120, unit: "g", calories: 107, protein: 1.3, carbs: 27.4, fat: 0.4 },
          { name: "Rice cakes", name_es: "Tortitas de arroz", quantity: 2, unit: "unit", calories: 70, protein: 1.4, carbs: 15, fat: 0.5 },
          { name: "Peanut butter", name_es: "Mantequilla de cacahuate", quantity: 15, unit: "g", calories: 88, protein: 3.8, carbs: 3, fat: 7.5 },
        ],
      },
      {
        name: "Post-Workout",
        meal_type: "post_workout",
        foods: [
          { name: "Whey protein shake", name_es: "Batido de proteina", quantity: 2, unit: "scoop", calories: 240, protein: 48, carbs: 6, fat: 3 },
          { name: "White rice (cooked)", name_es: "Arroz blanco (cocido)", quantity: 200, unit: "g", calories: 260, protein: 5.2, carbs: 57, fat: 0.4 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Beef steak (sirloin)", name_es: "Bistec de sirloin", quantity: 220, unit: "g", calories: 396, protein: 56.1, carbs: 0, fat: 17.6 },
          { name: "Sweet potato (baked)", name_es: "Batata al horno", quantity: 200, unit: "g", calories: 180, protein: 4, carbs: 41.4, fat: 0.2 },
          { name: "Steamed broccoli", name_es: "Brocoli al vapor", quantity: 150, unit: "g", calories: 52, protein: 4.2, carbs: 7.2, fat: 0.6 },
          { name: "Olive oil", name_es: "Aceite de oliva", quantity: 10, unit: "ml", calories: 88, protein: 0, carbs: 0, fat: 10 },
        ],
      },
      {
        name: "Evening Snack",
        meal_type: "evening_snack",
        foods: [
          { name: "Cottage cheese", name_es: "Queso cottage", quantity: 200, unit: "g", calories: 145, protein: 24.4, carbs: 7, fat: 2 },
          { name: "Walnuts", name_es: "Nueces", quantity: 20, unit: "g", calories: 131, protein: 3, carbs: 2.7, fat: 13.1 },
        ],
      },
    ],
  },

  // Template 19: Game Day Nutrition
  {
    name: "Game Day Nutrition",
    name_es: "Nutricion Dia de Competicion",
    description: "Optimized nutrition for competition day with easily digestible carbs and moderate protein.",
    description_es: "Nutricion optimizada para dia de competicion con carbohidratos de facil digestion y proteina moderada.",
    goal: "performance",
    daily_calories: 2600,
    daily_protein: 150,
    daily_carbs: 340,
    daily_fat: 65,
    meals: [
      {
        name: "Pre-Game Breakfast (3h before)",
        meal_type: "breakfast",
        foods: [
          { name: "White rice (cooked)", name_es: "Arroz blanco (cocido)", quantity: 200, unit: "g", calories: 260, protein: 5.2, carbs: 57, fat: 0.4 },
          { name: "Grilled chicken breast", name_es: "Pechuga de pollo a la plancha", quantity: 120, unit: "g", calories: 198, protein: 37.2, carbs: 0, fat: 4.3 },
          { name: "Banana", name_es: "Platano", quantity: 100, unit: "g", calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
        ],
      },
      {
        name: "Pre-Game Snack (1h before)",
        meal_type: "pre_workout",
        foods: [
          { name: "Granola bar", name_es: "Barra de granola", quantity: 1, unit: "unit", calories: 100, protein: 2, carbs: 17, fat: 3 },
          { name: "Orange juice", name_es: "Jugo de naranja", quantity: 200, unit: "ml", calories: 90, protein: 1.4, carbs: 20.6, fat: 0.4 },
        ],
      },
      {
        name: "Post-Game Recovery",
        meal_type: "post_workout",
        foods: [
          { name: "Whey protein shake", name_es: "Batido de proteina", quantity: 1, unit: "scoop", calories: 120, protein: 24, carbs: 3, fat: 1.5 },
          { name: "White rice (cooked)", name_es: "Arroz blanco (cocido)", quantity: 200, unit: "g", calories: 260, protein: 5.2, carbs: 57, fat: 0.4 },
          { name: "Banana", name_es: "Platano", quantity: 120, unit: "g", calories: 107, protein: 1.3, carbs: 27.4, fat: 0.4 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Grilled salmon", name_es: "Salmon a la plancha", quantity: 180, unit: "g", calories: 375, protein: 40.5, carbs: 0, fat: 23 },
          { name: "Pasta (cooked)", name_es: "Pasta (cocida)", quantity: 200, unit: "g", calories: 314, protein: 11, carbs: 62.8, fat: 1.8 },
          { name: "Steamed vegetables", name_es: "Vegetales al vapor", quantity: 150, unit: "g", calories: 45, protein: 3, carbs: 8, fat: 0.5 },
        ],
      },
      {
        name: "Evening Recovery Snack",
        meal_type: "evening_snack",
        foods: [
          { name: "Greek yogurt", name_es: "Yogur griego", quantity: 200, unit: "g", calories: 118, protein: 20, carbs: 7, fat: 0.8 },
          { name: "Honey", name_es: "Miel", quantity: 15, unit: "g", calories: 46, protein: 0.1, carbs: 12.4, fat: 0 },
          { name: "Granola", name_es: "Granola", quantity: 30, unit: "g", calories: 135, protein: 3, carbs: 19.5, fat: 4.5 },
        ],
      },
    ],
  },

  // Template 20: Recovery Day
  {
    name: "Recovery Day",
    name_es: "Dia de Recuperacion",
    description: "A moderate-calorie plan focused on anti-inflammatory foods and protein for muscle recovery on rest days.",
    description_es: "Plan de calorias moderadas enfocado en alimentos antiinflamatorios y proteina para la recuperacion muscular en dias de descanso.",
    goal: "performance",
    daily_calories: 2200,
    daily_protein: 160,
    daily_carbs: 240,
    daily_fat: 60,
    meals: [
      {
        name: "Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Oats", name_es: "Avena", quantity: 60, unit: "g", calories: 234, protein: 8.1, carbs: 40.2, fat: 4.2 },
          { name: "Blueberries", name_es: "Arandanos", quantity: 100, unit: "g", calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 },
          { name: "Whole egg", name_es: "Huevo entero", quantity: 2, unit: "unit", calories: 144, protein: 12.6, carbs: 0.7, fat: 9.6 },
        ],
      },
      {
        name: "Lunch",
        meal_type: "lunch",
        foods: [
          { name: "Grilled chicken breast", name_es: "Pechuga de pollo a la plancha", quantity: 200, unit: "g", calories: 330, protein: 62, carbs: 0, fat: 7.2 },
          { name: "Sweet potato (baked)", name_es: "Batata al horno", quantity: 200, unit: "g", calories: 180, protein: 4, carbs: 41.4, fat: 0.2 },
          { name: "Spinach salad", name_es: "Ensalada de espinaca", quantity: 100, unit: "g", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
          { name: "Olive oil", name_es: "Aceite de oliva", quantity: 8, unit: "ml", calories: 70, protein: 0, carbs: 0, fat: 8 },
        ],
      },
      {
        name: "Afternoon Snack",
        meal_type: "afternoon_snack",
        foods: [
          { name: "Greek yogurt", name_es: "Yogur griego", quantity: 170, unit: "g", calories: 100, protein: 17, carbs: 6, fat: 0.7 },
          { name: "Walnuts", name_es: "Nueces", quantity: 15, unit: "g", calories: 98, protein: 2.3, carbs: 2.1, fat: 9.8 },
          { name: "Banana", name_es: "Platano", quantity: 100, unit: "g", calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Baked salmon", name_es: "Salmon al horno", quantity: 180, unit: "g", calories: 375, protein: 40.5, carbs: 0, fat: 23 },
          { name: "Brown rice (cooked)", name_es: "Arroz integral (cocido)", quantity: 150, unit: "g", calories: 173, protein: 3.8, carbs: 36, fat: 1.4 },
          { name: "Steamed broccoli", name_es: "Brocoli al vapor", quantity: 150, unit: "g", calories: 52, protein: 4.2, carbs: 7.2, fat: 0.6 },
        ],
      },
    ],
  },

  // ===================================================================
  // HEALTH (~5 templates)
  // ===================================================================

  // Template 21: Anti-Inflammatory Diet
  {
    name: "Anti-Inflammatory Diet",
    name_es: "Dieta Antiinflamatoria",
    description: "A nutrition plan focused on anti-inflammatory foods including fatty fish, berries, leafy greens, and turmeric.",
    description_es: "Plan nutricional enfocado en alimentos antiinflamatorios incluyendo pescado graso, frutos rojos, hojas verdes y curcuma.",
    goal: "health",
    daily_calories: 2000,
    daily_protein: 120,
    daily_carbs: 200,
    daily_fat: 75,
    meals: [
      {
        name: "Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Oats with turmeric", name_es: "Avena con curcuma", quantity: 50, unit: "g", calories: 195, protein: 6.8, carbs: 33.5, fat: 3.5 },
          { name: "Blueberries", name_es: "Arandanos", quantity: 100, unit: "g", calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 },
          { name: "Walnuts", name_es: "Nueces", quantity: 20, unit: "g", calories: 131, protein: 3, carbs: 2.7, fat: 13.1 },
          { name: "Almond milk", name_es: "Leche de almendra", quantity: 150, unit: "ml", calories: 20, protein: 0.6, carbs: 0.3, fat: 1.5 },
        ],
      },
      {
        name: "Lunch",
        meal_type: "lunch",
        foods: [
          { name: "Baked salmon", name_es: "Salmon al horno", quantity: 170, unit: "g", calories: 354, protein: 38.3, carbs: 0, fat: 21.6 },
          { name: "Quinoa (cooked)", name_es: "Quinoa (cocida)", quantity: 150, unit: "g", calories: 180, protein: 6.6, carbs: 31.5, fat: 2.9 },
          { name: "Kale salad", name_es: "Ensalada de kale", quantity: 80, unit: "g", calories: 35, protein: 2.2, carbs: 6, fat: 0.5 },
          { name: "Olive oil", name_es: "Aceite de oliva", quantity: 10, unit: "ml", calories: 88, protein: 0, carbs: 0, fat: 10 },
        ],
      },
      {
        name: "Afternoon Snack",
        meal_type: "afternoon_snack",
        foods: [
          { name: "Almonds", name_es: "Almendras", quantity: 20, unit: "g", calories: 116, protein: 4.2, carbs: 4.4, fat: 10 },
          { name: "Cherries", name_es: "Cerezas", quantity: 100, unit: "g", calories: 63, protein: 1.1, carbs: 16, fat: 0.2 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Grilled chicken breast", name_es: "Pechuga de pollo a la plancha", quantity: 180, unit: "g", calories: 297, protein: 53.4, carbs: 0, fat: 6.5 },
          { name: "Sweet potato (baked)", name_es: "Batata al horno", quantity: 180, unit: "g", calories: 162, protein: 3.6, carbs: 37.3, fat: 0.2 },
          { name: "Steamed spinach", name_es: "Espinaca al vapor", quantity: 100, unit: "g", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
          { name: "Extra virgin olive oil", name_es: "Aceite de oliva extra virgen", quantity: 5, unit: "ml", calories: 44, protein: 0, carbs: 0, fat: 5 },
        ],
      },
    ],
  },

  // Template 22: Heart Healthy
  {
    name: "Heart Healthy",
    name_es: "Saludable para el Corazon",
    description: "A heart-healthy plan low in saturated fats and sodium, rich in omega-3s, fiber, and antioxidants.",
    description_es: "Plan saludable para el corazon bajo en grasas saturadas y sodio, rico en omega-3, fibra y antioxidantes.",
    goal: "health",
    daily_calories: 1900,
    daily_protein: 110,
    daily_carbs: 220,
    daily_fat: 60,
    meals: [
      {
        name: "Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Oats", name_es: "Avena", quantity: 50, unit: "g", calories: 195, protein: 6.8, carbs: 33.5, fat: 3.5 },
          { name: "Flaxseeds", name_es: "Semillas de linaza", quantity: 10, unit: "g", calories: 53, protein: 1.8, carbs: 2.9, fat: 4.2 },
          { name: "Strawberries", name_es: "Fresas", quantity: 100, unit: "g", calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 },
          { name: "Skim milk", name_es: "Leche descremada", quantity: 200, unit: "ml", calories: 66, protein: 6.8, carbs: 9.8, fat: 0.4 },
        ],
      },
      {
        name: "Lunch",
        meal_type: "lunch",
        foods: [
          { name: "Grilled sardines", name_es: "Sardinas a la plancha", quantity: 120, unit: "g", calories: 208, protein: 24.6, carbs: 0, fat: 11.6 },
          { name: "Brown rice (cooked)", name_es: "Arroz integral (cocido)", quantity: 180, unit: "g", calories: 207, protein: 4.5, carbs: 43.2, fat: 1.6 },
          { name: "Steamed broccoli", name_es: "Brocoli al vapor", quantity: 120, unit: "g", calories: 41, protein: 3.4, carbs: 5.8, fat: 0.5 },
          { name: "Olive oil", name_es: "Aceite de oliva", quantity: 8, unit: "ml", calories: 70, protein: 0, carbs: 0, fat: 8 },
        ],
      },
      {
        name: "Afternoon Snack",
        meal_type: "afternoon_snack",
        foods: [
          { name: "Walnuts", name_es: "Nueces", quantity: 20, unit: "g", calories: 131, protein: 3, carbs: 2.7, fat: 13.1 },
          { name: "Orange", name_es: "Naranja", quantity: 150, unit: "g", calories: 70, protein: 1.4, carbs: 17.6, fat: 0.2 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Baked chicken breast (skinless)", name_es: "Pechuga de pollo al horno (sin piel)", quantity: 180, unit: "g", calories: 297, protein: 53.4, carbs: 0, fat: 6.5 },
          { name: "Lentils (cooked)", name_es: "Lentejas (cocidas)", quantity: 120, unit: "g", calories: 140, protein: 10.8, carbs: 24, fat: 0.5 },
          { name: "Mixed green salad", name_es: "Ensalada verde mixta", quantity: 100, unit: "g", calories: 20, protein: 1.5, carbs: 2.5, fat: 0.3 },
          { name: "Balsamic vinegar dressing", name_es: "Aderezo de vinagre balsamico", quantity: 15, unit: "ml", calories: 14, protein: 0.1, carbs: 2.7, fat: 0 },
        ],
      },
    ],
  },

  // Template 23: Gut Health Focus
  {
    name: "Gut Health Focus",
    name_es: "Salud Digestiva",
    description: "A plan rich in prebiotics, probiotics, and fiber to support a healthy gut microbiome.",
    description_es: "Plan rico en prebioticos, probioticos y fibra para apoyar un microbioma intestinal saludable.",
    goal: "health",
    daily_calories: 2100,
    daily_protein: 120,
    daily_carbs: 250,
    daily_fat: 65,
    meals: [
      {
        name: "Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Greek yogurt (probiotic)", name_es: "Yogur griego (probiotico)", quantity: 170, unit: "g", calories: 100, protein: 17, carbs: 6, fat: 0.7 },
          { name: "Oats", name_es: "Avena", quantity: 50, unit: "g", calories: 195, protein: 6.8, carbs: 33.5, fat: 3.5 },
          { name: "Banana (prebiotic)", name_es: "Platano (prebiotico)", quantity: 100, unit: "g", calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
          { name: "Chia seeds", name_es: "Semillas de chia", quantity: 15, unit: "g", calories: 73, protein: 2.5, carbs: 6.3, fat: 4.7 },
        ],
      },
      {
        name: "Lunch",
        meal_type: "lunch",
        foods: [
          { name: "Grilled chicken breast", name_es: "Pechuga de pollo a la plancha", quantity: 170, unit: "g", calories: 281, protein: 52.7, carbs: 0, fat: 6.1 },
          { name: "Lentils (cooked)", name_es: "Lentejas (cocidas)", quantity: 150, unit: "g", calories: 175, protein: 13.5, carbs: 30, fat: 0.6 },
          { name: "Kimchi/sauerkraut", name_es: "Kimchi/chucrut", quantity: 50, unit: "g", calories: 11, protein: 0.8, carbs: 2.3, fat: 0.1 },
        ],
      },
      {
        name: "Afternoon Snack",
        meal_type: "afternoon_snack",
        foods: [
          { name: "Apple (with skin)", name_es: "Manzana (con piel)", quantity: 150, unit: "g", calories: 78, protein: 0.4, carbs: 20.7, fat: 0.3 },
          { name: "Almonds", name_es: "Almendras", quantity: 20, unit: "g", calories: 116, protein: 4.2, carbs: 4.4, fat: 10 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Baked salmon", name_es: "Salmon al horno", quantity: 170, unit: "g", calories: 354, protein: 38.3, carbs: 0, fat: 21.6 },
          { name: "Brown rice (cooked)", name_es: "Arroz integral (cocido)", quantity: 180, unit: "g", calories: 207, protein: 4.5, carbs: 43.2, fat: 1.6 },
          { name: "Asparagus (prebiotic)", name_es: "Esparragos (prebiotico)", quantity: 120, unit: "g", calories: 24, protein: 2.6, carbs: 2.8, fat: 0.2 },
          { name: "Olive oil", name_es: "Aceite de oliva", quantity: 8, unit: "ml", calories: 70, protein: 0, carbs: 0, fat: 8 },
        ],
      },
      {
        name: "Evening Snack",
        meal_type: "evening_snack",
        foods: [
          { name: "Kefir", name_es: "Kefir", quantity: 200, unit: "ml", calories: 104, protein: 6, carbs: 10.2, fat: 3.6 },
          { name: "Flaxseeds", name_es: "Semillas de linaza", quantity: 10, unit: "g", calories: 53, protein: 1.8, carbs: 2.9, fat: 4.2 },
        ],
      },
    ],
  },

  // Template 24: Diabetic Friendly
  {
    name: "Diabetic Friendly",
    name_es: "Apto para Diabeticos",
    description: "A low-glycemic plan designed for blood sugar management with balanced macros and fiber-rich foods.",
    description_es: "Plan de bajo indice glucemico disenado para el control de azucar en sangre con macros equilibrados y alimentos ricos en fibra.",
    goal: "health",
    daily_calories: 1800,
    daily_protein: 130,
    daily_carbs: 150,
    daily_fat: 65,
    meals: [
      {
        name: "Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Whole eggs (scrambled)", name_es: "Huevos revueltos", quantity: 2, unit: "unit", calories: 144, protein: 12.6, carbs: 0.7, fat: 9.6 },
          { name: "Steel-cut oats", name_es: "Avena cortada", quantity: 35, unit: "g", calories: 137, protein: 4.7, carbs: 23.5, fat: 2.4 },
          { name: "Blueberries", name_es: "Arandanos", quantity: 70, unit: "g", calories: 40, protein: 0.5, carbs: 10.1, fat: 0.2 },
          { name: "Chia seeds", name_es: "Semillas de chia", quantity: 10, unit: "g", calories: 49, protein: 1.7, carbs: 4.2, fat: 3.1 },
        ],
      },
      {
        name: "Lunch",
        meal_type: "lunch",
        foods: [
          { name: "Grilled chicken breast", name_es: "Pechuga de pollo a la plancha", quantity: 180, unit: "g", calories: 297, protein: 53.4, carbs: 0, fat: 6.5 },
          { name: "Lentils (cooked)", name_es: "Lentejas (cocidas)", quantity: 120, unit: "g", calories: 140, protein: 10.8, carbs: 24, fat: 0.5 },
          { name: "Mixed green salad", name_es: "Ensalada verde mixta", quantity: 120, unit: "g", calories: 24, protein: 1.8, carbs: 3, fat: 0.4 },
          { name: "Olive oil", name_es: "Aceite de oliva", quantity: 10, unit: "ml", calories: 88, protein: 0, carbs: 0, fat: 10 },
        ],
      },
      {
        name: "Afternoon Snack",
        meal_type: "afternoon_snack",
        foods: [
          { name: "Cottage cheese", name_es: "Queso cottage", quantity: 120, unit: "g", calories: 87, protein: 14.6, carbs: 4.2, fat: 1.2 },
          { name: "Walnuts", name_es: "Nueces", quantity: 15, unit: "g", calories: 98, protein: 2.3, carbs: 2.1, fat: 9.8 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Baked cod", name_es: "Bacalao al horno", quantity: 180, unit: "g", calories: 149, protein: 32.4, carbs: 0, fat: 1.3 },
          { name: "Quinoa (cooked)", name_es: "Quinoa (cocida)", quantity: 130, unit: "g", calories: 156, protein: 5.7, carbs: 27.3, fat: 2.5 },
          { name: "Steamed broccoli", name_es: "Brocoli al vapor", quantity: 150, unit: "g", calories: 52, protein: 4.2, carbs: 7.2, fat: 0.6 },
          { name: "Olive oil", name_es: "Aceite de oliva", quantity: 5, unit: "ml", calories: 44, protein: 0, carbs: 0, fat: 5 },
        ],
      },
      {
        name: "Evening Snack",
        meal_type: "evening_snack",
        foods: [
          { name: "Almonds", name_es: "Almendras", quantity: 15, unit: "g", calories: 87, protein: 3.2, carbs: 3.3, fat: 7.5 },
          { name: "Celery sticks", name_es: "Palitos de apio", quantity: 100, unit: "g", calories: 16, protein: 0.7, carbs: 3, fat: 0.2 },
        ],
      },
    ],
  },

  // Template 25: Senior Active
  {
    name: "Senior Active",
    name_es: "Adulto Mayor Activo",
    description: "A nutrient-dense plan for active older adults with emphasis on protein, calcium, and vitamin D for bone and muscle health.",
    description_es: "Plan rico en nutrientes para adultos mayores activos con enfasis en proteina, calcio y vitamina D para la salud osea y muscular.",
    goal: "health",
    daily_calories: 1800,
    daily_protein: 110,
    daily_carbs: 200,
    daily_fat: 55,
    meals: [
      {
        name: "Breakfast",
        meal_type: "breakfast",
        foods: [
          { name: "Oats", name_es: "Avena", quantity: 50, unit: "g", calories: 195, protein: 6.8, carbs: 33.5, fat: 3.5 },
          { name: "Skim milk", name_es: "Leche descremada", quantity: 200, unit: "ml", calories: 66, protein: 6.8, carbs: 9.8, fat: 0.4 },
          { name: "Banana", name_es: "Platano", quantity: 80, unit: "g", calories: 71, protein: 0.9, carbs: 18.2, fat: 0.2 },
          { name: "Whole egg", name_es: "Huevo entero", quantity: 1, unit: "unit", calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8 },
        ],
      },
      {
        name: "Morning Snack",
        meal_type: "morning_snack",
        foods: [
          { name: "Greek yogurt", name_es: "Yogur griego", quantity: 150, unit: "g", calories: 88, protein: 15, carbs: 5.3, fat: 0.6 },
          { name: "Almonds", name_es: "Almendras", quantity: 15, unit: "g", calories: 87, protein: 3.2, carbs: 3.3, fat: 7.5 },
        ],
      },
      {
        name: "Lunch",
        meal_type: "lunch",
        foods: [
          { name: "Baked salmon", name_es: "Salmon al horno", quantity: 150, unit: "g", calories: 312, protein: 33.8, carbs: 0, fat: 19.1 },
          { name: "Brown rice (cooked)", name_es: "Arroz integral (cocido)", quantity: 150, unit: "g", calories: 173, protein: 3.8, carbs: 36, fat: 1.4 },
          { name: "Steamed spinach", name_es: "Espinaca al vapor", quantity: 100, unit: "g", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
          { name: "Olive oil", name_es: "Aceite de oliva", quantity: 8, unit: "ml", calories: 70, protein: 0, carbs: 0, fat: 8 },
        ],
      },
      {
        name: "Afternoon Snack",
        meal_type: "afternoon_snack",
        foods: [
          { name: "Cottage cheese", name_es: "Queso cottage", quantity: 120, unit: "g", calories: 87, protein: 14.6, carbs: 4.2, fat: 1.2 },
          { name: "Pear", name_es: "Pera", quantity: 120, unit: "g", calories: 68, protein: 0.4, carbs: 18.1, fat: 0.1 },
        ],
      },
      {
        name: "Dinner",
        meal_type: "dinner",
        foods: [
          { name: "Grilled chicken breast", name_es: "Pechuga de pollo a la plancha", quantity: 150, unit: "g", calories: 248, protein: 46.5, carbs: 0, fat: 5.4 },
          { name: "Sweet potato (baked)", name_es: "Batata al horno", quantity: 150, unit: "g", calories: 135, protein: 3, carbs: 31, fat: 0.2 },
          { name: "Steamed broccoli", name_es: "Brocoli al vapor", quantity: 120, unit: "g", calories: 41, protein: 3.4, carbs: 5.8, fat: 0.5 },
        ],
      },
    ],
  },
];

// ---------- main ----------
async function main() {
  console.log("Starting meal plan template import...\n");

  // Step 1: Check existing platform templates for dedup
  const { data: existing, error: fetchError } = await supabase
    .from("meal_plans")
    .select("name")
    .is("trainer_id", null)
    .eq("is_template", true);

  if (fetchError) {
    console.error("Failed to fetch existing templates:", fetchError.message);
    process.exit(1);
  }

  const existingNames = new Set((existing ?? []).map((p) => p.name));
  console.log(`Existing platform templates: ${existingNames.size}\n`);

  let insertedPlans = 0;
  let insertedMeals = 0;
  let insertedFoods = 0;
  let skipped = 0;
  let errors = 0;

  // Step 2: Insert each template
  for (const template of TEMPLATES) {
    if (existingNames.has(template.name)) {
      console.log(`  [SKIP] "${template.name}" already exists`);
      skipped++;
      continue;
    }

    console.log(`  Inserting: "${template.name}" (${template.goal}, ${template.daily_calories} kcal)`);

    // Insert meal plan (use description to store both languages)
    const fullDescription = template.description_es
      ? `${template.description}\n\n---\n\n${template.description_es}`
      : template.description;

    const { data: plan, error: planError } = await supabase
      .from("meal_plans")
      .insert({
        trainer_id: null,
        name: template.name,
        description: fullDescription,
        goal: template.goal,
        daily_calories: template.daily_calories,
        daily_protein: template.daily_protein,
        daily_carbs: template.daily_carbs,
        daily_fat: template.daily_fat,
        is_template: true,
      })
      .select("id")
      .single();

    if (planError || !plan) {
      console.error(`    [ERROR] meal_plan: ${planError?.message}`);
      errors++;
      continue;
    }

    insertedPlans++;

    // Insert meals
    for (let mi = 0; mi < template.meals.length; mi++) {
      const meal = template.meals[mi];

      const { data: insertedMeal, error: mealError } = await supabase
        .from("meal_plan_meals")
        .insert({
          meal_plan_id: plan.id,
          name: meal.name,
          meal_type: meal.meal_type,
          order_index: mi,
          notes: null,
        })
        .select("id")
        .single();

      if (mealError || !insertedMeal) {
        console.error(`    [ERROR] meal "${meal.name}": ${mealError?.message}`);
        errors++;
        continue;
      }

      insertedMeals++;

      // Insert foods for this meal
      for (let fi = 0; fi < meal.foods.length; fi++) {
        const food = meal.foods[fi];

        const { error: foodError } = await supabase.from("meal_foods").insert({
          meal_plan_meal_id: insertedMeal.id,
          name: food.name,
          quantity: food.quantity,
          unit: food.unit,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          order_index: fi,
          notes: food.name_es || null,
        });

        if (foodError) {
          console.error(`    [ERROR] food "${food.name}": ${foodError.message}`);
          errors++;
        } else {
          insertedFoods++;
        }
      }
    }

    // Small delay between templates
    await sleep(100);
  }

  // Step 3: Summary
  console.log("\n========= IMPORT COMPLETE =========");
  console.log(`Templates defined:      ${TEMPLATES.length}`);
  console.log(`Plans inserted:         ${insertedPlans}`);
  console.log(`Meals inserted:         ${insertedMeals}`);
  console.log(`Foods inserted:         ${insertedFoods}`);
  console.log(`Skipped (existing):     ${skipped}`);
  console.log(`Errors:                 ${errors}`);
  console.log("====================================");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
