-- Add timer fields to workout_logs
ALTER TABLE public.workout_logs ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ;
ALTER TABLE public.workout_logs ADD COLUMN IF NOT EXISTS duration_minutes INT;

-- Add feedback field to exercise_logs
ALTER TABLE public.exercise_logs ADD COLUMN IF NOT EXISTS feedback TEXT;
