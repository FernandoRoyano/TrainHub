-- ============================================
-- Migration 00031: Add image_url to foods and meal_foods
-- Enables food photos from Spoonacular and other sources
-- ============================================

ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.meal_foods ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add 'spoonacular' as valid source
ALTER TABLE public.foods DROP CONSTRAINT IF EXISTS foods_source_check;
ALTER TABLE public.foods ADD CONSTRAINT foods_source_check
  CHECK (source IN ('custom', 'seed', 'open_food_facts', 'spoonacular'));
