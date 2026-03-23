-- ============================================================
-- Mary - Plan de Entrenamiento Marzo 2026
-- Trainer: wellnessrealoficial@gmail.com (3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f)
-- Client: Mary (look up by email)
-- ============================================================

DO $$
DECLARE
  v_trainer_id UUID := '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f';
  v_client_id UUID;
  -- Exercise IDs
  e_goblet_squat UUID;
  e_hip_thrust UUID;
  e_db_bench_press UUID;
  e_lat_pulldown UUID;
  e_tricep_pushdown UUID;
  e_plank UUID;
  e_dead_bug UUID;
  e_rdl UUID;
  e_walking_lunge UUID;
  e_single_arm_row UUID;
  e_overhead_press UUID;
  e_face_pull UUID;
  e_bicep_curl UUID;
  e_pallof_press UUID;
  e_bulgarian_split UUID;
  e_hip_thrust_floor UUID;
  e_incline_press UUID;
  e_seated_row UUID;
  e_lateral_raise UUID;
  e_bird_dog UUID;
  e_side_plank UUID;
  -- Routine & Days
  v_routine_id UUID;
  v_day_a UUID;
  v_day_b UUID;
  v_day_c UUID;
BEGIN

-- ============================================================
-- 1. EXERCISES
-- ============================================================

-- Sentadilla Goblet con Mancuerna
INSERT INTO exercises (id, trainer_id, name, name_es, description_es, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, mechanics, "force", source, is_public)
VALUES (gen_random_uuid(), v_trainer_id,
  'Goblet Squat', 'Sentadilla Goblet con Mancuerna',
  'Sentadilla con mancuerna pegada al pecho',
  'Mancuerna pegada al pecho, codos hacia abajo. Baja controlada (3 seg) hasta que los codos toquen el interior de las rodillas. Pausa 1 seg abajo. Rodillas hacia fuera siguiendo los pies.',
  ARRAY['quadriceps','glutes','core'], ARRAY['dumbbell'], 'beginner', 'strength',
  ARRAY['quadriceps','glutes'], 'compound', 'push', 'custom', true)
RETURNING id INTO e_goblet_squat;

-- Hip Thrust con Barra
INSERT INTO exercises (id, trainer_id, name, name_es, description_es, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, secondary_muscles, mechanics, "force", source, is_public)
VALUES (gen_random_uuid(), v_trainer_id,
  'Barbell Hip Thrust', 'Hip Thrust con Barra',
  'Extension de cadera con barra apoyada en banco',
  'Espalda media apoyada en banco a la altura de las escápulas. Pies a la anchura de caderas. Sube hasta extensión completa de cadera (no hiperextensión lumbar), aprieta glúteos arriba y mantén 2 segundos. Barbilla al pecho.',
  ARRAY['glutes','hamstrings'], ARRAY['barbell','bench'], 'intermediate', 'strength',
  ARRAY['glutes'], ARRAY['hamstrings'], 'compound', 'push', 'custom', true)
RETURNING id INTO e_hip_thrust;

-- Press de Banca con Mancuernas
INSERT INTO exercises (id, trainer_id, name, name_es, description_es, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, secondary_muscles, mechanics, "force", source, is_public)
VALUES (gen_random_uuid(), v_trainer_id,
  'Dumbbell Bench Press', 'Press de Banca con Mancuernas',
  'Press horizontal con mancuernas en banco plano',
  'Retrae escápulas y mantén pecho elevado. Baja hasta que los codos queden a 90° o ligeramente por debajo del banco. Codos a 45° del torso. Empuja vertical.',
  ARRAY['chest','shoulders','triceps'], ARRAY['dumbbell','bench'], 'intermediate', 'strength',
  ARRAY['chest'], ARRAY['shoulders','triceps'], 'compound', 'push', 'custom', true)
RETURNING id INTO e_db_bench_press;

-- Jalón al Pecho (Agarre Ancho)
INSERT INTO exercises (id, trainer_id, name, name_es, description_es, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, secondary_muscles, mechanics, "force", source, is_public)
VALUES (gen_random_uuid(), v_trainer_id,
  'Wide Grip Lat Pulldown', 'Jalón al Pecho (Agarre Ancho)',
  'Tirón vertical con agarre ancho en polea alta',
  'Tira con los codos hacia las costillas, no con las manos. Pecho hacia la barra. Pausa breve abajo.',
  ARRAY['back','biceps'], ARRAY['cable'], 'beginner', 'strength',
  ARRAY['lats'], ARRAY['biceps'], 'compound', 'pull', 'custom', true)
