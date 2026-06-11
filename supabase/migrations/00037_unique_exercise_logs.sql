-- El upsert de logExercise usa onConflict (workout_log_id, routine_exercise_id)
-- pero esa constraint única nunca existió: Postgres rechazaba el upsert (42P10)
-- y el código caía a un INSERT, creando una fila duplicada en cada guardado.
-- Los duplicados inflaban progreso, historial y analíticas.

-- 1. Eliminar duplicados existentes conservando la fila más reciente por par
DELETE FROM public.exercise_logs el
USING public.exercise_logs dup
WHERE el.workout_log_id = dup.workout_log_id
  AND el.routine_exercise_id IS NOT DISTINCT FROM dup.routine_exercise_id
  AND el.routine_exercise_id IS NOT NULL
  AND (
    el.created_at < dup.created_at
    OR (el.created_at = dup.created_at AND el.id < dup.id)
  );

-- 2. Índice único que el upsert necesita. NO parcial: PostgREST no puede
--    inferir ON CONFLICT sobre índices parciales. Las filas con
--    routine_exercise_id NULL (historial preservado por la migración 00036)
--    no colisionan entre sí porque los NULL son distintos en índices únicos.
CREATE UNIQUE INDEX IF NOT EXISTS uq_exercise_logs_workout_exercise
  ON public.exercise_logs (workout_log_id, routine_exercise_id);
