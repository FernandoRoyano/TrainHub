-- ============================================
-- Workout Logs: registro de entrenamientos del cliente
-- ============================================
CREATE TABLE public.workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  client_routine_id UUID NOT NULL REFERENCES public.client_routines(id) ON DELETE CASCADE,
  routine_day_id UUID NOT NULL REFERENCES public.routine_days(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

-- Clients can manage their own logs
CREATE POLICY "Clients manage own workout logs"
  ON public.workout_logs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = workout_logs.client_id
      AND clients.user_id = auth.uid()
    )
  );

-- Trainers can view their clients' logs
CREATE POLICY "Trainers view client workout logs"
  ON public.workout_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = workout_logs.client_id
      AND clients.trainer_id = auth.uid()
    )
  );

CREATE INDEX idx_workout_logs_client ON public.workout_logs(client_id, date);
CREATE INDEX idx_workout_logs_routine ON public.workout_logs(client_routine_id);

-- ============================================
-- Exercise Logs: detalle de cada ejercicio completado
-- ============================================
CREATE TABLE public.exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_log_id UUID NOT NULL REFERENCES public.workout_logs(id) ON DELETE CASCADE,
  routine_exercise_id UUID NOT NULL REFERENCES public.routine_exercises(id) ON DELETE CASCADE,
  sets_completed INT DEFAULT 0,
  weight_used DECIMAL(6,2),
  reps_completed TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients manage own exercise logs"
  ON public.exercise_logs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_logs
      JOIN public.clients ON clients.id = workout_logs.client_id
      WHERE workout_logs.id = exercise_logs.workout_log_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers view client exercise logs"
  ON public.exercise_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_logs
      JOIN public.clients ON clients.id = workout_logs.client_id
      WHERE workout_logs.id = exercise_logs.workout_log_id
      AND clients.trainer_id = auth.uid()
    )
  );

CREATE INDEX idx_exercise_logs_workout ON public.exercise_logs(workout_log_id);

CREATE TRIGGER on_workout_logs_updated
  BEFORE UPDATE ON public.workout_logs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
