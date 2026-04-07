-- ============================================
-- Migration 00030: Seed Laura Training Template
-- Tonificación general — principiante — 3 días/semana
-- With thumbnail_url from free-exercise-db where available
-- ============================================

DO $$
DECLARE
  v_trainer_id UUID := '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f';
  v_img TEXT := 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';
  v_routine_id UUID;
  v_day_a_id UUID;
  v_day_b_id UUID;
  v_day_c_id UUID;
  -- Exercise IDs
  e_marcha UUID;
  e_sentadilla_aire UUID;
  e_puente_glut UUID;
  e_sent_goblet UUID;
  e_puente_glut_pesa UUID;
  e_zancada_rev UUID;
  e_abduc_banda UUID;
  e_patada_glut UUID;
  e_elev_talones UUID;
  e_dead_bug UUID;
  e_plancha_frontal UUID;
  e_rot_hombro UUID;
  e_apert_pecho_banda UUID;
  e_remo_banda UUID;
  e_press_hombro UUID;
  e_curl_biceps UUID;
  e_ext_triceps UUID;
  e_elev_laterales UUID;
  e_remo_1brazo UUID;
  e_crunch_fitball UUID;
  e_plancha_lateral UUID;
  e_rebotes_fitball UUID;
  e_sent_pausa UUID;
  e_sent_banda UUID;
  e_flex_fitball UUID;
  e_puente_1pierna UUID;
  e_remo_invertido UUID;
  e_abduc_pie UUID;
  e_superman UUID;
  e_estir_cuad UUID;
  e_estir_glut UUID;
  e_resp_diafr UUID;
  g_id UUID;
