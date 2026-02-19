-- ============================================
-- TrainHub - Seed: Ejercicios base de plataforma
-- trainer_id = NULL => ejercicios de plataforma
-- ============================================

INSERT INTO exercises (name, description, instructions, muscle_groups, equipment, difficulty, category) VALUES

-- === PECHO ===
('Press de banca', 'Ejercicio compuesto para pecho con barra', 'Acuestate en el banco, agarra la barra con agarre medio. Baja la barra al pecho y empuja hacia arriba.', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['barbell', 'bench'], 'intermediate', 'strength'),
('Press de banca inclinado', 'Press en banco inclinado para pecho superior', 'Ajusta el banco a 30-45 grados. Baja la barra al pecho superior y empuja.', ARRAY['chest', 'shoulders', 'triceps'], ARRAY['barbell', 'bench'], 'intermediate', 'strength'),
('Press con mancuernas', 'Press de pecho con mancuernas en banco plano', 'Acuestate con una mancuerna en cada mano. Baja controladamente y empuja hacia arriba.', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['dumbbell', 'bench'], 'beginner', 'strength'),
('Aperturas con mancuernas', 'Aislamiento de pecho con mancuernas', 'Con brazos casi extendidos, baja las mancuernas lateralmente y junta al centro.', ARRAY['chest'], ARRAY['dumbbell', 'bench'], 'beginner', 'strength'),
('Fondos en paralelas', 'Ejercicio compuesto con peso corporal', 'Sujetate en las barras paralelas, baja flexionando codos e inclinate hacia adelante.', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['bodyweight'], 'intermediate', 'strength'),
('Crossover en poleas', 'Aislamiento de pecho con cables', 'Con las poleas altas, cruza los brazos al frente manteniendo codos ligeramente flexionados.', ARRAY['chest'], ARRAY['cable'], 'intermediate', 'strength'),

-- === ESPALDA ===
('Dominadas', 'Ejercicio compuesto de espalda con peso corporal', 'Cuelgate de la barra con agarre prono. Eleva tu cuerpo hasta que la barbilla supere la barra.', ARRAY['back', 'biceps', 'lats'], ARRAY['pull_up_bar', 'bodyweight'], 'advanced', 'strength'),
('Remo con barra', 'Ejercicio compuesto para espalda media', 'Inclinate 45 grados, agarra la barra y tira hacia el abdomen retrayendo escapulas.', ARRAY['back', 'lats', 'biceps', 'traps'], ARRAY['barbell'], 'intermediate', 'strength'),
('Remo con mancuerna', 'Remo unilateral con mancuerna', 'Apoya una mano y rodilla en el banco. Tira de la mancuerna hacia la cadera.', ARRAY['back', 'lats', 'biceps'], ARRAY['dumbbell', 'bench'], 'beginner', 'strength'),
('Jalon al pecho', 'Ejercicio de espalda en polea alta', 'Siéntate y agarra la barra ancha. Tira hacia el pecho retrayendo escapulas.', ARRAY['back', 'lats', 'biceps'], ARRAY['cable', 'machine'], 'beginner', 'strength'),
('Peso muerto', 'Ejercicio compuesto fundamental', 'Con la barra en el suelo, agarra con agarre mixto y levanta usando piernas y espalda.', ARRAY['back', 'hamstrings', 'glutes', 'core', 'traps'], ARRAY['barbell'], 'advanced', 'strength'),
('Remo en polea baja', 'Remo sentado con cable', 'Sentado, tira del agarre hacia el abdomen manteniendo la espalda recta.', ARRAY['back', 'lats', 'biceps'], ARRAY['cable', 'machine'], 'beginner', 'strength'),

-- === HOMBROS ===
('Press militar', 'Press de hombros con barra de pie', 'De pie, empuja la barra desde los hombros hacia arriba por encima de la cabeza.', ARRAY['shoulders', 'triceps'], ARRAY['barbell'], 'intermediate', 'strength'),
('Press de hombros con mancuernas', 'Press de hombros sentado', 'Sentado, empuja las mancuernas desde los hombros hacia arriba.', ARRAY['shoulders', 'triceps'], ARRAY['dumbbell', 'bench'], 'beginner', 'strength'),
('Elevaciones laterales', 'Aislamiento de deltoides lateral', 'De pie, eleva las mancuernas lateralmente hasta la altura de los hombros.', ARRAY['shoulders'], ARRAY['dumbbell'], 'beginner', 'strength'),
('Elevaciones frontales', 'Aislamiento de deltoides anterior', 'De pie, eleva las mancuernas al frente hasta la altura de los hombros alternando brazos.', ARRAY['shoulders'], ARRAY['dumbbell'], 'beginner', 'strength'),
('Face pull', 'Ejercicio para deltoides posterior y salud del hombro', 'Con la polea alta, tira hacia la cara abriendo los codos hacia afuera.', ARRAY['shoulders', 'traps', 'back'], ARRAY['cable'], 'beginner', 'strength'),

