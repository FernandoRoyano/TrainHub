/**
 * Mappings for the food database import from Open Food Facts.
 * Used by the import script (import-foods.ts) and seed script (seed-foods.ts).
 */

// ---------- Category Queries ----------

export interface FoodCategoryQuery {
  query: string;
  category: string;
  maxResults: number;
}

/**
 * Search queries for the Open Food Facts API.
 * Each entry maps a search term to our internal food category.
 */
export const FOOD_CATEGORY_QUERIES: FoodCategoryQuery[] = [
  // ── Protein ──
  { query: "chicken-breast", category: "protein", maxResults: 20 },
  { query: "chicken-thigh", category: "protein", maxResults: 10 },
  { query: "ground-beef", category: "protein", maxResults: 15 },
  { query: "beef-steaks", category: "protein", maxResults: 10 },
  { query: "salmon", category: "protein", maxResults: 15 },
  { query: "tuna", category: "protein", maxResults: 15 },
  { query: "shrimps", category: "protein", maxResults: 10 },
  { query: "eggs", category: "protein", maxResults: 15 },
  { query: "turkey-breast", category: "protein", maxResults: 10 },
  { query: "pork-loin", category: "protein", maxResults: 10 },
  { query: "tilapia", category: "protein", maxResults: 10 },
  { query: "cod", category: "protein", maxResults: 10 },
  { query: "sardines", category: "protein", maxResults: 10 },

  // ── Dairy ──
  { query: "whole-milk", category: "dairy", maxResults: 10 },
  { query: "greek-yogurts", category: "dairy", maxResults: 15 },
  { query: "cottage-cheeses", category: "dairy", maxResults: 10 },
  { query: "cheddar", category: "dairy", maxResults: 10 },
  { query: "mozzarella", category: "dairy", maxResults: 10 },
  { query: "skyr", category: "dairy", maxResults: 10 },

  // ── Grains ──
  { query: "white-rice", category: "grain", maxResults: 15 },
  { query: "brown-rice", category: "grain", maxResults: 10 },
  { query: "rolled-oats", category: "grain", maxResults: 15 },
  { query: "whole-wheat-pasta", category: "grain", maxResults: 10 },
  { query: "whole-wheat-bread", category: "grain", maxResults: 10 },
  { query: "quinoa", category: "grain", maxResults: 10 },
  { query: "sweet-potatoes", category: "grain", maxResults: 10 },
  { query: "potatoes", category: "grain", maxResults: 10 },
  { query: "corn-tortillas", category: "grain", maxResults: 10 },

  // ── Vegetables ──
  { query: "broccoli", category: "vegetable", maxResults: 10 },
  { query: "spinach", category: "vegetable", maxResults: 10 },
  { query: "tomatoes", category: "vegetable", maxResults: 10 },
  { query: "carrots", category: "vegetable", maxResults: 10 },
  { query: "peppers", category: "vegetable", maxResults: 10 },
  { query: "asparagus", category: "vegetable", maxResults: 10 },
  { query: "green-beans", category: "vegetable", maxResults: 10 },
  { query: "zucchini", category: "vegetable", maxResults: 10 },

  // ── Fruits ──
  { query: "bananas", category: "fruit", maxResults: 10 },
  { query: "apples", category: "fruit", maxResults: 10 },
  { query: "strawberries", category: "fruit", maxResults: 10 },
  { query: "blueberries", category: "fruit", maxResults: 10 },
  { query: "avocados", category: "fruit", maxResults: 10 },
  { query: "oranges", category: "fruit", maxResults: 10 },
  { query: "mangoes", category: "fruit", maxResults: 10 },

  // ── Legumes ──
  { query: "lentils", category: "legume", maxResults: 10 },
  { query: "chickpeas", category: "legume", maxResults: 10 },
  { query: "black-beans", category: "legume", maxResults: 10 },
  { query: "kidney-beans", category: "legume", maxResults: 10 },

  // ── Nuts & Seeds ──
  { query: "almonds", category: "nut_seed", maxResults: 10 },
  { query: "peanut-butter", category: "nut_seed", maxResults: 10 },
  { query: "walnuts", category: "nut_seed", maxResults: 10 },
  { query: "chia-seeds", category: "nut_seed", maxResults: 10 },
  { query: "flaxseeds", category: "nut_seed", maxResults: 10 },

  // ── Oils & Fats ──
  { query: "olive-oils", category: "oil_fat", maxResults: 10 },
  { query: "coconut-oil", category: "oil_fat", maxResults: 5 },
  { query: "butter", category: "oil_fat", maxResults: 10 },

  // ── Supplements ──
  { query: "whey-protein", category: "supplement", maxResults: 15 },
  { query: "casein-protein", category: "supplement", maxResults: 10 },
  { query: "creatine", category: "supplement", maxResults: 5 },

  // ── Beverages ──
  { query: "orange-juice", category: "beverage", maxResults: 5 },
  { query: "coconut-water", category: "beverage", maxResults: 5 },

  // ── Snacks ──
  { query: "rice-cakes", category: "snack", maxResults: 10 },
  { query: "granola-bars", category: "snack", maxResults: 10 },
  { query: "dark-chocolate", category: "snack", maxResults: 10 },
];

