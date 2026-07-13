-- =====================================================
-- 00041: Índices de rendimiento
-- Auditoría jul-2026: FKs sin índice + columnas usadas
-- en políticas RLS y filtros de la app.
-- =====================================================

-- CRÍTICO: lado derecho de ~20 políticas RLS
-- (EXISTS ... clients.user_id = auth.uid()) y lookups de la app cliente
CREATE INDEX IF NOT EXISTS idx_clients_user_id
  ON public.clients(user_id) WHERE user_id IS NOT NULL;

-- FKs sin índice (embeds de PostgREST + validación ON DELETE)
CREATE INDEX IF NOT EXISTS idx_routine_exercises_exercise
  ON public.routine_exercises(exercise_id);
CREATE INDEX IF NOT EXISTS idx_routine_exercises_group
  ON public.routine_exercises(exercise_group_id) WHERE exercise_group_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_messages_sender
  ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_conversations_client
  ON public.conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_block_exercises_exercise
  ON public.block_exercises(exercise_id);
CREATE INDEX IF NOT EXISTS idx_cycle_perf_workout_log
  ON public.cycle_performance_logs(workout_log_id) WHERE workout_log_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_client_service_tiers_trainer
  ON public.client_service_tiers(trainer_id);
CREATE INDEX IF NOT EXISTS idx_client_service_tiers_tier
  ON public.client_service_tiers(service_tier_id);
CREATE INDEX IF NOT EXISTS idx_client_coaching_plans_trainer
  ON public.client_coaching_plans(trainer_id);
CREATE INDEX IF NOT EXISTS idx_client_coaching_plans_routine
  ON public.client_coaching_plans(client_routine_id) WHERE client_routine_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_client_coaching_plans_meal
  ON public.client_coaching_plans(client_meal_plan_id) WHERE client_meal_plan_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_client_coaching_plans_tier
  ON public.client_coaching_plans(client_service_tier_id) WHERE client_service_tier_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_coaching_plan_questionnaires_template
  ON public.coaching_plan_questionnaires(questionnaire_template_id);
CREATE INDEX IF NOT EXISTS idx_session_notes_trainer
  ON public.session_notes(trainer_id);

-- analytics.service.ts: rango .gte(date) global sin líder indexable
CREATE INDEX IF NOT EXISTS idx_workout_logs_date
  ON public.workout_logs(date);

ANALYZE public.clients;
ANALYZE public.messages;
ANALYZE public.conversations;
ANALYZE public.routine_exercises;
ANALYZE public.workout_logs;
