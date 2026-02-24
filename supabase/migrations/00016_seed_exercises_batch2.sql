-- ============================================
-- TrainHub - Seed: Ejercicios batch 2 (desde imagenes)
-- trainer_id = NULL => ejercicios de plataforma
-- Incluye columnas extendidas: name_es, primary_muscles,
-- secondary_muscles, exercise_type, mechanics, force, source
-- ============================================

-- === DELTOIDES POSTERIOR / REAR DELTS ===

INSERT INTO exercises (name, name_es, description, instructions, muscle_groups, equipment, difficulty, category, primary_muscles, secondary_muscles, exercise_type, mechanics, force, source)
VALUES
('Aperturas inversas en máquina', 'Aperturas inversas en máquina',
 'Aislamiento de deltoides posterior en máquina pec deck inversa',
 'Siéntate mirando hacia la máquina. Agarra las manijas con los brazos extendidos al frente y abre los brazos hacia atrás apretando las escápulas.',
 ARRAY['shoulders', 'back'], ARRAY['machine'], 'beginner', 'strength',
 ARRAY['shoulders'], ARRAY['traps', 'back'],
 'isolation', 'isolation', 'pull', 'seed'),

('Aperturas inversas con cable', 'Aperturas inversas con cable',
 'Aislamiento de deltoides posterior con poleas cruzadas',
 'De pie entre las poleas a la altura de la cara, cruza los cables y tira hacia afuera abriendo los brazos. Mantén los codos ligeramente flexionados.',
 ARRAY['shoulders', 'back'], ARRAY['cable'], 'beginner', 'strength',
 ARRAY['shoulders'], ARRAY['traps', 'back'],
 'isolation', 'isolation', 'pull', 'seed'),

('Elevaciones posteriores con mancuernas inclinado', 'Elevaciones posteriores con mancuernas inclinado',
 'Aislamiento de deltoides posterior con el torso inclinado hacia adelante',
 'De pie, inclina el torso hacia adelante a 45-60 grados. Con mancuernas en cada mano, eleva los brazos lateralmente apretando las escápulas.',
 ARRAY['shoulders', 'back'], ARRAY['dumbbell'], 'beginner', 'strength',
 ARRAY['shoulders'], ARRAY['traps', 'back'],
 'isolation', 'isolation', 'pull', 'seed'),

('Elevaciones posteriores en banco inclinado', 'Elevaciones posteriores en banco inclinado',
 'Aislamiento de deltoides posterior acostado boca abajo en banco inclinado',
 'Acuéstate boca abajo en un banco inclinado a 30-45 grados. Deja colgar las mancuernas y eleva los brazos lateralmente apretando las escápulas.',
 ARRAY['shoulders', 'back'], ARRAY['dumbbell', 'bench'], 'beginner', 'strength',
 ARRAY['shoulders'], ARRAY['traps', 'back'],
 'isolation', 'isolation', 'pull', 'seed'),

('Elevaciones posteriores sentado con mancuernas', 'Elevaciones posteriores sentado con mancuernas',
 'Aislamiento de deltoides posterior sentado con el torso inclinado sobre las rodillas',
 'Sentado en un banco, inclínate hacia adelante con el pecho cerca de las rodillas. Eleva las mancuernas lateralmente.',
 ARRAY['shoulders', 'back'], ARRAY['dumbbell', 'bench'], 'beginner', 'strength',
 ARRAY['shoulders'], ARRAY['traps', 'back'],
 'isolation', 'isolation', 'pull', 'seed'),

('Elevaciones posteriores pronado en banco plano', 'Elevaciones posteriores pronado en banco plano',
 'Aislamiento de deltoides posterior acostado boca abajo en banco plano',
 'Acuéstate boca abajo en un banco plano con las mancuernas colgando. Eleva los brazos lateralmente manteniendo los codos ligeramente flexionados.',
 ARRAY['shoulders', 'back'], ARRAY['dumbbell', 'bench'], 'beginner', 'strength',
 ARRAY['shoulders'], ARRAY['traps', 'back'],
 'isolation', 'isolation', 'pull', 'seed'),

