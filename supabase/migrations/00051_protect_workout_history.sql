-- Protege el historial de entrenamientos frente al borrado de una asignación.
--
-- Problema: workout_logs.client_routine_id -> client_routines seguía con
-- ON DELETE CASCADE (desde 00005). La migración 00036 convirtió a SET NULL los
-- FKs a routine_days/routine_exercises (editar rutina ya no borra logs), pero
-- dejó este camino. Si se borra una asignación (deleteClientRoutine) o la rutina,
-- todo el histórico del cliente para esa asignación se borraba en cascada.
--
-- Espejo de 00036: client_routine_id -> SET NULL + snapshot del nombre de rutina
-- para que el log sobreviva y conserve contexto aunque la asignación desaparezca.

-- ============================================
-- 1. client_routine_id: CASCADE -> SET NULL
-- ============================================
alter table public.workout_logs
  alter column client_routine_id drop not null;

alter table public.workout_logs
  drop constraint if exists workout_logs_client_routine_id_fkey;

alter table public.workout_logs
  add constraint workout_logs_client_routine_id_fkey
  foreign key (client_routine_id)
  references public.client_routines(id)
  on delete set null;

-- ============================================
-- 2. Snapshot del nombre de la rutina en el log
--    Si la asignación/rutina se elimina (FK a null), el histórico conserva de
--    qué rutina venía para mostrarlo al cliente.
-- ============================================
alter table public.workout_logs
  add column if not exists routine_name_snapshot text;

-- Backfill de los logs existentes desde la rutina asignada.
update public.workout_logs wl
set routine_name_snapshot = r.name
from public.client_routines cr
join public.routines r on r.id = cr.routine_id
where wl.client_routine_id = cr.id
  and wl.routine_name_snapshot is null;
