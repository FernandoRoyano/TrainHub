-- ============================================
-- Questionnaire Templates
-- ============================================
CREATE TABLE IF NOT EXISTS public.questionnaire_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('medical', 'goals', 'lifestyle', 'nutrition', 'general')),
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.questionnaire_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage own questionnaire templates"
  ON public.questionnaire_templates FOR ALL
  USING (auth.uid() = trainer_id);

CREATE INDEX idx_questionnaire_templates_trainer ON public.questionnaire_templates(trainer_id);

CREATE TRIGGER on_questionnaire_templates_updated
  BEFORE UPDATE ON public.questionnaire_templates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Questionnaire Questions
-- ============================================
CREATE TABLE IF NOT EXISTS public.questionnaire_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.questionnaire_templates(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('text', 'textarea', 'select', 'multi_select', 'number', 'date', 'boolean', 'scale')),
  options JSONB DEFAULT '[]',
  is_required BOOLEAN DEFAULT false,
  order_index INT NOT NULL DEFAULT 0,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.questionnaire_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage questionnaire questions"
  ON public.questionnaire_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.questionnaire_templates
      WHERE questionnaire_templates.id = questionnaire_questions.template_id
      AND questionnaire_templates.trainer_id = auth.uid()
    )
  );

CREATE POLICY "Clients view assigned questionnaire questions"
  ON public.questionnaire_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.client_questionnaires cq
      JOIN public.clients c ON c.id = cq.client_id
      WHERE cq.template_id = questionnaire_questions.template_id
      AND c.user_id = auth.uid()
    )
  );

CREATE INDEX idx_questionnaire_questions_template ON public.questionnaire_questions(template_id, order_index);

-- ============================================
-- Client Questionnaires (assignments)
-- ============================================
CREATE TABLE IF NOT EXISTS public.client_questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.questionnaire_templates(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'expired')),
  assigned_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  due_date DATE,
  notes TEXT
);

ALTER TABLE public.client_questionnaires ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage client questionnaires"
  ON public.client_questionnaires FOR ALL
  USING (auth.uid() = trainer_id);

CREATE POLICY "Clients view and update own questionnaires"
  ON public.client_questionnaires FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = client_questionnaires.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Clients update own questionnaire status"
  ON public.client_questionnaires FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = client_questionnaires.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE INDEX idx_client_questionnaires_client ON public.client_questionnaires(client_id);
CREATE INDEX idx_client_questionnaires_template ON public.client_questionnaires(template_id);

-- ============================================
-- Questionnaire Responses
-- ============================================
CREATE TABLE IF NOT EXISTS public.questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_questionnaire_id UUID NOT NULL REFERENCES public.client_questionnaires(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questionnaire_questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  answer_number NUMERIC,
  answer_boolean BOOLEAN,
  answer_date DATE,
  answer_json JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (client_questionnaire_id, question_id)
);

ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients manage own responses"
  ON public.questionnaire_responses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.client_questionnaires cq
      JOIN public.clients c ON c.id = cq.client_id
      WHERE cq.id = questionnaire_responses.client_questionnaire_id
      AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers view client responses"
  ON public.questionnaire_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.client_questionnaires cq
      WHERE cq.id = questionnaire_responses.client_questionnaire_id
      AND cq.trainer_id = auth.uid()
    )
  );

CREATE INDEX idx_questionnaire_responses_assignment ON public.questionnaire_responses(client_questionnaire_id);

CREATE TRIGGER on_questionnaire_responses_updated
  BEFORE UPDATE ON public.questionnaire_responses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
