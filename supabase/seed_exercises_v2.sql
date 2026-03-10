-- ============================================
-- TrainHub - Seed V2: Ejercicios adicionales
-- trainer_id = NULL => ejercicios de plataforma
-- Ejecutar DESPUES del seed.sql original
-- ============================================

INSERT INTO exercises (name, description, instructions, muscle_groups, equipment, difficulty, category) VALUES

-- === PECHO (adicionales) ===
('Press de banca declinado', 'Press en banco declinado para pecho inferior', 'Ajusta el banco en declive. Baja la barra al pecho inferior y empuja.', ARRAY['chest', 'triceps'], ARRAY['barbell', 'bench'], 'intermediate', 'strength'),
('Press inclinado con mancuernas', 'Press en banco inclinado con mancuernas', 'En banco inclinado a 30-45 grados, empuja las mancuernas hacia arriba.', ARRAY['chest', 'shoulders', 'triceps'], ARRAY['dumbbell', 'bench'], 'beginner', 'strength'),
('Flexiones', 'Ejercicio clasico de empuje con peso corporal', 'En posicion de plancha, baja el pecho al suelo y empuja de vuelta.', ARRAY['chest', 'triceps', 'shoulders', 'core'], ARRAY['bodyweight'], 'beginner', 'strength'),
('Flexiones diamante', 'Flexiones con agarre estrecho para triceps', 'Coloca las manos juntas formando un diamante bajo el pecho.', ARRAY['chest', 'triceps'], ARRAY['bodyweight'], 'intermediate', 'strength'),
('Flexiones declinadas', 'Flexiones con pies elevados', 'Coloca los pies en un banco y realiza flexiones para enfatizar pecho superior.', ARRAY['chest', 'shoulders', 'triceps'], ARRAY['bodyweight', 'bench'], 'intermediate', 'strength'),
('Press en maquina de pecho', 'Press de pecho en maquina convergente', 'Sentado, empuja las manijas hacia adelante hasta extender los brazos.', ARRAY['chest', 'triceps'], ARRAY['machine'], 'beginner', 'strength'),
('Pullover con mancuerna', 'Ejercicio para pecho y espalda', 'Acostado en banco, baja la mancuerna detras de la cabeza con brazos semi-extendidos.', ARRAY['chest', 'lats', 'triceps'], ARRAY['dumbbell', 'bench'], 'intermediate', 'strength'),
('Aperturas en polea baja', 'Aperturas con cables desde abajo', 'Con poleas bajas, cruza los brazos hacia arriba al frente del pecho.', ARRAY['chest'], ARRAY['cable'], 'intermediate', 'strength'),

-- === ESPALDA (adicionales) ===
('Dominadas supinas', 'Dominadas con agarre supino', 'Cuelgate con las palmas hacia ti. Sube hasta que la barbilla supere la barra.', ARRAY['back', 'biceps', 'lats'], ARRAY['pull_up_bar', 'bodyweight'], 'intermediate', 'strength'),
('Dominadas neutras', 'Dominadas con agarre neutro', 'Usa agarres paralelos. Sube controladamente.', ARRAY['back', 'biceps', 'lats'], ARRAY['pull_up_bar', 'bodyweight'], 'intermediate', 'strength'),
('Remo Pendlay', 'Remo explosivo desde el suelo', 'Desde el suelo con torso paralelo, tira explosivamente hacia el abdomen.', ARRAY['back', 'lats', 'traps'], ARRAY['barbell'], 'advanced', 'strength'),
('Remo en maquina T', 'Remo con barra T', 'Inclinate sobre la maquina T y tira del peso hacia el pecho.', ARRAY['back', 'lats', 'biceps', 'traps'], ARRAY['barbell'], 'intermediate', 'strength'),
('Remo invertido', 'Remo con peso corporal', 'Cuelgate bajo una barra baja y tira del pecho hacia la barra.', ARRAY['back', 'biceps'], ARRAY['bodyweight'], 'beginner', 'strength'),
('Jalon con agarre estrecho', 'Jalon al pecho con agarre cerrado', 'Usa un agarre en V y tira hacia el pecho.', ARRAY['back', 'lats', 'biceps'], ARRAY['cable', 'machine'], 'beginner', 'strength'),
('Encogimientos con barra', 'Ejercicio de trapecios', 'De pie con barra, eleva los hombros lo mas alto posible.', ARRAY['traps'], ARRAY['barbell'], 'beginner', 'strength'),
('Encogimientos con mancuernas', 'Trapecios con mancuernas', 'De pie, eleva los hombros con una mancuerna en cada mano.', ARRAY['traps'], ARRAY['dumbbell'], 'beginner', 'strength'),
('Pulldown con brazos rectos', 'Aislamiento de dorsales en polea', 'De pie frente a la polea alta, empuja la barra hacia los muslos con brazos rectos.', ARRAY['lats', 'back'], ARRAY['cable'], 'intermediate', 'strength'),
('Hiperextensiones', 'Extension de espalda baja', 'En banco de hiperextensiones, baja el torso y sube hasta alinear con las piernas.', ARRAY['back', 'glutes', 'hamstrings'], ARRAY['bodyweight'], 'beginner', 'strength'),
('Good morning', 'Flexion de cadera con barra', 'Con barra en la espalda, inclinate hacia adelante desde la cadera con piernas semi-rectas.', ARRAY['back', 'hamstrings', 'glutes'], ARRAY['barbell'], 'intermediate', 'strength'),

