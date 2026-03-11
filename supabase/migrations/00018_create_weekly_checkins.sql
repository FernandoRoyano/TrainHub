CREATE TABLE public.weekly_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  energy SMALLINT NOT NULL CHECK (energy BETWEEN 1 AND 5),
  sleep_quality SMALLINT NOT NULL CHECK (sleep_quality BETWEEN 1 AND 5),
  adherence SMALLINT NOT NULL CHECK (adherence BETWEEN 1 AND 5),
  stress SMALLINT NOT NULL CHECK (stress BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (client_id, week_start)
);

CREATE INDEX idx_weekly_checkins_client ON public.weekly_checkins(client_id);
CREATE INDEX idx_weekly_checkins_week ON public.weekly_checkins(week_start DESC);

ALTER TABLE public.weekly_checkins ENABLE ROW LEVEL SECURITY;

-- Clients can manage their own check-ins
CREATE POLICY "Clients can manage own checkins"
  ON public.weekly_checkins FOR ALL
  USING (
    client_id IN (
      SELECT id FROM public.clients WHERE user_id = auth.uid()
    )
  );

-- Trainers can view check-ins of their clients
CREATE POLICY "Trainers can view client checkins"
  ON public.weekly_checkins FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM public.clients WHERE trainer_id = auth.uid()
    )
  );