RETURNING id INTO e_lat_pulldown;

-- Extensión de Tríceps en Polea (Cuerda)
INSERT INTO exercises (id, trainer_id, name, name_es, description_es, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, mechanics, "force", source, is_public)
VALUES (gen_random_uuid(), v_trainer_id,
  'Cable Tricep Pushdown (Rope)', 'Extensión de Tríceps en Polea (Cuerda)',
  'Extension de triceps en polea con cuerda',
  'Codos pegados al cuerpo. Separa las manos al final del movimiento. Aprieta tríceps abajo.',
  ARRAY['triceps'], ARRAY['cable'], 'beginner', 'strength',
  ARRAY['triceps'], 'isolation', 'push', 'custom', true)
RETURNING id INTO e_tricep_pushdown;

-- Plancha Frontal
INSERT INTO exercises (id, trainer_id, name, name_es, description_es, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, mechanics, "force", source, is_public)
VALUES (gen_random_uuid(), v_trainer_id,
  'Front Plank', 'Plancha Frontal',
  'Isometrico de core en posicion prona',
  'Cuerpo en línea recta desde cabeza hasta talones. Aprieta abdomen y glúteos. No hundir ni subir cadera.',
  ARRAY['core'], ARRAY['bodyweight'], 'beginner', 'strength',
  ARRAY['core'], 'compound', 'static', 'custom', true)
RETURNING id INTO e_plank;

-- Dead Bug
INSERT INTO exercises (id, trainer_id, name, name_es, description_es, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, mechanics, "force", source, is_public)
VALUES (gen_random_uuid(), v_trainer_id,
  'Dead Bug', 'Dead Bug',
  'Estabilizacion lumbo-pelvica en supino',
  'Lumbar pegada al suelo TODO el tiempo. Extiende brazo y pierna opuestos lentamente. Si la lumbar se despega, reduce el rango.',
  ARRAY['core'], ARRAY['bodyweight'], 'beginner', 'strength',
  ARRAY['core'], 'compound', 'static', 'custom', true)
RETURNING id INTO e_dead_bug;

-- Peso Muerto Rumano con Mancuernas
INSERT INTO exercises (id, trainer_id, name, name_es, description_es, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, secondary_muscles, mechanics, "force", source, is_public)
VALUES (gen_random_uuid(), v_trainer_id,
  'Dumbbell Romanian Deadlift', 'Peso Muerto Rumano con Mancuernas',
  'Bisagra de cadera con mancuernas',
  'Rodillas ligeramente flexionadas y fijas. Bisagra de cadera: empuja el culo hacia atrás. Baja hasta sentir tensión en isquios (no forzar). Espalda neutra TODO el movimiento. Mancuernas cerca de las piernas.',
  ARRAY['hamstrings','glutes','back'], ARRAY['dumbbell'], 'intermediate', 'strength',
  ARRAY['hamstrings','glutes'], ARRAY['back'], 'compound', 'pull', 'custom', true)
RETURNING id INTO e_rdl;

-- Zancadas Caminando con Mancuernas
INSERT INTO exercises (id, trainer_id, name, name_es, description_es, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, secondary_muscles, mechanics, "force", source, is_public)
VALUES (gen_random_uuid(), v_trainer_id,
  'Dumbbell Walking Lunge', 'Zancadas Caminando con Mancuernas',
  'Zancadas dinamicas con mancuernas',
  'Paso largo. Rodilla trasera casi toca el suelo. Torso erguido, mirada al frente. Empuja desde el talón de la pierna delantera. Controla el descenso.',
  ARRAY['quadriceps','glutes'], ARRAY['dumbbell'], 'intermediate', 'strength',
  ARRAY['quadriceps','glutes'], NULL, 'compound', 'push', 'custom', true)
RETURNING id INTO e_walking_lunge;

-- Remo con Mancuerna a Una Mano
INSERT INTO exercises (id, trainer_id, name, name_es, description_es, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, secondary_muscles, mechanics, "force", source, is_public)
VALUES (gen_random_uuid(), v_trainer_id,
  'Single-Arm Dumbbell Row', 'Remo con Mancuerna a Una Mano',
  'Remo unilateral con mancuerna apoyado en banco',
  'Mano y rodilla del mismo lado en banco. Tira el codo hacia la cadera, no hacia arriba. Sin rotar el torso. Aprieta escápula arriba 1 segundo.',
  ARRAY['back','biceps'], ARRAY['dumbbell','bench'], 'beginner', 'strength',
  ARRAY['lats','back'], ARRAY['biceps','traps'], 'compound', 'pull', 'custom', true)
