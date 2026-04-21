# SKILL: Next.js 14+ (App Router)

## Estructura de carpetas — estándar

```
app/
  (auth)/               # Rutas sin layout principal
    login/page.tsx
    register/page.tsx
  (app)/                # Rutas protegidas
    layout.tsx          # Layout con nav/sidebar
    dashboard/
      page.tsx
      loading.tsx       # Suspense automático
      error.tsx         # Error boundary automático
      _components/      # Componentes privados de la ruta
      actions.ts        # Server Actions
  (marketing)/          # Rutas públicas / landing
    page.tsx            # Home
    pricing/page.tsx
  api/
    [feature]/route.ts
  layout.tsx            # Root layout
  not-found.tsx
  error.tsx

components/
  ui/                   # Primitivos (Button, Input, Modal...)
  [feature]/            # Componentes de dominio
  layouts/              # Layouts reutilizables

lib/
  supabase/
    client.ts
    server.ts
  utils.ts
  validations.ts        # Zod schemas

hooks/                  # Custom hooks ('use client')
types/                  # TypeScript global types
constants/              # Constantes de negocio
```

---

## Server vs Client Component — decisión rápida

```
¿Necesita estado, eventos o browser APIs? → 'use client'
¿Solo muestra datos, hace fetch, accede a cookies? → Server Component (default)
```

```typescript
// ✅ Patrón correcto: server fetch + client interactivity
// app/(app)/workouts/page.tsx — Server Component
import { WorkoutList } from './_components/WorkoutList'
import { createClient } from '@/lib/supabase/server'

export default async function WorkoutsPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('workouts')
    .select('id, title, date, duration_minutes')
    .order('date', { ascending: false })

  return <WorkoutList initialData={data ?? []} />
}

// app/(app)/workouts/_components/WorkoutList.tsx — Client Component
'use client'
export function WorkoutList({ initialData }: { initialData: Workout[] }) {
  const [data, setData] = useState(initialData)
  // interactividad aquí
}
```

---

## loading.tsx y error.tsx — siempre crear

```typescript
// app/(app)/dashboard/loading.tsx
import { CardSkeleton } from '@/components/ui/Skeleton'
export default function Loading() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  )
}

// app/(app)/dashboard/error.tsx
'use client'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <p className="text-muted">Algo salió mal: {error.message}</p>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  )
}
```

---

## Server Actions — formularios y mutaciones

```typescript
// app/(app)/workouts/actions.ts
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const CreateWorkoutSchema = z.object({
  title:            z.string().min(1, 'Título requerido').max(100),
  duration_minutes: z.coerce.number().min(1).max(480),
  date:             z.string().datetime(),
})

export async function createWorkout(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const parsed = CreateWorkoutSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const { error } = await supabase.from('workouts').insert({
    ...parsed.data,
    user_id: user.id,
  })

  if (error) return { error: { _form: [error.message] } }

  revalidatePath('/dashboard/workouts')
  return { success: true }
}
```

---

## API Routes — patrón estándar

```typescript
// app/api/[feature]/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const bodySchema = z.object({
  // definir según endpoint
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const parsed = bodySchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

    // lógica de negocio

    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    console.error('[API Error]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

## Metadata — SEO

```typescript
// Estática
export const metadata: Metadata = {
  title: { default: 'App Name', template: '%s | App Name' },
  description: '...',
  openGraph: { title: '...', description: '...', images: ['/og.png'] },
  twitter: { card: 'summary_large_image' },
}

// Dinámica
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const item = await getItem(params.id)
  return {
    title: item.title,
    description: item.description,
  }
}
```

---

## Optimización de imágenes

```typescript
import Image from 'next/image'

// Imagen con tamaño conocido
<Image src="/hero.jpg" alt="..." width={1200} height={630} priority className="..." />

// Imagen que llena el contenedor
<div className="relative aspect-video">
  <Image src="/..." alt="..." fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
</div>
```

---

## Performance — buenas prácticas

```typescript
// Lazy load de componentes pesados
const HeavyChart = dynamic(() => import('@/components/Chart'), {
  loading: () => <Skeleton className="h-64" />,
  ssr: false,  // solo si usa browser APIs
})

// Prefetch de rutas frecuentes
import { prefetch } from 'next/navigation'
prefetch('/dashboard')

// Suspense boundaries
<Suspense fallback={<CardSkeleton />}>
  <AsyncComponent />
</Suspense>
```

---

## Variables de entorno

```env
# Públicas
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=

# Privadas (solo servidor)
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
ANTHROPIC_API_KEY=
```

---

## Errores comunes — evitar

- ❌ `useRouter` en Server Components → usar `redirect()` de `next/navigation`
- ❌ `supabase.auth.getSession()` en servidor → siempre `getUser()`
- ❌ Olvidar `revalidatePath` después de mutaciones
- ❌ Pasar funciones como props de Server → Client Component
- ❌ `fetch` en Client Component sin caché (usar SWR o React Query)
- ❌ Imágenes con `<img>` en vez de `next/image`
- ❌ Olvidar `loading.tsx` y `error.tsx` en rutas con datos async