// ---------- Name Overrides ----------

/**
 * Bilingual name overrides for common fitness foods.
 * Keyed by a slug derived from the Open Food Facts product name or search query.
 * Used when OFF returns brand names instead of generic names.
 */
export const FOOD_NAME_OVERRIDES: Record<string, { en: string; es: string }> = {
  // ── Protein: Poultry ──
  "chicken-breast": { en: "Chicken Breast", es: "Pechuga de Pollo" },
  "chicken-breast-raw": { en: "Chicken Breast (Raw)", es: "Pechuga de Pollo (Cruda)" },
  "chicken-breast-cooked": { en: "Chicken Breast (Cooked)", es: "Pechuga de Pollo (Cocida)" },
  "chicken-breast-grilled": { en: "Grilled Chicken Breast", es: "Pechuga de Pollo a la Plancha" },
  "chicken-thigh": { en: "Chicken Thigh", es: "Muslo de Pollo" },
  "chicken-thigh-raw": { en: "Chicken Thigh (Raw)", es: "Muslo de Pollo (Crudo)" },
  "chicken-thigh-boneless": { en: "Boneless Chicken Thigh", es: "Muslo de Pollo Deshuesado" },
  "chicken-drumstick": { en: "Chicken Drumstick", es: "Pierna de Pollo" },
  "chicken-wing": { en: "Chicken Wing", es: "Ala de Pollo" },
  "ground-chicken": { en: "Ground Chicken", es: "Pollo Molido" },
  "turkey-breast": { en: "Turkey Breast", es: "Pechuga de Pavo" },
  "turkey-breast-deli": { en: "Turkey Breast Deli Slices", es: "Pechuga de Pavo en Rebanadas" },
  "ground-turkey": { en: "Ground Turkey", es: "Pavo Molido" },

  // ── Protein: Beef ──
  "ground-beef": { en: "Ground Beef", es: "Carne Molida de Res" },
  "ground-beef-90-10": { en: "Ground Beef 90/10", es: "Carne Molida de Res 90/10" },
  "ground-beef-80-20": { en: "Ground Beef 80/20", es: "Carne Molida de Res 80/20" },
  "sirloin-steak": { en: "Sirloin Steak", es: "Bistec de Sirloin" },
  "ribeye-steak": { en: "Ribeye Steak", es: "Bistec Ribeye" },
  "flank-steak": { en: "Flank Steak", es: "Bistec de Falda" },
  "beef-tenderloin": { en: "Beef Tenderloin", es: "Lomo de Res" },
  "beef-jerky": { en: "Beef Jerky", es: "Cecina de Res" },

  // ── Protein: Pork ──
  "pork-loin": { en: "Pork Loin", es: "Lomo de Cerdo" },
  "pork-chop": { en: "Pork Chop", es: "Chuleta de Cerdo" },
  "pork-tenderloin": { en: "Pork Tenderloin", es: "Solomillo de Cerdo" },
  "bacon": { en: "Bacon", es: "Tocino" },
  "ham": { en: "Ham", es: "Jamón" },

  // ── Protein: Seafood ──
  "salmon": { en: "Salmon", es: "Salmón" },
  "salmon-fillet": { en: "Salmon Fillet", es: "Filete de Salmón" },
  "smoked-salmon": { en: "Smoked Salmon", es: "Salmón Ahumado" },
  "tuna": { en: "Tuna", es: "Atún" },
  "tuna-canned-water": { en: "Tuna Canned in Water", es: "Atún en Lata al Agua" },
  "tuna-canned-oil": { en: "Tuna Canned in Oil", es: "Atún en Lata al Aceite" },
  "tuna-fresh": { en: "Fresh Tuna Steak", es: "Filete de Atún Fresco" },
  "shrimp": { en: "Shrimp", es: "Camarones" },
  "cod": { en: "Cod", es: "Bacalao" },
  "tilapia": { en: "Tilapia", es: "Tilapia" },
  "sardines": { en: "Sardines", es: "Sardinas" },
  "sardines-canned": { en: "Sardines Canned in Oil", es: "Sardinas en Lata al Aceite" },
  "sea-bass": { en: "Sea Bass", es: "Lubina" },
  "mahi-mahi": { en: "Mahi-Mahi", es: "Dorado" },

  // ── Protein: Eggs ──
  "whole-egg": { en: "Whole Egg", es: "Huevo Entero" },
  "egg-whites": { en: "Egg Whites", es: "Claras de Huevo" },
  "hard-boiled-egg": { en: "Hard-Boiled Egg", es: "Huevo Duro" },

  // ── Protein: Plant-based ──
  "tofu-firm": { en: "Firm Tofu", es: "Tofu Firme" },
  "tofu-silken": { en: "Silken Tofu", es: "Tofu Sedoso" },
  "tempeh": { en: "Tempeh", es: "Tempeh" },
  "seitan": { en: "Seitan", es: "Seitán" },
  "tvp": { en: "Textured Vegetable Protein", es: "Proteína Vegetal Texturizada" },

  // ── Dairy ──
  "whole-milk": { en: "Whole Milk", es: "Leche Entera" },
  "skim-milk": { en: "Skim Milk", es: "Leche Descremada" },
  "2-percent-milk": { en: "2% Milk", es: "Leche al 2%" },
  "greek-yogurt": { en: "Greek Yogurt", es: "Yogur Griego" },
  "greek-yogurt-plain": { en: "Plain Greek Yogurt", es: "Yogur Griego Natural" },
  "greek-yogurt-nonfat": { en: "Nonfat Greek Yogurt", es: "Yogur Griego Descremado" },
  "regular-yogurt": { en: "Regular Yogurt", es: "Yogur Regular" },
  "cottage-cheese": { en: "Cottage Cheese", es: "Queso Cottage" },
  "cottage-cheese-lowfat": { en: "Low-Fat Cottage Cheese", es: "Queso Cottage Bajo en Grasa" },
  "cheddar": { en: "Cheddar Cheese", es: "Queso Cheddar" },
  "mozzarella": { en: "Mozzarella Cheese", es: "Queso Mozzarella" },
  "parmesan": { en: "Parmesan Cheese", es: "Queso Parmesano" },
  "cream-cheese": { en: "Cream Cheese", es: "Queso Crema" },
  "ricotta": { en: "Ricotta Cheese", es: "Queso Ricotta" },
  "skyr": { en: "Skyr", es: "Skyr" },
  "whipped-cream": { en: "Whipped Cream", es: "Crema Batida" },
  "sour-cream": { en: "Sour Cream", es: "Crema Agria" },
  "butter": { en: "Butter", es: "Mantequilla" },
  "ghee": { en: "Ghee (Clarified Butter)", es: "Ghee (Mantequilla Clarificada)" },

  // ── Grains & Starches ──
  "white-rice": { en: "White Rice", es: "Arroz Blanco" },
  "white-rice-cooked": { en: "White Rice (Cooked)", es: "Arroz Blanco (Cocido)" },
  "brown-rice": { en: "Brown Rice", es: "Arroz Integral" },
  "brown-rice-cooked": { en: "Brown Rice (Cooked)", es: "Arroz Integral (Cocido)" },
  "jasmine-rice": { en: "Jasmine Rice", es: "Arroz Jazmín" },
  "basmati-rice": { en: "Basmati Rice", es: "Arroz Basmati" },
  "rolled-oats": { en: "Rolled Oats", es: "Avena en Hojuelas" },
  "instant-oats": { en: "Instant Oats", es: "Avena Instantánea" },
  "steel-cut-oats": { en: "Steel-Cut Oats", es: "Avena Cortada" },
  "whole-wheat-pasta": { en: "Whole Wheat Pasta", es: "Pasta Integral" },
  "white-pasta": { en: "White Pasta", es: "Pasta Blanca" },
  "whole-wheat-bread": { en: "Whole Wheat Bread", es: "Pan Integral" },
  "white-bread": { en: "White Bread", es: "Pan Blanco" },
  "sourdough-bread": { en: "Sourdough Bread", es: "Pan de Masa Madre" },
  "quinoa": { en: "Quinoa", es: "Quinoa" },
  "quinoa-cooked": { en: "Quinoa (Cooked)", es: "Quinoa (Cocida)" },
  "sweet-potato": { en: "Sweet Potato", es: "Camote" },
  "sweet-potato-cooked": { en: "Sweet Potato (Cooked)", es: "Camote (Cocido)" },
  "potato": { en: "Potato", es: "Papa" },
  "potato-boiled": { en: "Potato (Boiled)", es: "Papa (Hervida)" },
  "corn-tortilla": { en: "Corn Tortilla", es: "Tortilla de Maíz" },
  "flour-tortilla": { en: "Flour Tortilla", es: "Tortilla de Harina" },
  "couscous": { en: "Couscous", es: "Cuscús" },
  "bulgur": { en: "Bulgur Wheat", es: "Trigo Bulgur" },
  "granola": { en: "Granola", es: "Granola" },
  "rice-noodles": { en: "Rice Noodles", es: "Fideos de Arroz" },

  // ── Vegetables ──
  "broccoli": { en: "Broccoli", es: "Brócoli" },
  "spinach": { en: "Spinach", es: "Espinaca" },
  "spinach-raw": { en: "Spinach (Raw)", es: "Espinaca (Cruda)" },
  "spinach-cooked": { en: "Spinach (Cooked)", es: "Espinaca (Cocida)" },
  "tomato": { en: "Tomato", es: "Tomate" },
  "cherry-tomatoes": { en: "Cherry Tomatoes", es: "Tomates Cherry" },
  "carrot": { en: "Carrot", es: "Zanahoria" },
  "bell-pepper": { en: "Bell Pepper", es: "Pimiento" },
  "asparagus": { en: "Asparagus", es: "Espárrago" },
  "green-beans": { en: "Green Beans", es: "Ejotes" },
  "zucchini": { en: "Zucchini", es: "Calabacín" },
  "cauliflower": { en: "Cauliflower", es: "Coliflor" },
  "cucumber": { en: "Cucumber", es: "Pepino" },
  "lettuce": { en: "Lettuce", es: "Lechuga" },
  "kale": { en: "Kale", es: "Col Rizada" },
  "onion": { en: "Onion", es: "Cebolla" },
  "mushrooms": { en: "Mushrooms", es: "Champiñones" },
  "eggplant": { en: "Eggplant", es: "Berenjena" },
  "cabbage": { en: "Cabbage", es: "Repollo" },
  "celery": { en: "Celery", es: "Apio" },
  "brussels-sprouts": { en: "Brussels Sprouts", es: "Coles de Bruselas" },
  "artichoke": { en: "Artichoke", es: "Alcachofa" },
  "beets": { en: "Beets", es: "Remolacha" },
  "corn": { en: "Corn", es: "Maíz" },

  // ── Fruits ──
  "banana": { en: "Banana", es: "Plátano" },
  "apple": { en: "Apple", es: "Manzana" },
  "strawberry": { en: "Strawberry", es: "Fresa" },
  "blueberry": { en: "Blueberry", es: "Arándano" },
  "avocado": { en: "Avocado", es: "Aguacate" },
  "orange": { en: "Orange", es: "Naranja" },
  "mango": { en: "Mango", es: "Mango" },
  "pineapple": { en: "Pineapple", es: "Piña" },
  "watermelon": { en: "Watermelon", es: "Sandía" },
  "grapes": { en: "Grapes", es: "Uvas" },
  "kiwi": { en: "Kiwi", es: "Kiwi" },
  "pear": { en: "Pear", es: "Pera" },
  "peach": { en: "Peach", es: "Durazno" },
  "papaya": { en: "Papaya", es: "Papaya" },
  "raspberries": { en: "Raspberries", es: "Frambuesas" },
  "cherries": { en: "Cherries", es: "Cerezas" },
  "plum": { en: "Plum", es: "Ciruela" },
  "coconut-fresh": { en: "Fresh Coconut", es: "Coco Fresco" },
  "dried-mango": { en: "Dried Mango", es: "Mango Deshidratado" },
  "raisins": { en: "Raisins", es: "Pasas" },

  // ── Legumes ──
  "lentils": { en: "Lentils", es: "Lentejas" },
  "lentils-cooked": { en: "Lentils (Cooked)", es: "Lentejas (Cocidas)" },
  "chickpeas": { en: "Chickpeas", es: "Garbanzos" },
  "chickpeas-cooked": { en: "Chickpeas (Cooked)", es: "Garbanzos (Cocidos)" },
  "black-beans": { en: "Black Beans", es: "Frijoles Negros" },
  "black-beans-cooked": { en: "Black Beans (Cooked)", es: "Frijoles Negros (Cocidos)" },
  "kidney-beans": { en: "Kidney Beans", es: "Frijoles Rojos" },
  "edamame": { en: "Edamame", es: "Edamame" },
  "peas": { en: "Green Peas", es: "Chícharos" },
  "soybeans": { en: "Soybeans", es: "Soya" },
  "hummus": { en: "Hummus", es: "Hummus" },

  // ── Nuts & Seeds ──
  "almonds": { en: "Almonds", es: "Almendras" },
  "walnuts": { en: "Walnuts", es: "Nueces" },
  "peanuts": { en: "Peanuts", es: "Cacahuates" },
  "peanut-butter": { en: "Peanut Butter", es: "Crema de Cacahuate" },
  "almond-butter": { en: "Almond Butter", es: "Crema de Almendra" },
  "cashews": { en: "Cashews", es: "Anacardos" },
  "chia-seeds": { en: "Chia Seeds", es: "Semillas de Chía" },
  "flaxseeds": { en: "Flaxseeds", es: "Semillas de Linaza" },
  "sunflower-seeds": { en: "Sunflower Seeds", es: "Semillas de Girasol" },
  "pumpkin-seeds": { en: "Pumpkin Seeds", es: "Semillas de Calabaza" },
  "pistachios": { en: "Pistachios", es: "Pistachos" },
  "macadamia": { en: "Macadamia Nuts", es: "Nueces de Macadamia" },
  "hazelnuts": { en: "Hazelnuts", es: "Avellanas" },
  "tahini": { en: "Tahini", es: "Tahini" },
  "coconut-shredded": { en: "Shredded Coconut", es: "Coco Rallado" },
  "trail-mix": { en: "Trail Mix", es: "Mix de Frutos Secos" },

  // ── Oils & Fats ──
  "olive-oil": { en: "Olive Oil", es: "Aceite de Oliva" },
  "extra-virgin-olive-oil": { en: "Extra Virgin Olive Oil", es: "Aceite de Oliva Extra Virgen" },
  "coconut-oil": { en: "Coconut Oil", es: "Aceite de Coco" },
  "avocado-oil": { en: "Avocado Oil", es: "Aceite de Aguacate" },
  "lard": { en: "Lard", es: "Manteca de Cerdo" },

  // ── Supplements ──
  "whey-protein-concentrate": { en: "Whey Protein Concentrate", es: "Proteína de Suero Concentrada" },
  "whey-protein-isolate": { en: "Whey Protein Isolate", es: "Proteína de Suero Aislada" },
  "casein-protein": { en: "Casein Protein", es: "Proteína de Caseína" },
  "plant-protein": { en: "Plant Protein Blend", es: "Proteína Vegetal" },
  "creatine-monohydrate": { en: "Creatine Monohydrate", es: "Creatina Monohidratada" },
  "bcaa-powder": { en: "BCAA Powder", es: "BCAA en Polvo" },
  "mass-gainer": { en: "Mass Gainer", es: "Ganador de Masa" },
  "pre-workout": { en: "Pre-Workout", es: "Pre-Entreno" },
  "collagen-peptides": { en: "Collagen Peptides", es: "Péptidos de Colágeno" },

  // ── Beverages ──
  "orange-juice": { en: "Orange Juice", es: "Jugo de Naranja" },
  "coconut-water": { en: "Coconut Water", es: "Agua de Coco" },
  "almond-milk": { en: "Almond Milk (Unsweetened)", es: "Leche de Almendra (Sin Azúcar)" },
  "oat-milk": { en: "Oat Milk", es: "Leche de Avena" },
  "soy-milk": { en: "Soy Milk", es: "Leche de Soya" },
  "protein-shake": { en: "Protein Shake", es: "Batido de Proteína" },

  // ── Snacks ──
  "rice-cakes": { en: "Rice Cakes", es: "Tortitas de Arroz" },
  "dark-chocolate": { en: "Dark Chocolate 70%", es: "Chocolate Negro 70%" },
  "granola-bar": { en: "Granola Bar", es: "Barra de Granola" },
  "protein-bar": { en: "Protein Bar", es: "Barra de Proteína" },

  // ── Condiments ──
  "honey": { en: "Honey", es: "Miel" },
  "maple-syrup": { en: "Maple Syrup", es: "Jarabe de Arce" },
  "soy-sauce": { en: "Soy Sauce", es: "Salsa de Soya" },
  "hot-sauce": { en: "Hot Sauce", es: "Salsa Picante" },
  "balsamic-vinegar": { en: "Balsamic Vinegar", es: "Vinagre Balsámico" },
  "mustard": { en: "Mustard", es: "Mostaza" },
  "ketchup": { en: "Ketchup", es: "Kétchup" },
  "salsa": { en: "Salsa", es: "Salsa" },
  "mayonnaise": { en: "Mayonnaise", es: "Mayonesa" },
  "guacamole": { en: "Guacamole", es: "Guacamole" },
};