('Aperturas inversas con cable inclinado', 'Aperturas inversas con cable inclinado',
 'Aislamiento de deltoides posterior con cable, torso inclinado',
 'De pie frente a la polea baja, inclina el torso y tira del cable hacia arriba y afuera con un brazo. Alterna lados.',
 ARRAY['shoulders', 'back'], ARRAY['cable'], 'intermediate', 'strength',
 ARRAY['shoulders'], ARRAY['traps', 'back'],
 'isolation', 'isolation', 'pull', 'seed'),

-- === TRAPECIOS ===

('Encogimientos con mancuernas', 'Encogimientos con mancuernas',
 'Aislamiento de trapecios superiores con mancuernas',
 'De pie con una mancuerna en cada mano, encoge los hombros hacia las orejas. Mantén la contracción arriba 1-2 segundos.',
 ARRAY['traps', 'shoulders'], ARRAY['dumbbell'], 'beginner', 'strength',
 ARRAY['traps'], ARRAY['shoulders', 'forearms'],
 'isolation', 'isolation', 'pull', 'seed'),

-- === GLÚTEOS / CADERA ===

('Patada de glúteo', 'Patada de glúteo',
 'Ejercicio de aislamiento de glúteos en cuatro puntos',
 'En posición de cuatro puntos (manos y rodillas), extiende una pierna hacia atrás y arriba apretando el glúteo. Alterna piernas.',
 ARRAY['glutes'], ARRAY['bodyweight'], 'beginner', 'strength',
 ARRAY['glutes'], ARRAY['hamstrings', 'core'],
 'isolation', 'isolation', 'push', 'seed'),

('Patada de glúteo en cable', 'Patada de glúteo en cable',
 'Extensión de cadera con cable para glúteos',
 'De pie frente a la polea baja con el tobillero puesto, extiende la pierna hacia atrás contra la resistencia del cable. Mantén el core firme.',
 ARRAY['glutes'], ARRAY['cable'], 'beginner', 'strength',
 ARRAY['glutes'], ARRAY['hamstrings', 'core'],
 'isolation', 'isolation', 'push', 'seed'),

('Abducción de cadera en cable', 'Abducción de cadera en cable',
 'Aislamiento de glúteo medio con cable',
 'De pie de lado a la polea baja con el tobillero en la pierna lejana, abre la pierna lateralmente contra la resistencia. Mantén el torso recto.',
 ARRAY['glutes'], ARRAY['cable'], 'beginner', 'strength',
 ARRAY['glutes'], ARRAY['hip_flexors'],
 'isolation', 'isolation', 'push', 'seed'),

-- === VARIANTES DE PESO MUERTO ===

('Peso muerto con barra hexagonal', 'Peso muerto con barra hexagonal',
 'Peso muerto con trap bar, más amigable para la espalda',
 'Párate dentro de la barra hexagonal, agarra las manijas laterales y levanta extendiendo caderas y rodillas simultáneamente.',
 ARRAY['back', 'hamstrings', 'glutes', 'quadriceps', 'core', 'traps'], ARRAY['barbell'], 'intermediate', 'strength',
 ARRAY['glutes', 'hamstrings', 'quadriceps'], ARRAY['back', 'core', 'traps'],
 'compound', 'compound', 'pull', 'seed'),

('Peso muerto déficit', 'Peso muerto déficit',
 'Peso muerto desde una plataforma elevada para mayor rango de movimiento',
 'Párate sobre una plataforma de 5-10 cm. Realiza el peso muerto convencional con mayor rango de movimiento al bajar más.',
 ARRAY['back', 'hamstrings', 'glutes', 'core', 'traps'], ARRAY['barbell'], 'advanced', 'strength',
 ARRAY['glutes', 'hamstrings', 'back'], ARRAY['core', 'traps', 'quadriceps'],
 'compound', 'compound', 'pull', 'seed'),

