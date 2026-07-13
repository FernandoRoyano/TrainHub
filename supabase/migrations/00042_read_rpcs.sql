-- =====================================================
-- 00042: RPCs de lectura para el dashboard del trainer
-- Colapsan 15+3 requests de PostgREST en 1+1.
-- SECURITY INVOKER: RLS sigue aplicando; el trainer se
-- resuelve con auth.uid(), no se confía en parámetros.
-- =====================================================

-- p_week_start: lunes de la semana en fecha LOCAL del trainer (columnas DATE)
-- p_week_start_ts: mismo instante como timestamptz (columnas timestamptz)
CREATE OR REPLACE FUNCTION public.get_dashboard_stats(
  p_week_start date,
  p_week_start_ts timestamptz
)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'active_clients', (
      SELECT count(*) FROM clients
      WHERE trainer_id = auth.uid() AND status = 'active'
    ),
    'total_routines', (
      SELECT count(*) FROM routines WHERE trainer_id = auth.uid()
    ),
    'pending_reviews', (
      SELECT count(*) FROM client_routines
      WHERE trainer_id = auth.uid() AND status = 'active'
        AND start_date < (CURRENT_DATE - 28)
    ),
    'new_clients_week', (
      SELECT count(*) FROM clients
      WHERE trainer_id = auth.uid() AND created_at >= p_week_start_ts
    ),
    'unread_messages', (
      SELECT count(*) FROM messages m
      JOIN conversations c ON c.id = m.conversation_id
      WHERE c.trainer_id = auth.uid() AND NOT m.read AND m.sender_id <> auth.uid()
    ),
    'messages_sent_week', (
      SELECT count(*) FROM messages m
      JOIN conversations c ON c.id = m.conversation_id
      WHERE c.trainer_id = auth.uid() AND m.sender_id = auth.uid()
        AND m.created_at >= p_week_start_ts
    ),
    'recent_clients', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', id, 'full_name', full_name, 'created_at', created_at
      ) ORDER BY created_at DESC)
      FROM (
        SELECT id, full_name, created_at FROM clients
        WHERE trainer_id = auth.uid()
        ORDER BY created_at DESC LIMIT 5
      ) rc
    ), '[]'::jsonb),
    'recent_routines', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', id, 'name', name, 'created_at', created_at
      ) ORDER BY created_at DESC)
      FROM (
        SELECT id, name, created_at FROM routines
        WHERE trainer_id = auth.uid()
        ORDER BY created_at DESC LIMIT 5
      ) rr
    ), '[]'::jsonb),
    'recent_assignments', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', ra.id, 'created_at', ra.created_at,
        'client_name', ra.client_name, 'routine_name', ra.routine_name
      ) ORDER BY ra.created_at DESC)
      FROM (
        SELECT cr.id, cr.created_at, cl.full_name AS client_name, r.name AS routine_name
        FROM client_routines cr
        LEFT JOIN clients cl ON cl.id = cr.client_id
        LEFT JOIN routines r ON r.id = cr.routine_id
        WHERE cr.trainer_id = auth.uid()
        ORDER BY cr.created_at DESC LIMIT 5
      ) ra
    ), '[]'::jsonb),
    'week_workouts', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('client_id', wl.client_id, 'date', wl.date))
      FROM workout_logs wl
      JOIN client_routines cr ON cr.id = wl.client_routine_id
      WHERE cr.trainer_id = auth.uid() AND wl.date >= p_week_start
    ), '[]'::jsonb),
    'active_clients_list', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('id', id, 'full_name', full_name))
      FROM clients
      WHERE trainer_id = auth.uid() AND status = 'active'
    ), '[]'::jsonb),
    'client_routine_days', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'client_id', cr.client_id, 'days_per_week', COALESCE(r.days_per_week, 0)
      ))
      FROM client_routines cr
      LEFT JOIN routines r ON r.id = cr.routine_id
      WHERE cr.trainer_id = auth.uid() AND cr.status = 'active'
    ), '[]'::jsonb),
    'last_workouts', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('client_id', lw.client_id, 'date', lw.last_date))
      FROM (
        SELECT wl.client_id, max(wl.date) AS last_date
        FROM workout_logs wl
        JOIN client_routines cr ON cr.id = wl.client_routine_id
        WHERE cr.trainer_id = auth.uid()
          AND wl.date >= (CURRENT_DATE - 90)
        GROUP BY wl.client_id
      ) lw
    ), '[]'::jsonb)
  );
$$;

CREATE OR REPLACE FUNCTION public.get_sidebar_badges()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'unread_messages', (
      SELECT count(*) FROM messages m
      JOIN conversations c ON c.id = m.conversation_id
      WHERE c.trainer_id = auth.uid() AND NOT m.read AND m.sender_id <> auth.uid()
    ),
    'pending_clients', (
      SELECT count(*) FROM clients
      WHERE trainer_id = auth.uid() AND status = 'pending'
    )
  );
$$;

-- PUBLIC recibe EXECUTE implícito al crear la función: revocarlo, no solo anon
REVOKE EXECUTE ON FUNCTION public.get_dashboard_stats(date, timestamptz) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_sidebar_badges() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_dashboard_stats(date, timestamptz) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_sidebar_badges() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats(date, timestamptz) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_sidebar_badges() TO authenticated, service_role;
