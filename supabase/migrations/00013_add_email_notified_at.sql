-- Add debounce column for email notifications on messages
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS last_email_notified_at timestamptz;