('Peso muerto sumo', 'Peso muerto sumo',
 'Peso muerto con postura ancha que enfatiza más los aductores y glúteos',
 'Con los pies más anchos que los hombros y las puntas hacia afuera, agarra la barra con agarre estrecho y levanta extendiendo caderas y rodillas.',
 ARRAY['glutes', 'hamstrings', 'quadriceps', 'back', 'core'], ARRAY['barbell'], 'intermediate', 'strength',
 ARRAY['glutes', 'hamstrings', 'quadriceps'], ARRAY['back', 'core'],
 'compound', 'compound', 'pull', 'seed'),

('Peso muerto piernas rígidas', 'Peso muerto piernas rígidas',
 'Peso muerto con las piernas completamente extendidas',
 'Con las piernas rectas (sin flexionar rodillas), baja la barra a lo largo de las piernas manteniendo la espalda recta. Siente el estiramiento en los isquiotibiales.',
 ARRAY['hamstrings', 'glutes', 'back'], ARRAY['barbell'], 'intermediate', 'strength',
 ARRAY['hamstrings', 'glutes'], ARRAY['back', 'core'],
 'compound', 'compound', 'pull', 'seed'),

('Peso muerto en máquina Smith', 'Peso muerto en máquina Smith',
 'Peso muerto guiado en máquina Smith',
 'En la máquina Smith, realiza el movimiento de peso muerto con la barra guiada. Útil para aprender el patrón de movimiento.',
 ARRAY['back', 'hamstrings', 'glutes', 'core'], ARRAY['smith_machine'], 'beginner', 'strength',
 ARRAY['glutes', 'hamstrings'], ARRAY['back', 'core'],
 'compound', 'compound', 'pull', 'seed'),

('Peso muerto a una pierna con kettlebell', 'Peso muerto a una pierna con kettlebell',
 'Ejercicio unilateral de equilibrio y fuerza con kettlebell',
 'De pie en una pierna sosteniendo la kettlebell, inclínate al frente con la otra pierna extendiéndose atrás. Baja la kettlebell hacia el suelo y regresa.',
 ARRAY['hamstrings', 'glutes', 'core'], ARRAY['kettlebell'], 'intermediate', 'balance',
 ARRAY['hamstrings', 'glutes'], ARRAY['core', 'back'],
 'compound', 'compound', 'pull', 'seed'),

-- === CORE ===

('Plancha lateral', 'Plancha lateral',
 'Ejercicio isométrico de core lateral para oblicuos',
 'Acuéstate de lado apoyándote en el antebrazo y el lateral del pie. Eleva la cadera formando una línea recta. Mantén la posición.',
 ARRAY['core'], ARRAY['bodyweight'], 'beginner', 'strength',
 ARRAY['core'], ARRAY['shoulders'],
 'isolation', 'isolation', 'static', 'seed'),

-- === PIERNAS ===

('Sentadilla con mancuernas', 'Sentadilla con mancuernas',
 'Sentadilla con mancuernas a los lados del cuerpo',
 'De pie con una mancuerna en cada mano a los costados, baja en sentadilla hasta que los muslos estén paralelos al suelo.',
 ARRAY['quadriceps', 'glutes', 'hamstrings', 'core'], ARRAY['dumbbell'], 'beginner', 'strength',
 ARRAY['quadriceps', 'glutes'], ARRAY['hamstrings', 'core'],
 'compound', 'compound', 'push', 'seed'),

('Prensa de piernas 45 grados', 'Prensa de piernas 45 grados',
 'Prensa de piernas en máquina inclinada a 45 grados',
 'Siéntate en la prensa inclinada con los pies separados al ancho de los hombros. Baja la plataforma flexionando las rodillas y empuja de vuelta.',
 ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY['machine'], 'beginner', 'strength',
 ARRAY['quadriceps', 'glutes'], ARRAY['hamstrings'],
 'compound', 'compound', 'push', 'seed'),

('Prensa de piernas horizontal', 'Prensa de piernas horizontal',
 'Prensa de piernas en máquina horizontal sentado',
 'Siéntate en la prensa horizontal con los pies en la plataforma. Empuja hacia adelante extendiendo las piernas.',
 ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY['machine'], 'beginner', 'strength',
 ARRAY['quadriceps', 'glutes'], ARRAY['hamstrings'],
 'compound', 'compound', 'push', 'seed'),

