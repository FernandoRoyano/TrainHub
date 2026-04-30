-- Protege la integridad de datos de rutinas y previene pérdidas accidentales
-- por cascadas demasiado agresivas.
--
-- Problema raíz reportado: clientes ven ejercicios desaparecer de su rutina.
-- Causa: routine_exercises.exercise_id era ON DELETE CASCADE → cuando el
-- trainer borraba un ejercicio de su biblioteca, ese ejercicio se eliminaba
-- en cascada de TODAS las rutinas activas de TODOS sus clientes.

-- ============================================
-- 1. Soft delete para ejercicios
-- ============================================
alter table public.exercises
  add column if not exists archived_at timestamptz;

create index if not exists idx_exercises_active
  on public.exercises (trainer_id)
  where archived_at is null;

-- ============================================
-- 2. routine_exercises.exercise_id: CASCADE → RESTRICT
--    Borrar un ejercicio en uso ahora falla con error en vez de borrar
--    silenciosamente todas sus referencias en rutinas.
-- ============================================
alter table public.routine_exercises
  drop constraint if exists routine_exercises_exercise_id_fkey;

alter table public.routine_exercises
  add constraint routine_exercises_exercise_id_fkey
  foreign key (exercise_id)
  references public.exercises(id)
  on delete restrict;

-- ============================================
-- 3. Preservar historial de entrenamientos del cliente
--    Cuando el trainer edita una rutina (delete-all-days + reinsert),
--    los workout_logs y exercise_logs no deben perderse.
-- ============================================
alter table public.workout_logs
  alter column routine_day_id drop not null;

alter table public.workout_logs
  drop constraint if exists workout_logs_routine_day_id_fkey;

alter table public.workout_logs
  add constraint workout_logs_routine_day_id_fkey
  foreign key (routine_day_id)
  references public.routine_days(id)
  on delete set null;

alter table public.exercise_logs
  alter column routine_exercise_id drop not null;

alter table public.exercise_logs
  drop constraint if exists exercise_logs_routine_exercise_id_fkey;

alter table public.exercise_logs
  add constraint exercise_logs_routine_exercise_id_fkey
  foreign key (routine_exercise_id)
  references public.routine_exercises(id)
  on delete set null;

-- ============================================
-- 4. Snapshot del nombre del ejercicio en exercise_logs
--    Si el routine_exercise se elimina (FK queda null), el log conserva
--    el nombre original para que el cliente pueda ver su histórico.
-- ============================================
alter table public.exercise_logs
  add column if not exists exercise_name_snapshot text;
