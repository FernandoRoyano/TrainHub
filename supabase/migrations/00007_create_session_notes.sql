-- Session notes: trainer notes per client session
CREATE TABLE public.session_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.session_notes ENABLE ROW LEVEL SECURITY;

-- Trainer can manage their own notes
CREATE POLICY "Trainers manage own session notes"
  ON public.session_notes FOR ALL
  USING (auth.uid() = trainer_id);

CREATE INDEX idx_session_notes_client ON public.session_notes(client_id);
CREATE INDEX idx_session_notes_date ON public.session_notes(date DESC);

CREATE TRIGGER on_session_notes_updated
  BEFORE UPDATE ON public.session_notes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
