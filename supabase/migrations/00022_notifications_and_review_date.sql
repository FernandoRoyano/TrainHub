-- ============================================
-- 1. Notifications table (in-app)
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('routine_ending', 'review_reminder', 'routine_assigned', 'message', 'general')),
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages notifications"
  ON public.notifications FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, read, created_at DESC);

-- ============================================
-- 2. Add review_date to client_routines
-- ============================================
ALTER TABLE public.client_routines ADD COLUMN IF NOT EXISTS review_date DATE;
