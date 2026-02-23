-- Add completed_at timestamp to workout_logs
ALTER TABLE workout_logs ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Backfill existing completed logs with updated_at
UPDATE workout_logs SET completed_at = updated_at WHERE completed = true AND completed_at IS NULL;