-- === BICEPS ===
('Curl con barra', 'Curl de biceps con barra recta', 'De pie, curl la barra desde los muslos hasta los hombros sin mover los codos.', ARRAY['biceps'], ARRAY['barbell'], 'beginner', 'strength'),
('Curl con mancuernas', 'Curl alterno con mancuernas', 'De pie, curl alternando brazos con supinacion al subir.', ARRAY['biceps'], ARRAY['dumbbell'], 'beginner', 'strength'),
('Curl martillo', 'Curl con agarre neutro', 'De pie, curl con las palmas enfrentadas (agarre neutro).', ARRAY['biceps', 'forearms'], ARRAY['dumbbell'], 'beginner', 'strength'),
('Curl en banco predicador', 'Curl con aislamiento de bíceps', 'Apoya los brazos en el banco predicador y curl la barra EZ.', ARRAY['biceps'], ARRAY['ez_bar', 'bench'], 'intermediate', 'strength'),

-- === TRICEPS ===
('Extension de triceps en polea', 'Pushdown de triceps con cable', 'De pie frente a la polea alta, extiende los brazos hacia abajo sin mover los codos.', ARRAY['triceps'], ARRAY['cable'], 'beginner', 'strength'),
('Press frances', 'Extension de triceps acostado', 'Acostado en banco, baja la barra EZ hacia la frente y extiende los brazos.', ARRAY['triceps'], ARRAY['ez_bar', 'bench'], 'intermediate', 'strength'),
('Fondos en banco', 'Dips de triceps en banco', 'Apoya las manos en el banco detras de ti y baja flexionando codos.', ARRAY['triceps', 'chest', 'shoulders'], ARRAY['bench', 'bodyweight'], 'beginner', 'strength'),

-- === PIERNAS ===
('Sentadilla con barra', 'Ejercicio compuesto fundamental de piernas', 'Con la barra en la espalda alta, baja hasta que los muslos esten paralelos al suelo.', ARRAY['quadriceps', 'glutes', 'hamstrings', 'core'], ARRAY['barbell'], 'intermediate', 'strength'),
('Sentadilla goblet', 'Sentadilla con kettlebell o mancuerna', 'Sostén la pesa frente al pecho y realiza la sentadilla.', ARRAY['quadriceps', 'glutes', 'core'], ARRAY['kettlebell'], 'beginner', 'strength'),
('Prensa de piernas', 'Ejercicio compuesto en maquina', 'Sentado en la prensa, empuja la plataforma extendiendo las piernas.', ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY['machine'], 'beginner', 'strength'),
('Extension de cuadriceps', 'Aislamiento de cuadriceps en maquina', 'Sentado, extiende las piernas hasta la posicion horizontal.', ARRAY['quadriceps'], ARRAY['machine'], 'beginner', 'strength'),
('Curl de isquiotibiales', 'Aislamiento de isquiotibiales', 'Acostado boca abajo, flexiona las piernas hacia los gluteos.', ARRAY['hamstrings'], ARRAY['machine'], 'beginner', 'strength'),
('Zancadas con mancuernas', 'Ejercicio unilateral de piernas', 'Da un paso al frente y baja la rodilla trasera hacia el suelo. Alterna piernas.', ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY['dumbbell'], 'beginner', 'strength'),
('Hip thrust', 'Ejercicio principal de gluteos', 'Con la espalda en un banco, empuja la barra hacia arriba con las caderas.', ARRAY['glutes', 'hamstrings'], ARRAY['barbell', 'bench'], 'intermediate', 'strength'),
('Peso muerto rumano', 'Ejercicio para isquiotibiales y gluteos', 'Con piernas casi rectas, baja la barra a lo largo de los muslos manteniendo la espalda recta.', ARRAY['hamstrings', 'glutes', 'back'], ARRAY['barbell'], 'intermediate', 'strength'),
('Elevacion de gemelos', 'Aislamiento de pantorrillas', 'De pie en una plataforma elevada, eleva los talones lo mas alto posible.', ARRAY['calves'], ARRAY['machine', 'bodyweight'], 'beginner', 'strength'),

