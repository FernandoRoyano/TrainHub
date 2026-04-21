# SKILL: TrainHub Platform

## Stack
Next.js 14 + Supabase + Tailwind + Vercel + Claude API

## Schema Supabase — Tablas principales

### Existentes
```sql
-- usuarios (extiende auth.users de Supabase)
profiles (
  id uuid references auth.users,
  full_name text,
  avatar_url text,
  role text -- 'trainer' | 'client'
)

-- entrenamientos
workouts (
  id uuid,
  user_id uuid references profiles,
  title text,
  description text,
  date date,
  duration_minutes int,
  created_at timestamptz
)

-- ejercicios del catálogo visual
exercises (
  id uuid,
  name text,           -- español
  category text,
  muscles text[],
  video_url text,      -- muestra fase concéntrica y excéntrica
  created_at timestamptz
)
```

### Módulo Cycle-Aware Training (nuevas tablas)
```sql
-- seguimiento ciclo menstrual
cycle_logs (
  id uuid,
  user_id uuid references profiles,
  period_start date,
  period_end date,
  cycle_length int,    -- días
  notes text,
  created_at timestamptz
)

-- síntomas diarios
daily_symptoms (
  id uuid,
  user_id uuid references profiles,
  date date,
  phase text,          -- 'menstrual' | 'folicular' | 'ovulacion' | 'lutea'
  energy_level int,    -- 1-10
  pain_level int,      -- 1-10
  mood text,
  symptoms text[],     -- ['cramps', 'fatigue', 'bloating'...]
  created_at timestamptz
)

-- adaptaciones de entrenamiento por fase
phase_training_config (
  id uuid,
  user_id uuid references profiles,
  phase text,
  intensity_modifier float,  -- 0.5-1.2 multiplicador
  recommended_types text[],  -- ['strength', 'cardio', 'yoga'...]
  avoid_types text[],
  notes text
)

-- correlación síntoma-rendimiento
performance_correlations (
  id uuid,
  user_id uuid references profiles,
  workout_id uuid references workouts,
  symptom_log_id uuid references daily_symptoms,
  performance_score int,   -- 1-10
  notes text
)
```

## Features activas

### ✅ Completadas
- Auth con Supabase (login/register)
- Perfil de usuario
- Catálogo de ejercicios

### 🔄 En desarrollo — Cycle-Aware Training
- [ ] Formulario de inicio de ciclo
- [ ] Dashboard de fase actual con recomendaciones
- [ ] Adaptive training engine (ajuste de intensidad por fase)
- [ ] Trainer dashboard (vista de todas las clientas)
- [ ] Claude API health assistant (chat contextual)
- [ ] Gráficas correlación síntoma-rendimiento

## Biblioteca de ejercicios visual
Ejercicios en catálogo (ID y nombre):
1. Crunch clásico
2. Crunch con giro
3. Peso muerto sumo
4. Fondos en paralelas
5. Elevación de talones
6. Peso muerto a una pierna

**Regla crítica:** Siempre mostrar fase concéntrica Y excéntrica en videos/demos.

## Lógica de fases del ciclo
```typescript
type CyclePhase = 'menstrual' | 'folicular' | 'ovulacion' | 'lutea'

const phaseRecommendations: Record<CyclePhase, {
  intensity: 'low' | 'moderate' | 'high',
  focus: string[],
  avoid: string[]
}> = {
  menstrual: {
    intensity: 'low',
    focus: ['movilidad', 'yoga', 'cardio suave'],
    avoid: ['alta intensidad', 'heavy lifting']
  },
  folicular: {
    intensity: 'high',
    focus: ['fuerza', 'HIIT', 'nuevos ejercicios'],
    avoid: []
  },
  ovulacion: {
    intensity: 'high',
    focus: ['rendimiento máximo', 'competición', 'PR'],
    avoid: []
  },
  lutea: {
    intensity: 'moderate',
    focus: ['fuerza moderada', 'steady cardio'],
    avoid: ['nuevo aprendizaje motor complejo']
  }
}
```

## Rutas de la app
```
/                    → Landing
/login               → Auth
/dashboard           → Home del usuario
/dashboard/cycle     → Módulo ciclo menstrual
/dashboard/workouts  → Entrenamientos
/dashboard/exercises → Catálogo ejercicios
/dashboard/assistant → Chat Claude API
/trainer             → Vista entrenador (role: trainer)
/trainer/clients     → Dashboard clientas
```
