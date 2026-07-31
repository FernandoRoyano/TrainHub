/**
 * Carga un plan de nutrición de REFERENCIA por hábitos (método del plato) en el
 * catálogo del entrenador. Por defecto DRY-RUN (solo lectura). Para aplicar:
 *   node scripts/load-nutricion-habitos.mjs --apply
 *
 * Diseñado para una clienta con ANTECEDENTES de TCA en la adolescencia:
 *   - NO cuenta calorías (daily_calories = null). Único número: proteína
 *     orientativa, en positivo (recuperar / mantener músculo), no restricción.
 *   - Raciones por método del plato (palma, puño, puñado), sin pesar alimentos.
 *   - Cero alimentos prohibidos; lenguaje no centrado en el peso.
 *   - Estructura de comidas regular (no saltarse comidas = clave anti-atracón).
 * La pauta fina debe llevarla un dietista-nutricionista con experiencia en TCA;
 * esto es una referencia de hábitos para acompañar el entrenamiento.
 *
 * Esquema: meal_plans / meal_plan_meals / meal_foods.
 * NO asigna a cliente (se hace desde la app o con --client <clients.id>).
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const get = (k) => env.match(new RegExp(`^${k}=(.*)$`, "m"))?.[1]?.trim();
const supa = createClient(get("NEXT_PUBLIC_SUPABASE_URL"), get("SUPABASE_SERVICE_ROLE_KEY"), {
  auth: { persistSession: false },
});

const APPLY = process.argv.includes("--apply");
const clientArgIdx = process.argv.indexOf("--client");
const CLIENT_ID = clientArgIdx !== -1 ? process.argv[clientArgIdx + 1] : null;
const TRAINER = "3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f";

const PLAN = {
  name: "Hábitos y método del plato - recomposición",
  // goal 'health' a propósito: enfoque salud/hábitos, no "pérdida" en la ficha
  // que ve la clienta (evita reforzar la fijación con el peso).
  goal: "health",
  description:
    "Enfoque flexible por hábitos y método del plato. No se pesan alimentos ni se " +
    "cuentan calorías. La idea es comer SUFICIENTE para entrenar fuerte y recuperar, " +
    "con buena proteína en cada comida, mejorando la composición corporal sin " +
    "restricciones ni prohibiciones. Sin alimentos prohibidos: todo se integra en " +
    "su ración. Comer con calma, sentada, y sin saltarse comidas. " +
    "Progreso: por cómo entrenas, la ropa y las medidas, no por la báscula diaria. " +
    "Único número orientativo: ~120-135 g de proteína al día (repartidos), como " +
    "referencia para recuperar y mantener músculo, no como norma estricta. " +
    "Esta es una guía de hábitos; la pauta detallada la lleva un dietista-" +
    "nutricionista (idealmente con experiencia en conducta alimentaria).",
  daily_calories: null,      // deliberadamente sin kcal
  daily_protein: 125,        // orientativo, en positivo
  daily_carbs: null,
  daily_fat: null,
  is_template: false,
};

// meal_type validos: breakfast, morning_snack, lunch, afternoon_snack, dinner,
//                    evening_snack, pre_workout, post_workout, other
const MEALS = [
  {
    meal_type: "breakfast", name: "Desayuno",
    notes: "Método del plato: proteína + carbohidrato + fruta + un poco de grasa buena. " +
      "Sin prisa y sentada. Un desayuno completo quita el hambre ansiosa del resto del día.",
    foods: [
      "Proteína: 2-3 huevos o 1 vaso de yogur griego natural",
      "Carbohidrato: 1 puñado de avena o 2 rebanadas de pan integral",
      "Fruta: 1 pieza",
      "Grasa buena: 1/4 de aguacate o un puñado pequeño de frutos secos",
    ],
  },
  {
    meal_type: "lunch", name: "Comida",
    notes: "Método del plato: 1/2 plato de verdura, 1/4 proteína (1 palma de la mano), " +
      "1/4 carbohidrato (1 puño), y 1 cucharada de aceite de oliva. Come hasta estar " +
      "saciada, no llena a reventar ni con hambre.",
    foods: [
      "Verdura/hortaliza: 1/2 plato (libre)",
      "Proteína: 1 palma de la mano (pollo, pescado, ternera magra, legumbre, huevo)",
      "Carbohidrato: 1 puño (arroz, patata, pasta, legumbre, pan)",
      "Grasa: 1 cucharada de aceite de oliva",
    ],
  },
  {
    meal_type: "afternoon_snack", name: "Merienda",
    notes: "Tentempié flexible, mejor con algo de proteína para llegar bien a la cena " +
      "y no picar sin control. Nada está prohibido: si te apetece algo dulce, cabe aquí.",
    foods: [
      "Fruta: 1 pieza",
      "Proteína/grasa: yogur natural, requesón o un puñado de frutos secos",
    ],
  },
  {
    meal_type: "dinner", name: "Cena",
    notes: "Ligera pero suficiente: verdura + proteína magra, y carbohidrato según el " +
      "hambre y si has entrenado. Cenar tranquila, idealmente ~2 h antes de dormir.",
    foods: [
      "Verdura: 1/2 plato",
      "Proteína magra: 1 palma de la mano",
      "Carbohidrato: opcional segun hambre y si has entrenado/corrido",
      "Grasa: moderada (aceite, aguacate)",
    ],
  },
  {
    meal_type: "post_workout", name: "Después de entrenar o correr",
    notes: "Solo los días de fuerza o carrera. Ayuda a recuperar y a rendir el " +
      "siguiente día. No es un extra 'que compensar': entrenar pide comer.",
    foods: [
      "Proteína + carbohidrato: yogur con fruta, un batido, o adelantar la merienda",
    ],
  },
];

const enumMeal = new Set([
  "breakfast","morning_snack","lunch","afternoon_snack","dinner",
  "evening_snack","pre_workout","post_workout","other",
]);
for (const m of MEALS) if (!enumMeal.has(m.meal_type)) {
  console.error(`✗ meal_type inválido: ${m.meal_type}`); process.exit(1);
}

console.log(`\n=== PLAN DE NUTRICIÓN — modo ${APPLY ? "APPLY" : "DRY-RUN"} ===\n`);
console.log(`Plan: "${PLAN.name}"  (goal=${PLAN.goal}, proteína~${PLAN.daily_protein} g, sin kcal)`);
for (const m of MEALS) {
  console.log(`\n• ${m.name} [${m.meal_type}]`);
  console.log(`   ${m.notes}`);
  for (const f of m.foods) console.log(`   - ${f}`);
}
console.log(`\nComidas: ${MEALS.length} · ítems: ${MEALS.reduce((a, m) => a + m.foods.length, 0)}`);
console.log(CLIENT_ID ? `Asignar a clients.id = ${CLIENT_ID}` : "Sin asignar (crear solo el plan)");

if (!APPLY) {
  console.log("\n(DRY-RUN: no se ha escrito nada. Revisa y ejecuta con --apply.)");
  process.exit(0);
}

// =================== APLICAR ===================
console.log("\n=== APLICANDO ===");

const { data: existing } = await supa
  .from("meal_plans").select("id").eq("trainer_id", TRAINER).eq("name", PLAN.name).maybeSingle();
if (existing) {
  console.error(`✗ Ya existe un plan "${PLAN.name}" (${existing.id}). Aborto para no duplicar.`);
  process.exit(1);
}

// 1. Plan
const { data: plan, error: pErr } = await supa.from("meal_plans").insert({
  trainer_id: TRAINER, name: PLAN.name, description: PLAN.description, goal: PLAN.goal,
  daily_calories: PLAN.daily_calories, daily_protein: PLAN.daily_protein,
  daily_carbs: PLAN.daily_carbs, daily_fat: PLAN.daily_fat, is_template: PLAN.is_template,
}).select("id").single();
if (pErr) { console.error("✗ crear plan:", pErr.message); process.exit(1); }
console.log(`  + plan creado: ${plan.id}`);

// 2. Comidas + 3. Ítems
for (let i = 0; i < MEALS.length; i++) {
  const m = MEALS[i];
  const { data: meal, error: mErr } = await supa.from("meal_plan_meals").insert({
    meal_plan_id: plan.id, name: m.name, meal_type: m.meal_type, order_index: i, notes: m.notes,
  }).select("id").single();
  if (mErr) { console.error(`✗ comida ${m.name}:`, mErr.message); process.exit(1); }

  const rows = m.foods.map((name, j) => ({
    meal_plan_meal_id: meal.id, name, order_index: j,
  }));
  const { error: fErr } = await supa.from("meal_foods").insert(rows);
  if (fErr) { console.error(`✗ ítems de ${m.name}:`, fErr.message); process.exit(1); }
  console.log(`  + ${m.name}: ${rows.length} ítems`);
}

// 4. Asignación (opcional)
if (CLIENT_ID) {
  const { error: aErr } = await supa.from("client_meal_plans").insert({
    client_id: CLIENT_ID, meal_plan_id: plan.id, trainer_id: TRAINER,
  });
  if (aErr) { console.error("✗ asignar a cliente:", aErr.message); process.exit(1); }
  console.log(`  + asignado a clients.id ${CLIENT_ID}`);
}

console.log(`\n✓ Plan de nutrición creado${CLIENT_ID ? " y asignado" : " (sin asignar)"}.`);
console.log(`MEAL_PLAN_ID=${plan.id}`);
process.exit(0);
