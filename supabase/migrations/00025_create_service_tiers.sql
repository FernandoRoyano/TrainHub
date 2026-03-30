-- ============================================
-- Service Tiers (paquetes de servicio)
-- ============================================
CREATE TABLE IF NOT EXISTS public.service_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  icon TEXT,
  price NUMERIC(10,2),
  currency TEXT DEFAULT 'EUR',
  billing_interval TEXT CHECK (billing_interval IN ('monthly', 'quarterly', 'yearly', 'one_time')),
  features JSONB NOT NULL DEFAULT '{"training":true,"nutrition":false,"messaging":true,"progress_tracking":true,"measurements":true,"checkins":false,"questionnaires":false}',
  max_revisions_per_month INT,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.service_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage own service tiers"
  ON public.service_tiers FOR ALL
  USING (auth.uid() = trainer_id);

CREATE INDEX idx_service_tiers_trainer ON public.service_tiers(trainer_id);

CREATE TRIGGER on_service_tiers_updated
  BEFORE UPDATE ON public.service_tiers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Client Service Tiers (assignment)
-- ============================================
CREATE TABLE IF NOT EXISTS public.client_service_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  service_tier_id UUID NOT NULL REFERENCES public.service_tiers(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.client_service_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage client service tiers"
  ON public.client_service_tiers FOR ALL
  USING (auth.uid() = trainer_id);

CREATE POLICY "Clients view own service tier"
  ON public.client_service_tiers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = client_service_tiers.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE INDEX idx_client_service_tiers_client ON public.client_service_tiers(client_id);

CREATE TRIGGER on_client_service_tiers_updated
  BEFORE UPDATE ON public.client_service_tiers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Add active tier reference to clients
-- ============================================
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS active_service_tier_id UUID REFERENCES public.service_tiers(id) ON DELETE SET NULL;
