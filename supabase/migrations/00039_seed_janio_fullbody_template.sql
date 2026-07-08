-- Plantilla 'Full Body 3 dias - Janio' + copia asignada al cliente.
-- Generada y aplicada en produccion via REST el 2026-07-08; este archivo la versiona.
-- Idempotente: ON CONFLICT (id) DO NOTHING en todas las filas.

INSERT INTO routines (id, trainer_id, name, description, duration_weeks, days_per_week, difficulty, target_gender, is_template) VALUES
('2ec695b3-59bc-4fdb-91a5-983520aee722', '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Full Body 3 días — Janio', 'Full Body 3 días (ideal L-X-V, siempre con un día de descanso entre medias). Diseñada para sobrevivir a las semanas malas: si solo entrenas 2 días, igualmente estimulas todo el cuerpo. Prioridad real del programa: hombros y brazos, trabajados los 3 días con ángulos distintos.

PROGRESIÓN DOBLE: cada ejercicio tiene un rango de repeticiones (p. ej. 8-10). Empieza con un peso que te permita llegar al número bajo con buena técnica. Cuando completes TODAS las series al número alto del rango, sube el peso la siguiente sesión y vuelve a empezar por el número bajo.

ADAPTACIONES: rodilla (hemiprótesis) → patrones de bisagra de cadera, cero impacto, rango de prensa según sensaciones del día. Hombro → empujes con mancuerna en agarre neutro, nada de fondos, face pull para salud articular.

Si un día vas justo de tiempo: ejercicio 1 + las dos primeras biseries = 80% del estímulo. Un entreno recortado siempre gana a uno saltado.', 8, 3, 'intermediate', 'male', true),
('856b79fe-f3c7-4151-ba10-b4fdd6e9fc94', '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Full Body 3 días — Janio', 'Full Body 3 días (ideal L-X-V, siempre con un día de descanso entre medias). Diseñada para sobrevivir a las semanas malas: si solo entrenas 2 días, igualmente estimulas todo el cuerpo. Prioridad real del programa: hombros y brazos, trabajados los 3 días con ángulos distintos.

PROGRESIÓN DOBLE: cada ejercicio tiene un rango de repeticiones (p. ej. 8-10). Empieza con un peso que te permita llegar al número bajo con buena técnica. Cuando completes TODAS las series al número alto del rango, sube el peso la siguiente sesión y vuelve a empezar por el número bajo.

ADAPTACIONES: rodilla (hemiprótesis) → patrones de bisagra de cadera, cero impacto, rango de prensa según sensaciones del día. Hombro → empujes con mancuerna en agarre neutro, nada de fondos, face pull para salud articular.

Si un día vas justo de tiempo: ejercicio 1 + las dos primeras biseries = 80% del estímulo. Un entreno recortado siempre gana a uno saltado.', 8, 3, 'intermediate', 'male', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO routine_days (id, routine_id, day_number, name, description) VALUES
('3460293f-65e9-45b2-9954-d61b2468bf58', '2ec695b3-59bc-4fdb-91a5-983520aee722', 1, 'Día A — Empuje + bisagra', 'Empieza siempre por el press banca: es el ejercicio pesado del día, con 120-150 s de descanso entre series. Los ejercicios en biserie (3a-3b y 4a-4b) se hacen uno detrás de otro sin descanso, y descansas 60-90 s al terminar la pareja. En laterales y curl no busques peso: baja controlado y siente el músculo. ¿Día con prisa? Haz el ejercicio 1 y las dos biseries; el resto hoy es prescindible.'),
('70f63567-d33b-4dbf-a087-41ff8c24a43e', '2ec695b3-59bc-4fdb-91a5-983520aee722', 2, 'Día B — Tirón + cuádriceps controlado', 'El jalón es el principal del día: 120 s de descanso entre series. Las biseries (3a-3b y 4a-4b) van seguidas, con 60-90 s al terminar cada pareja. En la prensa, el rango de recorrido lo marca la rodilla ese día: si molesta, acorta el rango, no fuerces. ¿Con prisa? Ejercicio 1 y las dos biseries.'),
('9f4d16c7-a533-4770-9412-b1c58ddcd6d6', '2ec695b3-59bc-4fdb-91a5-983520aee722', 3, 'Día C — Hombros/brazos + glúteo', 'Día de foco máximo en tu objetivo. El press militar es el pesado: 120-150 s de descanso. La triserie 4a-4b-4c va seguida sin descanso entre ejercicios, con 60-90 s al terminar la ronda. En los aislamientos manda la técnica y la conexión, no la carga. ¿Con prisa? Ejercicio 1 + biserie 3 + triserie 4.'),
('59250ce3-5e73-41b0-8c4d-e783c30c3442', '856b79fe-f3c7-4151-ba10-b4fdd6e9fc94', 1, 'Día A — Empuje + bisagra', 'Empieza siempre por el press banca: es el ejercicio pesado del día, con 120-150 s de descanso entre series. Los ejercicios en biserie (3a-3b y 4a-4b) se hacen uno detrás de otro sin descanso, y descansas 60-90 s al terminar la pareja. En laterales y curl no busques peso: baja controlado y siente el músculo. ¿Día con prisa? Haz el ejercicio 1 y las dos biseries; el resto hoy es prescindible.'),
('0aada829-6fd8-44fd-9a61-5e89977aa641', '856b79fe-f3c7-4151-ba10-b4fdd6e9fc94', 2, 'Día B — Tirón + cuádriceps controlado', 'El jalón es el principal del día: 120 s de descanso entre series. Las biseries (3a-3b y 4a-4b) van seguidas, con 60-90 s al terminar cada pareja. En la prensa, el rango de recorrido lo marca la rodilla ese día: si molesta, acorta el rango, no fuerces. ¿Con prisa? Ejercicio 1 y las dos biseries.'),
('ee3d8c98-4472-4153-852e-eb9f9c085b96', '856b79fe-f3c7-4151-ba10-b4fdd6e9fc94', 3, 'Día C — Hombros/brazos + glúteo', 'Día de foco máximo en tu objetivo. El press militar es el pesado: 120-150 s de descanso. La triserie 4a-4b-4c va seguida sin descanso entre ejercicios, con 60-90 s al terminar la ronda. En los aislamientos manda la técnica y la conexión, no la carga. ¿Con prisa? Ejercicio 1 + biserie 3 + triserie 4.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO exercise_groups (id, routine_day_id, group_type, order_index, label) VALUES
('c39e5a80-f348-4035-9bce-cd70ae923caa', '3460293f-65e9-45b2-9954-d61b2468bf58', 'solo', 0, '1 — Principal'),
('ced4031f-d64d-4bf2-951e-2103366d2ba0', '3460293f-65e9-45b2-9954-d61b2468bf58', 'solo', 1, '2'),
('5e8a9dd0-2eb8-421a-a7f7-d1ff83ebd6ea', '3460293f-65e9-45b2-9954-d61b2468bf58', 'superset', 2, 'Biserie 3'),
('77d0be18-cfe5-498b-91bd-c6c0174fd612', '3460293f-65e9-45b2-9954-d61b2468bf58', 'superset', 3, 'Biserie 4'),
('6248ef92-6958-4061-ae2f-4e8f0d7f4feb', '3460293f-65e9-45b2-9954-d61b2468bf58', 'solo', 4, '5'),
('92b603b8-ab7f-4ce3-a97e-4d592086e451', '3460293f-65e9-45b2-9954-d61b2468bf58', 'solo', 5, '6'),
('9f909f5c-6a54-4cb0-b61f-7036e154bb43', '70f63567-d33b-4dbf-a087-41ff8c24a43e', 'solo', 0, '1 — Principal'),
('7bfd7f30-3876-4b3a-8704-e4142904e6bd', '70f63567-d33b-4dbf-a087-41ff8c24a43e', 'solo', 1, '2'),
('13bb841c-cb69-4364-af73-9439e19b4042', '70f63567-d33b-4dbf-a087-41ff8c24a43e', 'superset', 2, 'Biserie 3'),
('a2c66047-c760-4038-b4a9-c2a0a111c508', '70f63567-d33b-4dbf-a087-41ff8c24a43e', 'superset', 3, 'Biserie 4'),
('d42a3c2b-580e-4cc8-919d-f860029eedfd', '70f63567-d33b-4dbf-a087-41ff8c24a43e', 'solo', 4, '5'),
('068f3ffb-9fd5-406d-b73f-4c7bcb7111b6', '70f63567-d33b-4dbf-a087-41ff8c24a43e', 'solo', 5, '6'),
('1f8fd93e-7ddb-4640-99f9-44a125633c42', '9f4d16c7-a533-4770-9412-b1c58ddcd6d6', 'solo', 0, '1 — Principal'),
('2a81d783-7a35-4e2a-a63f-91b0c215a6ee', '9f4d16c7-a533-4770-9412-b1c58ddcd6d6', 'solo', 1, '2'),
('43095ff7-c7ff-4600-b009-d555b35e12f6', '9f4d16c7-a533-4770-9412-b1c58ddcd6d6', 'superset', 2, 'Biserie 3'),
('2a46e5b2-f853-43bd-b30b-95d182341be2', '9f4d16c7-a533-4770-9412-b1c58ddcd6d6', 'triset', 3, 'Triserie 4 — Foco brazos/hombros'),
('76a26d9a-3c37-4182-869a-8ec2f20a11f2', '9f4d16c7-a533-4770-9412-b1c58ddcd6d6', 'solo', 4, '5'),
('dcd9b4f4-ae3e-4a84-ab96-e4b8b932a618', '9f4d16c7-a533-4770-9412-b1c58ddcd6d6', 'solo', 5, '6'),
('fe19e1ff-dbf9-4b9f-93e6-70a87c2a5f5a', '59250ce3-5e73-41b0-8c4d-e783c30c3442', 'solo', 0, '1 — Principal'),
('e03aa7ac-f63b-44f0-87cf-09561bf13c9c', '59250ce3-5e73-41b0-8c4d-e783c30c3442', 'solo', 1, '2'),
('73800ccc-3721-47b1-bf12-9533c8ae2247', '59250ce3-5e73-41b0-8c4d-e783c30c3442', 'superset', 2, 'Biserie 3'),
('b04cf668-8920-4ee9-895e-acf619044571', '59250ce3-5e73-41b0-8c4d-e783c30c3442', 'superset', 3, 'Biserie 4'),
('fa16a78c-05d9-4ccd-8253-b87d6868cc9c', '59250ce3-5e73-41b0-8c4d-e783c30c3442', 'solo', 4, '5'),
('6ed62ca7-fc06-463f-b323-059d6e7afc46', '59250ce3-5e73-41b0-8c4d-e783c30c3442', 'solo', 5, '6'),
('27a5a9d0-864c-4313-8c66-9a17d7a80265', '0aada829-6fd8-44fd-9a61-5e89977aa641', 'solo', 0, '1 — Principal'),
('764fe1da-f9cb-42d9-bfbf-9ff9565197b1', '0aada829-6fd8-44fd-9a61-5e89977aa641', 'solo', 1, '2'),
('8ff6d365-29b0-4bee-acda-91d7c5c7f636', '0aada829-6fd8-44fd-9a61-5e89977aa641', 'superset', 2, 'Biserie 3'),
('f3f433f5-bec7-4cc8-aedc-c7d01f8b7df7', '0aada829-6fd8-44fd-9a61-5e89977aa641', 'superset', 3, 'Biserie 4'),
('7536ad74-cc2d-424b-ba36-09d280478158', '0aada829-6fd8-44fd-9a61-5e89977aa641', 'solo', 4, '5'),
('a473fac5-4f93-4353-a492-5fc9555cb70c', '0aada829-6fd8-44fd-9a61-5e89977aa641', 'solo', 5, '6'),
('e91d7d40-e944-4ab6-85b7-972f80253fea', 'ee3d8c98-4472-4153-852e-eb9f9c085b96', 'solo', 0, '1 — Principal'),
('7d580ed8-80a8-4ac9-8d16-1e5d35f41ab8', 'ee3d8c98-4472-4153-852e-eb9f9c085b96', 'solo', 1, '2'),
('c0a60ade-41c7-4180-90b2-ad7c58a31013', 'ee3d8c98-4472-4153-852e-eb9f9c085b96', 'superset', 2, 'Biserie 3'),
('279616fa-7e15-40d1-8a4f-192d20902736', 'ee3d8c98-4472-4153-852e-eb9f9c085b96', 'triset', 3, 'Triserie 4 — Foco brazos/hombros'),
('bd1c313d-e17b-4e3c-8490-bbbd456dbdc1', 'ee3d8c98-4472-4153-852e-eb9f9c085b96', 'solo', 4, '5'),
('ca330de3-aff0-4a71-96d0-42a23e451441', 'ee3d8c98-4472-4153-852e-eb9f9c085b96', 'solo', 5, '6')
ON CONFLICT (id) DO NOTHING;

INSERT INTO routine_exercises (id, routine_day_id, exercise_id, exercise_group_id, order_index, sets, reps, rest_seconds, notes) VALUES
('8df4dab7-4b1d-4a57-87d5-bf68ce8f7316', '3460293f-65e9-45b2-9954-d61b2468bf58', '2c719634-bea2-46e1-8aff-c5757b4f5088', 'c39e5a80-f348-4035-9bce-cd70ae923caa', 0, 4, '8-10', 150, 'Ejercicio pesado del día. Agarre neutro para proteger el hombro.'),
('009f606e-4307-49b7-9e02-766985ee5e3a', '3460293f-65e9-45b2-9954-d61b2468bf58', '88c102a9-ad99-49a8-b13d-d0dc0ae9720d', 'ced4031f-d64d-4bf2-951e-2103366d2ba0', 1, 3, '8-10', 120, 'Bisagra de cadera, mínima flexión de rodilla.'),
('e91b1d09-2577-4e29-8447-dd096c474fb1', '3460293f-65e9-45b2-9954-d61b2468bf58', '18bcd3ec-3f9c-4df7-b169-9683e8810ab6', '5e8a9dd0-2eb8-421a-a7f7-d1ff83ebd6ea', 2, 3, '10', 0, '3a. Sin descanso, pasa al remo.'),
('f81a21cd-c7ed-40ab-a17d-6a9a3a407150', '3460293f-65e9-45b2-9954-d61b2468bf58', '9442f527-8f3b-437a-866a-ed30b730f4bf', '5e8a9dd0-2eb8-421a-a7f7-d1ff83ebd6ea', 3, 3, '10-12', 75, '3b. Descansa 60-90 s al acabar la pareja.'),
('9b9b9fbf-e073-4708-baa6-fb5a8c874162', '3460293f-65e9-45b2-9954-d61b2468bf58', 'c925609b-f56c-4733-8d6c-68dd11a9342c', '77d0be18-cfe5-498b-91bd-c6c0174fd612', 4, 3, '12-15', 0, '4a. Foco hombro: control, no peso.'),
('8b72db7f-4555-43db-8e11-3d31f5074206', '3460293f-65e9-45b2-9954-d61b2468bf58', 'b54da71d-2e92-4a02-b546-c9940a17c11d', '77d0be18-cfe5-498b-91bd-c6c0174fd612', 5, 3, '10-12', 60, '4b. Descansa 60-90 s al acabar la pareja.'),
('148032cf-c525-4175-a352-28ef56cc433b', '3460293f-65e9-45b2-9954-d61b2468bf58', '0ed95ea3-6622-496a-aa4b-e50918f7d565', '6248ef92-6958-4061-ae2f-4e8f0d7f4feb', 6, 3, '15', 60, 'Salud de hombro: equilibra todo el trabajo de empuje.'),
('44a86dd8-1364-4c86-abbd-ea6904a77e7f', '3460293f-65e9-45b2-9954-d61b2468bf58', '399a49e8-b21a-4e54-8e62-112d4e12b305', '92b603b8-ab7f-4ce3-a97e-4d592086e451', 7, 3, '40s', 45, 'Core. Cuerpo en línea, sin hundir la cadera.'),
('bd8f2520-9fb7-4363-b957-edcff405701a', '70f63567-d33b-4dbf-a087-41ff8c24a43e', '1e6af6cb-e035-49bf-9d3a-bd800661c63e', '9f909f5c-6a54-4cb0-b61f-7036e154bb43', 0, 4, '10-12', 120, 'Principal de tirón. Agarre en V (neutro).'),
('46063ba9-43a5-428a-9471-8612a310838e', '70f63567-d33b-4dbf-a087-41ff8c24a43e', '229fa1ef-d49e-484e-b267-35056c2addaa', '7bfd7f30-3876-4b3a-8704-e4142904e6bd', 1, 3, '10-12', 90, 'Rango según tolerancia de la rodilla ese día. Sin bloquear al final.'),
('6011df68-92c7-4d9d-a56d-2b12e2b31fc4', '70f63567-d33b-4dbf-a087-41ff8c24a43e', '6622046c-f76e-4c71-ad8c-3b76df12ce95', '13bb841c-cb69-4364-af73-9439e19b4042', 2, 3, '10', 0, '3a. Agarre cerrado. Sin descanso, pasa al press.'),
('26e74df1-26ae-43bf-971f-02df6a3dcf0d', '70f63567-d33b-4dbf-a087-41ff8c24a43e', 'ed626506-2c7c-486d-9d5f-154ad1140f6f', '13bb841c-cb69-4364-af73-9439e19b4042', 3, 3, '10', 75, '3b. Descansa 60-90 s al acabar la pareja.'),
('e391acfd-513b-4f0e-b94a-7f08c93cabac', '70f63567-d33b-4dbf-a087-41ff8c24a43e', 'fd837b4d-c070-41f5-a6ac-228ddb555353', 'a2c66047-c760-4038-b4a9-c2a0a111c508', 4, 3, '15', 0, '4a. Deltoides posterior. Ligero y controlado.'),
('933c9854-cad8-4880-909a-0b5cd5f80d94', '70f63567-d33b-4dbf-a087-41ff8c24a43e', '9756e4d0-dcf5-41a8-9b0b-29723f23c96f', 'a2c66047-c760-4038-b4a9-c2a0a111c508', 5, 3, '10-12', 60, '4b. Antebrazo y braquial. Descansa al acabar la pareja.'),
('9ea2c835-657d-415e-8c48-fa900b5dc2c1', '70f63567-d33b-4dbf-a087-41ff8c24a43e', '7cb7f880-2a93-4a6c-aaae-01548f881ae9', 'd42a3c2b-580e-4cc8-919d-f860029eedfd', 6, 3, '12', 60, 'Isquios: complementa el RDL del día A. Controla la bajada.'),
('9d63c308-7a24-45d8-84e9-f1db8ceb6a05', '70f63567-d33b-4dbf-a087-41ff8c24a43e', '5d05d54c-f3a8-45d1-93d6-d2fb60baa769', '068f3ffb-9fd5-406d-b73f-4c7bcb7111b6', 7, 3, '15', 45, 'Core. Flexiona desde el abdomen, no desde la cadera.'),
('80c6a37b-3aad-47e8-a438-f301ae6341a1', '9f4d16c7-a533-4770-9412-b1c58ddcd6d6', '18bcd3ec-3f9c-4df7-b169-9683e8810ab6', '1f8fd93e-7ddb-4640-99f9-44a125633c42', 0, 4, '8-10', 150, 'Principal de hombro del día. De pie, core firme.'),
('b905f059-502e-44b5-91fa-06d0d8b1d096', '9f4d16c7-a533-4770-9412-b1c58ddcd6d6', 'd21efc1c-e429-4d50-8c04-23d6e3ef49b7', '2a81d783-7a35-4e2a-a63f-91b0c215a6ee', 1, 3, '10-12', 90, 'Desde el suelo, sin máquina. Aprieta el glúteo arriba 1 segundo.'),
('f5a74f71-48a5-423f-b3bd-ef4ba095976b', '9f4d16c7-a533-4770-9412-b1c58ddcd6d6', '64244836-1f12-46cb-b7b5-b3aa061d2881', '43095ff7-c7ff-4600-b009-d555b35e12f6', 2, 3, '10', 0, '3a. Sin descanso, pasa al jalón.'),
('bd44e308-16fc-4931-996b-92530601fd51', '9f4d16c7-a533-4770-9412-b1c58ddcd6d6', 'f9618105-c302-4434-b5a2-46cb25b92f22', '43095ff7-c7ff-4600-b009-d555b35e12f6', 3, 3, '10-12', 75, '3b. Descansa 60-90 s al acabar la pareja.'),
('fd07522d-ade6-4689-8a88-77614045fa6d', '9f4d16c7-a533-4770-9412-b1c58ddcd6d6', 'c925609b-f56c-4733-8d6c-68dd11a9342c', '2a46e5b2-f853-43bd-b30b-95d182341be2', 4, 3, '15', 0, '4a. El foco del objetivo. Control total.'),
('29548cf5-ac27-4e8d-ae81-84cb9ee798a8', '9f4d16c7-a533-4770-9412-b1c58ddcd6d6', '1c52a94d-5ff1-42eb-9a24-5629299ba980', '2a46e5b2-f853-43bd-b30b-95d182341be2', 5, 3, '12', 0, '4b. Sin balanceo.'),
('494485f6-53d3-4aca-be5a-0a53ccf64145', '9f4d16c7-a533-4770-9412-b1c58ddcd6d6', '0832b70e-7451-4491-9a25-6c593e91fc85', '2a46e5b2-f853-43bd-b30b-95d182341be2', 6, 3, '15', 75, '4c. Descansa 60-90 s al acabar la triserie.'),
('b6435ac8-00e2-495d-8f65-4501dc057ca7', '9f4d16c7-a533-4770-9412-b1c58ddcd6d6', 'efefa68c-d5a1-4fa4-bff0-3064286849df', '76a26d9a-3c37-4182-869a-8ec2f20a11f2', 7, 3, '10/lado', 60, 'Glúteo e isquio unilateral, rodilla-friendly. Apóyate si necesitas equilibrio.'),
('6a06da58-e3d1-4256-851c-d56c8726890b', '9f4d16c7-a533-4770-9412-b1c58ddcd6d6', 'b481679c-c4fd-4aa0-95b3-6de100b73fa3', 'dcd9b4f4-ae3e-4a84-ab96-e4b8b932a618', 8, 3, '30s/lado', 45, 'Core lateral. Cadera alta, cuerpo en línea.'),
('601aa203-3678-4791-88de-5a55339368b2', '59250ce3-5e73-41b0-8c4d-e783c30c3442', '2c719634-bea2-46e1-8aff-c5757b4f5088', 'fe19e1ff-dbf9-4b9f-93e6-70a87c2a5f5a', 0, 4, '8-10', 150, 'Ejercicio pesado del día. Agarre neutro para proteger el hombro.'),
('bd2dee88-2fef-4ed2-855c-ec36f816ace5', '59250ce3-5e73-41b0-8c4d-e783c30c3442', '88c102a9-ad99-49a8-b13d-d0dc0ae9720d', 'e03aa7ac-f63b-44f0-87cf-09561bf13c9c', 1, 3, '8-10', 120, 'Bisagra de cadera, mínima flexión de rodilla.'),
('c2058b91-f114-4dde-bbb7-3c6aaa07bccf', '59250ce3-5e73-41b0-8c4d-e783c30c3442', '18bcd3ec-3f9c-4df7-b169-9683e8810ab6', '73800ccc-3721-47b1-bf12-9533c8ae2247', 2, 3, '10', 0, '3a. Sin descanso, pasa al remo.'),
('5cc0b15c-ee3e-4bc3-9dbe-0f722635712d', '59250ce3-5e73-41b0-8c4d-e783c30c3442', '9442f527-8f3b-437a-866a-ed30b730f4bf', '73800ccc-3721-47b1-bf12-9533c8ae2247', 3, 3, '10-12', 75, '3b. Descansa 60-90 s al acabar la pareja.'),
('2bd5ba71-2426-4902-982d-5c067b6bd442', '59250ce3-5e73-41b0-8c4d-e783c30c3442', 'c925609b-f56c-4733-8d6c-68dd11a9342c', 'b04cf668-8920-4ee9-895e-acf619044571', 4, 3, '12-15', 0, '4a. Foco hombro: control, no peso.'),
('e313e35f-f9ab-44b1-8be2-e9f70bd0f231', '59250ce3-5e73-41b0-8c4d-e783c30c3442', 'b54da71d-2e92-4a02-b546-c9940a17c11d', 'b04cf668-8920-4ee9-895e-acf619044571', 5, 3, '10-12', 60, '4b. Descansa 60-90 s al acabar la pareja.'),
('2201ec54-ee28-4c84-83d6-d57a69b1b0fe', '59250ce3-5e73-41b0-8c4d-e783c30c3442', '0ed95ea3-6622-496a-aa4b-e50918f7d565', 'fa16a78c-05d9-4ccd-8253-b87d6868cc9c', 6, 3, '15', 60, 'Salud de hombro: equilibra todo el trabajo de empuje.'),
('bb310641-53ec-4dfc-b5a5-a9a92273c522', '59250ce3-5e73-41b0-8c4d-e783c30c3442', '399a49e8-b21a-4e54-8e62-112d4e12b305', '6ed62ca7-fc06-463f-b323-059d6e7afc46', 7, 3, '40s', 45, 'Core. Cuerpo en línea, sin hundir la cadera.'),
('cef01eb2-1393-4db6-b764-478648aded5e', '0aada829-6fd8-44fd-9a61-5e89977aa641', '1e6af6cb-e035-49bf-9d3a-bd800661c63e', '27a5a9d0-864c-4313-8c66-9a17d7a80265', 0, 4, '10-12', 120, 'Principal de tirón. Agarre en V (neutro).'),
('e8e1fb12-72dc-4a27-ac15-f73dcffab8c9', '0aada829-6fd8-44fd-9a61-5e89977aa641', '229fa1ef-d49e-484e-b267-35056c2addaa', '764fe1da-f9cb-42d9-bfbf-9ff9565197b1', 1, 3, '10-12', 90, 'Rango según tolerancia de la rodilla ese día. Sin bloquear al final.'),
('ea388d25-9181-4f51-bf1f-9d1e00923229', '0aada829-6fd8-44fd-9a61-5e89977aa641', '6622046c-f76e-4c71-ad8c-3b76df12ce95', '8ff6d365-29b0-4bee-acda-91d7c5c7f636', 2, 3, '10', 0, '3a. Agarre cerrado. Sin descanso, pasa al press.'),
('21476142-ba86-4330-8dfd-8ac6302f301a', '0aada829-6fd8-44fd-9a61-5e89977aa641', 'ed626506-2c7c-486d-9d5f-154ad1140f6f', '8ff6d365-29b0-4bee-acda-91d7c5c7f636', 3, 3, '10', 75, '3b. Descansa 60-90 s al acabar la pareja.'),
('9de2e78d-205e-4740-a844-e28bceecffbc', '0aada829-6fd8-44fd-9a61-5e89977aa641', 'fd837b4d-c070-41f5-a6ac-228ddb555353', 'f3f433f5-bec7-4cc8-aedc-c7d01f8b7df7', 4, 3, '15', 0, '4a. Deltoides posterior. Ligero y controlado.'),
('b583c054-602a-40c3-91b1-bca4afc30d19', '0aada829-6fd8-44fd-9a61-5e89977aa641', '9756e4d0-dcf5-41a8-9b0b-29723f23c96f', 'f3f433f5-bec7-4cc8-aedc-c7d01f8b7df7', 5, 3, '10-12', 60, '4b. Antebrazo y braquial. Descansa al acabar la pareja.'),
('da0c9e56-9491-45a0-8964-64f3e4374aa5', '0aada829-6fd8-44fd-9a61-5e89977aa641', '7cb7f880-2a93-4a6c-aaae-01548f881ae9', '7536ad74-cc2d-424b-ba36-09d280478158', 6, 3, '12', 60, 'Isquios: complementa el RDL del día A. Controla la bajada.'),
('8f58bb3e-e3a3-401f-9529-286addb44914', '0aada829-6fd8-44fd-9a61-5e89977aa641', '5d05d54c-f3a8-45d1-93d6-d2fb60baa769', 'a473fac5-4f93-4353-a492-5fc9555cb70c', 7, 3, '15', 45, 'Core. Flexiona desde el abdomen, no desde la cadera.'),
('586fbee5-bcd2-4dc5-af38-d62200706485', 'ee3d8c98-4472-4153-852e-eb9f9c085b96', '18bcd3ec-3f9c-4df7-b169-9683e8810ab6', 'e91d7d40-e944-4ab6-85b7-972f80253fea', 0, 4, '8-10', 150, 'Principal de hombro del día. De pie, core firme.'),
('794753b8-5d67-4842-8188-f7f1423d0ccb', 'ee3d8c98-4472-4153-852e-eb9f9c085b96', 'd21efc1c-e429-4d50-8c04-23d6e3ef49b7', '7d580ed8-80a8-4ac9-8d16-1e5d35f41ab8', 1, 3, '10-12', 90, 'Desde el suelo, sin máquina. Aprieta el glúteo arriba 1 segundo.'),
('2e6b1cd4-0c2e-494b-b8e3-94589611823d', 'ee3d8c98-4472-4153-852e-eb9f9c085b96', '64244836-1f12-46cb-b7b5-b3aa061d2881', 'c0a60ade-41c7-4180-90b2-ad7c58a31013', 2, 3, '10', 0, '3a. Sin descanso, pasa al jalón.'),
('f0abba17-670e-4c53-924a-78311e35741c', 'ee3d8c98-4472-4153-852e-eb9f9c085b96', 'f9618105-c302-4434-b5a2-46cb25b92f22', 'c0a60ade-41c7-4180-90b2-ad7c58a31013', 3, 3, '10-12', 75, '3b. Descansa 60-90 s al acabar la pareja.'),
('94e7a978-38f0-4fc0-bba0-812a06054d60', 'ee3d8c98-4472-4153-852e-eb9f9c085b96', 'c925609b-f56c-4733-8d6c-68dd11a9342c', '279616fa-7e15-40d1-8a4f-192d20902736', 4, 3, '15', 0, '4a. El foco del objetivo. Control total.'),
('30b8a4ee-cf0a-4245-a477-aff54f8433aa', 'ee3d8c98-4472-4153-852e-eb9f9c085b96', '1c52a94d-5ff1-42eb-9a24-5629299ba980', '279616fa-7e15-40d1-8a4f-192d20902736', 5, 3, '12', 0, '4b. Sin balanceo.'),
('dbde3759-5743-4c84-8cc8-eb0f843f58e7', 'ee3d8c98-4472-4153-852e-eb9f9c085b96', '0832b70e-7451-4491-9a25-6c593e91fc85', '279616fa-7e15-40d1-8a4f-192d20902736', 6, 3, '15', 75, '4c. Descansa 60-90 s al acabar la triserie.'),
('a4221c53-edd7-4ec6-a454-9f4a33eeaacf', 'ee3d8c98-4472-4153-852e-eb9f9c085b96', 'efefa68c-d5a1-4fa4-bff0-3064286849df', 'bd1c313d-e17b-4e3c-8490-bbbd456dbdc1', 7, 3, '10/lado', 60, 'Glúteo e isquio unilateral, rodilla-friendly. Apóyate si necesitas equilibrio.'),
('28bd6383-e5a6-4399-b0dc-f40dd071f917', 'ee3d8c98-4472-4153-852e-eb9f9c085b96', 'b481679c-c4fd-4aa0-95b3-6de100b73fa3', 'ca330de3-aff0-4a71-96d0-42a23e451441', 8, 3, '30s/lado', 45, 'Core lateral. Cadera alta, cuerpo en línea.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO client_routines (id, client_id, routine_id, trainer_id, start_date, end_date, status, notes) VALUES
('16f9c3e0-1533-48f9-bdef-4c5897d5123d', 'ddb3c640-867d-49f5-955e-7845c06da53c', '856b79fe-f3c7-4151-ba10-b4fdd6e9fc94', '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', '2026-07-08', '2026-09-02', 'active', 'Full Body 3 días con doble progresión. Recuerda las dos anclas fuera del gym: rutina de cierre del día (ducha, infusión, 5 min de calma) y pasos diarios. El déficit se decide en la cena y en los pasos, no en las series.')
ON CONFLICT (id) DO NOTHING;
