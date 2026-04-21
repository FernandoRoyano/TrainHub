# SKILL: Next.js 14+ (App Router)

## Estructura de carpetas — Estándar Fernando

```
app/
  (auth)/           # Rutas sin layout principal
    login/
    register/
  (dashboard)/      # Rutas protegidas con layout
    layout.tsx      # Layout con sidebar/nav
    page.tsx        # Dashboard home
    [feature]/
      page.tsx
      _components/  # Componentes privados de la ruta
  api/
    [feature]/
      route.ts
  layout.tsx        # Root layout
  page.tsx          # Landing / home pública

components/         # Componentes reutilizables globales
  ui/               # Primitivos (Button, Input, Modal...)
  [feature]/        # Componentes de dominio

lib/
  supabase/
    client.ts
    server.ts
  utils.ts
  validations.ts    # Zod schemas

hooks/              # Custom hooks cliente
types/              # Tipos TypeScript globales
```

## Decisión Server vs Client Component

### Usar Server Component (default) cuando:
- Solo muestra datos (no interactividad)
- Hace fetch directo a DB o API
- Accede a cookies/headers
- SEO importante

### Usar `'use client'` cuando:
- useState, useEffect, hooks
- Event listeners (onClick, onChange...)
- Browser APIs (localStorage, window...)
- Componentes de UI interactivos

```typescript
// ✅ Patrón correcto: fetch en server, interactividad en client
// app/dashboard/page.tsx (Server Component)
import { DataTable } from './_components/DataTable'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data } = await supabase.from('items').select('*')
  
  return <DataTable initialData={data ?? []} />
}

// app/dashboard/_components/DataTable.tsx (Client Component)
'use client'
export function DataTable({ initialData }: { initialData: Item[] }) {
  const [data, setData] = useState(initialData)
  // ... interactividad
}
```

## API Routes

```typescript
// app/api/[feature]/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  
  // lógica...
  
  return NextResponse.json({ success: true, data: result })
}
```

## Server Actions — Para formularios

```typescript
// app/[feature]/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const schema = z.object({
  nombre: z.string().min(1),
  // ...
})

export async function createItem(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.flatten() }

  const { error } = await supabase.from('items').insert({
    ...parsed.data,
    user_id: user.id
  })

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard')
  return { success: true }
}
```

## Metadata y SEO

```typescript
// Estático
export const metadata: Metadata = {
  title: 'Página | Proyecto',
  description: '...',
}

// Dinámico
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getItem(params.id)
  return { title: item.nombre }
}
```

## Variables de entorno
```env
# Públicas (accesibles en browser)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=

# Privadas (solo servidor)
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
ANTHROPIC_API_KEY=
```

## Errores comunes — evitar
- ❌ `useRouter` en Server Components
- ❌ Fetch en Client Component sin SWR/React Query si hay revalidación
- ❌ Pasar funciones no serializables como props de Server → Client
- ❌ Olvidar `revalidatePath` después de mutaciones con Server Actions
