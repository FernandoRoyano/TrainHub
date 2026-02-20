-- Extend exercises table with fields for Free Exercise DB import
-- This is an ADDITIVE migration — no columns are dropped

ALTER TABLE public.exercises
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'custom',
  ADD COLUMN IF NOT EXISTS source_id TEXT,
  ADD COLUMN IF NOT EXISTS name_es TEXT,
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS description_es TEXT,
  ADD COLUMN IF NOT EXISTS instructions_es TEXT,
  ADD COLUMN IF NOT EXISTS primary_muscles TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS secondary_muscles TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS exercise_type TEXT,
  ADD COLUMN IF NOT EXISTS mechanics TEXT,
  ADD COLUMN IF NOT EXISTS force TEXT,
  ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Check constraints
ALTER TABLE public.exercises
  ADD CONSTRAINT chk_exercises_source CHECK (source IN ('custom', 'seed', 'free_exercise_db'));

ALTER TABLE public.exercises
  ADD CONSTRAINT chk_exercises_type CHECK (exercise_type IS NULL OR exercise_type IN ('compound', 'isolation', 'cardio', 'stretching', 'plyometric'));

ALTER TABLE public.exercises
  ADD CONSTRAINT chk_exercises_mechanics CHECK (mechanics IS NULL OR mechanics IN ('compound', 'isolation'));

ALTER TABLE public.exercises
  ADD CONSTRAINT chk_exercises_force CHECK (force IS NULL OR force IN ('push', 'pull', 'static'));

-- Unique index on source_id (only for non-null values)
CREATE UNIQUE INDEX IF NOT EXISTS idx_exercises_source_id
  ON public.exercises(source, source_id)
  WHERE source_id IS NOT NULL;

-- GIN index on primary_muscles for array contains queries
CREATE INDEX IF NOT EXISTS idx_exercises_primary_muscles
  ON public.exercises USING GIN(primary_muscles);

-- Index on slug for lookups
CREATE INDEX IF NOT EXISTS idx_exercises_slug
  ON public.exercises(slug)
  WHERE slug IS NOT NULL;

-- Index on source for filtering
CREATE INDEX IF NOT EXISTS idx_exercises_source
  ON public.exercises(source);

-- Update the "View exercises" policy to include public imported exercises
-- Drop and recreate since we need to expand the condition
DROP POLICY IF EXISTS "View exercises" ON public.exercises;

CREATE POLICY "View exercises"
  ON public.exercises FOR SELECT
  USING (
    trainer_id IS NULL
    OR auth.uid() = trainer_id
  );

-- Mark existing exercises without source as 'custom'
UPDATE public.exercises SET source = 'custom' WHERE source IS NULL;
