-- ============================================
-- TrainHub - Seed: Ejercicios del plan de Mary (Febrero 2026)
-- trainer_id = NULL => ejercicios de plataforma
-- Solo inserta si no existe ya un ejercicio con el mismo nombre
-- ============================================

-- === EJERCICIOS PRINCIPALES ===

INSERT INTO exercises (name, name_es, description, description_es, instructions, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, secondary_muscles, exercise_type, mechanics, force, source)
SELECT * FROM (VALUES

-- 1. Sentadilla Goblet con Mancuerna
('Goblet Squat', 'Sentadilla Goblet con Mancuerna',
 'Squat variation holding a dumbbell at chest height, great for beginners and muscle activation.',
 'Variante de sentadilla sosteniendo una mancuerna a la altura del pecho, ideal para principiantes y activación muscular.',
 'Hold a dumbbell close to your chest with elbows pointing down. Squat down controlled (3 sec) until elbows touch the inside of your knees. Pause 1 sec at the bottom. Push knees out following your feet.',
 'Mancuerna pegada al pecho, codos hacia abajo. Baja controlada (3 seg) hasta que los codos toquen el interior de las rodillas. Pausa 1 seg abajo. Rodillas hacia fuera siguiendo los pies.',
 ARRAY['quadriceps', 'glutes', 'core'], ARRAY['dumbbell'], 'beginner', 'strength',
 ARRAY['quadriceps', 'glutes'], ARRAY['core'],
 'compound', 'compound', 'push', 'seed'),

-- 2. Hip Thrust con Barra
('Barbell Hip Thrust', 'Hip Thrust con Barra',
 'Glute-dominant exercise performed with upper back on a bench and a barbell across the hips.',
 'Ejercicio dominante de glúteo realizado con la espalda media en un banco y una barra sobre las caderas.',
 'Lean upper back on bench at shoulder blade height. Feet hip-width apart. Drive hips up to full extension (no lumbar hyperextension), squeeze glutes at top and hold 2 seconds. Chin to chest.',
 'Espalda media apoyada en banco a la altura de las escápulas. Pies a la anchura de caderas. Sube hasta extensión completa de cadera (no hiperextensión lumbar), aprieta glúteos arriba y mantén 2 segundos. Barbilla al pecho.',
 ARRAY['glutes', 'hamstrings'], ARRAY['barbell', 'bench'], 'beginner', 'strength',
 ARRAY['glutes'], ARRAY['hamstrings'],
 'compound', 'compound', 'push', 'seed'),

-- 3. Press de Banca con Mancuernas
('Dumbbell Bench Press', 'Press de Banca con Mancuernas',
 'Horizontal pressing exercise targeting chest, front delts and triceps using dumbbells.',
 'Ejercicio de empuje horizontal que trabaja pecho, deltoides anterior y tríceps con mancuernas.',
 'Retract scapulae and keep chest elevated. Lower until elbows are at 90° or slightly below the bench. Elbows at 45° from torso (not flared at 90°). Push vertically.',
 'Retrae escápulas y mantén pecho elevado. Baja hasta que los codos queden a 90° o ligeramente por debajo del banco. Codos a 45° del torso (no abiertos a 90°). Empuja vertical.',
 ARRAY['chest', 'shoulders', 'triceps'], ARRAY['dumbbell', 'bench'], 'beginner', 'strength',
 ARRAY['chest'], ARRAY['shoulders', 'triceps'],
 'compound', 'compound', 'push', 'seed'),

-- 4. Peso Muerto Rumano con Mancuernas
('Dumbbell Romanian Deadlift', 'Peso Muerto Rumano con Mancuernas',
 'Hip hinge exercise targeting hamstrings and glutes with dumbbells.',
 'Ejercicio de bisagra de cadera que trabaja isquiosurales y glúteos con mancuernas.',
 'Slightly bent knees kept fixed. Hip hinge: push hips back. Lower until you feel tension in hamstrings (don''t force). Neutral spine throughout. Dumbbells close to legs.',
 'Rodillas ligeramente flexionadas y fijas. Bisagra de cadera: empuja el culo hacia atrás. Baja hasta sentir tensión en isquios (no forzar). Espalda neutra TODO el movimiento. Mancuernas cerca de las piernas.',
 ARRAY['hamstrings', 'glutes', 'back'], ARRAY['dumbbell'], 'beginner', 'strength',
 ARRAY['hamstrings', 'glutes'], ARRAY['back'],
 'compound', 'compound', 'pull', 'seed'),

-- 5. Zancadas Caminando con Mancuernas
('Dumbbell Walking Lunges', 'Zancadas Caminando con Mancuernas',
 'Dynamic unilateral leg exercise performed walking forward with dumbbells.',
 'Ejercicio unilateral dinámico de pierna caminando hacia adelante con mancuernas.',
 'Take a long step. Back knee almost touches the floor. Torso upright, eyes forward. Push from the heel of the front leg. Control the descent.',
 'Paso largo. Rodilla trasera casi toca el suelo. Torso erguido, mirada al frente. Empuja desde el talón de la pierna delantera. Controla el descenso.',
 ARRAY['quadriceps', 'glutes'], ARRAY['dumbbell'], 'beginner', 'strength',
 ARRAY['quadriceps', 'glutes'], ARRAY['core'],
 'compound', 'compound', 'push', 'seed'),

-- 6. Remo con Mancuerna a Una Mano
('Single Arm Dumbbell Row', 'Remo con Mancuerna a Una Mano',
 'Unilateral back exercise performed with one hand and knee on a bench.',
 'Ejercicio unilateral de espalda con una mano y rodilla apoyadas en banco.',
 'Hand and knee of the same side on bench. Pull elbow towards hip, not upward. No torso rotation. Squeeze scapula at top for 1 second.',
 'Mano y rodilla del mismo lado en banco. Tira el codo hacia la cadera, no hacia arriba. Sin rotar el torso. Aprieta escápula arriba 1 segundo.',
 ARRAY['back', 'biceps', 'traps'], ARRAY['dumbbell', 'bench'], 'beginner', 'strength',
 ARRAY['lats', 'back'], ARRAY['biceps', 'traps'],
 'compound', 'compound', 'pull', 'seed'),

-- 7. Press Militar con Mancuernas (De pie)
('Standing Dumbbell Overhead Press', 'Press Militar con Mancuernas (De pie)',
 'Vertical pressing exercise targeting shoulders, triceps and core stability.',
 'Ejercicio de empuje vertical que trabaja deltoides, tríceps y estabilidad del core.',
 'Push vertically, not forward. Brace abs and glutes for stability. Don''t arch lower back.',
 'Empuja vertical, no hacia delante. Aprieta abdomen y glúteos para estabilizar. No arquear la lumbar.',
 ARRAY['shoulders', 'triceps', 'core'], ARRAY['dumbbell'], 'intermediate', 'strength',
 ARRAY['shoulders'], ARRAY['triceps', 'core'],
 'compound', 'compound', 'push', 'seed'),

-- 8. Sentadilla Búlgara con Mancuernas
('Dumbbell Bulgarian Split Squat', 'Sentadilla Búlgara con Mancuernas',
 'Unilateral squat with rear foot elevated on a bench, excellent for quad and glute development.',
 'Sentadilla unilateral con pie trasero elevado en banco, excelente para desarrollo de cuádriceps y glúteos.',
 'Rear foot on bench (top of foot resting). Distance: when lowering, front knee does not pass toe tip. Torso slightly leaning forward. Lower until back knee almost touches the floor.',
 'Pie trasero en banco (empeine apoyado). Distancia: al bajar, rodilla delantera no pasa la punta del pie. Torso ligeramente inclinado hacia delante. Baja hasta que la rodilla trasera casi toque el suelo.',
 ARRAY['quadriceps', 'glutes', 'core'], ARRAY['dumbbell', 'bench'], 'intermediate', 'strength',
 ARRAY['quadriceps', 'glutes'], ARRAY['core'],
 'compound', 'compound', 'push', 'seed'),

-- 9. Glute Bridge con Barra
('Barbell Glute Bridge', 'Glute Bridge con Barra (desde suelo)',
 'Glute-dominant exercise performed lying on the floor with a barbell across the hips.',
 'Ejercicio dominante de glúteo realizado tumbada en el suelo con barra sobre caderas.',
 'Lying face up, feet hip-width apart. Drive hips up squeezing glutes (not lower back). Hold 2 seconds at top. Lower controlled without touching the floor between reps.',
 'Tumbada boca arriba, pies a la anchura de caderas. Sube cadera apretando glúteos (no lumbar). Mantén 2 segundos arriba. Baja controlado sin tocar el suelo entre reps.',
 ARRAY['glutes', 'hamstrings'], ARRAY['barbell'], 'beginner', 'strength',
 ARRAY['glutes'], ARRAY['hamstrings'],
 'compound', 'compound', 'push', 'seed'),

-- 10. Press Mancuernas en Banco Inclinado
('Incline Dumbbell Bench Press', 'Press Mancuernas en Banco Inclinado (30-45°)',
 'Upper chest pressing exercise on an inclined bench with dumbbells.',
 'Ejercicio de empuje para pectoral superior en banco inclinado con mancuernas.',
 'Bench at 30-45°. Retracted scapulae. Lower dumbbells to chest level (not shoulders). Push diagonally towards the ceiling.',
 'Banco a 30-45°. Escápulas retraídas. Baja mancuernas a nivel del pecho (no hombros). Empuja diagonal hacia el techo.',
 ARRAY['chest', 'shoulders', 'triceps'], ARRAY['dumbbell', 'bench'], 'beginner', 'strength',
 ARRAY['chest'], ARRAY['shoulders', 'triceps'],
 'compound', 'compound', 'push', 'seed'),

-- === ACCESORIOS ===

-- 11. Jalón al Pecho (Agarre Ancho)
('Wide Grip Lat Pulldown', 'Jalón al Pecho (Agarre Ancho)',
 'Back exercise pulling a wide bar down to the chest on a cable machine.',
 'Ejercicio de espalda tirando una barra ancha hacia el pecho en máquina de poleas.',
 'Pull with elbows towards ribs, not with hands. Chest towards the bar. Brief pause at bottom.',
 'Tira con los codos hacia las costillas, no con las manos. Pecho hacia la barra. Pausa breve abajo.',
 ARRAY['back', 'biceps'], ARRAY['cable'], 'beginner', 'strength',
 ARRAY['lats', 'back'], ARRAY['biceps'],
 'compound', 'compound', 'pull', 'seed'),

-- 12. Extensión de Tríceps en Polea (Cuerda)
('Cable Rope Tricep Pushdown', 'Extensión de Tríceps en Polea (Cuerda)',
 'Tricep isolation exercise using a rope attachment on a cable machine.',
 'Ejercicio de aislamiento de tríceps usando cuerda en polea.',
 'Elbows pinned to body. Spread hands at the end of the movement. Squeeze triceps at bottom.',
 'Codos pegados al cuerpo. Separa las manos al final del movimiento. Aprieta tríceps abajo.',
 ARRAY['triceps'], ARRAY['cable'], 'beginner', 'strength',
 ARRAY['triceps'], ARRAY[]::text[],
 'isolation', 'isolation', 'push', 'seed'),

-- 13. Face Pull en Polea
('Cable Face Pull', 'Face Pull en Polea',
 'Rear delt and rotator cuff exercise using a rope on a high cable pulley.',
 'Ejercicio de deltoides posterior y manguito rotador con cuerda en polea alta.',
 'Cable at face height. Pull towards face opening elbows. Finish with external rotation (thumbs pointing back). Squeeze scapulae.',
 'Polea a la altura de la cara. Tira hacia la cara abriendo los codos. Termina con rotación externa (pulgares hacia atrás). Aprieta escápulas.',
 ARRAY['shoulders', 'back'], ARRAY['cable'], 'beginner', 'strength',
 ARRAY['shoulders'], ARRAY['traps', 'back'],
 'isolation', 'isolation', 'pull', 'seed'),

-- 14. Curl de Bíceps con Mancuernas (Alterno)
('Alternating Dumbbell Bicep Curl', 'Curl de Bíceps con Mancuernas (Alterno)',
 'Classic bicep isolation exercise alternating arms with dumbbells.',
 'Ejercicio clásico de aislamiento de bíceps alternando brazos con mancuernas.',
 'Elbows fixed pinned to body. Full supination at top. Lower controlled.',
 'Codos fijos pegados al cuerpo. Supinación completa arriba. Baja controlado.',
 ARRAY['biceps'], ARRAY['dumbbell'], 'beginner', 'strength',
 ARRAY['biceps'], ARRAY[]::text[],
 'isolation', 'isolation', 'pull', 'seed'),

-- 15. Remo Sentado en Polea (Agarre Estrecho)
('Seated Cable Row (Close Grip)', 'Remo Sentado en Polea (Agarre Estrecho)',
 'Back exercise pulling a close-grip handle towards the abdomen on a seated cable row.',
 'Ejercicio de espalda tirando un agarre estrecho hacia el abdomen en polea sentado.',
 'Pull towards belly button. Squeeze scapulae at the end. Don''t lean back more than 10-15°.',
 'Tira hacia el ombligo. Aprieta escápulas al final. No te inclines hacia atrás más de 10-15°.',
 ARRAY['back', 'biceps'], ARRAY['cable'], 'beginner', 'strength',
 ARRAY['lats', 'back'], ARRAY['biceps', 'traps'],
 'compound', 'compound', 'pull', 'seed'),

-- 16. Elevaciones Laterales con Mancuernas
('Dumbbell Lateral Raises', 'Elevaciones Laterales con Mancuernas',
 'Shoulder isolation exercise lifting dumbbells out to the sides.',
 'Ejercicio de aislamiento de hombros elevando mancuernas lateralmente.',
 'Slightly bent elbows. Raise to shoulder height (no higher). Pinky slightly higher than thumb.',
 'Codos ligeramente flexionados. Sube hasta altura de hombros (no más). Meñique ligeramente más alto que pulgar.',
 ARRAY['shoulders'], ARRAY['dumbbell'], 'beginner', 'strength',
 ARRAY['shoulders'], ARRAY[]::text[],
 'isolation', 'isolation', 'push', 'seed'),

-- === CORE ===

-- 17. Plancha Frontal
('Front Plank', 'Plancha Frontal',
 'Isometric core exercise holding a push-up position on forearms.',
 'Ejercicio isométrico de core manteniendo posición de flexión sobre antebrazos.',
 'Straight line from head to heels. Brace abs and glutes. Don''t let hips sag or pike.',
 'Cuerpo en línea recta desde cabeza hasta talones. Aprieta abdomen y glúteos. No hundir ni subir cadera.',
 ARRAY['core'], ARRAY['bodyweight'], 'beginner', 'strength',
 ARRAY['core'], ARRAY[]::text[],
 'isolation', 'isolation', 'static', 'seed'),

-- 18. Dead Bug
('Dead Bug', 'Dead Bug',
 'Anti-extension core exercise performed lying on your back.',
 'Ejercicio anti-extensión de core realizado tumbado boca arriba.',
 'Lower back glued to the floor at ALL times. Extend opposite arm and leg slowly. If lower back lifts, reduce range of motion.',
 'Lumbar pegada al suelo TODO el tiempo. Extiende brazo y pierna opuestos lentamente. Si la lumbar se despega, reduce el rango.',
 ARRAY['core'], ARRAY['bodyweight'], 'beginner', 'balance',
 ARRAY['core'], ARRAY[]::text[],
 'isolation', 'isolation', 'static', 'seed'),

-- 19. Pallof Press (Anti-rotación)
('Pallof Press', 'Pallof Press (Anti-rotación)',
 'Anti-rotation core exercise using a cable machine.',
 'Ejercicio anti-rotación de core usando polea.',
 'Stand sideways to the cable. Extend arms without letting body rotate. Hold 2 seconds extended. Control the return.',
 'De pie lateral a la polea. Extiende brazos sin que el cuerpo rote. Mantén 2 segundos extendido. Controla el regreso.',
 ARRAY['core'], ARRAY['cable'], 'beginner', 'strength',
 ARRAY['core'], ARRAY[]::text[],
 'isolation', 'isolation', 'static', 'seed'),

-- 20. Bird Dog
('Bird Dog', 'Bird Dog',
 'Core stability exercise performed on hands and knees.',
 'Ejercicio de estabilidad de core en cuadrupedia.',
 'On all fours. Extend opposite arm and leg slowly (3 sec). No hip or shoulder rotation. Hold straight line 2 seconds at top.',
 'En cuadrupedia. Extiende brazo y pierna opuestos lentamente (3 seg). Sin rotar cadera ni hombros. Mantén línea recta 2 segundos arriba.',
 ARRAY['core', 'glutes'], ARRAY['bodyweight'], 'beginner', 'balance',
 ARRAY['core'], ARRAY['glutes'],
 'isolation', 'isolation', 'static', 'seed'),

-- 21. Plancha Lateral
('Side Plank', 'Plancha Lateral',
 'Isometric lateral core exercise targeting obliques.',
 'Ejercicio isométrico lateral de core que trabaja oblicuos.',
 'Straight line body. Hips up. If too hard, support on lower knee.',
 'Cuerpo en línea recta. Cadera arriba. Si es difícil, apoya rodilla inferior.',
 ARRAY['core'], ARRAY['bodyweight'], 'beginner', 'strength',
 ARRAY['core'], ARRAY[]::text[],
 'isolation', 'isolation', 'static', 'seed')

) AS v(name, name_es, description, description_es, instructions, instructions_es, muscle_groups, equipment, difficulty, category, primary_muscles, secondary_muscles, exercise_type, mechanics, force, source)
WHERE NOT EXISTS (
  SELECT 1 FROM exercises e WHERE e.name = v.name
);
