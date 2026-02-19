CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'paused', 'pending')),
  profile_data JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Trainers can only manage their own clients
CREATE POLICY "Trainers manage own clients"
  ON public.clients FOR ALL
  USING (auth.uid() = trainer_id);

-- Clients can view their own record
CREATE POLICY "Clients view own record"
  ON public.clients FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX idx_clients_trainer ON public.clients(trainer_id);
CREATE INDEX idx_clients_status ON public.clients(trainer_id, status);
CREATE INDEX idx_clients_email ON public.clients(trainer_id, email);

-- Auto-update updated_at
CREATE TRIGGER on_clients_updated
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