-- === PECHO ===

('Press de banca declinado', 'Press de banca declinado',
 'Press de pecho con barra en banco declinado para pecho inferior',
 'Acuéstate en el banco declinado, agarra la barra y bájala al pecho inferior. Empuja hacia arriba.',
 ARRAY['chest', 'triceps', 'shoulders'], ARRAY['barbell', 'bench'], 'intermediate', 'strength',
 ARRAY['chest'], ARRAY['triceps', 'shoulders'],
 'compound', 'compound', 'push', 'seed'),

('Press con mancuernas inclinado', 'Press con mancuernas inclinado',
 'Press de pecho con mancuernas en banco inclinado para pecho superior',
 'En banco inclinado a 30-45 grados, empuja las mancuernas hacia arriba desde los hombros.',
 ARRAY['chest', 'shoulders', 'triceps'], ARRAY['dumbbell', 'bench'], 'intermediate', 'strength',
 ARRAY['chest'], ARRAY['shoulders', 'triceps'],
 'compound', 'compound', 'push', 'seed'),

('Press con mancuernas declinado', 'Press con mancuernas declinado',
 'Press de pecho con mancuernas en banco declinado',
 'En banco declinado, empuja las mancuernas hacia arriba desde el pecho inferior.',
 ARRAY['chest', 'triceps', 'shoulders'], ARRAY['dumbbell', 'bench'], 'intermediate', 'strength',
 ARRAY['chest'], ARRAY['triceps', 'shoulders'],
 'compound', 'compound', 'push', 'seed'),

('Press de banca en máquina Smith', 'Press de banca en máquina Smith',
 'Press de pecho guiado en máquina Smith',
 'Acuéstate en el banco bajo la máquina Smith. Desbloquea la barra, bájala al pecho y empuja hacia arriba.',
 ARRAY['chest', 'triceps', 'shoulders'], ARRAY['smith_machine', 'bench'], 'beginner', 'strength',
 ARRAY['chest'], ARRAY['triceps', 'shoulders'],
 'compound', 'compound', 'push', 'seed'),

('Cruces en cable bajo', 'Cruces en cable bajo',
 'Aislamiento de pecho superior con cables desde polea baja',
 'Con las poleas bajas, eleva y cruza los brazos hacia arriba y al centro. Enfatiza el pecho superior.',
 ARRAY['chest'], ARRAY['cable'], 'intermediate', 'strength',
 ARRAY['chest'], ARRAY['shoulders'],
 'isolation', 'isolation', 'push', 'seed'),

('Aperturas en cable inclinado', 'Aperturas en cable inclinado',
 'Aislamiento de pecho en banco inclinado con cables',
 'En un banco inclinado entre las poleas, abre y cierra los brazos con los cables manteniendo los codos ligeramente flexionados.',
 ARRAY['chest'], ARRAY['cable', 'bench'], 'intermediate', 'strength',
 ARRAY['chest'], ARRAY['shoulders'],
 'isolation', 'isolation', 'push', 'seed'),

('Pullover con mancuerna', 'Pullover con mancuerna',
 'Ejercicio para pecho y dorsal con mancuerna',
 'Acostado en un banco, sostén una mancuerna sobre el pecho con los brazos extendidos. Baja la mancuerna detrás de la cabeza y regresa.',
 ARRAY['chest', 'lats', 'back'], ARRAY['dumbbell', 'bench'], 'intermediate', 'strength',
 ARRAY['chest', 'lats'], ARRAY['triceps', 'core'],
 'compound', 'compound', 'pull', 'seed'),

('Press de pecho en máquina', 'Press de pecho en máquina',
 'Press de pecho en máquina con movimiento guiado',
 'Siéntate en la máquina de press, ajusta el asiento y empuja las manijas hacia adelante extendiendo los brazos.',
 ARRAY['chest', 'triceps', 'shoulders'], ARRAY['machine'], 'beginner', 'strength',
 ARRAY['chest'], ARRAY['triceps', 'shoulders'],
 'compound', 'compound', 'push', 'seed'),

