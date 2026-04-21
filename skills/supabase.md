# SKILL: Supabase

## Setup del cliente

### Cliente servidor (Server Components / API Routes)
```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

### Cliente navegador (Client Components)
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

## Auth — Patrón Fernando

### Middleware (protección de rutas)
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
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Rutas protegidas — ajustar según proyecto
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

## Queries — Patrones comunes

### Fetch con tipo seguro
```typescript
// Siempre tipar el retorno explícitamente
const { data, error } = await supabase
  .from('tabla')
  .select('id, nombre, created_at')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })

if (error) throw error
return data // TypeScript infiere el tipo correcto
```

### Upsert
```typescript
const { error } = await supabase
  .from('tabla')
  .upsert({ id: existingId, campo: valor }, { onConflict: 'id' })
```

### Transacciones (Edge Function o RPC)
```typescript
// Preferir RPC para operaciones multi-tabla
const { data, error } = await supabase.rpc('nombre_funcion', {
  param1: valor1,
  param2: valor2
})
```

## RLS — Reglas base

```sql
-- Patrón estándar: usuario solo ve sus datos
ALTER TABLE tabla ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own data"
  ON tabla FOR ALL
  USING (auth.uid() = user_id);

-- Para datos públicos de lectura
CREATE POLICY "Public read"
  ON tabla FOR SELECT
  USING (true);

-- Para admins (usar rol custom en metadata)
CREATE POLICY "Admin full access"
  ON tabla FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

## Storage

```typescript
// Upload
const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload(`${userId}/${fileName}`, file, {
    cacheControl: '3600',
    upsert: true
  })

// URL pública
const { data: { publicUrl } } = supabase.storage
  .from('bucket-name')
  .getPublicUrl(path)
```

## Variables de entorno requeridas
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=  # Solo en server, nunca exponer al cliente
```

## Errores comunes — evitar
- ❌ Usar `supabase.auth.getSession()` en servidor (inseguro) → usar `getUser()`
- ❌ Importar cliente browser en Server Components
- ❌ Olvidar `await` en operaciones async de Supabase
- ❌ Exponer `SERVICE_ROLE_KEY` en variables `NEXT_PUBLIC_`
