-- ============================================
-- Exercise Blocks: bloques reutilizables de ejercicios
-- ============================================
CREATE TABLE public.exercise_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  block_type TEXT NOT NULL CHECK (block_type IN ('warmup', 'cooldown', 'circuit', 'custom')),
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.exercise_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage own blocks"
  ON public.exercise_blocks FOR ALL
  USING (
    auth.uid() = trainer_id
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE INDEX idx_exercise_blocks_trainer ON public.exercise_blocks(trainer_id);
CREATE INDEX idx_exercise_blocks_type ON public.exercise_blocks(block_type);

CREATE TRIGGER on_exercise_blocks_updated
  BEFORE UPDATE ON public.exercise_blocks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Block Exercises: ejercicios dentro de un bloque
-- ============================================
CREATE TABLE public.block_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id UUID NOT NULL REFERENCES public.exercise_blocks(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  order_index INT NOT NULL DEFAULT 0,
  sets INT DEFAULT 3,
  reps TEXT DEFAULT '10',
  rest_seconds INT DEFAULT 60,
  notes TEXT,
  superset_group INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.block_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage block exercises"
  ON public.block_exercises FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.exercise_blocks
      WHERE exercise_blocks.id = block_exercises.block_id
      AND (
        exercise_blocks.trainer_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

CREATE INDEX idx_block_exercises_block ON public.block_exercises(block_id, order_index);