RETURNING id INTO e_single_arm_row;

-- Press Militar con Mancuernas (De pie)
INSERT INTO exercises (id, trainer_id, name, name_es, description_es, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, secondary_muscles, mechanics, "force", source, is_public)
VALUES (gen_random_uuid(), v_trainer_id,
  'Standing Dumbbell Overhead Press', 'Press Militar con Mancuernas (De pie)',
  'Press vertical con mancuernas de pie',
  'Empuja vertical, no hacia delante. Aprieta abdomen y glúteos para estabilizar. No arquear la lumbar.',
  ARRAY['shoulders','triceps','core'], ARRAY['dumbbell'], 'intermediate', 'strength',
  ARRAY['shoulders'], ARRAY['triceps','core'], 'compound', 'push', 'custom', true)
RETURNING id INTO e_overhead_press;

-- Face Pull en Polea
INSERT INTO exercises (id, trainer_id, name, name_es, description_es, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, secondary_muscles, mechanics, "force", source, is_public)
VALUES (gen_random_uuid(), v_trainer_id,
  'Cable Face Pull', 'Face Pull en Polea',
  'Tiron a la cara con polea para deltoides posterior',
  'Polea a la altura de la cara. Tira hacia la cara abriendo los codos. Termina con rotación externa (pulgares hacia atrás). Aprieta escápulas.',
  ARRAY['shoulders','back'], ARRAY['cable'], 'beginner', 'strength',
  ARRAY['shoulders'], ARRAY['back'], 'isolation', 'pull', 'custom', true)
RETURNING id INTO e_face_pull;

-- Curl de Bíceps con Mancuernas (Alterno)
INSERT INTO exercises (id, trainer_id, name, name_es, description_es, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, mechanics, "force", source, is_public)
VALUES (gen_random_uuid(), v_trainer_id,
  'Alternating Dumbbell Bicep Curl', 'Curl de Bíceps con Mancuernas (Alterno)',
  'Curl alterno con mancuernas',
  'Codos fijos pegados al cuerpo. Supinación completa arriba. Baja controlado.',
  ARRAY['biceps'], ARRAY['dumbbell'], 'beginner', 'strength',
  ARRAY['biceps'], 'isolation', 'pull', 'custom', true)
RETURNING id INTO e_bicep_curl;

-- Pallof Press
INSERT INTO exercises (id, trainer_id, name, name_es, description_es, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, mechanics, "force", source, is_public)
VALUES (gen_random_uuid(), v_trainer_id,
  'Pallof Press', 'Pallof Press (Anti-rotación)',
  'Ejercicio anti-rotacion con polea',
  'De pie lateral a la polea. Extiende brazos sin que el cuerpo rote. Mantén 2 segundos extendido. Controla el regreso.',
  ARRAY['core'], ARRAY['cable'], 'beginner', 'strength',
  ARRAY['core'], 'compound', 'static', 'custom', true)
RETURNING id INTO e_pallof_press;

-- Sentadilla Búlgara con Mancuernas
INSERT INTO exercises (id, trainer_id, name, name_es, description_es, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, secondary_muscles, mechanics, "force", source, is_public)
VALUES (gen_random_uuid(), v_trainer_id,
  'Dumbbell Bulgarian Split Squat', 'Sentadilla Búlgara con Mancuernas',
  'Sentadilla unilateral con pie trasero elevado',
  'Pie trasero en banco (empeine apoyado). Al bajar, rodilla delantera no pasa la punta del pie. Torso ligeramente inclinado hacia delante. Baja hasta que la rodilla trasera casi toque el suelo.',
  ARRAY['quadriceps','glutes','core'], ARRAY['dumbbell','bench'], 'intermediate', 'strength',
  ARRAY['quadriceps','glutes'], ARRAY['core'], 'compound', 'push', 'custom', true)
RETURNING id INTO e_bulgarian_split;

