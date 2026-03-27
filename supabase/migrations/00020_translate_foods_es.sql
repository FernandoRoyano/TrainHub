-- Translate food names to Spanish (name_es)
-- Strategy:
--   1. Foods already in Spanish → copy name to name_es
--   2. Common English foods → direct translation
--   3. French/German/other → translate common ones
--   4. Branded/unknown → keep original name

-- First: set name_es = name for foods that are already in Spanish
UPDATE foods SET name_es = name WHERE name_es IS NULL AND (
  name ILIKE 'Arroz%' OR name ILIKE 'Atún%' OR name ILIKE 'Atun%' OR
  name ILIKE 'Almendra%' OR name ILIKE 'Aceite%' OR name ILIKE 'Copos%' OR
  name ILIKE 'Yogur%' OR name ILIKE 'Naranjas%' OR name ILIKE 'Nuez%' OR
  name ILIKE 'Filete%' OR name ILIKE 'Fiambre%' OR name ILIKE 'PATATAS%' OR
  name ILIKE 'agua de%' OR name ILIKE 'Batata%'
);

-- English protein translations
UPDATE foods SET name_es = CASE
  WHEN name = 'Chicken Breast (Raw)' THEN 'Pechuga de Pollo (Cruda)'
  WHEN name = 'Chicken Breast (Cooked)' THEN 'Pechuga de Pollo (Cocinada)'
  WHEN name = 'Chicken Thigh (Raw)' THEN 'Muslo de Pollo (Crudo)'
  WHEN name = 'Chicken Thigh (Cooked)' THEN 'Muslo de Pollo (Cocinado)'
  WHEN name = 'Chicken Drumstick' THEN 'Contramuslo de Pollo'
  WHEN name = 'Chicken Wing (Raw)' THEN 'Ala de Pollo (Cruda)'
  WHEN name = 'Ground Chicken' THEN 'Pollo Molido'
  WHEN name = 'Turkey Breast' THEN 'Pechuga de Pavo'
  WHEN name = 'Ground Turkey (93/7)' THEN 'Pavo Molido (93/7)'
  WHEN name = 'Ground Beef (90/10)' THEN 'Carne Molida de Ternera (90/10)'
  WHEN name = 'Ground Beef (80/20)' THEN 'Carne Molida de Ternera (80/20)'
  WHEN name = 'Extra Lean Ground Beef' THEN 'Carne Molida Extra Magra'
  WHEN name = 'Beef Tenderloin' THEN 'Solomillo de Ternera'
  WHEN name = 'Beef Jerky' THEN 'Cecina de Ternera'
  WHEN name = 'Pork Chop' THEN 'Chuleta de Cerdo'
  WHEN name = 'Pork Tenderloin' THEN 'Solomillo de Cerdo'
  WHEN name = 'Pork Loin (Cooked)' THEN 'Lomo de Cerdo (Cocinado)'
  WHEN name = 'Bacon' THEN 'Bacon'
  WHEN name = 'Ham (Deli)' THEN 'Jamón York'
  WHEN name = 'Lamb (Leg, Roasted)' THEN 'Pierna de Cordero (Asada)'
  WHEN name = 'Salmon (Wild, Cooked)' THEN 'Salmón Salvaje (Cocinado)'
  WHEN name = 'Salmon (Farmed, Cooked)' THEN 'Salmón de Piscifactoría (Cocinado)'
  WHEN name = 'Tuna (Canned in Water)' THEN 'Atún en Lata (al Natural)'
  WHEN name = 'Tuna (Fresh, Cooked)' THEN 'Atún Fresco (Cocinado)'
  WHEN name = 'Cod' THEN 'Bacalao'
  WHEN name = 'Tilapia' THEN 'Tilapia'
  WHEN name = 'Shrimp (Cooked)' THEN 'Gambas (Cocinadas)'
  WHEN name = 'Sardines (Canned)' THEN 'Sardinas (en Lata)'
  WHEN name = 'Egg (Whole, Large)' THEN 'Huevo Entero (Grande)'
  WHEN name = 'Egg Whites' THEN 'Claras de Huevo'
  WHEN name = 'Tofu (Firm)' THEN 'Tofu (Firme)'
  WHEN name = 'Tempeh' THEN 'Tempeh'
  WHEN name = 'Seitan' THEN 'Seitán'
  WHEN name = 'Venison' THEN 'Venado'
  WHEN name = 'Bison (Ground)' THEN 'Bisonte (Molido)'
  WHEN name = 'Duck Breast' THEN 'Pechuga de Pato'
  WHEN name = 'Chicken Thighs' THEN 'Muslos de Pollo'
  WHEN name = 'Chunk Chicken Breast' THEN 'Trozos de Pechuga de Pollo'
  WHEN name = 'Chargrilled Chicken Breast Slices' THEN 'Lonchas de Pechuga de Pollo a la Parrilla'
  ELSE name
