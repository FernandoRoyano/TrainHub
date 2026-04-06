-- ============================================
-- Migration 00029: Cycle-Aware Training System
-- Tables: cycle_training_config, cycle_performance_logs, cycle_privacy_settings
-- ============================================

-- ============================================
-- 1. Cycle Training Configuration (per client)
-- Trainer configures intensity/volume adjustments per phase
-- ============================================
CREATE TABLE IF NOT EXISTS public.cycle_training_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL UNIQUE REFERENCES public.clients(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT true,

  -- Per-phase adjustments (percentage modifiers: -30 = reduce 30%, +10 = increase 10%)
  menstrual_intensity INT DEFAULT -20,
  menstrual_volume INT DEFAULT -15,
  menstrual_notes TEXT,

  follicular_intensity INT DEFAULT 0,
  follicular_volume INT DEFAULT 0,
  follicular_notes TEXT,

  ovulation_intensity INT DEFAULT 10,
  ovulation_volume INT DEFAULT 5,
  ovulation_notes TEXT,

  luteal_intensity INT DEFAULT -10,
  luteal_volume INT DEFAULT -10,
  luteal_notes TEXT,

  -- Auto-adjust: suggest changes automatically based on logged symptoms
  auto_adjust BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.cycle_training_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage cycle training config"
  ON public.cycle_training_config FOR ALL
  USING (trainer_id = auth.uid());

CREATE POLICY "Clients view own cycle training config"
  ON public.cycle_training_config FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = cycle_training_config.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE TRIGGER on_cycle_training_config_updated
  BEFORE UPDATE ON public.cycle_training_config
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 2. Cycle Performance Logs
-- Links workout performance to cycle phase for correlation analysis
-- ============================================
CREATE TABLE IF NOT EXISTS public.cycle_performance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  workout_log_id UUID REFERENCES public.workout_logs(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  cycle_day INT,
  phase TEXT CHECK (phase IN ('menstrual', 'follicular', 'ovulation', 'luteal')),

  -- Performance metrics
  perceived_effort INT CHECK (perceived_effort BETWEEN 1 AND 10),  -- RPE
  energy_before INT CHECK (energy_before BETWEEN 1 AND 5),
  energy_after INT CHECK (energy_after BETWEEN 1 AND 5),
  performance_rating INT CHECK (performance_rating BETWEEN 1 AND 5),  -- subjective

  -- Symptoms that affected training
  training_symptoms JSONB DEFAULT '[]',

  -- Adjustments applied
  intensity_adjustment INT DEFAULT 0,
  volume_adjustment INT DEFAULT 0,
  exercises_modified JSONB DEFAULT '[]',

  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.cycle_performance_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients manage own cycle performance logs"
  ON public.cycle_performance_logs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = cycle_performance_logs.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers view client cycle performance logs"
  ON public.cycle_performance_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = cycle_performance_logs.client_id
      AND clients.trainer_id = auth.uid()
    )
  );

CREATE INDEX idx_cycle_perf_client_date ON public.cycle_performance_logs(client_id, date DESC);
CREATE INDEX idx_cycle_perf_phase ON public.cycle_performance_logs(client_id, phase);

-- ============================================
-- 3. Cycle Privacy Settings
-- Client controls what cycle data the trainer can see
-- ============================================
CREATE TABLE IF NOT EXISTS public.cycle_privacy_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL UNIQUE REFERENCES public.clients(id) ON DELETE CASCADE,

  -- What trainer can see
  share_phase BOOLEAN DEFAULT true,
  share_symptoms BOOLEAN DEFAULT false,
  share_mood BOOLEAN DEFAULT false,
  share_flow BOOLEAN DEFAULT false,
  share_energy BOOLEAN DEFAULT true,
  share_predictions BOOLEAN DEFAULT false,

  -- Trainer sees generic "recovery day" instead of cycle details
  anonymous_mode BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.cycle_privacy_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients manage own cycle privacy"
  ON public.cycle_privacy_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = cycle_privacy_settings.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers view client cycle privacy (if shared)"
  ON public.cycle_privacy_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = cycle_privacy_settings.client_id
      AND clients.trainer_id = auth.uid()
    )
  );

CREATE TRIGGER on_cycle_privacy_updated
  BEFORE UPDATE ON public.cycle_privacy_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
