# SKILL: Refactorización

## Principio
Refactorizar = mejorar estructura interna sin cambiar comportamiento externo.
**Nunca refactorizar y añadir features en el mismo commit.** Son operaciones separadas.

---

## Señales de que hay que refactorizar

### 🔴 Urgente — refactorizar ahora
- Función o Server Action > 60 líneas
- Componente > 200 líneas
- Lógica duplicada en 3+ sitios
- `any` sin justificación explícita
- Prop drilling > 3 niveles
- Archivo > 400 líneas

### 🟡 Planificar — próxima iteración
- Componente hace más de una cosa
- Nombres que no describen (`handleStuff`, `doThing`, `data2`)
- Comentario que explica QUÉ hace (el código debería explicarse solo)
- Query de Supabase duplicada en múltiples componentes
- Lógica de negocio mezclada con lógica de UI

### 🟢 Cuando toques el archivo — oportunidad de paso
- Variables con nombres de una letra (`d`, `e`, `res`)
- Condicionales anidados > 2 niveles
- Magic numbers sin constante nombrada (`* 1000`, `> 86400`)

---

## Patrones de refactorización — React/Next.js

### 1. Extraer componente

```typescript
// ❌ Antes — todo en un componente
export function WorkoutPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Workouts</h1>
        <button className="bg-accent text-white px-4 py-2 rounded-lg" onClick={handleNew}>
          Nuevo
        </button>
      </div>
      {workouts.map(w => (
        <div key={w.id} className="bg-white rounded-xl p-4 border mb-4">
          <h3 className="font-semibold">{w.title}</h3>
          <span className={w.done ? 'text-green-500' : 'text-gray-400'}>
            {w.done ? 'Completado' : 'Pendiente'}
          </span>
        </div>
      ))}
    </div>
  )
}

// ✅ Después — responsabilidades separadas
export function WorkoutPage() {
  return (
    <>
      <PageHeader title="Workouts" action={<NewWorkoutButton />} />
      <WorkoutList workouts={workouts} />
    </>
  )
}
```

### 2. Extraer custom hook

```typescript
// ❌ Antes — lógica en el componente
export function CycleTracker() {
  const [phase, setPhase] = useState<CyclePhase>('folicular')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('cycle_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data?.[0]) setPhase(calculatePhase(data[0]))
        setLoading(false)
      })
  }, [])

  // ...80 líneas de UI
}

// ✅ Después — hook separado
// hooks/useCycleData.ts
export function useCycleData(userId: string) {
  const [phase, setPhase] = useState<CyclePhase>('folicular')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('cycle_logs')
      .select('*').eq('user_id', userId)
      .order('created_at', { ascending: false }).limit(1)
      .then(({ data, error }) => {
        if (error) { setError(error.message); return }
        if (data?.[0]) setPhase(calculatePhase(data[0]))
        setLoading(false)
      })
  }, [userId])

  return { phase, loading, error }
}

// Componente limpio
export function CycleTracker() {
  const { phase, loading, error } = useCycleData(userId)
  if (loading) return <CycleTrackerSkeleton />
  if (error)   return <ErrorState message={error} />
  // solo UI aquí
}
```

### 3. Centralizar queries Supabase

```typescript
// ❌ Antes — query duplicada en múltiples componentes
// ComponentA: supabase.from('workouts').select('*').eq('user_id', id)
// ComponentB: supabase.from('workouts').select('*').eq('user_id', id)

// ✅ Después — lib/queries/workouts.ts
import { createClient } from '@/lib/supabase/server'

export async function getWorkoutsByUser(userId: string, limit = 20) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('workouts')
    .select('id, title, date, duration_minutes')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`[getWorkoutsByUser] ${error.message}`)
  return data
}
```

### 4. Simplificar condicionales

```typescript
// ❌ Antes — if/else anidado
function getStatusColor(status: string) {
  if (status === 'active') return 'text-green-500'
  else if (status === 'pending') return 'text-yellow-500'
  else if (status === 'error') return 'text-red-500'
  else return 'text-gray-400'
}

// ✅ Después — lookup object
const STATUS_STYLES: Record<string, string> = {
  active:  'text-green-500',
  pending: 'text-yellow-500',
  error:   'text-red-500',
}
const getStatusColor = (status: string) => STATUS_STYLES[status] ?? 'text-gray-400'
```

### 5. Eliminar prop drilling

```typescript
// ❌ Antes — prop drilling 4 niveles
<Layout user={user}>
  <Sidebar user={user} />
  <Main><Header user={user} /><Content user={user} /></Main>
</Layout>

// ✅ Opción A — Context (para estado global frecuente)
// contexts/UserContext.tsx
const UserContext = createContext<User | null>(null)
export const useUser = () => {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be inside UserProvider')
  return ctx
}

// ✅ Opción B — Composición (preferir cuando es posible)
// Cada componente hace su propio fetch si lo necesita
// → elimina el prop drilling sin añadir complejidad
```

### 6. Tipar correctamente

```typescript
// ❌ Antes
function processData(data: any) {
  return data.items.map((i: any) => i.name)
}

// ✅ Después
interface DataItem { id: string; name: string; value: number }
interface DataResponse { items: DataItem[]; total: number }

function processData(data: DataResponse): string[] {
  return data.items.map(item => item.name)
}
```

---

## Organización de archivos

```
Regla: un archivo = una responsabilidad

components/ui/             → primitivos sin lógica de negocio
components/[feature]/      → componentes de dominio
hooks/                     → custom hooks (lógica reutilizable cliente)
lib/queries/               → queries Supabase centralizadas
lib/utils.ts               → utilidades puras (sin React, sin Supabase)
lib/validations.ts         → Zod schemas reutilizables
types/                     → interfaces y tipos globales
constants/                 → valores constantes de negocio
app/[route]/actions.ts     → Server Actions de esa ruta
app/[route]/_components/   → componentes privados de esa ruta
```

---

## Proceso seguro — commits atómicos

```bash
# Un commit por tipo de refactor
git commit -m "refactor: rename handleData to processWorkoutSubmit"
git commit -m "refactor: extract WorkoutCard from WorkoutList"
git commit -m "refactor: extract useWorkoutData hook"
git commit -m "refactor: centralize workout queries in lib/queries"
git commit -m "refactor: add TypeScript types to cycle module"
```

---

## Checklist de refactorización completa

- [ ] Comportamiento idéntico antes y después
- [ ] Tipos TypeScript más precisos o igual de precisos
- [ ] Más legible para alguien que no lo escribió
- [ ] Sin código duplicado
- [ ] Cada función/componente tiene una sola responsabilidad
- [ ] Nombres descriptivos sin necesitar comentarios
- [ ] `tsc --noEmit` sin errores
- [ ] Sin regresiones en las rutas afectadas