END
WHERE name_es IS NULL AND category = 'protein' AND name NOT LIKE '%poulet%' AND name NOT LIKE '%œuf%' AND name NOT LIKE '%Dinde%' AND name NOT LIKE '%Crevette%' AND name NOT LIKE '%bœuf%' AND name NOT LIKE '%porc%' AND name NOT LIKE '%Atún%' AND name NOT LIKE '%Atun%' AND name NOT LIKE '%filet%' AND name NOT LIKE '%Filet%';

-- French protein → Spanish
UPDATE foods SET name_es = CASE
  WHEN name ILIKE '%filet de poulet%' THEN 'Filete de Pollo'
  WHEN name ILIKE '%cuisse de poulet%' OR name ILIKE '%cuisses de poulet%' THEN 'Muslo de Pollo'
  WHEN name ILIKE '%escalope%poulet%' THEN 'Escalope de Pollo'
  WHEN name ILIKE '%émincé%poulet%' OR name ILIKE '%emincé%poulet%' OR name ILIKE '%Emincés%poulet%' THEN 'Tiras de Pollo'
  WHEN name ILIKE '%blanc de dinde%' THEN 'Pechuga de Pavo'
  WHEN name ILIKE '%crevette%' THEN 'Gambas'
  WHEN name ILIKE '%cabillaud%' THEN 'Bacalao'
  WHEN name ILIKE '%sardine%' THEN 'Sardinas'
  WHEN name ILIKE '%steak haché%boeuf%' OR name ILIKE '%bifteck%haché%' THEN 'Hamburguesa de Ternera'
  WHEN name ILIKE '%œuf%' OR name ILIKE '%oeufs%' THEN 'Huevos'
  WHEN name ILIKE '%saumon%' THEN 'Salmón'
  WHEN name ILIKE '%thon%' THEN 'Atún'
  WHEN name ILIKE '%nems%' THEN 'Rollitos de Primavera'
  WHEN name ILIKE '%tilapia%' THEN 'Tilapia'
  ELSE name
END
WHERE name_es IS NULL AND category = 'protein';

