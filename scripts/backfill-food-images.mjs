// Backfill de foods.image_url para el catálogo local, usando las imágenes
// públicas de ingredientes de Spoonacular (CDN img.spoonacular.com), SIN API key.
// Cada candidato se VERIFICA con HEAD antes de usarse (404 → se descarta);
// las confirmadas se copian al bucket público `foods` de Supabase Storage
// (sin hotlink a terceros) y se actualiza la fila.
//
// Uso: node scripts/backfill-food-images.mjs           (dry-run)
//      node scripts/backfill-food-images.mjs --apply   (sube + actualiza + rollback)
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "fs";

const APPLY = process.argv.includes("--apply");

const env = {};
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const supabase = createClient(URL_, env.SUPABASE_SERVICE_ROLE_KEY);

const CDN = "https://img.spoonacular.com/ingredients_250x250";
const STORAGE_BASE = `${URL_}/storage/v1/object/public/foods`;

// Reglas por palabra clave (primera que matchea gana; el orden importa:
// específicas antes que genéricas). Cada regla da candidatos de archivo;
// se usa el primero que exista en el CDN (verificado con HEAD).
const RULES = [
  // Proteínas en polvo / suplementos → bote de proteína genérico
  [/whey|casein|protein (powder|plus|blend|bar|cr[eè]me|caramel|cocoa)|mass gainer|bcaa|creatin|pre-workout|collagen|egg white protein|eat natural|nitro tech/i, ["whey-protein-powder.jpg", "whey-powder.jpg", "protein-powder.png"]],
  // Aves
  [/chicken breast|pechug(a|uita) de pollo|filet de poulet|tiras pollo/i, ["chicken-breasts.jpg", "chicken-breast.jpg"]],
  [/chicken thigh|muslo de pollo|cuisse de poulet/i, ["chicken-thighs.png", "chicken-thighs.jpg", "chicken-thigh.jpg"]],
  [/drumstick|pierna de pollo/i, ["chicken-drumsticks.jpg", "chicken-leg.png", "chicken-leg.jpg"]],
  [/chicken wing|ala de pollo/i, ["chicken-wings.png", "chicken-wings.jpg"]],
  [/ground chicken|pollo molido/i, ["ground-chicken.png", "ground-chicken.jpg", "fresh-ground-beef.jpg"]],
  [/turkey.*deli|pechuga de pavo|pavofrio|turkey breast/i, ["turkey-breast.png", "turkey-breast.jpg", "sliced-turkey.png", "sliced-turkey.jpg"]],
  [/ground turkey/i, ["fresh-ground-turkey.jpg", "ground-turkey.jpg", "fresh-ground-beef.jpg"]],
  // Huevo
  [/egg white/i, ["egg-whites.jpg", "egg-white.jpg"]],
  [/hard-?boiled/i, ["hard-boiled-egg.png", "boiled-egg.jpg", "egg.png"]],
  // (?<!b) evita que "boeuf"/"bœuf" matchee "oeuf"
  [/\begg|huevo|(?<!b)(oeuf|œuf)/i, ["egg.png", "egg.jpg", "eggs.png"]],
  // Vacuno / cerdo
  [/beef jerky/i, ["beef-jerky.png", "beef-jerky.jpg"]],
  [/beef tenderloin/i, ["beef-tenderloin.png", "beef-tenderloin.jpg", "steak.png"]],
  [/ribeye|rib-eye/i, ["ribeye-raw.jpg", "rib-eye-steak.jpg", "steak.png"]],
  [/sirloin/i, ["sirloin-steak.jpg", "ribeye-raw.jpg", "beef-tenderloin.png"]],
  [/flank/i, ["flank-steak.jpg", "flank-steak.png", "steak.png"]],
  [/ground beef|stea[ck]k?.{0,3}hach|bifteck|boeuf 5|bœuf|pur boeuf|мляно/i, ["fresh-ground-beef.jpg", "ground-beef.png", "ground-beef.jpg"]],
  [/pork tenderloin|pork loin/i, ["pork-tenderloin-raw.png", "pork-tenderloin.jpg", "pork-loin.jpg"]],
  [/pork chop/i, ["pork-chops.jpg", "pork-chop.jpg", "raw-pork-chops.png"]],
  [/bacon/i, ["raw-bacon.png", "bacon.jpg", "cooked-bacon.jpg"]],
  [/\blard\b/i, ["lard.png", "lard.jpg", "shortening.jpg"]],
  [/lomo|fiambre|ham|jamb?on/i, ["sliced-ham.png", "sliced-ham.jpg", "ham.png", "ham.jpg"]],
  // Pescado / marisco
  [/nems/i, ["spring-rolls.png", "spring-rolls.jpg", "egg-rolls.jpg"]],
  [/smoked salmon|saumon fum|salm[oó]n.*fume?/i, ["smoked-salmon.png", "smoked-salmon.jpg", "salmon.png"]],
  [/salmon|saumon|salmón/i, ["salmon.png", "salmon.jpg", "salmon-fillet.jpg"]],
  [/tuna fresh|tuna.*steak/i, ["tuna-steak.png", "tuna-steak.jpg", "canned-tuna.png"]],
  [/tuna|atun|atún|thon|thunfisch/i, ["canned-tuna.png", "canned-tuna.jpg", "tuna-canned.png"]],
  [/sardine/i, ["sardines.png", "sardine.jpg", "canned-tuna.png"]],
  [/\bcod\b|morue/i, ["cod-fillet.jpg", "cod-fillets.jpg", "fish-fillet.jpg"]],
  [/tilapia/i, ["tilapia.png", "tilapia.jpg", "fish-fillet.jpg"]],
  [/sea bass/i, ["sea-bass.jpg", "seabass.jpg", "fish-fillet.jpg"]],
  [/shrimp|crevette|gamba|camar/i, ["shrimp.png", "shrimp.jpg", "cooked-shrimp.jpg"]],
  // Lácteos
  [/cottage/i, ["cottage-cheese.jpg", "cottage-cheese.png"]],
  [/greek|grec|grieg|grego|skyr|yaos/i, ["plain-yogurt.jpg", "greek-yogurt.png", "plain-greek-yogurt.jpg"]],
  [/yogur|yaourt|yogurt|ياغورت/i, ["plain-yogurt.jpg", "yogurt.png"]],
  [/cheddar/i, ["cheddar-cheese.png", "cheddar-cheese.jpg", "cheddar.jpg"]],
  [/mozzarella|galbani/i, ["mozzarella.png", "mozzarella.jpg", "fresh-mozzarella.png"]],
  [/feta/i, ["feta.png", "feta-cheese.jpg", "feta.jpg"]],
  [/parmesan/i, ["parmesan.jpg", "parmesan.png", "grated-parmesan.jpg"]],
  [/goat cheese/i, ["goat-cheese.jpg", "goat-cheese.png"]],
  [/ricotta/i, ["ricotta.png", "ricotta-cheese.jpg", "ricotta.jpg"]],
  [/provolone/i, ["provolone.jpg", "provolone-cheese.jpg", "cheddar-cheese.png"]],
  [/swiss cheese/i, ["swiss-cheese.jpg", "swiss-cheese.png", "cheddar-cheese.png"]],
  [/cream cheese|boursin/i, ["cream-cheese.png", "cream-cheese.jpg"]],
  [/sour cream/i, ["sour-cream.jpg", "sour-cream.png"]],
  [/whipped cream/i, ["whipped-cream.png", "whipped-cream.jpg"]],
  [/chocolate milk/i, ["chocolate-milk.png", "chocolate-milk.jpg", "milk.png"]],
  [/oat milk/i, ["oat-milk.png", "oat-milk.jpg", "milk.png"]],
  [/soy milk/i, ["soy-milk.jpg", "soy-milk.png", "milk.png"]],
  [/almond milk/i, ["almond-milk.png", "almond-milk.jpg", "milk.png"]],
  [/milk|leche/i, ["milk.png", "milk.jpg", "whole-milk.jpg"]],
  [/butter.*cacahu|peanut butter/i, ["peanut-butter.png", "peanut-butter.jpg"]],
  [/peanut|cacahu/i, ["peanuts.png", "peanuts.jpg", "peanuts-in-shell.jpg"]],
  [/almond butter/i, ["almond-butter.png", "almond-butter.jpg", "peanut-butter.png"]],
  [/ghee/i, ["ghee.png", "ghee.jpg", "butter.jpg"]],
  [/\bbutter\b|beurre/i, ["butter-sliced.jpg", "butter.jpg", "butter.png"]],
  // Frutos secos / semillas
  [/almond|almendra/i, ["almonds.jpg", "almonds.png"]],
  [/walnut|nuez|nusskern/i, ["walnuts.jpg", "walnuts.png", "walnut-halves.jpg"]],
  [/pecan/i, ["pecans.jpg", "pecans.png"]],
  [/cashew/i, ["cashews.jpg", "cashews.png"]],
  [/pistachio/i, ["pistachios.jpg", "pistachios.png"]],
  [/hazelnut/i, ["hazelnuts.jpg", "hazelnuts.png"]],
  [/macadamia/i, ["macadamia-nuts.jpg", "macadamias.jpg", "macadamia.jpg"]],
  [/brazil nut/i, ["brazil-nuts.jpg", "brazil-nuts.png"]],
  [/chia/i, ["chia-seeds.jpg", "chia-seeds.png"]],
  [/flaxseed oil|flax.*oil/i, ["flax-seed-oil.png", "flax-oil.png", "olive-oil.jpg"]],
  [/flaxseed/i, ["flax-seeds.png", "flaxseed.jpg", "flax-seeds.jpg"]],
  [/hemp seed/i, ["hemp-hearts.png", "hemp-hearts.jpg", "sunflower-seeds.jpg"]],
  [/pumpkin seed/i, ["pumpkin-seeds.jpg", "pumpkin-seeds.png"]],
  [/sunflower seed/i, ["sunflower-seeds.jpg", "sunflower-seeds.png"]],
  [/sesame oil/i, ["sesame-oil.png", "sesame-oil.jpg"]],
  [/tahini/i, ["tahini-paste.png", "tahini.jpg", "tahini.png"]],
  // Aceites
  [/olive oil|huile d.?olive|aceite de oliva|huile|hule|huill/i, ["olive-oil.jpg", "olive-oil.png"]],
  [/coconut oil|aceite de coco/i, ["coconut-oil.png", "coconut-oil.jpg", "olive-oil.jpg"]],
  [/avocado oil/i, ["avocado-oil.jpg", "avocado-oil.png", "olive-oil.jpg"]],
  // Frutas
  [/apple juice/i, ["apple-juice.jpg", "apple-juice.png"]],
  [/compote|applesauce|pom.?potes/i, ["applesauce.png", "applesauce.jpg", "apple.jpg"]],
  [/apple|pomme(?!s de terre)|manzana/i, ["apple.jpg", "red-delicious-apples.png", "apple.png"]],
  [/orange juice|jus d.?orange/i, ["orange-juice.jpg", "orange-juice.png"]],
  [/orange|naranja/i, ["orange.png", "orange.jpg", "oranges.jpg"]],
  [/banan|plátano/i, ["bananas.jpg", "banana.jpg", "banana.png"]],
  [/blueberr|myrtille|arándano|mirtillo/i, ["blueberries.jpg", "blueberries.png"]],
  [/strawberr|fraise|erdbeer|aardbei|fresa/i, ["strawberries.png", "strawberries.jpg", "strawberry.jpg"]],
  [/raspberr/i, ["raspberries.jpg", "raspberries.png"]],
  [/dried mango|mango.*(schnitze|getrocknet)|mangue.*(morceaux|tranches|moelleuse)/i, ["dried-mango.png", "dried-mango.jpg", "mango.jpg"]],
  [/mango|mangue/i, ["mango.jpg", "mango.png"]],
  [/avocado|avocat|aguacate/i, ["avocado.jpg", "avocado.png", "avocado-slices.png"]],
  [/grapefruit/i, ["grapefruit.png", "grapefruit.jpg"]],
  [/grape|raisin/i, ["red-grapes.jpg", "grapes.jpg", "grapes.png"]],
  [/watermelon/i, ["watermelon.png", "watermelon.jpg"]],
  [/pineapple|piña/i, ["pineapple.jpg", "pineapple.png"]],
  [/peach/i, ["peach.jpg", "peaches.png", "peach.png"]],
  [/pear/i, ["pear.jpg", "bosc-pears.jpg", "pear.png"]],
  [/plum/i, ["plums.jpg", "plum.jpg", "plums.png"]],
  [/kiwi/i, ["kiwi.jpg", "kiwi.png"]],
  [/cherr(y|ies)(?!.*tomato)/i, ["cherries.jpg", "cherries.png"]],
  [/papaya/i, ["papaya.jpg", "papaya.png"]],
  [/cantaloupe/i, ["cantaloupe.png", "cantaloupe.jpg", "melon.png"]],
  [/cranberry juice/i, ["cranberry-juice.png", "cranberry-juice.jpg"]],
  // Verduras
  [/cherry tomato|tomates? ceris|tomate cherry/i, ["cherry-tomatoes.png", "cherry-tomatoes.jpg"]],
  [/tomato paste|concentr[eé] de tomate|tomato.*paste/i, ["tomato-paste.png", "tomato-paste.jpg"]],
  [/chopped tomato|peeled tomato|polpa|tomater|tomates concass/i, ["canned-tomatoes.png", "diced-tomatoes.png", "tomato.png"]],
  [/tomato/i, ["tomato.png", "tomato.jpg", "roma-tomatoes.png"]],
  [/broccoli|brocolis/i, ["broccoli.jpg", "broccoli.png"]],
  [/spinach|épinard|epinard/i, ["spinach.jpg", "spinach.png"]],
  [/kale/i, ["kale.jpg", "kale.png"]],
  [/lettuce/i, ["romaine-lettuce.jpg", "lettuce.jpg", "iceberg-lettuce.jpg"]],
  [/cucumber|pepino/i, ["cucumber.jpg", "cucumber.png"]],
  [/zucchini|courgette/i, ["zucchini.jpg", "zucchini.png"]],
  [/eggplant/i, ["eggplant.png", "eggplant.jpg"]],
  [/asparagus/i, ["asparagus.png", "asparagus.jpg"]],
  [/carrot|carotte/i, ["sliced-carrot.png", "carrots.jpg", "carrots.png"]],
  [/bell pepper/i, ["red-bell-pepper.jpg", "bell-pepper.jpg", "red-bell-pepper.png"]],
  [/onion|oignon/i, ["brown-onion.png", "onion.jpg", "yellow-onion.png"]],
  [/garlic|ail\b/i, ["garlic.png", "garlic.jpg", "garlic-cloves.jpg"]],
  [/mushroom/i, ["mushrooms.png", "mushrooms.jpg", "mushrooms-white.jpg"]],
  [/cauliflower/i, ["cauliflower.jpg", "cauliflower.png"]],
  [/brussels?.?sprout/i, ["brussel-sprouts.jpg", "brussels-sprouts.jpg", "brussel-sprouts.png"]],
  [/cabbage|choux/i, ["cabbage.jpg", "green-cabbage.jpg", "cabbage.png"]],
  [/celery/i, ["celery.jpg", "celery.png"]],
  [/beet/i, ["beets.jpg", "beets.png", "beet.jpg"]],
  [/radish/i, ["radishes.jpg", "radishes.png", "radish.jpg"]],
  [/green bean|haricot/i, ["string-beans.jpg", "haricots-verts.jpg", "frozen-green-beans.png", "peas.png"]],
  [/green pea|peas\b|petits pois/i, ["peas.png", "green-peas.jpg", "peas.jpg"]],
  [/sweet corn|corn \(|maïs/i, ["corn.png", "sweet-corn.png", "corn-kernels.png"]],
  [/artichoke/i, ["artichokes.png", "artichoke.jpg", "artichokes.jpg"]],
  [/kimchi/i, ["kimchi.png", "kimchi.jpg"]],
  [/edamame/i, ["edamame.png", "edamame.jpg"]],
  [/coleslaw/i, ["coleslaw.jpg", "coleslaw.png", "cabbage.jpg"]],
  // Tubérculos / cereales / legumbres
  [/sweet potato.*(fries|hash|sticks)|crispy sweet/i, ["sweet-potato-fries.jpg", "french-fries.png", "sweet-potato.png"]],
  [/sweet potato|patate douce|batata/i, ["sweet-potato.png", "sweet-potato.jpg", "sweet-potatoes.png"]],
  [/mashed potato/i, ["mashed-potatoes-in-bowl.jpg", "mashed-potatoes.jpg", "potatoes-yukon-gold.png"]],
  [/fries|frites|wedges|rissol|country potatoes|grenaille|poêlée/i, ["fries.png", "steak-fries.jpg", "potato-wedges.jpg", "potatoes-yukon-gold.png"]],
  [/potato|patatas|pomme de terre/i, ["potatoes-yukon-gold.png", "potato.jpg", "russet-potato.jpg"]],
  [/rice cake/i, ["rice-cakes.jpg", "rice-cake.jpg", "rice-cakes.png"]],
  [/rice noodle/i, ["rice-noodles.jpg", "rice-noodles.png"]],
  [/brown rice|riz complet|arroz integral|basmati complet/i, ["uncooked-brown-rice.png", "brown-rice.jpg", "brown-rice.png"]],
  [/rice|riz|arroz|basmati/i, ["uncooked-white-rice.png", "rice.png", "white-rice.jpg"]],
  [/oat|avena|avoine|flocons/i, ["rolled-oats.jpg", "oats.png", "rolled-oats.png"]],
  [/quinoa/i, ["uncooked-quinoa.png", "quinoa.png", "cooked-quinoa.jpg"]],
  [/couscous/i, ["couscous.png", "couscous-cooked.jpg", "couscous.jpg"]],
  [/bulgur/i, ["bulgur.png", "bulgur-wheat.jpg", "bulgur.jpg"]],
  [/whole wheat (spaghetti|pasta)|integrale|vollkorn spaghetti/i, ["whole-wheat-spaghetti.jpg", "whole-wheat-pasta.jpg", "spaghetti.jpg"]],
  [/pasta|spaghetti|penne/i, ["spaghetti.jpg", "penne-pasta.jpg", "fusilli.jpg"]],
  [/lentil|lentille/i, ["lentils.jpg", "lentils-brown.jpg", "red-lentils.png", "green-lentils.png"]],
  [/black bean/i, ["black-beans.jpg", "black-beans.png"]],
  [/kidney bean/i, ["red-kidney-beans.jpg", "kidney-beans.jpg", "kidney-beans.png"]],
  [/chickpea|garbanzo/i, ["chickpeas.png", "chickpeas.jpg", "canned-chickpeas.png"]],
  [/pinto bean/i, ["pinto-beans.jpg", "pinto-beans.png"]],
  [/navy bean/i, ["navy-beans.jpg", "navy-beans.png", "white-beans.jpg"]],
  [/lima bean/i, ["lima-beans.png", "butter-beans.jpg", "chickpeas.png"]],
  [/refried bean/i, ["refried-beans.jpg", "refried-beans.png"]],
  [/soybean/i, ["soybeans.jpg", "soybeans.png", "edamame.png"]],
  // Pan / tortillas / snacks
  [/whole wheat bread|pain complet/i, ["whole-wheat-bread.jpg", "whole-wheat-bread.png", "bread.jpg"]],
  [/sourdough/i, ["sourdough-bread.jpg", "crusty-bread.jpg", "bread.jpg"]],
  [/white bread/i, ["white-bread.jpg", "white-bread.png", "bread.jpg"]],
  [/bagel/i, ["bagel.png", "bagels.jpg", "white-bread.jpg"]],
  [/english muffin/i, ["english-muffin.png", "english-muffins.png", "white-bread.jpg"]],
  [/corn tortilla|tortillas? (white|yellow)|white corn tortilla/i, ["corn-tortillas.png", "corn-tortillas.jpg", "tortillas.png"]],
  [/flour tortilla/i, ["flour-tortilla.jpg", "flour-tortillas.png", "tortillas.png"]],
  [/granola bar|barre|crunchy|grany|sweet & salty|graze/i, ["energy-bar.jpg", "granola-bar.png", "granola.jpg"]],
  [/granola/i, ["granola.jpg", "granola.png"]],
  [/trail mix/i, ["trail-mix.jpg", "trail-mix.png", "mixed-nuts.png"]],
  [/popcorn/i, ["popcorn.png", "popcorn.jpg"]],
  [/chips/i, ["potato-chips.jpg", "potato-chips.png", "chips.jpg"]],
  // Dulces / condimentos / otros
  [/dark|noir|cacao|chocolade|chocolat/i, ["dark-chocolate-pieces.jpg", "dark-chocolate.jpg", "dark-chocolate-bar.jpg"]],
  [/honey|miel/i, ["honey.png", "honey.jpg"]],
  [/maple/i, ["maple-syrup.png", "maple-syrup.jpg"]],
  [/confiture|confettura|jam\b|sirop de fraise/i, ["strawberry-jam.png", "jam.jpg", "strawberry-jelly.jpg"]],
  [/hummus/i, ["hummus.png", "hummus.jpg"]],
  [/firm tofu|silken tofu|tofu/i, ["tofu.png", "firm-tofu.jpg", "tofu.jpg"]],
  [/tempeh/i, ["tempeh.png", "tempeh.jpg"]],
  [/seitan/i, ["seitan.png", "seitan.jpg"]],
  [/ketchup/i, ["ketchup.png", "ketchup.jpg"]],
  [/mustard/i, ["mustard.png", "dijon-mustard.jpg", "mustard.jpg"]],
  [/soy sauce/i, ["soy-sauce.jpg", "soy-sauce.png", "dark-soy-sauce.jpg"]],
  [/hot sauce/i, ["hot-sauce-or-tabasco.png", "hot-sauce.jpg", "hot-sauce.png"]],
  [/salsa/i, ["salsa.png", "salsa.jpg"]],
  [/balsamic/i, ["balsamic-vinegar.png", "balsamic-vinegar.jpg"]],
  [/coconut water/i, ["coconut-water.png", "coconut-water.jpg"]],
  [/shredded coconut|coconut meat/i, ["coconut-flakes.jpg", "shredded-coconut.jpg", "coconut.jpg"]],
  [/foie de morue/i, ["cod-liver-oil.jpg", "canned-sardines.jpg", "sardines.png"]],
];

function resolveCandidates(name, nameEs) {
  const haystack = `${name ?? ""} ${nameEs ?? ""}`;
  for (const [re, candidates] of RULES) {
    if (re.test(haystack)) return candidates;
  }
  return null;
}

// Verificación HEAD con caché por archivo
const verified = new Map(); // filename → boolean
async function existsOnCdn(file) {
  if (verified.has(file)) return verified.get(file);
  try {
    const r = await fetch(`${CDN}/${file}`, { method: "HEAD" });
    verified.set(file, r.ok);
    return r.ok;
  } catch {
    verified.set(file, false);
    return false;
  }
}

// 1. Cargar alimentos sin imagen
const foods = [];
for (let from = 0; ; from += 1000) {
  const { data, error } = await supabase
    .from("foods")
    .select("id, name, name_es")
    .is("image_url", null)
    .order("name")
    .range(from, from + 999);
  if (error) throw error;
  foods.push(...(data ?? []));
  if (!data || data.length < 1000) break;
}

// 2. Resolver archivo por alimento (verificando candidatos en orden)
const matches = []; // {id, name, file}
const unmatched = [];
for (const f of foods) {
  const candidates = resolveCandidates(f.name, f.name_es);
  if (!candidates) {
    unmatched.push(f.name);
    continue;
  }
  let chosen = null;
  for (const c of candidates) {
    if (await existsOnCdn(c)) {
      chosen = c;
      break;
    }
  }
  if (chosen) matches.push({ id: f.id, name: f.name, file: chosen });
  else unmatched.push(`${f.name} (candidatos 404: ${candidates.join(", ")})`);
}

console.log(`Alimentos sin foto: ${foods.length}`);
console.log(`Con imagen verificada: ${matches.length} | sin match: ${unmatched.length}`);
console.log(`Archivos únicos a copiar: ${new Set(matches.map((m) => m.file)).size}`);

if (!APPLY) {
  console.log("\nDRY-RUN (usa --apply). Muestra de matches:");
  for (const m of matches.slice(0, 20)) console.log(`  ${m.name} → ${m.file}`);
  console.log("\nSin match (muestra):");
  for (const u of unmatched.slice(0, 25)) console.log(`  ✗ ${u}`);
  writeFileSync(`food-images-unmatched-${Date.now()}.json`, JSON.stringify(unmatched, null, 2));
  process.exit(0);
}

// 3. Crear bucket público `foods` si no existe
{
  const { error } = await supabase.storage.createBucket("foods", { public: true });
  if (error && !/already exists/i.test(error.message)) throw error;
}

// 4. Descargar del CDN y subir a Storage (dedupe por archivo)
const uniqueFiles = [...new Set(matches.map((m) => m.file))];
const uploaded = new Set();
for (const file of uniqueFiles) {
  const r = await fetch(`${CDN}/${file}`);
  if (!r.ok) continue;
  const buf = Buffer.from(await r.arrayBuffer());
  const contentType = file.endsWith(".png") ? "image/png" : "image/jpeg";
  const { error } = await supabase.storage.from("foods").upload(file, buf, { contentType, upsert: true });
  if (!error) uploaded.add(file);
  else console.error(`upload ${file}: ${error.message}`);
}
console.log(`Subidos a Storage: ${uploaded.size}/${uniqueFiles.length}`);

// 5. Actualizar BD solo con subidas confirmadas + rollback
const updates = matches.filter((m) => uploaded.has(m.file));
writeFileSync(
  `food-images-rollback-${Date.now()}.json`,
  JSON.stringify(updates.map(({ id }) => ({ id, image_url_prev: null })), null, 2)
);

let done = 0;
let errors = 0;
for (const u of updates) {
  const { error } = await supabase
    .from("foods")
    .update({ image_url: `${STORAGE_BASE}/${u.file}` })
    .eq("id", u.id);
  if (error) errors++;
  else done++;
  if (done % 100 === 0) console.log(`  ${done}/${updates.length}…`);
}
console.log(`BD actualizada: ${done} alimentos, ${errors} errores.`);