-- === HOMBROS (adicionales) ===
('Press Arnold', 'Press de hombros con rotacion', 'Empieza con mancuernas frente al pecho, rota y empuja hacia arriba.', ARRAY['shoulders', 'triceps'], ARRAY['dumbbell'], 'intermediate', 'strength'),
('Elevaciones laterales en polea', 'Lateral raise con cable', 'De pie al lado de la polea baja, eleva el brazo lateralmente.', ARRAY['shoulders'], ARRAY['cable'], 'beginner', 'strength'),
('Pajaro con mancuernas', 'Elevacion posterior con mancuernas', 'Inclinado hacia adelante, eleva las mancuernas lateralmente.', ARRAY['shoulders', 'back'], ARRAY['dumbbell'], 'beginner', 'strength'),
('Press con kettlebell', 'Press de hombro unilateral', 'De pie, empuja la kettlebell hacia arriba con un brazo.', ARRAY['shoulders', 'triceps', 'core'], ARRAY['kettlebell'], 'intermediate', 'strength'),
('Elevacion Y-T-W', 'Ejercicio de salud del hombro', 'Inclinado, eleva los brazos formando letras Y, T y W.', ARRAY['shoulders', 'back', 'traps'], ARRAY['dumbbell'], 'beginner', 'strength'),
('Remo al menton', 'Remo vertical con barra', 'De pie, tira de la barra hacia el menton con los codos hacia afuera.', ARRAY['shoulders', 'traps'], ARRAY['barbell'], 'intermediate', 'strength'),
('Press landmine', 'Press angular con barra', 'Con un extremo de la barra anclado, empuja hacia arriba y al frente.', ARRAY['shoulders', 'chest', 'triceps'], ARRAY['barbell'], 'intermediate', 'strength'),

-- === BICEPS (adicionales) ===
('Curl concentrado', 'Curl unilateral sentado', 'Sentado, apoya el codo en el muslo y curl la mancuerna.', ARRAY['biceps'], ARRAY['dumbbell', 'bench'], 'beginner', 'strength'),
('Curl en polea baja', 'Curl de biceps con cable', 'De pie frente a la polea baja, curl el agarre hacia los hombros.', ARRAY['biceps'], ARRAY['cable'], 'beginner', 'strength'),
('Curl con barra EZ', 'Curl con barra angulada', 'De pie, curl la barra EZ para reducir tension en munecas.', ARRAY['biceps'], ARRAY['ez_bar'], 'beginner', 'strength'),
('Curl inclinado con mancuernas', 'Curl en banco inclinado para estiramiento completo', 'En banco a 45 grados, curl mancuernas desde extension completa.', ARRAY['biceps'], ARRAY['dumbbell', 'bench'], 'intermediate', 'strength'),
('Curl 21s', 'Curl con 3 rangos de movimiento', 'Realiza 7 reps parciales abajo, 7 arriba y 7 completas.', ARRAY['biceps'], ARRAY['barbell'], 'intermediate', 'strength'),
('Curl spider', 'Curl en lado vertical del banco predicador', 'Apoya el pecho en el lado vertical del banco y curl.', ARRAY['biceps'], ARRAY['dumbbell', 'bench'], 'intermediate', 'strength'),