-- Dairy translations
UPDATE foods SET name_es = CASE
  WHEN name = 'Whole Milk' THEN 'Leche Entera'
  WHEN name = 'Skim Milk' THEN 'Leche Desnatada'
  WHEN name = '2% Milk' THEN 'Leche Semidesnatada'
  WHEN name = 'Greek Yogurt (Plain, Nonfat)' THEN 'Yogur Griego Natural (0%)'
  WHEN name = 'Greek Yogurt (Plain, Whole)' THEN 'Yogur Griego Natural (Entero)'
  WHEN name = 'Regular Yogurt (Plain)' THEN 'Yogur Natural'
  WHEN name ILIKE 'Cottage Cheese%' THEN 'Queso Cottage'
  WHEN name = 'Cottage Cheese (Low-Fat)' THEN 'Queso Cottage (Bajo en Grasa)'
  WHEN name = 'Cream Cheese' THEN 'Queso Crema'
  WHEN name = 'Cheddar Cheese' THEN 'Queso Cheddar'
  WHEN name ILIKE 'Cheddar' THEN 'Queso Cheddar'
  WHEN name = 'Mozzarella Cheese' THEN 'Queso Mozzarella'
  WHEN name ILIKE 'Mozzarella' THEN 'Mozzarella'
  WHEN name = 'Parmesan Cheese' THEN 'Queso Parmesano'
  WHEN name = 'Feta Cheese' THEN 'Queso Feta'
  WHEN name = 'Goat Cheese' THEN 'Queso de Cabra'
  WHEN name = 'Swiss Cheese' THEN 'Queso Suizo'
  WHEN name = 'Provolone Cheese' THEN 'Queso Provolone'
  WHEN name = 'Ricotta Cheese' THEN 'Queso Ricotta'
  WHEN name = 'Sour Cream' THEN 'Nata Agria'
  WHEN name = 'Whipped Cream' THEN 'Nata Montada'
  WHEN name ILIKE 'Skyr%' THEN 'Skyr'
  WHEN name ILIKE '%yaourt%grec%' OR name ILIKE '%yaos%' THEN 'Yogur Griego'
  WHEN name ILIKE '%lait%entier%' THEN 'Leche Entera'
  WHEN name ILIKE '%lait%' THEN 'Leche'
  WHEN name ILIKE '%beurre%' THEN 'Mantequilla'
  ELSE name
END
WHERE name_es IS NULL AND category = 'dairy';

-- Fruit translations
UPDATE foods SET name_es = CASE
  WHEN name = 'Apple' THEN 'Manzana'
  WHEN name = 'Banana' THEN 'Plátano'
  WHEN name = 'Orange' THEN 'Naranja'
  WHEN name = 'Strawberries' OR name = 'Strawberry' THEN 'Fresas'
  WHEN name = 'Blueberries' OR name = 'Blueberry' THEN 'Arándanos'
  WHEN name = 'Raspberries' THEN 'Frambuesas'
  WHEN name = 'Grapes' THEN 'Uvas'
  WHEN name = 'Mango' THEN 'Mango'
  WHEN name = 'Pineapple' THEN 'Piña'
  WHEN name = 'Watermelon' THEN 'Sandía'
  WHEN name = 'Cantaloupe' THEN 'Melón'
  WHEN name = 'Peach' THEN 'Melocotón'
  WHEN name = 'Pear' THEN 'Pera'
  WHEN name = 'Kiwi' THEN 'Kiwi'
  WHEN name = 'Cherries' THEN 'Cerezas'
  WHEN name = 'Plum' THEN 'Ciruela'
  WHEN name = 'Grapefruit' THEN 'Pomelo'
  WHEN name = 'Papaya' THEN 'Papaya'
  WHEN name = 'Avocado' THEN 'Aguacate'
  WHEN name ILIKE 'Avocado%' THEN 'Aguacate'
  WHEN name = 'Coconut Meat (Fresh)' THEN 'Coco Fresco'
  WHEN name ILIKE '%mangue%' OR name ILIKE '%mango%' THEN 'Mango'
  WHEN name ILIKE '%myrtille%' THEN 'Arándanos'
  WHEN name ILIKE '%fraise%' THEN 'Fresas'
  WHEN name ILIKE '%pomme%' AND name NOT ILIKE '%pommes de terre%' THEN 'Manzana'
  WHEN name ILIKE '%banane%' THEN 'Plátano'
  WHEN name ILIKE '%avocat%' THEN 'Aguacate'
  WHEN name ILIKE '%confiture%' THEN 'Mermelada'
  WHEN name = 'Apple Juice' THEN 'Zumo de Manzana'
  ELSE name
END
WHERE name_es IS NULL AND category = 'fruit';

