-- Habilita Realtime en las tablas que componen la rutina del cliente
-- para que los cambios del entrenador se propaguen al navegador del cliente
-- sin necesidad de recargar.

ALTER PUBLICATION supabase_realtime ADD TABLE public.routines;
ALTER PUBLICATION supabase_realtime ADD TABLE public.routine_days;
ALTER PUBLICATION supabase_realtime ADD TABLE public.routine_exercises;
ALTER PUBLICATION supabase_realtime ADD TABLE public.exercise_groups;
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_routines;
