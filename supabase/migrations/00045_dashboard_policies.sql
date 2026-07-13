-- =====================================================
-- 00045: reconciliar políticas RLS creadas desde el dashboard
--
-- Auditoría 13-jul-2026 (pg_policies vs migraciones del repo):
-- estas 9 políticas existían solo en la base (creadas a mano en el
-- dashboard de Supabase) y 5 del repo fueron renombradas/reemplazadas.
-- Sin esta migración, una base reconstruida desde el repo dejaría a
-- los clientes sin acceso a sus rutinas asignadas.
--
-- Idempotente: en la base actual recrea las políticas idénticas;
-- en una base nueva las crea por primera vez.
-- =====================================================

-- ── routines / routine_days / routine_exercises: acceso de clientes ──
-- (sin estas, la app del cliente no puede leer su rutina asignada)

DROP POLICY IF EXISTS "Clients view assigned routines" ON public.routines;
CREATE POLICY "Clients view assigned routines"
  ON public.routines FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.client_routines cr
      JOIN public.clients c ON c.id = cr.client_id
      WHERE cr.routine_id = routines.id
      AND c.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Clients view assigned routine days" ON public.routine_days;
CREATE POLICY "Clients view assigned routine days"
  ON public.routine_days FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.client_routines cr
      JOIN public.clients c ON c.id = cr.client_id
      WHERE cr.routine_id = routine_days.routine_id
      AND c.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Clients view assigned routine exercises" ON public.routine_exercises;
CREATE POLICY "Clients view assigned routine exercises"
  ON public.routine_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.routine_days rd
      JOIN public.client_routines cr ON cr.routine_id = rd.routine_id
      JOIN public.clients c ON c.id = cr.client_id
      WHERE rd.id = routine_exercises.routine_day_id
      AND c.user_id = (SELECT auth.uid())
    )
  );

-- ── exercises: variantes con admin que reemplazaron a las "own" ──

DROP POLICY IF EXISTS "Insert own exercises" ON public.exercises;
DROP POLICY IF EXISTS "Insert exercises" ON public.exercises;
CREATE POLICY "Insert exercises"
  ON public.exercises FOR INSERT
  WITH CHECK (
    (SELECT auth.uid()) = trainer_id
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = (SELECT auth.uid()) AND users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Update own exercises" ON public.exercises;
DROP POLICY IF EXISTS "Update exercises" ON public.exercises;
CREATE POLICY "Update exercises"
  ON public.exercises FOR UPDATE
  USING (
    (SELECT auth.uid()) = trainer_id
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = (SELECT auth.uid()) AND users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Delete own exercises" ON public.exercises;
DROP POLICY IF EXISTS "Delete exercises" ON public.exercises;
CREATE POLICY "Delete exercises"
  ON public.exercises FOR DELETE
  USING (
    (SELECT auth.uid()) = trainer_id
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = (SELECT auth.uid()) AND users.role = 'admin'
    )
  );

-- ── body_measurements: INSERT del propio cliente ──

DROP POLICY IF EXISTS "Clients insert own measurements" ON public.body_measurements;
CREATE POLICY "Clients insert own measurements"
  ON public.body_measurements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = body_measurements.client_id
      AND clients.user_id = (SELECT auth.uid())
    )
  );

-- ── client_questionnaires: rename de "view and update" a solo view ──
-- (el UPDATE lo cubre "Clients update own questionnaire status", ya en repo)

DROP POLICY IF EXISTS "Clients view and update own questionnaires" ON public.client_questionnaires;
DROP POLICY IF EXISTS "Clients view own questionnaires" ON public.client_questionnaires;
CREATE POLICY "Clients view own questionnaires"
  ON public.client_questionnaires FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = client_questionnaires.client_id
      AND clients.user_id = (SELECT auth.uid())
    )
  );

-- ── stripe_events: deny-all explícito (solo service_role, que ignora RLS) ──

DROP POLICY IF EXISTS "stripe_events_service_only" ON public.stripe_events;
CREATE POLICY "stripe_events_service_only"
  ON public.stripe_events FOR ALL
  USING (false)
  WITH CHECK (false);

-- ── limpieza: política del repo eliminada en la base ──
-- (inocua: service_role ignora RLS, la política nunca hizo nada)
DROP POLICY IF EXISTS "Service role manages notifications" ON public.notifications;