-- Grain translations
UPDATE foods SET name_es = CASE
  WHEN name = 'White Rice (Cooked)' THEN 'Arroz Blanco (Cocinado)'
  WHEN name = 'Brown Rice (Cooked)' THEN 'Arroz Integral (Cocinado)'
  WHEN name = 'Basmati Rice (Cooked)' THEN 'Arroz Basmati (Cocinado)'
  WHEN name = 'Jasmine Rice (Cooked)' THEN 'Arroz Jazmín (Cocinado)'
  WHEN name = 'White Pasta (Cooked)' THEN 'Pasta Blanca (Cocinada)'
  WHEN name = 'Whole Wheat Pasta (Cooked)' THEN 'Pasta Integral (Cocinada)'
  WHEN name = 'Rice Noodles (Cooked)' THEN 'Fideos de Arroz (Cocinados)'
  WHEN name = 'Oats (Dry)' THEN 'Avena (Seca)'
  WHEN name = 'Oatmeal' OR name = 'Oatmeal (Cooked)' THEN 'Avena (Cocinada)'
  WHEN name = 'Quinoa' OR name = 'Quinoa (Cooked)' THEN 'Quinoa'
  WHEN name = 'Bulgur Wheat (Cooked)' THEN 'Bulgur (Cocinado)'
  WHEN name = 'Couscous (Cooked)' THEN 'Cuscús (Cocinado)'
  WHEN name = 'White Bread' THEN 'Pan Blanco'
  WHEN name ILIKE 'Whole Wheat Bread%' OR name = 'WHOLE WHEAT BREAD' THEN 'Pan Integral'
  WHEN name ILIKE '100% Whole Wheat Bread%' THEN 'Pan 100% Integral'
  WHEN name = 'Sourdough Bread' THEN 'Pan de Masa Madre'
  WHEN name = 'Bagel (Plain)' THEN 'Bagel (Normal)'
  WHEN name = 'English Muffin' THEN 'Muffin Inglés'
  WHEN name = 'Corn Tortilla' OR name ILIKE 'Corn Tortilla%' THEN 'Tortilla de Maíz'
  WHEN name = 'Flour Tortilla' THEN 'Tortilla de Harina'
  WHEN name = 'Granola' THEN 'Granola'
  WHEN name = 'Potato (Baked)' THEN 'Patata (al Horno)'
  WHEN name = 'Potato (Boiled)' THEN 'Patata (Hervida)'
  WHEN name = 'Mashed Potatoes' THEN 'Puré de Patatas'
  WHEN name = 'Sweet Potato (Cooked)' THEN 'Boniato (Cocinado)'
  WHEN name ILIKE 'Sweet Potato%' THEN 'Boniato'
  WHEN name = 'Corn (Boiled)' THEN 'Maíz (Hervido)'
  WHEN name ILIKE '%flocon%avoine%' OR name ILIKE '%Quaker%avoine%' THEN 'Copos de Avena'
  WHEN name ILIKE '%riz%basmati%' THEN 'Arroz Basmati'
  WHEN name ILIKE '%riz%complet%' THEN 'Arroz Integral'
  WHEN name ILIKE '%riz%long%' THEN 'Arroz de Grano Largo'
  WHEN name ILIKE '%quinoa%' THEN 'Quinoa'
  WHEN name ILIKE '%spaghetti%' THEN 'Espaguetis Integrales'
  WHEN name ILIKE '%penne%' THEN 'Penne Integrales'
  WHEN name ILIKE '%coquillette%' OR name ILIKE '%torti%' OR name ILIKE '%torsade%' THEN 'Pasta Integral'
  WHEN name ILIKE '%patate douce%' THEN 'Boniato'
  WHEN name ILIKE '%pommes%terre%' OR name ILIKE '%pommes rissol%' THEN 'Patatas'
  WHEN name ILIKE '%tortilla%corn%' OR name ILIKE '%TORTILLA%CORN%' THEN 'Tortilla de Maíz'
  ELSE name
END
WHERE name_es IS NULL AND category = 'grain';

