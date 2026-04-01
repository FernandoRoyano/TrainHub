-- ============================================
-- 1. Add gender to clients
-- ============================================
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other'));

-- ============================================
-- 2. Fasting logs
-- ============================================
CREATE TABLE IF NOT EXISTS public.fasting_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  protocol TEXT NOT NULL CHECK (protocol IN ('16_8', '18_6', '20_4', '23_1', 'custom')),
  fast_start TIMESTAMPTZ NOT NULL,
  fast_end TIMESTAMPTZ,
  target_hours INT NOT NULL DEFAULT 16,
  actual_hours NUMERIC(4,1),
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.fasting_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients manage own fasting logs"
  ON public.fasting_logs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = fasting_logs.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers view client fasting logs"
  ON public.fasting_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = fasting_logs.client_id
      AND clients.trainer_id = auth.uid()
    )
  );

CREATE INDEX idx_fasting_logs_client ON public.fasting_logs(client_id, fast_start DESC);

-- ============================================
-- 3. Fasting settings per client
-- ============================================
CREATE TABLE IF NOT EXISTS public.fasting_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL UNIQUE REFERENCES public.clients(id) ON DELETE CASCADE,
  default_protocol TEXT NOT NULL DEFAULT '16_8' CHECK (default_protocol IN ('16_8', '18_6', '20_4', '23_1', 'custom')),
  custom_hours INT,
  reminder_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.fasting_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients manage own fasting settings"
  ON public.fasting_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = fasting_settings.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers view client fasting settings"
  ON public.fasting_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = fasting_settings.client_id
      AND clients.trainer_id = auth.uid()
    )
  );

CREATE TRIGGER on_fasting_settings_updated
  BEFORE UPDATE ON public.fasting_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 4. Menstrual cycle logs
-- ============================================
CREATE TABLE IF NOT EXISTS public.menstrual_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  cycle_day INT,
  phase TEXT CHECK (phase IN ('menstrual', 'follicular', 'ovulation', 'luteal')),
  flow TEXT CHECK (flow IN ('none', 'light', 'medium', 'heavy', 'spotting')),
  symptoms JSONB DEFAULT '[]',
  mood TEXT CHECK (mood IN ('great', 'good', 'neutral', 'low', 'bad')),
  energy_level INT CHECK (energy_level BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (client_id, date)
);

ALTER TABLE public.menstrual_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients manage own menstrual logs"
  ON public.menstrual_logs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = menstrual_logs.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers view client menstrual logs"
  ON public.menstrual_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = menstrual_logs.client_id
      AND clients.trainer_id = auth.uid()
    )
  );

CREATE INDEX idx_menstrual_logs_client ON public.menstrual_logs(client_id, date DESC);

CREATE TRIGGER on_menstrual_logs_updated
  BEFORE UPDATE ON public.menstrual_logs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 5. Menstrual cycle settings
-- ============================================
CREATE TABLE IF NOT EXISTS public.menstrual_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL UNIQUE REFERENCES public.clients(id) ON DELETE CASCADE,
  average_cycle_length INT DEFAULT 28,
  average_period_length INT DEFAULT 5,
  last_period_start DATE,
  tracking_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.menstrual_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients manage own menstrual settings"
  ON public.menstrual_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = menstrual_settings.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers view client menstrual settings"
  ON public.menstrual_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = menstrual_settings.client_id
      AND clients.trainer_id = auth.uid()
    )
  );

CREATE TRIGGER on_menstrual_settings_updated
  BEFORE UPDATE ON public.menstrual_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