-- === TRICEPS (adicionales) ===
('Extension de triceps sobre la cabeza', 'Extension con mancuerna sobre cabeza', 'Sentado o de pie, extiende una mancuerna detras de la cabeza.', ARRAY['triceps'], ARRAY['dumbbell'], 'beginner', 'strength'),
('Press cerrado', 'Press de banca con agarre estrecho', 'Press de banca con manos separadas al ancho de los hombros.', ARRAY['triceps', 'chest'], ARRAY['barbell', 'bench'], 'intermediate', 'strength'),
('Kickback con mancuerna', 'Extension de triceps inclinado', 'Inclinado, extiende el brazo hacia atras manteniendo el codo fijo.', ARRAY['triceps'], ARRAY['dumbbell'], 'beginner', 'strength'),
('Extension de triceps con cuerda', 'Pushdown con cuerda en polea', 'En polea alta, extiende los brazos abriendo la cuerda al final.', ARRAY['triceps'], ARRAY['cable'], 'beginner', 'strength'),
('Dips en maquina', 'Fondos asistidos en maquina', 'Usa la maquina de dips para realizar fondos con peso asistido.', ARRAY['triceps', 'chest'], ARRAY['machine'], 'beginner', 'strength'),

-- === PIERNAS (adicionales) ===
('Sentadilla frontal', 'Sentadilla con barra al frente', 'Con la barra apoyada en los deltoides frontales, realiza la sentadilla.', ARRAY['quadriceps', 'core', 'glutes'], ARRAY['barbell'], 'advanced', 'strength'),
('Sentadilla bulgara', 'Sentadilla con pie trasero elevado', 'Con un pie en un banco atras, baja en sentadilla unilateral.', ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY['dumbbell', 'bench'], 'intermediate', 'strength'),
('Sentadilla hack', 'Sentadilla en maquina hack', 'En la maquina hack, baja hasta 90 grados y sube.', ARRAY['quadriceps', 'glutes'], ARRAY['machine'], 'intermediate', 'strength'),
('Sentadilla sumo', 'Sentadilla con agarre ancho y pies abiertos', 'Con pies mas que ancho de hombros y puntas afuera, baja con la barra o mancuerna.', ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY['barbell'], 'intermediate', 'strength'),
('Step up con mancuernas', 'Subida a banco con peso', 'Sube a un banco con un pie y empuja hasta arriba. Alterna.', ARRAY['quadriceps', 'glutes'], ARRAY['dumbbell', 'bench'], 'beginner', 'strength'),
('Peso muerto sumo', 'Peso muerto con postura amplia', 'Con pies mas que ancho de hombros, agarra la barra entre las piernas y levanta.', ARRAY['glutes', 'hamstrings', 'quadriceps', 'back'], ARRAY['barbell'], 'intermediate', 'strength'),
('Peso muerto con trap bar', 'Peso muerto con barra hexagonal', 'Dentro de la barra hexagonal, agarra y levanta con postura natural.', ARRAY['quadriceps', 'glutes', 'hamstrings', 'back'], ARRAY['barbell'], 'intermediate', 'strength'),
('Abduccion de cadera en maquina', 'Aislamiento de gluteo medio', 'Sentado, abre las piernas contra la resistencia de la maquina.', ARRAY['glutes'], ARRAY['machine'], 'beginner', 'strength'),
('Aduccion de cadera en maquina', 'Aislamiento de aductores', 'Sentado, cierra las piernas contra la resistencia de la maquina.', ARRAY['quadriceps'], ARRAY['machine'], 'beginner', 'strength'),
('Curl nordico', 'Curl de isquiotibiales excentrico', 'De rodillas, baja el cuerpo lentamente hacia el suelo con los tobillos sujetos.', ARRAY['hamstrings'], ARRAY['bodyweight'], 'advanced', 'strength'),
('Elevacion de gemelos sentado', 'Gemelos en maquina sentado', 'Sentado con la almohadilla en los muslos, eleva los talones.', ARRAY['calves'], ARRAY['machine'], 'beginner', 'strength'),
('Sentadilla en Smith', 'Sentadilla en maquina Smith', 'En la maquina Smith, posiciona los pies ligeramente adelante y realiza la sentadilla.', ARRAY['quadriceps', 'glutes'], ARRAY['smith_machine'], 'beginner', 'strength'),
('Hip thrust con banda', 'Hip thrust con resistencia de banda', 'Con banda elastica sobre las caderas, realiza hip thrust desde el suelo o banco.', ARRAY['glutes', 'hamstrings'], ARRAY['band', 'bench'], 'beginner', 'strength'),
('Caminata de granjero', 'Ejercicio de cuerpo completo con carga', 'Sostén pesas pesadas a los lados y camina manteniendo postura erguida.', ARRAY['core', 'traps', 'forearms', 'glutes'], ARRAY['dumbbell'], 'intermediate', 'strength'),