-- Vegetable translations
UPDATE foods SET name_es = CASE
  WHEN name = 'Broccoli' THEN 'Brócoli'
  WHEN name = 'Spinach (Raw)' THEN 'Espinacas (Crudas)'
  WHEN name = 'Spinach (Cooked)' THEN 'Espinacas (Cocinadas)'
  WHEN name = 'Kale (Raw)' THEN 'Kale (Crudo)'
  WHEN name = 'Lettuce (Romaine)' THEN 'Lechuga Romana'
  WHEN name = 'Tomato' THEN 'Tomate'
  WHEN name = 'Cucumber' THEN 'Pepino'
  WHEN name = 'Bell Pepper' THEN 'Pimiento'
  WHEN name = 'Carrot' THEN 'Zanahoria'
  WHEN name = 'Cauliflower' THEN 'Coliflor'
  WHEN name = 'Zucchini' THEN 'Calabacín'
  WHEN name = 'Green Beans' THEN 'Judías Verdes'
  WHEN name = 'Asparagus' THEN 'Espárragos'
  WHEN name = 'Brussels Sprouts' THEN 'Coles de Bruselas'
  WHEN name = 'Cabbage' THEN 'Repollo'
  WHEN name = 'Mushrooms (White)' THEN 'Champiñones Blancos'
  WHEN name = 'Onion' THEN 'Cebolla'
  WHEN name = 'Garlic' THEN 'Ajo'
  WHEN name = 'Celery' THEN 'Apio'
  WHEN name = 'Eggplant' THEN 'Berenjena'
  WHEN name = 'Artichoke' THEN 'Alcachofa'
  WHEN name = 'Beet' THEN 'Remolacha'
  WHEN name = 'Radish' THEN 'Rábano'
  WHEN name = 'Turnip' THEN 'Nabo'
  WHEN name ILIKE '%tomate%' THEN 'Tomate'
  WHEN name ILIKE '%brocoli%' OR name ILIKE '%broccoli%' THEN 'Brócoli'
  WHEN name ILIKE '%épinard%' OR name ILIKE '%spinach%' THEN 'Espinacas'
  WHEN name ILIKE '%courgette%' OR name ILIKE '%zucchini%' THEN 'Calabacín'
  WHEN name ILIKE '%carotte%' THEN 'Zanahoria'
  WHEN name ILIKE '%oignon%' THEN 'Cebolla'
  WHEN name ILIKE '%champignon%' THEN 'Champiñones'
  WHEN name ILIKE '%haricot%vert%' THEN 'Judías Verdes'
  WHEN name ILIKE '%poivron%' THEN 'Pimiento'
  WHEN name ILIKE '%salade%' OR name ILIKE '%laitue%' THEN 'Ensalada'
  WHEN name ILIKE '%concombre%' THEN 'Pepino'
  WHEN name ILIKE '%chou%' AND name NOT ILIKE '%chou-fleur%' THEN 'Col'
  WHEN name ILIKE '%chou-fleur%' THEN 'Coliflor'
  WHEN name ILIKE '%aubergine%' THEN 'Berenjena'
  WHEN name ILIKE '%petits pois%' THEN 'Guisantes'
  WHEN name ILIKE '%maïs%' THEN 'Maíz'
  ELSE name
END
WHERE name_es IS NULL AND category = 'vegetable';

-- Legume translations
UPDATE foods SET name_es = CASE
  WHEN name = 'Black Beans (Cooked)' OR name = 'Black Beans' THEN 'Alubias Negras'
  WHEN name = 'Chickpeas (Cooked)' THEN 'Garbanzos (Cocinados)'
  WHEN name = 'Lentils (Cooked)' THEN 'Lentejas (Cocinadas)'
  WHEN name = 'Kidney Beans (Cooked)' THEN 'Alubias Rojas (Cocinadas)'
  WHEN name = 'Pinto Beans (Cooked)' THEN 'Alubias Pintas (Cocinadas)'
  WHEN name = 'Navy Beans (Cooked)' THEN 'Alubias Blancas (Cocinadas)'
  WHEN name = 'Lima Beans (Cooked)' THEN 'Habas (Cocinadas)'
  WHEN name = 'Soybeans (Cooked)' THEN 'Soja (Cocinada)'
  WHEN name = 'Green Peas' THEN 'Guisantes'
  WHEN name = 'Edamame' THEN 'Edamame'
  WHEN name = 'Hummus' THEN 'Hummus'
  WHEN name = 'Refried Beans' THEN 'Frijoles Refritos'
  WHEN name ILIKE '%black beans%' THEN 'Alubias Negras'
  WHEN name ILIKE '%chickpea%' THEN 'Garbanzos'
  WHEN name ILIKE '%pois chiche%' THEN 'Garbanzos'
  WHEN name ILIKE '%lentille%' THEN 'Lentejas'
  WHEN name ILIKE '%haricot%noir%' THEN 'Alubias Negras'
  WHEN name ILIKE '%Red Kidney%' THEN 'Alubias Rojas'
  ELSE name
