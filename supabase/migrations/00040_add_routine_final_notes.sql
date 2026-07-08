-- Apuntes del entrenador a nivel de rutina: recomendaciones fuera del gym
-- (hábitos, pasos, descanso). El cliente los ve al final de su rutina.
ALTER TABLE public.routines
  ADD COLUMN IF NOT EXISTS final_notes TEXT;

-- Apuntes de la rutina Full Body de Janio (plantilla + copia asignada, seed 00039)
UPDATE public.routines
SET final_notes = 'Las dos anclas fuera del gimnasio (aquí se decide el resultado):

1. Cierre del día: cuando se acuesten los niños — ducha, infusión y 5 minutos de calma. Ese gesto ocupa el hueco donde antes caía el picoteo; el problema suele ser el automatismo, no el hambre real.

2. Pasos, no cardio machacón: sacar al perro más rato, paseos con los niños. Es tu mejor palanca de déficit con la rodilla, y además baja el estrés.

Sin contar calorías: el déficit lo construyen la cena y los pasos del día a día. La rutina protege el músculo; el entorno hace el resto.'
WHERE id IN (
  '2ec695b3-59bc-4fdb-91a5-983520aee722',
  '856b79fe-f3c7-4151-ba10-b4fdd6e9fc94'
)
AND final_notes IS NULL;
