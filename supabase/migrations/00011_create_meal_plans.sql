-- ============================================
-- 1. CREATE ALL TABLES FIRST
-- ============================================

-- Meal Plans: plan nutricional creado por el entrenador
CREATE TABLE public.meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  goal TEXT CHECK (goal IN ('loss', 'maintenance', 'gain', 'performance', 'health')),
  daily_calories INT,
  daily_protein NUMERIC(6,1),
  daily_carbs NUMERIC(6,1),
  daily_fat NUMERIC(6,1),
  is_template BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Meal Plan Meals: cada comida dentro de un plan
CREATE TABLE public.meal_plan_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id UUID NOT NULL REFERENCES public.meal_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner', 'evening_snack', 'pre_workout', 'post_workout', 'other')),
  order_index INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Meal Foods: alimentos dentro de una comida
CREATE TABLE public.meal_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_meal_id UUID NOT NULL REFERENCES public.meal_plan_meals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity NUMERIC(8,2) DEFAULT 100,
  unit TEXT DEFAULT 'g' CHECK (unit IN ('g', 'ml', 'oz', 'cup', 'tbsp', 'tsp', 'unit', 'slice', 'scoop')),
  calories INT DEFAULT 0,
  protein NUMERIC(6,1) DEFAULT 0,
  carbs NUMERIC(6,1) DEFAULT 0,
  fat NUMERIC(6,1) DEFAULT 0,
  order_index INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Client Meal Plans: asignacion de plan nutricional a cliente
CREATE TABLE public.client_meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  meal_plan_id UUID NOT NULL REFERENCES public.meal_plans(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plan_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_meal_plans ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. RLS POLICIES (all tables exist now)
-- ============================================

-- meal_plans policies
CREATE POLICY "Trainers manage own meal plans"
  ON public.meal_plans FOR ALL
  USING (auth.uid() = trainer_id);

CREATE POLICY "Clients view assigned meal plans"
  ON public.meal_plans FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.client_meal_plans
      JOIN public.clients ON clients.id = client_meal_plans.client_id
      WHERE client_meal_plans.meal_plan_id = meal_plans.id
      AND client_meal_plans.status = 'active'
      AND clients.user_id = auth.uid()
    )
  );

-- meal_plan_meals policies
CREATE POLICY "Trainers manage meal plan meals"
  ON public.meal_plan_meals FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.meal_plans
      WHERE meal_plans.id = meal_plan_meals.meal_plan_id
      AND meal_plans.trainer_id = auth.uid()
    )
  );

CREATE POLICY "Clients view assigned meal plan meals"
  ON public.meal_plan_meals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.client_meal_plans
      JOIN public.clients ON clients.id = client_meal_plans.client_id
      WHERE client_meal_plans.meal_plan_id = meal_plan_meals.meal_plan_id
      AND client_meal_plans.status = 'active'
      AND clients.user_id = auth.uid()
    )
  );

-- meal_foods policies
CREATE POLICY "Trainers manage meal foods"
  ON public.meal_foods FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.meal_plan_meals
      JOIN public.meal_plans ON meal_plans.id = meal_plan_meals.meal_plan_id
      WHERE meal_plan_meals.id = meal_foods.meal_plan_meal_id
      AND meal_plans.trainer_id = auth.uid()
    )
  );

CREATE POLICY "Clients view assigned meal foods"
  ON public.meal_foods FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.meal_plan_meals
      JOIN public.client_meal_plans ON client_meal_plans.meal_plan_id = meal_plan_meals.meal_plan_id
      JOIN public.clients ON clients.id = client_meal_plans.client_id
      WHERE meal_plan_meals.id = meal_foods.meal_plan_meal_id
      AND client_meal_plans.status = 'active'
      AND clients.user_id = auth.uid()
    )
  );

-- client_meal_plans policies
CREATE POLICY "Trainers manage client meal plans"
  ON public.client_meal_plans FOR ALL
  USING (auth.uid() = trainer_id);

CREATE POLICY "Clients view own assigned meal plans"
  ON public.client_meal_plans FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = client_meal_plans.client_id
      AND clients.user_id = auth.uid()
    )
  );

-- ============================================
-- 4. INDEXES
-- ============================================

CREATE INDEX idx_meal_plans_trainer ON public.meal_plans(trainer_id);
CREATE INDEX idx_meal_plan_meals_plan ON public.meal_plan_meals(meal_plan_id, order_index);
CREATE INDEX idx_meal_foods_meal ON public.meal_foods(meal_plan_meal_id, order_index);
CREATE INDEX idx_client_meal_plans_client ON public.client_meal_plans(client_id);
CREATE INDEX idx_client_meal_plans_meal_plan ON public.client_meal_plans(meal_plan_id);
CREATE INDEX idx_client_meal_plans_trainer ON public.client_meal_plans(trainer_id);

-- ============================================
-- 5. TRIGGERS
-- ============================================

CREATE TRIGGER on_meal_plans_updated
  BEFORE UPDATE ON public.meal_plans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_client_meal_plans_updated
  BEFORE UPDATE ON public.client_meal_plans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