-- === CORE ===
('Plancha', 'Ejercicio isometrico de core', 'Mantén la posicion de plancha con los antebrazos y puntas de los pies apoyados.', ARRAY['core'], ARRAY['bodyweight'], 'beginner', 'strength'),
('Crunch abdominal', 'Ejercicio basico de abdominales', 'Acostado boca arriba, eleva los hombros del suelo contrayendo el abdomen.', ARRAY['core'], ARRAY['bodyweight'], 'beginner', 'strength'),
('Russian twist', 'Rotacion de core con peso', 'Sentado con el torso inclinado, gira de lado a lado con una mancuerna.', ARRAY['core'], ARRAY['dumbbell', 'bodyweight'], 'intermediate', 'strength'),
('Elevacion de piernas colgado', 'Ejercicio avanzado de core', 'Colgado de la barra, eleva las piernas rectas hasta la horizontal.', ARRAY['core', 'hip_flexors'], ARRAY['pull_up_bar', 'bodyweight'], 'advanced', 'strength'),
('Ab wheel rollout', 'Extension abdominal con rueda', 'De rodillas, rueda hacia adelante extendiendo el cuerpo y regresa.', ARRAY['core'], ARRAY['bodyweight'], 'advanced', 'strength'),

-- === CARDIO ===
('Burpees', 'Ejercicio de cuerpo completo de alta intensidad', 'Desde de pie, baja al suelo, haz una flexion, salta y repite.', ARRAY['core', 'chest', 'quadriceps'], ARRAY['bodyweight'], 'intermediate', 'cardio'),
('Mountain climbers', 'Ejercicio cardiovascular de core', 'En posicion de plancha, alterna llevando las rodillas al pecho rapidamente.', ARRAY['core', 'hip_flexors'], ARRAY['bodyweight'], 'beginner', 'cardio'),
('Saltos al cajon', 'Ejercicio pliometrico', 'Salta sobre un cajon con ambos pies y baja controladamente.', ARRAY['quadriceps', 'glutes', 'calves'], ARRAY['bodyweight'], 'intermediate', 'cardio'),
('Jumping jacks', 'Ejercicio cardiovascular basico', 'Salta abriendo piernas y brazos simultaneamente, luego cierra.', ARRAY['core'], ARRAY['bodyweight'], 'beginner', 'cardio'),
('Saltar la cuerda', 'Ejercicio cardiovascular clasico', 'Salta la cuerda con ambos pies o alternando a ritmo constante.', ARRAY['calves', 'core'], ARRAY['bodyweight'], 'beginner', 'cardio'),

-- === FLEXIBILIDAD ===
('Estiramiento de isquiotibiales', 'Estiramiento estatico', 'Sentado con las piernas extendidas, inclinate hacia adelante desde la cadera.', ARRAY['hamstrings'], ARRAY['bodyweight'], 'beginner', 'flexibility'),
('Estiramiento de cuadriceps', 'Estiramiento de pie', 'De pie, lleva el talon al gluteo y mantén el estiramiento.', ARRAY['quadriceps', 'hip_flexors'], ARRAY['bodyweight'], 'beginner', 'flexibility'),
('Estiramiento de pecho en puerta', 'Apertura pectoral pasiva', 'Apoya el antebrazo en el marco de una puerta y gira el cuerpo hacia el lado contrario.', ARRAY['chest', 'shoulders'], ARRAY['bodyweight'], 'beginner', 'flexibility'),
('Cat-cow stretch', 'Movilidad de columna', 'En cuatro puntos, alterna entre arquear y redondear la espalda.', ARRAY['back', 'core'], ARRAY['bodyweight'], 'beginner', 'flexibility'),

-- === EQUILIBRIO ===
('Sentadilla pistola', 'Sentadilla a una pierna', 'Baja en una pierna con la otra extendida al frente. Requiere gran equilibrio y fuerza.', ARRAY['quadriceps', 'glutes', 'core'], ARRAY['bodyweight'], 'advanced', 'balance'),
('Peso muerto a una pierna', 'Ejercicio unilateral de equilibrio', 'De pie en una pierna, inclinate al frente con la otra pierna extendida atras.', ARRAY['hamstrings', 'glutes', 'core'], ARRAY['dumbbell'], 'intermediate', 'balance');