END
WHERE name_es IS NULL AND category = 'legume';

-- Nut/seed translations
UPDATE foods SET name_es = CASE
  WHEN name = 'Almonds' THEN 'Almendras'
  WHEN name = 'Walnuts' THEN 'Nueces'
  WHEN name = 'Cashews' THEN 'Anacardos'
  WHEN name = 'Pistachios' THEN 'Pistachos'
  WHEN name = 'Pecans' THEN 'Pecanas'
  WHEN name = 'Hazelnuts' THEN 'Avellanas'
  WHEN name = 'Macadamia Nuts' THEN 'Nueces de Macadamia'
  WHEN name = 'Brazil Nuts' THEN 'Nueces de Brasil'
  WHEN name = 'Peanuts (Roasted)' THEN 'Cacahuetes (Tostados)'
  WHEN name = 'Peanut Butter' THEN 'Mantequilla de Cacahuete'
  WHEN name = 'Almond Butter' THEN 'Mantequilla de Almendra'
  WHEN name = 'Tahini' THEN 'Tahini'
  WHEN name = 'Chia Seeds' THEN 'Semillas de Chía'
  WHEN name = 'Flaxseed' OR name = 'Flaxseeds' THEN 'Semillas de Lino'
  WHEN name = 'Hemp Seeds' THEN 'Semillas de Cáñamo'
  WHEN name = 'Pumpkin Seeds' THEN 'Pipas de Calabaza'
  WHEN name = 'Sunflower Seeds' THEN 'Pipas de Girasol'
  WHEN name = 'Shredded Coconut (Dried)' THEN 'Coco Rallado (Seco)'
  WHEN name ILIKE '%amande%' THEN 'Almendras'
  WHEN name ILIKE '%noix' OR name ILIKE '%walnuts%' OR name ILIKE '%walnut%' THEN 'Nueces'
  WHEN name ILIKE '%cacahuète%' OR name ILIKE '%peanut%' THEN 'Mantequilla de Cacahuete'
  WHEN name ILIKE '%chia%' THEN 'Semillas de Chía'
  WHEN name ILIKE '%graines de lin%' OR name ILIKE '%flax%' THEN 'Semillas de Lino'
  WHEN name ILIKE '%Mandeln%' THEN 'Almendras'
  ELSE name
END
WHERE name_es IS NULL AND category = 'nut_seed';

-- Beverage translations
UPDATE foods SET name_es = CASE
  WHEN name = 'Orange Juice' THEN 'Zumo de Naranja'
  WHEN name = 'Apple Juice' THEN 'Zumo de Manzana'
  WHEN name = 'Coconut Water' THEN 'Agua de Coco'
  WHEN name = 'Almond Milk (Unsweetened)' THEN 'Leche de Almendra (Sin Azúcar)'
  WHEN name = 'Oat Milk' THEN 'Leche de Avena'
  WHEN name = 'Soy Milk (Unsweetened)' THEN 'Leche de Soja (Sin Azúcar)'
  WHEN name = 'Chocolate Milk (Whole)' THEN 'Leche con Chocolate (Entera)'
  WHEN name = 'Cranberry Juice (Unsweetened)' THEN 'Zumo de Arándanos (Sin Azúcar)'
  ELSE name
END
WHERE name_es IS NULL AND category = 'beverage';

