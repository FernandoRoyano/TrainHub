-- ============================================
-- 1. CREATE FOODS TABLE
-- ============================================

CREATE TABLE public.foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_es TEXT,
  slug TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'protein', 'dairy', 'grain', 'vegetable', 'fruit',
    'legume', 'nut_seed', 'oil_fat', 'beverage',
    'supplement', 'snack', 'condiment', 'other'
  )),
  calories_per_100g INT DEFAULT 0,
  protein_per_100g NUMERIC(6,1) DEFAULT 0,
  carbs_per_100g NUMERIC(6,1) DEFAULT 0,
  fat_per_100g NUMERIC(6,1) DEFAULT 0,
  source TEXT DEFAULT 'custom' CHECK (source IN ('custom', 'seed', 'open_food_facts')),
  source_id TEXT,
  is_public BOOLEAN DEFAULT true,
  trainer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. ALLOW PLATFORM MEAL PLAN TEMPLATES
-- ============================================

-- Make trainer_id nullable for platform templates
ALTER TABLE public.meal_plans ALTER COLUMN trainer_id DROP NOT NULL;

-- ============================================
-- 3. ENABLE RLS
-- ============================================

ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. RLS POLICIES FOR FOODS
-- ============================================

-- Everyone sees platform foods + trainers see their own custom foods
CREATE POLICY "View public foods"
  ON public.foods FOR SELECT
  USING (trainer_id IS NULL OR auth.uid() = trainer_id);

-- Trainers can create custom foods
CREATE POLICY "Insert own foods"
  ON public.foods FOR INSERT
  WITH CHECK (auth.uid() = trainer_id);

-- Trainers can update their own custom foods
CREATE POLICY "Update own foods"
  ON public.foods FOR UPDATE
  USING (auth.uid() = trainer_id);

-- Trainers can delete their own custom foods
CREATE POLICY "Delete own foods"
  ON public.foods FOR DELETE
  USING (auth.uid() = trainer_id);

-- ============================================
-- 5. RLS POLICY FOR PLATFORM TEMPLATES
-- ============================================

-- Allow viewing platform meal plan templates (trainer_id IS NULL)
CREATE POLICY "View platform meal plan templates"
  ON public.meal_plans FOR SELECT
  USING (trainer_id IS NULL AND is_template = true);

-- ============================================
-- 6. INDEXES
-- ============================================

-- Dedup by source
CREATE UNIQUE INDEX idx_foods_source_id
  ON public.foods(source, source_id)
  WHERE source_id IS NOT NULL;

-- Slug for lookups
CREATE INDEX idx_foods_slug ON public.foods(slug) WHERE slug IS NOT NULL;

-- Category filtering
CREATE INDEX idx_foods_category ON public.foods(category);

-- Full-text search on both name columns
CREATE INDEX idx_foods_name_en ON public.foods USING GIN (to_tsvector('english', name));
CREATE INDEX idx_foods_name_es ON public.foods USING GIN (to_tsvector('spanish', coalesce(name_es, '')));

-- Simple ilike fallback indexes
CREATE INDEX idx_foods_name_ilike ON public.foods(name text_pattern_ops);
CREATE INDEX idx_foods_name_es_ilike ON public.foods(name_es text_pattern_ops) WHERE name_es IS NOT NULL;

-- Source filtering
CREATE INDEX idx_foods_source ON public.foods(source);

-- Trainer filtering
CREATE INDEX idx_foods_trainer ON public.foods(trainer_id) WHERE trainer_id IS NOT NULL;

-- ============================================
-- 7. TRIGGER
-- ============================================

CREATE TRIGGER on_foods_updated
  BEFORE UPDATE ON public.foods
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
