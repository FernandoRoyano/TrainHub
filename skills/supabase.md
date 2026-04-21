# SKILL: Supabase

## Clientes — server vs browser

```typescript
// lib/supabase/server.ts — Server Components, API Routes, Server Actions
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll:  () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {}
        },
      },
    }
  )
}

// lib/supabase/client.ts — Client Components
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

## Middleware — protección de rutas

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // ⚠️ Siempre getUser(), nunca getSession() en servidor
  const { data: { user } } = await supabase.auth.getUser()

  const isProtected = request.nextUrl.pathname.startsWith('/dashboard') ||
                      request.nextUrl.pathname.startsWith('/app')
  const isAuth      = request.nextUrl.pathname.startsWith('/login') ||
                      request.nextUrl.pathname.startsWith('/register')

  if (!user && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isAuth) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

---

## Generar tipos TypeScript

```bash
# Ejecutar cada vez que cambie el schema
npx supabase gen types typescript --project-id TU_PROJECT_ID > types/supabase.ts
```

---

## Queries — patrones comunes

```typescript
// Select tipado
const { data, error } = await supabase
  .from('workouts')
  .select('id, title, date, duration_minutes, exercises(id, name)')
  .eq('user_id', user.id)
  .order('date', { ascending: false })
  .limit(20)

if (error) throw error

// Insert y obtener el registro creado
const { data: created, error } = await supabase
  .from('workouts')
  .insert({ title, user_id: user.id, date })
  .select()
  .single()

// Update
const { error } = await supabase
  .from('workouts')
  .update({ title: newTitle })
  .eq('id', workoutId)
  .eq('user_id', user.id) // ← siempre filtrar por user_id en updates

// Upsert
const { error } = await supabase
  .from('settings')
  .upsert({ user_id: user.id, key: 'theme', value: 'dark' }, { onConflict: 'user_id,key' })

// Delete
const { error } = await supabase
  .from('workouts')
  .delete()
  .eq('id', workoutId)
  .eq('user_id', user.id) // ← siempre incluir

// RPC — para lógica compleja o transacciones
const { data, error } = await supabase.rpc('calculate_streak', { p_user_id: user.id })
```

---

## RLS — Políticas estándar

```sql
-- Activar siempre en tablas con datos de usuario
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

-- Usuario ve y modifica solo sus datos
CREATE POLICY "Users own data" ON workouts
  FOR ALL USING (auth.uid() = user_id);

-- Lectura pública (para contenido público)
CREATE POLICY "Public read" ON posts
  FOR SELECT USING (published = true);

-- Solo admins (rol en user_metadata)
CREATE POLICY "Admin only" ON admin_settings
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Trainer ve datos de sus clientes
CREATE POLICY "Trainer sees clients" ON client_data
  FOR SELECT USING (
    trainer_id = auth.uid() OR user_id = auth.uid()
  );
```

---

## Auth — flujos completos

```typescript
// Login con email/password
const { error } = await supabase.auth.signInWithPassword({ email, password })

// OAuth (Google, GitHub...)
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` }
})

// Callback handler
// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }
  return NextResponse.redirect(new URL('/dashboard', request.url))
}

// Logout (Server Action)
'use server'
export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
```

---

## Storage

```typescript
// Upload con ruta organizada por usuario
const fileExt = file.name.split('.').pop()
const filePath = `${user.id}/${Date.now()}.${fileExt}`

const { data, error } = await supabase.storage
  .from('avatars')
  .upload(filePath, file, { cacheControl: '3600', upsert: true })

// URL pública
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(filePath)

// URL firmada (para archivos privados)
const { data: { signedUrl } } = await supabase.storage
  .from('private-files')
  .createSignedUrl(filePath, 3600) // expira en 1 hora
```

---

## Realtime — suscripciones

```typescript
// En Client Component
useEffect(() => {
  const channel = supabase
    .channel('workouts-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'workouts',
      filter: `user_id=eq.${userId}`,
    }, (payload) => {
      // actualizar estado local
      if (payload.eventType === 'INSERT') setWorkouts(prev => [payload.new, ...prev])
      if (payload.eventType === 'DELETE') setWorkouts(prev => prev.filter(w => w.id !== payload.old.id))
    })
    .subscribe()

  return () => { supabase.removeChannel(channel) }
}, [userId])
```

---

## Edge Functions — cuándo usarlas

```typescript
// Casos de uso: webhooks, lógica server-side compleja, cron jobs
// supabase/functions/send-weekly-report/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!  // service role para bypass RLS
  )
  // lógica...
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
})
```

---

## Errores comunes — evitar

- ❌ `getSession()` en servidor → siempre `getUser()`
- ❌ `SERVICE_ROLE_KEY` en variables `NEXT_PUBLIC_` → expone permisos de admin
- ❌ Olvidar filtrar por `user_id` en updates/deletes (confiar solo en RLS es frágil)
- ❌ Queries sin `.limit()` en tablas grandes
- ❌ Importar cliente browser en Server Components
- ❌ Olvidar `await` en operaciones async
- ❌ Tipos desincronizados → regenerar después de cada cambio de schema