-- === CORE (adicionales) ===
('Plancha lateral', 'Isometrico oblicuo', 'Apoyado en un antebrazo de lado, mantén el cuerpo recto.', ARRAY['core'], ARRAY['bodyweight'], 'beginner', 'strength'),
('Crunch en polea', 'Crunch con resistencia de cable', 'De rodillas frente a la polea alta, flexiona el tronco hacia abajo.', ARRAY['core'], ARRAY['cable'], 'intermediate', 'strength'),
('Dead bug', 'Estabilizacion de core', 'Acostado boca arriba, extiende brazo y pierna opuestos alternando.', ARRAY['core'], ARRAY['bodyweight'], 'beginner', 'strength'),
('Bird dog', 'Estabilizacion de core en cuatro puntos', 'En cuatro puntos, extiende brazo y pierna opuestos. Alterna.', ARRAY['core', 'back'], ARRAY['bodyweight'], 'beginner', 'strength'),
('Pallof press', 'Anti-rotacion con cable', 'De pie lateral a la polea, extiende los brazos al frente resistiendo la rotacion.', ARRAY['core'], ARRAY['cable'], 'intermediate', 'strength'),
('Leno wiper', 'Rotacion de piernas colgado', 'Colgado de la barra, eleva las piernas y rota de lado a lado.', ARRAY['core'], ARRAY['pull_up_bar', 'bodyweight'], 'advanced', 'strength'),
('Hollow hold', 'Isometrico de core en posicion hollow', 'Acostado, eleva hombros y piernas del suelo formando un arco invertido.', ARRAY['core'], ARRAY['bodyweight'], 'intermediate', 'strength'),
('Crunch bicicleta', 'Crunch con rotacion alternada', 'Acostado, toca codo con rodilla opuesta alternando lados.', ARRAY['core'], ARRAY['bodyweight'], 'beginner', 'strength'),
('Dragon flag', 'Ejercicio avanzado de core', 'Acostado en banco, eleva el cuerpo recto usando solo los hombros como apoyo.', ARRAY['core'], ARRAY['bench', 'bodyweight'], 'advanced', 'strength'),
('Rueda abdominal de pie', 'Ab wheel rollout desde posicion de pie', 'De pie, rueda hacia adelante y regresa. Version avanzada del rollout.', ARRAY['core'], ARRAY['bodyweight'], 'advanced', 'strength'),

-- === ANTEBRAZOS ===
('Curl de muneca con barra', 'Flexion de muneca', 'Sentado con antebrazos en los muslos, curl la barra con las munecas.', ARRAY['forearms'], ARRAY['barbell'], 'beginner', 'strength'),
('Curl inverso con barra', 'Curl con agarre prono', 'De pie, curl la barra con las palmas hacia abajo.', ARRAY['forearms', 'biceps'], ARRAY['barbell'], 'intermediate', 'strength'),
('Agarre con pinza', 'Fuerza de agarre con disco', 'Sujeta un disco de peso con los dedos el mayor tiempo posible.', ARRAY['forearms'], ARRAY['bodyweight'], 'intermediate', 'strength'),

