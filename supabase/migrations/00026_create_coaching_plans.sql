-- ============================================
-- Coaching Plans (planes de asesoramiento)
-- ============================================
CREATE TABLE IF NOT EXISTS public.coaching_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  duration_weeks INT NOT NULL DEFAULT 4,
  service_tier_id UUID REFERENCES public.service_tiers(id) ON DELETE SET NULL,
  routine_template_id UUID REFERENCES public.routines(id) ON DELETE SET NULL,
  meal_plan_template_id UUID REFERENCES public.meal_plans(id) ON DELETE SET NULL,
  price NUMERIC(10,2),
  currency TEXT DEFAULT 'EUR',
  is_active BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.coaching_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage own coaching plans"
  ON public.coaching_plans FOR ALL
  USING (auth.uid() = trainer_id);

CREATE INDEX idx_coaching_plans_trainer ON public.coaching_plans(trainer_id);

CREATE TRIGGER on_coaching_plans_updated
  BEFORE UPDATE ON public.coaching_plans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Coaching Plan Questionnaires (which questionnaires are included)
-- ============================================
CREATE TABLE IF NOT EXISTS public.coaching_plan_questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coaching_plan_id UUID NOT NULL REFERENCES public.coaching_plans(id) ON DELETE CASCADE,
  questionnaire_template_id UUID NOT NULL REFERENCES public.questionnaire_templates(id) ON DELETE CASCADE,
  order_index INT DEFAULT 0,
  UNIQUE (coaching_plan_id, questionnaire_template_id)
);

ALTER TABLE public.coaching_plan_questionnaires ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage coaching plan questionnaires"
  ON public.coaching_plan_questionnaires FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.coaching_plans
      WHERE coaching_plans.id = coaching_plan_questionnaires.coaching_plan_id
      AND coaching_plans.trainer_id = auth.uid()
    )
  );

-- ============================================
-- Client Coaching Plans (assignment)
-- ============================================
CREATE TABLE IF NOT EXISTS public.client_coaching_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  coaching_plan_id UUID NOT NULL REFERENCES public.coaching_plans(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  client_routine_id UUID REFERENCES public.client_routines(id) ON DELETE SET NULL,
  client_meal_plan_id UUID REFERENCES public.client_meal_plans(id) ON DELETE SET NULL,
  client_service_tier_id UUID REFERENCES public.client_service_tiers(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.client_coaching_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage client coaching plans"
  ON public.client_coaching_plans FOR ALL
  USING (auth.uid() = trainer_id);

CREATE POLICY "Clients view own coaching plans"
  ON public.client_coaching_plans FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = client_coaching_plans.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE INDEX idx_client_coaching_plans_client ON public.client_coaching_plans(client_id);
CREATE INDEX idx_client_coaching_plans_plan ON public.client_coaching_plans(coaching_plan_id);

CREATE TRIGGER on_client_coaching_plans_updated
  BEFORE UPDATE ON public.client_coaching_plans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Add active coaching plan reference to clients
-- ============================================
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS active_coaching_plan_id UUID REFERENCES public.coaching_plans(id) ON DELETE SET NULL;
