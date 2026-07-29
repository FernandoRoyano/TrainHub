-- =====================================================
-- 00050: detalle por serie en exercise_logs (RIR, descanso, series extra)
--
-- Hasta ahora el registro del cliente era agregado: sets_completed (int),
-- weight_used (promedio) y reps_completed (texto "10@40kg / 8@42kg"). El
-- entrenador pidió poder registrar por serie el descanso y el RIR, y añadir
-- series extra. Se añade una columna JSONB con el detalle estructurado de cada
-- serie, sin romper el modelo de una fila por ejercicio (índice único 00037).
--
-- Cada elemento de set_logs:
--   { "set": 1, "reps": "10", "weight": 40, "rir": 2, "rest_seconds": 90, "note": "" }
--
-- Los campos agregados (sets_completed/weight_used/reps_completed) se siguen
-- rellenando para no romper las vistas e históricos existentes.
-- =====================================================

alter table public.exercise_logs
  add column if not exists set_logs jsonb not null default '[]'::jsonb;