-- Hip Thrust con Barra (desde suelo)
INSERT INTO exercises (id, trainer_id, name, name_es, description_es, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, secondary_muscles, mechanics, "force", source, is_public)
VALUES (gen_random_uuid(), v_trainer_id,
  'Barbell Glute Bridge', 'Hip Thrust con Barra (desde suelo)',
  'Extension de cadera con barra desde el suelo',
  'Tumbada boca arriba, pies a la anchura de caderas. Sube cadera apretando glúteos (no lumbar). Mantén 2 segundos arriba. Baja controlado sin tocar el suelo entre reps.',
  ARRAY['glutes','hamstrings'], ARRAY['barbell'], 'beginner', 'strength',
  ARRAY['glutes'], ARRAY['hamstrings'], 'compound', 'push', 'custom', true)
RETURNING id INTO e_hip_thrust_floor;

-- Press Mancuernas en Banco Inclinado
INSERT INTO exercises (id, trainer_id, name, name_es, description_es, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, secondary_muscles, mechanics, "force", source, is_public)
VALUES (gen_random_uuid(), v_trainer_id,
  'Incline Dumbbell Press', 'Press Mancuernas en Banco Inclinado (30-45°)',
  'Press con mancuernas en banco inclinado',
  'Banco a 30-45°. Escápulas retraídas. Baja mancuernas a nivel del pecho (no hombros). Empuja diagonal hacia el techo.',
  ARRAY['chest','shoulders','triceps'], ARRAY['dumbbell','bench'], 'intermediate', 'strength',
  ARRAY['chest'], ARRAY['shoulders','triceps'], 'compound', 'push', 'custom', true)
RETURNING id INTO e_incline_press;

-- Remo Sentado en Polea (Agarre Estrecho)
INSERT INTO exercises (id, trainer_id, name, name_es, description_es, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, secondary_muscles, mechanics, "force", source, is_public)
VALUES (gen_random_uuid(), v_trainer_id,
  'Seated Cable Row (Close Grip)', 'Remo Sentado en Polea (Agarre Estrecho)',
  'Remo horizontal en polea con agarre estrecho',
  'Tira hacia el ombligo. Aprieta escápulas al final. No te inclines hacia atrás más de 10-15°.',
  ARRAY['back','biceps'], ARRAY['cable'], 'beginner', 'strength',
  ARRAY['lats','back'], ARRAY['biceps'], 'compound', 'pull', 'custom', true)
RETURNING id INTO e_seated_row;

-- Elevaciones Laterales con Mancuernas
INSERT INTO exercises (id, trainer_id, name, name_es, description_es, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, mechanics, "force", source, is_public)
VALUES (gen_random_uuid(), v_trainer_id,
  'Dumbbell Lateral Raise', 'Elevaciones Laterales con Mancuernas',
  'Elevacion lateral para deltoides medio',
  'Codos ligeramente flexionados. Sube hasta altura de hombros (no más). Meñique ligeramente más alto que pulgar.',
  ARRAY['shoulders'], ARRAY['dumbbell'], 'beginner', 'strength',
  ARRAY['shoulders'], 'isolation', 'push', 'custom', true)
RETURNING id INTO e_lateral_raise;

-- Bird Dog
INSERT INTO exercises (id, trainer_id, name, name_es, description_es, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, mechanics, "force", source, is_public)
VALUES (gen_random_uuid(), v_trainer_id,
  'Bird Dog', 'Bird Dog',
  'Estabilizacion en cuadrupedia',
  'En cuadrupedia. Extiende brazo y pierna opuestos lentamente (3 seg). Sin rotar cadera ni hombros. Mantén línea recta 2 segundos arriba.',
  ARRAY['core','glutes'], ARRAY['bodyweight'], 'beginner', 'strength',
  ARRAY['core'], 'compound', 'static', 'custom', true)
RETURNING id INTO e_bird_dog;

-- Plancha Lateral
INSERT INTO exercises (id, trainer_id, name, name_es, description_es, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, mechanics, "force", source, is_public)
VALUES (gen_random_uuid(), v_trainer_id,
  'Side Plank', 'Plancha Lateral',
  'Isometrico lateral de core',
  'Cuerpo en línea recta. Cadera arriba. Si es difícil, apoya rodilla inferior.',
  ARRAY['core'], ARRAY['bodyweight'], 'beginner', 'strength',
  ARRAY['core'], 'compound', 'static', 'custom', true)
RETURNING id INTO e_side_plank;

-- ============================================================
-- 2. ROUTINE (as template)
-- ============================================================

INSERT INTO routines (id, trainer_id, name, description, duration_weeks, days_per_week, difficulty, target_gender, is_template)
VALUES (gen_random_uuid(), v_trainer_id,
  'Plan Marzo 2026 - Mary',
  'Progresión y Consolidación · Recomposición corporal · Partimos de los pesos consolidados en febrero. Objetivo: +5% de carga en ejercicios principales cada 2 semanas si la técnica es perfecta y RPE no supera 8.',
  4, 3, 'intermediate', 'female', true)