-- === TRÍCEPS ===

('Extensión de tríceps acostado con mancuernas', 'Extensión de tríceps acostado con mancuernas',
 'Skull crusher con mancuernas en banco plano',
 'Acostado en banco, sostén las mancuernas sobre el pecho con brazos extendidos. Flexiona los codos bajando las mancuernas hacia la frente y extiende.',
 ARRAY['triceps'], ARRAY['dumbbell', 'bench'], 'intermediate', 'strength',
 ARRAY['triceps'], ARRAY['chest', 'shoulders'],
 'isolation', 'isolation', 'push', 'seed'),

('Extensión de tríceps sobre cabeza con cable', 'Extensión de tríceps sobre cabeza con cable',
 'Extensión de tríceps overhead con polea baja',
 'De espaldas a la polea baja, agarra la cuerda y extiende los brazos sobre la cabeza. Flexiona solo los codos.',
 ARRAY['triceps'], ARRAY['cable'], 'intermediate', 'strength',
 ARRAY['triceps'], ARRAY[]::TEXT[],
 'isolation', 'isolation', 'push', 'seed'),

('Extensión de tríceps sobre cabeza con mancuerna', 'Extensión de tríceps sobre cabeza con mancuerna',
 'Extensión de tríceps overhead con una mancuerna a dos manos',
 'De pie o sentado, sostén una mancuerna sobre la cabeza con ambas manos. Baja detrás de la cabeza flexionando los codos y extiende.',
 ARRAY['triceps'], ARRAY['dumbbell'], 'beginner', 'strength',
 ARRAY['triceps'], ARRAY[]::TEXT[],
 'isolation', 'isolation', 'push', 'seed'),

-- === HOMBROS ===

('Press de hombros de pie con mancuernas', 'Press de hombros de pie con mancuernas',
 'Press de hombros de pie con mancuernas para mayor activación del core',
 'De pie con una mancuerna en cada mano a la altura de los hombros, empuja hacia arriba sobre la cabeza. Mantén el core firme.',
 ARRAY['shoulders', 'triceps', 'core'], ARRAY['dumbbell'], 'intermediate', 'strength',
 ARRAY['shoulders'], ARRAY['triceps', 'core'],
 'compound', 'compound', 'push', 'seed'),

('Press militar tras nuca', 'Press militar tras nuca',
 'Press de hombros con barra detrás del cuello',
 'Sentado o de pie, baja la barra detrás de la cabeza hasta la nuca y empuja hacia arriba. Requiere buena movilidad de hombros.',
 ARRAY['shoulders', 'triceps'], ARRAY['barbell'], 'advanced', 'strength',
 ARRAY['shoulders'], ARRAY['triceps'],
 'compound', 'compound', 'push', 'seed'),

('Press de hombros en máquina', 'Press de hombros en máquina',
 'Press de hombros en máquina con movimiento guiado',
 'Siéntate en la máquina de press de hombros, ajusta el asiento y empuja las manijas hacia arriba.',
 ARRAY['shoulders', 'triceps'], ARRAY['machine'], 'beginner', 'strength',
 ARRAY['shoulders'], ARRAY['triceps'],
 'compound', 'compound', 'push', 'seed'),

('Elevaciones laterales con cable', 'Elevaciones laterales con cable',
 'Aislamiento de deltoides lateral con cable para tensión constante',
 'De pie de lado a la polea baja, agarra el cable con la mano lejana y eleva lateralmente hasta la altura del hombro.',
 ARRAY['shoulders'], ARRAY['cable'], 'beginner', 'strength',
 ARRAY['shoulders'], ARRAY[]::TEXT[],
 'isolation', 'isolation', 'pull', 'seed'),

-- === FUNCIONAL / CORE ===

('Woodchop con cable', 'Woodchop con cable',
 'Ejercicio rotacional de core con cable',
 'De pie de lado a la polea alta, agarra el cable con ambas manos y rota el torso diagonalmente hacia abajo y al lado opuesto. Controla el movimiento.',
 ARRAY['core', 'shoulders'], ARRAY['cable'], 'intermediate', 'strength',
 ARRAY['core'], ARRAY['shoulders'],
 'compound', 'compound', 'pull', 'seed'),

