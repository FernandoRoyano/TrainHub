# SKILL: Debugging

## Metodología — siempre en este orden

```
1. REPRODUCIR   → confirmar que el bug ocurre de forma consistente
2. AISLAR       → identificar el componente/función/query exacto que falla
3. HIPÓTESIS    → causa probable antes de tocar código
4. VERIFICAR    → confirmar con logs/devtools, no adivinar
5. CORREGIR     → el mínimo cambio necesario
6. VALIDAR      → confirmar que el fix no rompe nada más
```

**Regla:** Nunca cambiar código sin haber verificado la hipótesis. Cambios a ciegas generan bugs nuevos.

---

## Logs — estructura siempre con contexto

```typescript
// ✅ Log con contexto — fácil de buscar en producción
console.log('[WorkoutActions:create]', { userId: user.id, title, date })
console.error('[SupabaseQuery:workouts]', { error: error.message, code: error.code, hint: error.hint })
console.warn('[Auth:middleware]', { path: request.nextUrl.pathname, reason: 'no session' })

// ❌ Log sin contexto — inútil en producción
console.log(data)
console.log('error')
```

---

## Errores Next.js App Router

### Hidratación
```
Error: Hydration failed because the initial UI does not match
```
**Causa:** El servidor renderiza diferente al cliente.
**Checklist:**
- ¿`Math.random()`, `Date.now()`, `new Date()` en render?
- ¿Acceso a `window`, `localStorage`, `navigator` sin guard?
- ¿Componente con lógica diferente SSR/CSR?

```typescript
// Fix — montar solo en cliente
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return <Skeleton />  // o null
```

### Server/Client boundary
```
Error: Event handlers cannot be passed to Client Component props
Error: Functions cannot be passed directly to Client Components
```
**Fix:** Añadir `'use client'` al componente padre o usar Server Actions.

### Cookies en middleware
```
Error: Cookies can only be modified in a Server Action or Route Handler
```
**Fix:** Usar el patrón correcto de Supabase SSR (ver `skills/supabase.md`).

### Metadata de página
```
Warning: You are attempting to export "metadata" from a component marked with "use client"
```
**Fix:** Metadata solo puede estar en Server Components. Mover a un archivo separado o eliminar `'use client'`.

---

## Errores Supabase

### Query devuelve vacío sin error
**Causa más probable:** RLS bloqueando.
**Debug:**
```typescript
// 1. Verificar usuario
const { data: { user } } = await supabase.auth.getUser()
console.log('[Debug] user.id:', user?.id)

// 2. Verificar la policy en Dashboard → Authentication → Policies
// 3. Testear con service role (solo en dev) para confirmar si es RLS
const adminClient = createClient(url, serviceRoleKey)
const { data } = await adminClient.from('tabla').select('*').eq('user_id', userId)
```

### Error 406 / tipo inesperado
```
Error: JSON object requested, multiple (or no) rows returned
```
**Causa:** `.single()` cuando hay 0 o más de 1 resultado.
```typescript
// ✅ Usar .maybeSingle() cuando el resultado puede ser null
const { data } = await supabase.from('profiles').select().eq('id', userId).maybeSingle()
```

### Tipos desincronizados
**Síntoma:** TypeScript no reconoce columnas nuevas.
```bash
npx supabase gen types typescript --project-id TU_ID > types/supabase.ts
```

### Token expirado en servidor
```
Error: invalid JWT: unable to parse or verify signature
```
**Causa:** Usando `getSession()` en servidor.
**Fix:** Siempre `getUser()` en servidor — verifica el token con Supabase en cada llamada.

---

## Errores TypeScript

### `Property does not exist`
```typescript
// Opción 1 — optional chaining
const value = obj?.prop ?? 'default'

// Opción 2 — type guard
if (data && 'prop' in data) { /* ... */ }

// Opción 3 — type assertion (último recurso, comentar por qué)
const value = (data as ExpectedType).prop // seguro porque validamos antes con Zod
```

### Promesa no awaited
**Síntoma:** Datos undefined, comportamiento asíncrono inesperado.
**Fix:** Buscar funciones async sin `await` o `.then()`.

### `any` implícito
```bash
# Detectar todos los any implícitos
npx tsc --noEmit --strict
```

---

## DevTools — qué usar según el problema

| Problema | Herramienta |
|---|---|
| Estado React | React DevTools (extensión Chrome) → Components tab |
| Network requests | DevTools → Network → filtrar por XHR/Fetch |
| Layout/CSS | DevTools → Elements → Computed styles |
| Performance | DevTools → Performance → grabar interacción |
| Bundle size | `ANALYZE=true next build` o `next-bundle-analyzer` |
| Queries Supabase | Dashboard → Logs → API logs |
| Postgres queries | Dashboard → Logs → Postgres logs |
| Vercel funciones | Vercel → Project → Functions → Logs (en tiempo real) |

---

## Debug de CSS / Tailwind

```typescript
// Ver qué clases Tailwind se están aplicando realmente
// Extensión: Tailwind CSS IntelliSense en VS Code

// Conflicto de clases — siempre usar cn() de lib/utils.ts
// ❌ className={`bg-red-500 ${isActive ? 'bg-blue-500' : ''}`}  // conflicto
// ✅ className={cn('bg-red-500', isActive && 'bg-blue-500')}     // twMerge resuelve

// Clase no aplicada — verificar:
// 1. ¿Está en el content de tailwind.config.ts?
// 2. ¿Se construye dinámicamente? (Tailwind no purga clases dinámicas)
// Solución para clases dinámicas:
const colorMap = { red: 'bg-red-500', blue: 'bg-blue-500' }  // clases completas, no construidas
```

---

## Checklist antes de marcar un bug como resuelto

- [ ] ¿Funciona en Chrome, Firefox y Safari?
- [ ] ¿Funciona en móvil (375px)?
- [ ] ¿No rompe los estados loading/error/empty?
- [ ] ¿Se eliminaron todos los `console.log` de debug?
- [ ] ¿`tsc --noEmit` sin errores?
- [ ] ¿El fix tiene sentido leído sin el contexto del bug? (si no, añadir comentario)

---

## Bugs específicos del stack

### Ejercicio desaparece de rutina (TrainHub)
1. ¿Query incluye `order by` consistente?
2. ¿RLS permite lectura al usuario?
3. ¿El `workout_id` es correcto?
4. ¿Hay un `upsert` que sobrescribe en lugar de insertar?
5. ¿Hay un `revalidatePath` que dispara un refetch prematuro?

### Sesión se pierde entre navegaciones
1. ¿El middleware refresca el token correctamente?
2. ¿Las cookies se setean con `setAll` (ver supabase.md)?
3. ¿El dominio en Supabase Auth → URL Configuration coincide con la URL de Vercel?

### Componente no se actualiza tras Server Action
1. ¿Se ejecutó `revalidatePath('/ruta-correcta')`?
2. ¿La ruta del `revalidatePath` coincide exactamente?
3. ¿El componente es Server o Client? (Client necesita estado local o SWR)