-- Condiment translations
UPDATE foods SET name_es = CASE
  WHEN name = 'Honey' THEN 'Miel'
  WHEN name = 'Ketchup' THEN 'Ketchup'
  WHEN name = 'Mustard' THEN 'Mostaza'
  WHEN name = 'Soy Sauce' THEN 'Salsa de Soja'
  WHEN name = 'Hot Sauce' THEN 'Salsa Picante'
  WHEN name = 'Salsa' THEN 'Salsa'
  WHEN name = 'Balsamic Vinegar' THEN 'Vinagre Balsámico'
  WHEN name = 'Maple Syrup' THEN 'Sirope de Arce'
  ELSE name
END
WHERE name_es IS NULL AND category = 'condiment';

-- Oil/fat translations
UPDATE foods SET name_es = CASE
  WHEN name = 'Olive Oil' THEN 'Aceite de Oliva'
  WHEN name = 'Coconut Oil' OR name = 'Coconut oil' THEN 'Aceite de Coco'
  WHEN name = 'Avocado Oil' THEN 'Aceite de Aguacate'
  WHEN name = 'Sesame Oil' THEN 'Aceite de Sésamo'
  WHEN name = 'Flaxseed Oil' THEN 'Aceite de Linaza'
  WHEN name = 'Butter' THEN 'Mantequilla'
  WHEN name = 'Ghee' THEN 'Ghee'
  WHEN name = 'Lard' THEN 'Manteca de Cerdo'
  WHEN name ILIKE '%huile%olive%' THEN 'Aceite de Oliva'
  WHEN name ILIKE '%huile%coco%' OR name ILIKE '%coconut oil%' OR name ILIKE '%Kokosöl%' THEN 'Aceite de Coco'
  WHEN name ILIKE '%beurre%' THEN 'Mantequilla'
  WHEN name ILIKE '%margarine%' THEN 'Margarina'
  WHEN name ILIKE 'EXTRA VIRGIN%' THEN 'Aceite de Oliva Virgen Extra'
  ELSE name
END
WHERE name_es IS NULL AND category = 'oil_fat';

-- Supplement translations
UPDATE foods SET name_es = CASE
  WHEN name = 'Whey Protein Isolate' THEN 'Proteína de Suero Aislada'
  WHEN name = 'Whey Protein Concentrate' THEN 'Proteína de Suero Concentrada'
  WHEN name = 'Casein Protein' THEN 'Proteína de Caseína'
  WHEN name = 'Pea Protein' THEN 'Proteína de Guisante'
  WHEN name = 'Creatine Monohydrate' THEN 'Creatina Monohidrato'
  WHEN name = 'BCAA Powder' THEN 'BCAA en Polvo'
  WHEN name = 'Fish Oil (Capsule)' THEN 'Aceite de Pescado (Cápsula)'
  WHEN name = 'Multivitamin (Tablet)' THEN 'Multivitamínico (Comprimido)'
  WHEN name = 'Collagen Peptides' THEN 'Péptidos de Colágeno'
  WHEN name = 'Mass Gainer' THEN 'Ganador de Masa'
  WHEN name ILIKE '%whey%' OR name ILIKE '%protéine%' THEN 'Proteína en Polvo'
  ELSE name
END
WHERE name_es IS NULL AND category = 'supplement';

-- Snack translations
UPDATE foods SET name_es = CASE
  WHEN name = 'Dark Chocolate (70-85%)' THEN 'Chocolate Negro (70-85%)'
  WHEN name = 'Rice Cake' THEN 'Tortita de Arroz'
  WHEN name = 'Protein Bar' THEN 'Barrita de Proteínas'
  WHEN name = 'Trail Mix' THEN 'Mezcla de Frutos Secos'
  WHEN name = 'Popcorn (Air-Popped)' THEN 'Palomitas (Sin Aceite)'
  WHEN name ILIKE '%chocolate%noir%' OR name ILIKE '%dark chocolate%' THEN 'Chocolate Negro'
  WHEN name ILIKE '%galette%riz%' OR name ILIKE '%rice cake%' THEN 'Tortita de Arroz'
  ELSE name
END
WHERE name_es IS NULL AND category = 'snack';

-- Fallback: any food still without name_es gets the original name
UPDATE foods SET name_es = name WHERE name_es IS NULL;
