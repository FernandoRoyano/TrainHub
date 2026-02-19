-- Body measurements tracking
CREATE TABLE public.body_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight DECIMAL(5,1),
  body_fat_pct DECIMAL(4,1),
  chest_cm DECIMAL(5,1),
  waist_cm DECIMAL(5,1),
  hips_cm DECIMAL(5,1),
  bicep_cm DECIMAL(5,1),
  thigh_cm DECIMAL(5,1),
  calf_cm DECIMAL(5,1),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;

-- Trainers can manage measurements of their clients
CREATE POLICY "Trainers manage client measurements"
  ON public.body_measurements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.clients c
      WHERE c.id = body_measurements.client_id
        AND c.trainer_id = auth.uid()
    )
  );

-- Clients can view their own measurements
CREATE POLICY "Clients view own measurements"
  ON public.body_measurements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients c
      WHERE c.id = body_measurements.client_id
        AND c.user_id = auth.uid()
    )
  );

CREATE INDEX idx_body_measurements_client ON public.body_measurements(client_id);
CREATE INDEX idx_body_measurements_date ON public.body_measurements(date DESC);
