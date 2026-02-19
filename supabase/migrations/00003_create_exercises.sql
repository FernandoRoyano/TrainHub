CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  muscle_groups TEXT[] DEFAULT '{}',
  equipment TEXT[] DEFAULT '{}',
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT CHECK (category IN ('strength', 'cardio', 'flexibility', 'balance')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- Everyone can see platform exercises (trainer_id IS NULL) + trainers see their own
CREATE POLICY "View exercises"
  ON public.exercises FOR SELECT
  USING (trainer_id IS NULL OR auth.uid() = trainer_id);

CREATE POLICY "Insert own exercises"
  ON public.exercises FOR INSERT
  WITH CHECK (auth.uid() = trainer_id);

CREATE POLICY "Update own exercises"
  ON public.exercises FOR UPDATE
  USING (auth.uid() = trainer_id);

CREATE POLICY "Delete own exercises"
  ON public.exercises FOR DELETE
  USING (auth.uid() = trainer_id);

CREATE INDEX idx_exercises_trainer ON public.exercises(trainer_id);
CREATE INDEX idx_exercises_muscle ON public.exercises USING GIN(muscle_groups);
CREATE INDEX idx_exercises_category ON public.exercises(category);

CREATE TRIGGER on_exercises_updated
  BEFORE UPDATE ON public.exercises
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Storage bucket for exercise media
INSERT INTO storage.buckets (id, name, public) VALUES ('exercises', 'exercises', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Trainers upload exercise media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'exercises' AND auth.role() = 'authenticated');

CREATE POLICY "Public read exercise media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'exercises');

CREATE POLICY "Trainers delete own exercise media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'exercises' AND auth.role() = 'authenticated');