RETURNING id INTO v_routine_id;

-- ============================================================
-- 3. ROUTINE DAYS
-- ============================================================

-- Day A: Pierna Dominante + Empuje Horizontal
INSERT INTO routine_days (id, routine_id, day_number, name, notes)
VALUES (gen_random_uuid(), v_routine_id, 1,
  'Día A - Pierna Dominante + Empuje Horizontal',
  'Calentamiento (10 min): 5 min cardio suave · 10 círculos cadera cada lado · 10 world''s greatest stretch · 10 cat-cow · 15 clamshells cada lado · 10 glute bridges sin peso')
RETURNING id INTO v_day_a;

-- Day B: Bisagra de Cadera + Tirón + Hombro
INSERT INTO routine_days (id, routine_id, day_number, name, notes)
VALUES (gen_random_uuid(), v_routine_id, 2,
  'Día B - Bisagra de Cadera + Tirón + Hombro',
  'Calentamiento (10 min): 5 min remo/bici · 10 good mornings sin peso · 10 90/90 hip stretch · 10 inchworms · 10 rotaciones externas con banda · 10 YTW en suelo')
RETURNING id INTO v_day_b;

-- Day C: Unilateral Pierna + Empuje Inclinado + Glúteos
INSERT INTO routine_days (id, routine_id, day_number, name, notes)
VALUES (gen_random_uuid(), v_routine_id, 3,
  'Día C - Unilateral Pierna + Empuje Inclinado + Glúteos',
  'Calentamiento (10 min): 5 min cardio · 10 sentadillas sin peso · 10 lunges estáticos cada lado · 15 monster walks · 15 banded squats')
RETURNING id INTO v_day_c;

-- ============================================================
-- 4. DAY A EXERCISES
-- ============================================================

-- A1: Sentadilla Goblet
INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group)
VALUES (v_day_a, e_goblet_squat, 1, 3, '12', 90,
  'Tempo 3-1-2-0 · S1: 3x12 RPE 6-7 (peso feb ref) · S2: 3x10-12 RPE 7 (+2-5%) · S3: 4x10-12 RPE 7-8 (mantener) · S4: 4x8-10 RPE 8 (+2-5%)', NULL);

-- A2: Hip Thrust con Barra
INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group)
VALUES (v_day_a, e_hip_thrust, 2, 3, '12', 90,
  'Tempo 2-2-1-0 · S1: 3x12 RPE 6-7 · S2: 3x10-12 RPE 7 (+2-5%) · S3: 4x10-12 RPE 7-8 · S4: 4x10 RPE 8 (+5%)', NULL);

-- A3: Press Banca Mancuernas
INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group)
VALUES (v_day_a, e_db_bench_press, 3, 3, '10-12', 90,
  'Tempo 2-1-1-0 · S1: 3x10-12 RPE 6-7 · S2: 3x10 RPE 7 (+2kg/manc) · S3: 4x10 RPE 7-8 · S4: 4x8 RPE 8 (+2kg)', NULL);

-- B1: Jalón al Pecho (superserie)
INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group)
VALUES (v_day_a, e_lat_pulldown, 4, 3, '12', 0,
  'SUPERSERIE con B2 · Sin descanso entre B1 y B2 · S3: 10-12 reps · S4: 10 reps', 'B');

-- B2: Extensión Tríceps (superserie)
INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group)
VALUES (v_day_a, e_tricep_pushdown, 5, 3, '15', 60,
  'SUPERSERIE con B1 · 60s descanso tras B2 · S3: 12-15 reps · S4: 12 reps', 'B');

-- C1: Plancha Frontal
INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group)
VALUES (v_day_a, e_plank, 6, 3, '35-40s', 45,
  'S1: 35-40s · S2: 40-45s · S3: 45-50s · S4: 50-60s', NULL);

-- C2: Dead Bug
INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group)
VALUES (v_day_a, e_dead_bug, 7, 3, '10 por lado', 45,
  'S3-S4: 12 por lado', NULL);

-- ============================================================
-- 5. DAY B EXERCISES
-- ============================================================

