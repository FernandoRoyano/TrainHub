-- ============================================
-- Routines: plantilla de rutina creada por el entrenador
-- ============================================
CREATE TABLE public.routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_weeks INT DEFAULT 4,
  days_per_week INT DEFAULT 3,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  target_gender TEXT DEFAULT 'unisex' CHECK (target_gender IN ('male', 'female', 'unisex')),
  is_template BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage own routines"
  ON public.routines FOR ALL
  USING (auth.uid() = trainer_id);

CREATE INDEX idx_routines_trainer ON public.routines(trainer_id);

CREATE TRIGGER on_routines_updated
  BEFORE UPDATE ON public.routines
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Routine Days: cada dia dentro de una rutina
-- ============================================
CREATE TABLE public.routine_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id UUID NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.routine_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage routine days"
  ON public.routine_days FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.routines
      WHERE routines.id = routine_days.routine_id
      AND routines.trainer_id = auth.uid()
    )
  );

CREATE INDEX idx_routine_days_routine ON public.routine_days(routine_id, day_number);

-- ============================================
-- Routine Exercises: ejercicios dentro de un dia
-- ============================================
CREATE TABLE public.routine_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_day_id UUID NOT NULL REFERENCES public.routine_days(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  order_index INT NOT NULL DEFAULT 0,
  sets INT DEFAULT 3,
  reps TEXT DEFAULT '10',
  rest_seconds INT DEFAULT 60,
  notes TEXT,
  superset_group INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.routine_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage routine exercises"
  ON public.routine_exercises FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.routine_days
      JOIN public.routines ON routines.id = routine_days.routine_id
      WHERE routine_days.id = routine_exercises.routine_day_id
      AND routines.trainer_id = auth.uid()
    )
  );

CREATE INDEX idx_routine_exercises_day ON public.routine_exercises(routine_day_id, order_index);

-- ============================================
-- Client Routines: asignacion de rutina a cliente
-- ============================================
CREATE TABLE public.client_routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  routine_id UUID NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.client_routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage client routines"
  ON public.client_routines FOR ALL
  USING (auth.uid() = trainer_id);

CREATE POLICY "Clients view own assigned routines"
  ON public.client_routines FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = client_routines.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE INDEX idx_client_routines_client ON public.client_routines(client_id);
CREATE INDEX idx_client_routines_routine ON public.client_routines(routine_id);
CREATE INDEX idx_client_routines_trainer ON public.client_routines(trainer_id);

CREATE TRIGGER on_client_routines_updated
  BEFORE UPDATE ON public.client_routines
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
