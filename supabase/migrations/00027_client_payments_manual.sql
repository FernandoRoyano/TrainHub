-- ============================================
-- Client Payments (manual tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS public.client_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  payment_method TEXT CHECK (payment_method IN ('bizum', 'transfer', 'cash', 'card', 'paypal', 'other')),
  status TEXT DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'overdue', 'cancelled')),
  description TEXT,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  period_start DATE,
  period_end DATE,
  next_payment_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.client_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage client payments"
  ON public.client_payments FOR ALL
  USING (auth.uid() = trainer_id);

CREATE INDEX idx_client_payments_client ON public.client_payments(client_id, payment_date DESC);
CREATE INDEX idx_client_payments_trainer ON public.client_payments(trainer_id);
CREATE INDEX idx_client_payments_next ON public.client_payments(trainer_id, next_payment_date);

CREATE TRIGGER on_client_payments_updated
  BEFORE UPDATE ON public.client_payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