BEGIN

  -- ============================================
  -- 1. Create exercises (with images where available)
  -- ============================================

  -- Day A
  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'March in Place with High Knees', 'Marcha en el sitio con rodillas altas', '{"quadriceps","hip flexors"}', '{"body only"}', 'beginner', 'cardio', 'custom', NULL, '{}')
  RETURNING id INTO e_marcha;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Bodyweight Squat', 'Sentadilla al aire (sin carga)', '{"quadriceps","glutes"}', '{"body only"}', 'beginner', 'strength', 'custom',
    v_img || '/Bodyweight_Squat/0.jpg', ARRAY[v_img || '/Bodyweight_Squat/0.jpg', v_img || '/Bodyweight_Squat/1.jpg'])
  RETURNING id INTO e_sentadilla_aire;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Glute Bridge', 'Puente de glúteo sin carga', '{"glutes","hamstrings"}', '{"body only"}', 'beginner', 'strength', 'custom',
    v_img || '/Butt_Lift_Bridge/0.jpg', ARRAY[v_img || '/Butt_Lift_Bridge/0.jpg', v_img || '/Butt_Lift_Bridge/1.jpg'])
  RETURNING id INTO e_puente_glut;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Goblet Squat', 'Sentadilla goblet con pesa', '{"quadriceps","glutes"}', '{"dumbbell"}', 'beginner', 'strength', 'custom',
    v_img || '/Goblet_Squat/0.jpg', ARRAY[v_img || '/Goblet_Squat/0.jpg', v_img || '/Goblet_Squat/1.jpg'])
  RETURNING id INTO e_sent_goblet;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Weighted Glute Bridge', 'Puente de glúteo con pesa en cadera', '{"glutes","hamstrings"}', '{"dumbbell"}', 'beginner', 'strength', 'custom',
    v_img || '/Barbell_Glute_Bridge/0.jpg', ARRAY[v_img || '/Barbell_Glute_Bridge/0.jpg', v_img || '/Barbell_Glute_Bridge/1.jpg'])
  RETURNING id INTO e_puente_glut_pesa;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Reverse Lunge', 'Zancada reversa en el sitio', '{"quadriceps","glutes"}', '{"body only"}', 'beginner', 'strength', 'custom',
    v_img || '/Bodyweight_Walking_Lunge/0.jpg', ARRAY[v_img || '/Bodyweight_Walking_Lunge/0.jpg', v_img || '/Bodyweight_Walking_Lunge/1.jpg'])
  RETURNING id INTO e_zancada_rev;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Banded Hip Abduction Lying', 'Abducción de cadera tumbada con banda elástica', '{"abductors","glutes"}', '{"bands"}', 'beginner', 'strength', 'custom',
    v_img || '/Side_Leg_Raises/0.jpg', ARRAY[v_img || '/Side_Leg_Raises/0.jpg', v_img || '/Side_Leg_Raises/1.jpg'])
  RETURNING id INTO e_abduc_banda;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Quadruped Glute Kickback', 'Patada de glúteo a cuadrupedia con pesa de tobillo', '{"glutes"}', '{"body only"}', 'beginner', 'strength', 'custom',
    v_img || '/Glute_Kickback/0.jpg', ARRAY[v_img || '/Glute_Kickback/0.jpg', v_img || '/Glute_Kickback/1.jpg'])
  RETURNING id INTO e_patada_glut;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Standing Calf Raise', 'Elevación de talones de pie (gemelos)', '{"calves"}', '{"body only"}', 'beginner', 'strength', 'custom',
    v_img || '/Standing_Calf_Raises/0.jpg', ARRAY[v_img || '/Standing_Calf_Raises/0.jpg', v_img || '/Standing_Calf_Raises/1.jpg'])
  RETURNING id INTO e_elev_talones;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Dead Bug', 'Dead Bug', '{"abdominals"}', '{"body only"}', 'beginner', 'strength', 'custom',
    v_img || '/Dead_Bug/0.jpg', ARRAY[v_img || '/Dead_Bug/0.jpg', v_img || '/Dead_Bug/1.jpg'])
  RETURNING id INTO e_dead_bug;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Elbow Plank', 'Plancha frontal en codos', '{"abdominals"}', '{"body only"}', 'beginner', 'strength', 'custom',
    v_img || '/Plank/0.jpg', ARRAY[v_img || '/Plank/0.jpg', v_img || '/Plank/1.jpg'])
  RETURNING id INTO e_plancha_frontal;

  -- Day B
  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Shoulder Arm Circles', 'Rotaciones de hombro con brazo extendido', '{"shoulders"}', '{"body only"}', 'beginner', 'flexibility', 'custom', NULL, '{}')
  RETURNING id INTO e_rot_hombro;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Band Chest Fly', 'Apertura de pecho con banda elástica', '{"chest","shoulders"}', '{"bands"}', 'beginner', 'strength', 'custom',
    v_img || '/Reverse_Flyes/0.jpg', ARRAY[v_img || '/Reverse_Flyes/0.jpg', v_img || '/Reverse_Flyes/1.jpg'])
  RETURNING id INTO e_apert_pecho_banda;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Band Seated Row', 'Remo con banda elástica a 2 manos', '{"middle back","lats"}', '{"bands"}', 'beginner', 'strength', 'custom',
    v_img || '/Bent_Over_Barbell_Row/0.jpg', ARRAY[v_img || '/Bent_Over_Barbell_Row/0.jpg', v_img || '/Bent_Over_Barbell_Row/1.jpg'])
  RETURNING id INTO e_remo_banda;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Seated Dumbbell Press', 'Press de hombro con pesas', '{"shoulders"}', '{"dumbbell"}', 'beginner', 'strength', 'custom',
    v_img || '/Dumbbell_Shoulder_Press/0.jpg', ARRAY[v_img || '/Dumbbell_Shoulder_Press/0.jpg', v_img || '/Dumbbell_Shoulder_Press/1.jpg'])
  RETURNING id INTO e_press_hombro;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Dumbbell Bicep Curl', 'Curl de bíceps con pesas', '{"biceps"}', '{"dumbbell"}', 'beginner', 'strength', 'custom',
    v_img || '/Dumbbell_Bicep_Curl/0.jpg', ARRAY[v_img || '/Dumbbell_Bicep_Curl/0.jpg', v_img || '/Dumbbell_Bicep_Curl/1.jpg'])
  RETURNING id INTO e_curl_biceps;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Overhead Band Tricep Extension', 'Extensión de tríceps con banda elástica sobre cabeza', '{"triceps"}', '{"bands"}', 'beginner', 'strength', 'custom',
    v_img || '/Cable_Rope_Overhead_Triceps_Extension/0.jpg', ARRAY[v_img || '/Cable_Rope_Overhead_Triceps_Extension/0.jpg', v_img || '/Cable_Rope_Overhead_Triceps_Extension/1.jpg'])
  RETURNING id INTO e_ext_triceps;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Dumbbell Lateral Raise', 'Elevaciones laterales con pesas', '{"shoulders"}', '{"dumbbell"}', 'beginner', 'strength', 'custom',
    v_img || '/Side_Lateral_Raise/0.jpg', ARRAY[v_img || '/Side_Lateral_Raise/0.jpg', v_img || '/Side_Lateral_Raise/1.jpg'])
  RETURNING id INTO e_elev_laterales;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Single Arm Band Row', 'Remo con banda a 1 brazo', '{"middle back","lats"}', '{"bands"}', 'beginner', 'strength', 'custom',
    v_img || '/Alternating_Kettlebell_Row/0.jpg', ARRAY[v_img || '/Alternating_Kettlebell_Row/0.jpg', v_img || '/Alternating_Kettlebell_Row/1.jpg'])
  RETURNING id INTO e_remo_1brazo;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Fitball Crunch', 'Crunch abdominal sobre fitball', '{"abdominals"}', '{"exercise ball"}', 'beginner', 'strength', 'custom',
    v_img || '/Exercise_Ball_Crunch/0.jpg', ARRAY[v_img || '/Exercise_Ball_Crunch/0.jpg', v_img || '/Exercise_Ball_Crunch/1.jpg'])
  RETURNING id INTO e_crunch_fitball;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Kneeling Side Plank', 'Plancha lateral de rodillas', '{"abdominals","obliques"}', '{"body only"}', 'beginner', 'strength', 'custom',
    v_img || '/Side_Bridge/0.jpg', ARRAY[v_img || '/Side_Bridge/0.jpg', v_img || '/Side_Bridge/1.jpg'])
  RETURNING id INTO e_plancha_lateral;

  -- Day C
  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Fitball Seated Bounce', 'Sentada en fitball con rebotes suaves', '{"abdominals"}', '{"exercise ball"}', 'beginner', 'cardio', 'custom', NULL, '{}')
  RETURNING id INTO e_rebotes_fitball;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Pause Squat', 'Sentadilla al aire con pausa abajo', '{"quadriceps","glutes"}', '{"body only"}', 'beginner', 'strength', 'custom',
    v_img || '/Bodyweight_Squat/0.jpg', ARRAY[v_img || '/Bodyweight_Squat/0.jpg', v_img || '/Bodyweight_Squat/1.jpg'])
  RETURNING id INTO e_sent_pausa;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Banded Squat', 'Sentadilla con banda elástica bajo los pies', '{"quadriceps","glutes"}', '{"bands"}', 'beginner', 'strength', 'custom',
    v_img || '/Squat_with_Bands/0.jpg', ARRAY[v_img || '/Squat_with_Bands/0.jpg', v_img || '/Squat_with_Bands/1.jpg'])
  RETURNING id INTO e_sent_banda;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Fitball Knee Push-Up', 'Flexión de brazos en fitball (rodillas apoyadas)', '{"chest","triceps"}', '{"exercise ball"}', 'beginner', 'strength', 'custom',
    v_img || '/Pushups/0.jpg', ARRAY[v_img || '/Pushups/0.jpg', v_img || '/Pushups/1.jpg'])
  RETURNING id INTO e_flex_fitball;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Single Leg Glute Bridge', 'Puente de glúteo a 1 pierna', '{"glutes","hamstrings"}', '{"body only"}', 'beginner', 'strength', 'custom',
    v_img || '/Single_Leg_Glute_Bridge/0.jpg', ARRAY[v_img || '/Single_Leg_Glute_Bridge/0.jpg', v_img || '/Single_Leg_Glute_Bridge/1.jpg'])
  RETURNING id INTO e_puente_1pierna;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Inverted Row Under Table', 'Remo invertido bajo la mesa', '{"middle back","biceps"}', '{"body only"}', 'beginner', 'strength', 'custom', NULL, '{}')
  RETURNING id INTO e_remo_invertido;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Standing Band Abduction', 'Abducción con banda + pesa tobillo en pie', '{"abductors","glutes"}', '{"bands"}', 'beginner', 'strength', 'custom',
    v_img || '/Side_Leg_Raises/0.jpg', ARRAY[v_img || '/Side_Leg_Raises/0.jpg', v_img || '/Side_Leg_Raises/1.jpg'])
  RETURNING id INTO e_abduc_pie;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Modified Superman Arms Only', 'Superman modificado (solo brazos)', '{"lower back","shoulders"}', '{"body only"}', 'beginner', 'strength', 'custom',
    v_img || '/Superman/0.jpg', ARRAY[v_img || '/Superman/0.jpg', v_img || '/Superman/1.jpg'])
  RETURNING id INTO e_superman;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Standing Quad Stretch', 'Estiramiento de cuádriceps de pie', '{"quadriceps"}', '{"body only"}', 'beginner', 'flexibility', 'custom', NULL, '{}')
  RETURNING id INTO e_estir_cuad;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Figure 4 Glute Stretch', 'Estiramiento de glúteo en el suelo (figura 4)', '{"glutes"}', '{"body only"}', 'beginner', 'flexibility', 'custom',
    v_img || '/Seated_Glute/0.jpg', ARRAY[v_img || '/Seated_Glute/0.jpg', v_img || '/Seated_Glute/1.jpg'])
  RETURNING id INTO e_estir_glut;

  INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, thumbnail_url, images)
  VALUES (gen_random_uuid(), v_trainer_id, 'Diaphragmatic Breathing', 'Respiración diafragmática', '{"abdominals"}', '{"body only"}', 'beginner', 'flexibility', 'custom', NULL, '{}')
  RETURNING id INTO e_resp_diafr;

  -- ============================================
  -- 2. Create routine template
  -- ============================================
  INSERT INTO routines (id, trainer_id, name, description, duration_weeks, days_per_week, difficulty, target_gender, is_template)
  VALUES (
    gen_random_uuid(), v_trainer_id,
    'Tonificación General — Principiante (Mujer)',
    'Tonificación general — forma física y bienestar. 3 sesiones de 35 min. Adaptado para restricciones lumbares y de rodilla (sin impacto, sin extensiones de columna bajo carga).',
    12, 3, 'beginner', 'female', false
  ) RETURNING id INTO v_routine_id;

  -- ============================================
  -- 3. Create days
  -- ============================================
  INSERT INTO routine_days (id, routine_id, day_number, name, description)
  VALUES (gen_random_uuid(), v_routine_id, 1, 'Tren inferior + Glúteo + Core', 'Calentamiento 5-6 min → Fuerza en circuito por parejas 22-24 min → Core en suelo 6-7 min. Duración total: 35 min.')
  RETURNING id INTO v_day_a_id;

  INSERT INTO routine_days (id, routine_id, day_number, name, description)
  VALUES (gen_random_uuid(), v_routine_id, 2, 'Tren superior + Core', 'Calentamiento 5 min → Fuerza tren superior 22-24 min → Core con fitball 6-7 min. Duración total: 35 min.')
  RETURNING id INTO v_day_b_id;

  INSERT INTO routine_days (id, routine_id, day_number, name, description)
  VALUES (gen_random_uuid(), v_routine_id, 3, 'Full Body — Bandas + Fitball', 'Calentamiento 5 min → Circuito full body 3 vueltas 22-24 min → Vuelta a la calma 4-5 min. Duración total: 35 min.')
  RETURNING id INTO v_day_c_id;

  -- ============================================
  -- 4. Day A
  -- ============================================
  INSERT INTO exercise_groups (id, routine_day_id, group_type, order_index, label, notes)
  VALUES (gen_random_uuid(), v_day_a_id, 'solo', 0, 'Calentamiento', '5-6 min') RETURNING id INTO g_id;
  INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group) VALUES
    (v_day_a_id, e_marcha, 0, 1, '2 min', 0, 'Ritmo suave, activa la circulación', NULL),
    (v_day_a_id, e_sentadilla_aire, 1, 2, '10', 20, 'Profundidad cómoda, rodillas alineadas con pies', NULL),
    (v_day_a_id, e_puente_glut, 2, 2, '10', 20, 'Pausa 2s arriba, lumbar neutra', NULL);

  INSERT INTO exercise_groups (id, routine_day_id, group_type, order_index, label, notes)
  VALUES (gen_random_uuid(), v_day_a_id, 'superset', 1, 'A', 'Fuerza — Circuito por parejas') RETURNING id INTO g_id;
  INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group) VALUES
    (v_day_a_id, e_sent_goblet, 3, 3, '10-12', 0, 'Pesa 5 kg al pecho, espalda recta, no sobrepasar profundidad cómoda', 1),
    (v_day_a_id, e_puente_glut_pesa, 4, 3, '12', 45, 'Pesa 5 kg estabilizada con manos, pausa 1s arriba', 1);

  INSERT INTO exercise_groups (id, routine_day_id, group_type, order_index, label, notes)
  VALUES (gen_random_uuid(), v_day_a_id, 'superset', 2, 'B', NULL) RETURNING id INTO g_id;
  INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group) VALUES
    (v_day_a_id, e_zancada_rev, 5, 3, '8 c/lado', 0, 'Paso atrás controlado, rodilla delantera no más allá de la punta del pie', 2),
    (v_day_a_id, e_abduc_banda, 6, 3, '15 c/lado', 45, 'Banda por encima de rodillas, movimiento lento y controlado', 2);

  INSERT INTO exercise_groups (id, routine_day_id, group_type, order_index, label, notes)
  VALUES (gen_random_uuid(), v_day_a_id, 'superset', 3, 'C', NULL) RETURNING id INTO g_id;
  INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group) VALUES
    (v_day_a_id, e_patada_glut, 7, 3, '12 c/lado', 0, 'Cadera fija, no rotar el tronco, mirada al suelo', 3),
    (v_day_a_id, e_elev_talones, 8, 3, '15', 45, 'Mano en pared para equilibrio, subida lenta', 3);

  INSERT INTO exercise_groups (id, routine_day_id, group_type, order_index, label, notes)
  VALUES (gen_random_uuid(), v_day_a_id, 'solo', 4, 'Core — Suelo', '6-7 min') RETURNING id INTO g_id;
  INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group) VALUES
    (v_day_a_id, e_dead_bug, 9, 3, '6 c/lado', 30, 'Lumbar pegada al suelo en todo momento — clave para su lumbar', NULL),
    (v_day_a_id, e_plancha_frontal, 10, 3, '20-30s', 30, 'Cadera alineada, no subir el trasero', NULL);

  -- ============================================
  -- 5. Day B
  -- ============================================
  INSERT INTO exercise_groups (id, routine_day_id, group_type, order_index, label, notes)
  VALUES (gen_random_uuid(), v_day_b_id, 'solo', 0, 'Calentamiento', '5 min') RETURNING id INTO g_id;
  INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group) VALUES
    (v_day_b_id, e_rot_hombro, 0, 2, '10 círculos c/lado', 20, 'Adelante y atrás, amplitud progresiva', NULL),
    (v_day_b_id, e_apert_pecho_banda, 1, 2, '12', 20, 'Banda a la altura del pecho, codos ligeramente flexionados', NULL);

  INSERT INTO exercise_groups (id, routine_day_id, group_type, order_index, label, notes)
  VALUES (gen_random_uuid(), v_day_b_id, 'superset', 1, 'A', 'Fuerza — Tren superior') RETURNING id INTO g_id;
  INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group) VALUES
    (v_day_b_id, e_remo_banda, 2, 3, '12-15', 0, 'Banda anclada en puerta o silla, codos pegados al cuerpo', 1),
    (v_day_b_id, e_press_hombro, 3, 3, '10-12', 45, 'Sentada en fitball para activar core, pesas 3 kg, no arquear la espalda', 1);

  INSERT INTO exercise_groups (id, routine_day_id, group_type, order_index, label, notes)
  VALUES (gen_random_uuid(), v_day_b_id, 'superset', 2, 'B', NULL) RETURNING id INTO g_id;
  INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group) VALUES
    (v_day_b_id, e_curl_biceps, 4, 3, '10-12', 0, 'Pesas 3 kg, codos fijos a los costados, supinación al subir', 2),
    (v_day_b_id, e_ext_triceps, 5, 3, '12', 45, 'Codo apuntando al techo, movimiento de antebrazo solo', 2);

  INSERT INTO exercise_groups (id, routine_day_id, group_type, order_index, label, notes)
  VALUES (gen_random_uuid(), v_day_b_id, 'superset', 3, 'C', NULL) RETURNING id INTO g_id;
  INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group) VALUES
    (v_day_b_id, e_elev_laterales, 6, 3, '12', 0, 'Pesas 3 kg, codo ligeramente flexionado, no subir por encima del hombro', 3),
    (v_day_b_id, e_remo_1brazo, 7, 3, '12 c/lado', 45, 'Espalda recta, tirar del codo hacia atrás', 3);

  INSERT INTO exercise_groups (id, routine_day_id, group_type, order_index, label, notes)
  VALUES (gen_random_uuid(), v_day_b_id, 'solo', 4, 'Core — Fitball', '6-7 min') RETURNING id INTO g_id;
  INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group) VALUES
    (v_day_b_id, e_crunch_fitball, 8, 3, '15', 30, 'Lumbar apoyada en la pelota, movimiento corto y controlado', NULL),
    (v_day_b_id, e_plancha_lateral, 9, 3, '20s c/lado', 30, 'Versión adaptada — rodilla apoyada, cadera elevada', NULL);

  -- ============================================
  -- 6. Day C
  -- ============================================
  INSERT INTO exercise_groups (id, routine_day_id, group_type, order_index, label, notes)
  VALUES (gen_random_uuid(), v_day_c_id, 'solo', 0, 'Calentamiento', '5 min') RETURNING id INTO g_id;
  INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group) VALUES
    (v_day_c_id, e_rebotes_fitball, 0, 1, '1 min', 0, 'Activación del core de forma natural', NULL),
    (v_day_c_id, e_sent_pausa, 1, 2, '8', 20, '2s de pausa en la posición baja', NULL);

  INSERT INTO exercise_groups (id, routine_day_id, group_type, order_index, rounds, rest_between_rounds, label, notes)
  VALUES (gen_random_uuid(), v_day_c_id, 'circuit', 1, 3, 60, 'Circuito Full Body', 'Completar los 6 ejercicios seguidos = 1 vuelta. Descansar 60s entre vueltas.') RETURNING id INTO g_id;
  INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group) VALUES
    (v_day_c_id, e_sent_banda, 2, 3, '12', 0, 'Banda aporta resistencia al subir, rodillas hacia fuera', 4),
    (v_day_c_id, e_flex_fitball, 3, 3, '6-8', 0, 'Manos sobre la pelota, cuerpo recto de rodillas a hombros', 4),
    (v_day_c_id, e_puente_1pierna, 4, 3, '8 c/lado', 0, 'Progresión del puente básico — controlar la cadera', 4),
    (v_day_c_id, e_remo_invertido, 5, 3, '8-10', 0, 'Cuerpo recto, tirar del pecho hacia la mesa', 4),
    (v_day_c_id, e_abduc_pie, 6, 3, '12 c/lado', 0, 'De pie, mano en pared, pierna se eleva lateralmente', 4),
    (v_day_c_id, e_superman, 7, 3, '10-12', 0, 'Tumbada boca abajo, solo elevar brazos — lumbar sin compresión', 4);

  INSERT INTO exercise_groups (id, routine_day_id, group_type, order_index, label, notes)
  VALUES (gen_random_uuid(), v_day_c_id, 'solo', 2, 'Vuelta a la calma', '4-5 min') RETURNING id INTO g_id;
  INSERT INTO routine_exercises (routine_day_id, exercise_id, order_index, sets, reps, rest_seconds, notes, superset_group) VALUES
    (v_day_c_id, e_estir_cuad, 8, 1, '30s c/lado', 0, 'Mano en pared para equilibrio', NULL),
    (v_day_c_id, e_estir_glut, 9, 1, '30s c/lado', 0, 'Tumbada, tobillo sobre rodilla contraria', NULL),
    (v_day_c_id, e_resp_diafr, 10, 1, '5 respiraciones', 0, 'Mano en barriga, inhala 4s, exhala 6s', NULL);

  RAISE NOTICE 'Template created: % with ID %', 'Tonificación General — Principiante (Mujer)', v_routine_id;
END $$;