-- === CARDIO (adicionales) ===
('Sprint en cinta', 'Intervalos de velocidad', 'Alterna entre sprints de 20-30 segundos y caminata de 60 segundos.', ARRAY['quadriceps', 'hamstrings', 'calves', 'core'], ARRAY['machine'], 'intermediate', 'cardio'),
('Remo en ergometro', 'Cardio de cuerpo completo en maquina de remo', 'Empuja con piernas, tira con espalda y brazos en secuencia fluida.', ARRAY['back', 'quadriceps', 'biceps', 'core'], ARRAY['machine'], 'beginner', 'cardio'),
('Bicicleta estacionaria', 'Cardio de bajo impacto', 'Pedalea a intensidad constante o en intervalos.', ARRAY['quadriceps', 'hamstrings', 'calves'], ARRAY['machine'], 'beginner', 'cardio'),
('Escaladora', 'Cardio en maquina escaladora', 'Sube escalones a ritmo constante usando toda la planta del pie.', ARRAY['quadriceps', 'glutes', 'calves'], ARRAY['machine'], 'intermediate', 'cardio'),
('Battle ropes', 'Ejercicio de alta intensidad con cuerdas', 'Agita las cuerdas creando ondas con movimientos alternos o simultaneos.', ARRAY['shoulders', 'core', 'back'], ARRAY['bodyweight'], 'intermediate', 'cardio'),
('Kettlebell swing', 'Swing de kettlebell', 'Con kettlebell entre las piernas, empuja caderas al frente para balancear el peso.', ARRAY['glutes', 'hamstrings', 'core', 'shoulders'], ARRAY['kettlebell'], 'intermediate', 'cardio'),
('Thruster', 'Sentadilla + press combinado', 'Realiza una sentadilla y al subir, empuja las mancuernas o barra sobre la cabeza.', ARRAY['quadriceps', 'glutes', 'shoulders', 'triceps'], ARRAY['barbell'], 'intermediate', 'cardio'),
('Bear crawl', 'Desplazamiento en cuatro puntos', 'Camina en posicion de oso (manos y pies) hacia adelante y atras.', ARRAY['core', 'shoulders', 'quadriceps'], ARRAY['bodyweight'], 'intermediate', 'cardio'),
('Sled push', 'Empuje de trineo', 'Empuja un trineo con peso a lo largo de una distancia.', ARRAY['quadriceps', 'glutes', 'core', 'shoulders'], ARRAY['machine'], 'intermediate', 'cardio'),
('Wall ball', 'Sentadilla con lanzamiento de balon', 'Realiza sentadilla y al subir lanza el balon medicinal contra la pared.', ARRAY['quadriceps', 'glutes', 'shoulders', 'core'], ARRAY['bodyweight'], 'intermediate', 'cardio'),

-- === PLIOMETRIA ===
('Sentadilla con salto', 'Sentadilla explosiva con salto', 'Realiza una sentadilla y salta explosivamente al subir.', ARRAY['quadriceps', 'glutes', 'calves'], ARRAY['bodyweight'], 'intermediate', 'strength'),
('Zancada con salto', 'Zancada alternando con salto', 'En posicion de zancada, salta y alterna piernas en el aire.', ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY['bodyweight'], 'intermediate', 'strength'),
('Drop jump', 'Salto desde altura', 'Baja de un cajon y al tocar el suelo salta inmediatamente hacia arriba.', ARRAY['quadriceps', 'calves', 'glutes'], ARRAY['bodyweight'], 'advanced', 'strength'),
('Flexiones pliometricas', 'Flexiones con fase de vuelo', 'Realiza una flexion explosiva despegando las manos del suelo.', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['bodyweight'], 'advanced', 'strength'),
('Skater jumps', 'Saltos laterales', 'Salta lateralmente de un pie a otro imitando el movimiento de un patinador.', ARRAY['glutes', 'quadriceps'], ARRAY['bodyweight'], 'intermediate', 'cardio'),

