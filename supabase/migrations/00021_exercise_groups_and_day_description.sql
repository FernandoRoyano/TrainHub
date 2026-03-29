-- ============================================
-- 1. Add description to routine_days (client-facing instructions)
-- ============================================
ALTER TABLE public.routine_days ADD COLUMN IF NOT EXISTS description TEXT;

-- ============================================
-- 2. Exercise Groups table
-- ============================================
CREATE TABLE IF NOT EXISTS public.exercise_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_day_id UUID NOT NULL REFERENCES public.routine_days(id) ON DELETE CASCADE,
  group_type TEXT NOT NULL DEFAULT 'solo'
    CHECK (group_type IN ('solo', 'superset', 'triset', 'circuit', 'emom', 'amrap')),
  order_index INT NOT NULL DEFAULT 0,
  rounds INT,
  time_limit_seconds INT,
  rest_between_rounds INT,
  label TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.exercise_groups ENABLE ROW LEVEL SECURITY;

-- Trainers manage groups through routines
CREATE POLICY "Trainers manage exercise groups"
  ON public.exercise_groups FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.routine_days
      JOIN public.routines ON routines.id = routine_days.routine_id
      WHERE routine_days.id = exercise_groups.routine_day_id
      AND routines.trainer_id = auth.uid()
    )
  );

-- Clients view groups through assigned routines
CREATE POLICY "Clients view exercise groups"
  ON public.exercise_groups FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.routine_days
      JOIN public.routines ON routines.id = routine_days.routine_id
      JOIN public.client_routines ON client_routines.routine_id = routines.id
      JOIN public.clients ON clients.id = client_routines.client_id
      WHERE routine_days.id = exercise_groups.routine_day_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE INDEX idx_exercise_groups_day ON public.exercise_groups(routine_day_id, order_index);

-- ============================================
-- 3. Add exercise_group_id to routine_exercises
-- ============================================
ALTER TABLE public.routine_exercises
  ADD COLUMN IF NOT EXISTS exercise_group_id UUID REFERENCES public.exercise_groups(id) ON DELETE SET NULL;

-- ============================================
-- 4. Migrate existing superset_group data to exercise_groups
-- ============================================
DO $$
DECLARE
  r RECORD;
  v_group_id UUID;
  v_group_type TEXT;
  v_ex_count INT;
BEGIN
  -- For each day that has exercises with superset_group
  FOR r IN (
    SELECT DISTINCT re.routine_day_id, re.superset_group
    FROM routine_exercises re
    WHERE re.superset_group IS NOT NULL
    ORDER BY re.routine_day_id, re.superset_group
  ) LOOP
    -- Count exercises in this superset
    SELECT COUNT(*) INTO v_ex_count
    FROM routine_exercises
    WHERE routine_day_id = r.routine_day_id AND superset_group = r.superset_group;

    IF v_ex_count = 2 THEN
      v_group_type := 'superset';
    ELSIF v_ex_count = 3 THEN
      v_group_type := 'triset';
    ELSE
      v_group_type := 'circuit';
    END IF;

    -- Get min order_index for this group
    INSERT INTO exercise_groups (routine_day_id, group_type, order_index)
    SELECT r.routine_day_id, v_group_type, MIN(re.order_index)
    FROM routine_exercises re
    WHERE re.routine_day_id = r.routine_day_id AND re.superset_group = r.superset_group
    RETURNING id INTO v_group_id;

    -- Link exercises to the group
    UPDATE routine_exercises
    SET exercise_group_id = v_group_id
    WHERE routine_day_id = r.routine_day_id AND superset_group = r.superset_group;
  END LOOP;

  -- Create solo groups for exercises without a superset_group
  FOR r IN (
    SELECT id, routine_day_id, order_index
    FROM routine_exercises
    WHERE superset_group IS NULL AND exercise_group_id IS NULL
  ) LOOP
    INSERT INTO exercise_groups (routine_day_id, group_type, order_index)
    VALUES (r.routine_day_id, 'solo', r.order_index)
    RETURNING id INTO v_group_id;

    UPDATE routine_exercises SET exercise_group_id = v_group_id WHERE id = r.id;
  END LOOP;
END $$;