('Woodchop inverso con cable', 'Woodchop inverso con cable',
 'Ejercicio rotacional de core desde abajo hacia arriba con cable',
 'De pie de lado a la polea baja, agarra el cable y rota el torso diagonalmente hacia arriba y al lado opuesto.',
 ARRAY['core', 'shoulders'], ARRAY['cable'], 'intermediate', 'strength',
 ARRAY['core'], ARRAY['shoulders'],
 'compound', 'compound', 'push', 'seed'),

-- === ESPALDA ===

('Remo invertido', 'Remo invertido',
 'Remo con peso corporal en barra baja o TRX',
 'Cuelga debajo de una barra baja con los pies en el suelo. Tira del pecho hacia la barra retrayendo escápulas. Mantén el cuerpo recto.',
 ARRAY['back', 'lats', 'biceps', 'core'], ARRAY['bodyweight', 'pull_up_bar'], 'beginner', 'strength',
 ARRAY['back', 'lats'], ARRAY['biceps', 'core'],
 'compound', 'compound', 'pull', 'seed'),

('Remo invertido agarre supino', 'Remo invertido agarre supino',
 'Remo invertido con las palmas hacia ti para mayor énfasis en bíceps',
 'Igual que el remo invertido pero con agarre supino (palmas hacia ti). Mayor activación de bíceps.',
 ARRAY['back', 'lats', 'biceps', 'core'], ARRAY['bodyweight', 'pull_up_bar'], 'beginner', 'strength',
 ARRAY['back', 'biceps'], ARRAY['lats', 'core'],
 'compound', 'compound', 'pull', 'seed'),

-- === BÍCEPS ===

('Curl araña en banco inclinado', 'Curl araña en banco inclinado',
 'Curl de bíceps con los brazos colgando sobre un banco inclinado (spider curl)',
 'Acuéstate boca abajo en un banco inclinado con los brazos colgando. Realiza el curl con mancuernas manteniendo los brazos perpendiculares al suelo.',
 ARRAY['biceps'], ARRAY['dumbbell', 'bench'], 'intermediate', 'strength',
 ARRAY['biceps'], ARRAY[]::TEXT[],
 'isolation', 'isolation', 'pull', 'seed'),

-- === AVANZADO / CALISTENIA ===

('Flexión en pino', 'Flexión en pino',
 'Flexión de brazos en posición invertida (handstand push-up)',
 'En posición de pino contra una pared, baja la cabeza hacia el suelo flexionando los brazos y empuja hacia arriba. Ejercicio avanzado.',
 ARRAY['shoulders', 'triceps', 'core'], ARRAY['bodyweight'], 'advanced', 'strength',
 ARRAY['shoulders'], ARRAY['triceps', 'core'],
 'compound', 'compound', 'push', 'seed'),

-- === FLEXIBILIDAD ===

('Estiramiento tocando puntas de pie', 'Estiramiento tocando puntas de pie',
 'Estiramiento de isquiotibiales y espalda baja de pie',
 'De pie con las piernas rectas, inclínate hacia adelante intentando tocar las puntas de los pies con las manos. Mantén la posición 15-30 segundos.',
 ARRAY['hamstrings', 'back'], ARRAY['bodyweight'], 'beginner', 'flexibility',
 ARRAY['hamstrings'], ARRAY['back'],
 'stretching', NULL, 'static', 'seed'),

-- === BUENOS DÍAS ===

('Buenos días con barra', 'Buenos días con barra',
 'Ejercicio de bisagra de cadera con barra en la espalda',
 'Con la barra en la espalda como en la sentadilla, inclínate hacia adelante desde las caderas manteniendo la espalda recta y las rodillas ligeramente flexionadas.',
 ARRAY['hamstrings', 'glutes', 'back', 'core'], ARRAY['barbell'], 'intermediate', 'strength',
 ARRAY['hamstrings', 'glutes'], ARRAY['back', 'core'],
 'compound', 'compound', 'pull', 'seed');