-- === FLEXIBILIDAD (adicionales) ===
('Estiramiento de gluteos', 'Estiramiento de piriforme', 'Acostado, cruza un tobillo sobre la rodilla opuesta y tira hacia el pecho.', ARRAY['glutes'], ARRAY['bodyweight'], 'beginner', 'flexibility'),
('Estiramiento de hombros cruzado', 'Estiramiento de deltoides posterior', 'Cruza un brazo frente al pecho y presiona con el otro brazo.', ARRAY['shoulders'], ARRAY['bodyweight'], 'beginner', 'flexibility'),
('Estiramiento de triceps', 'Estiramiento sobre la cabeza', 'Lleva una mano detras de la cabeza y presiona el codo con la otra mano.', ARRAY['triceps'], ARRAY['bodyweight'], 'beginner', 'flexibility'),
('Estiramiento de psoas', 'Estiramiento de flexor de cadera', 'En posicion de zancada baja, empuja la cadera hacia adelante.', ARRAY['hip_flexors'], ARRAY['bodyweight'], 'beginner', 'flexibility'),
('Perro boca abajo', 'Postura de yoga para cadena posterior', 'Desde plancha, empuja las caderas hacia arriba formando una V invertida.', ARRAY['hamstrings', 'calves', 'shoulders', 'back'], ARRAY['bodyweight'], 'beginner', 'flexibility'),
('Estiramiento 90/90', 'Movilidad de cadera', 'Sentado con ambas piernas a 90 grados, rota el torso hacia cada lado.', ARRAY['hip_flexors', 'glutes'], ARRAY['bodyweight'], 'beginner', 'flexibility'),
('Foam rolling espalda', 'Auto-masaje con rodillo', 'Acostado sobre el foam roller, rueda arriba y abajo en la espalda media.', ARRAY['back'], ARRAY['bodyweight'], 'beginner', 'flexibility'),
('Foam rolling cuadriceps', 'Auto-masaje de cuadriceps', 'Boca abajo sobre el foam roller, rueda desde la cadera hasta la rodilla.', ARRAY['quadriceps'], ARRAY['bodyweight'], 'beginner', 'flexibility'),

-- === EJERCICIOS CON BANDAS ===
('Pull apart con banda', 'Retraccion escapular con banda', 'Sostén la banda frente al pecho y abre los brazos hacia los lados.', ARRAY['shoulders', 'back', 'traps'], ARRAY['band'], 'beginner', 'strength'),
('Curl con banda', 'Curl de biceps con banda elastica', 'Pisa la banda y curl hacia los hombros.', ARRAY['biceps'], ARRAY['band'], 'beginner', 'strength'),
('Sentadilla con banda', 'Sentadilla con resistencia de banda', 'Con banda sobre los hombros y bajo los pies, realiza sentadilla.', ARRAY['quadriceps', 'glutes'], ARRAY['band'], 'beginner', 'strength'),
('Clamshell con banda', 'Activacion de gluteo medio', 'Acostado de lado con banda en rodillas, abre y cierra las rodillas.', ARRAY['glutes'], ARRAY['band'], 'beginner', 'strength'),
('Monster walk', 'Caminata lateral con banda', 'Con banda en los tobillos, camina lateralmente manteniendo tension.', ARRAY['glutes'], ARRAY['band'], 'beginner', 'strength'),
('Press de pecho con banda', 'Press horizontal con banda elastica', 'Con banda detras de la espalda, empuja al frente.', ARRAY['chest', 'triceps'], ARRAY['band'], 'beginner', 'strength'),

-- === EJERCICIOS CON TRX ===
('Remo TRX', 'Remo con suspension', 'Inclinate hacia atras sosteniendo el TRX y tira del cuerpo hacia las manos.', ARRAY['back', 'biceps'], ARRAY['trx'], 'beginner', 'strength'),
('Flexiones TRX', 'Flexiones con suspension', 'Con manos en las asas del TRX, realiza flexiones.', ARRAY['chest', 'triceps', 'core'], ARRAY['trx'], 'intermediate', 'strength'),
('Sentadilla TRX', 'Sentadilla asistida con suspension', 'Sujeta las asas y realiza sentadilla profunda con asistencia.', ARRAY['quadriceps', 'glutes'], ARRAY['trx'], 'beginner', 'strength'),
('Pike TRX', 'Pike push up en suspension', 'Con pies en el TRX, lleva las caderas hacia arriba formando una V.', ARRAY['shoulders', 'core'], ARRAY['trx'], 'advanced', 'strength'),
('Curl de biceps TRX', 'Curl con peso corporal en TRX', 'Inclinate hacia atras y curl el cuerpo hacia las manos.', ARRAY['biceps'], ARRAY['trx'], 'intermediate', 'strength'),
('Mountain climber TRX', 'Mountain climber con pies en suspension', 'Con pies en el TRX, lleva rodillas al pecho alternando.', ARRAY['core', 'hip_flexors'], ARRAY['trx'], 'intermediate', 'cardio')

ON CONFLICT DO NOTHING;