-- A1: Peso Muerto Rumano
INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group)
VALUES (v_day_b, e_rdl, 1, 3, '10-12', 90,
  'Tempo 3-1-1-0 · S1: 3x10-12 RPE 6-7 · S2: 4x10 RPE 7 (+2-5%) · S3: 4x10 RPE 7-8 · S4: 4x8-10 RPE 8 (+5%)', NULL);

-- A2: Zancadas Caminando
INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group)
VALUES (v_day_b, e_walking_lunge, 2, 3, '12 por pierna', 90,
  'S2: +1-2kg/manc si fácil · S3: 4x12/pierna RPE 7-8 · S4: 4x10/pierna RPE 8 (+2kg)', NULL);

-- A3: Remo 1 Mano
INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group)
VALUES (v_day_b, e_single_arm_row, 3, 3, '10-12 por lado', 60,
  'S2: 4x10/lado RPE 7 (+2-5%) · S3: 4x10/lado RPE 7-8 · S4: 4x8-10/lado RPE 8 (+2-5%)', NULL);

-- B1: Press Militar (superserie)
INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group)
VALUES (v_day_b, e_overhead_press, 4, 3, '10-12', 0,
  'SUPERSERIE con B2 · S3: 10 reps · S4: 8-10 reps', 'B');

-- B2: Face Pull (superserie)
INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group)
VALUES (v_day_b, e_face_pull, 5, 3, '15', 60,
  'SUPERSERIE con B1 · 60s descanso tras B2 · S3: 12-15 reps · S4: 12 reps', 'B');

-- C1: Curl Bíceps
INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group)
VALUES (v_day_b, e_bicep_curl, 6, 3, '12 por brazo', 60,
  'S3: 10-12/brazo · S4: 10/brazo', NULL);

-- D1: Pallof Press
INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group)
VALUES (v_day_b, e_pallof_press, 7, 3, '10 por lado', 45,
  'S2-S4: 12 por lado', NULL);

-- ============================================================
-- 6. DAY C EXERCISES
-- ============================================================

-- A1: Sentadilla Búlgara
INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group)
VALUES (v_day_c, e_bulgarian_split, 1, 3, '10 por pierna', 60,
  'Tempo 2-1-1-0 · S1: 3x10/pierna RPE 6-7 · S2: +2kg/manc RPE 7 · S3: 4x10/pierna RPE 7-8 · S4: 4x8/pierna RPE 8 (+2kg)', NULL);

-- A2: Hip Thrust desde suelo
INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group)
VALUES (v_day_c, e_hip_thrust_floor, 2, 3, '12-15', 60,
  'Tempo 2-2-1-0 · S2: 4x12 RPE 7 (+5%) · S3: 4x12 RPE 7-8 · S4: 4x10-12 RPE 8 (+5%)', NULL);

-- A3: Press Inclinado
INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group)
VALUES (v_day_c, e_incline_press, 3, 3, '10-12', 90,
  'S2: 3x10 RPE 7 (+2kg/manc) · S3: 4x10 RPE 7-8 · S4: 4x8 RPE 8 (+2kg)', NULL);

-- B1: Remo Sentado (superserie)
INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group)
VALUES (v_day_c, e_seated_row, 4, 3, '12', 0,
  'SUPERSERIE con B2 · S3: 10-12 reps · S4: 10 reps', 'B');

-- B2: Elevaciones Laterales (superserie)
INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group)
VALUES (v_day_c, e_lateral_raise, 5, 3, '15', 60,
  'SUPERSERIE con B1 · 60s descanso tras B2 · S3: 12-15 reps · S4: 12 reps', 'B');

-- C1: Bird Dog
INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group)
VALUES (v_day_c, e_bird_dog, 6, 3, '10 por lado', 45,
  'S2-S4: 12 por lado', NULL);

-- C2: Plancha Lateral
INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group)
VALUES (v_day_c, e_side_plank, 7, 2, '25-30s por lado', 30,
  'S2: 3x30-35s · S3: 3x35-40s · S4: 3x40-45s', NULL);

-- ============================================================
-- 7. ASSIGN TO MARY
-- ============================================================

SELECT id INTO v_client_id FROM clients WHERE email = 'marybornaghi@gmail.com' LIMIT 1;

IF v_client_id IS NOT NULL THEN
  INSERT INTO client_routines (client_id, routine_id, trainer_id, start_date, status, notes)
  VALUES (v_client_id, v_routine_id, v_trainer_id, '2026-03-03', 'active',
    'Plan Marzo 2026 - Progresión y Consolidación · 4 semanas · 3 días/semana');
END IF;

END $$;
