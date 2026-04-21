# CLAUDE.md — Fernando's Dev Context

## Stack Principal
- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS v3+
- **Backend/DB:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Deploy:** Vercel
- **Payments:** Stripe
- **AI:** Claude API (`claude-opus-4-7`)
- **Styling extras:** CSS custom properties, `@layer`, container queries, `clamp()`

## Reglas de comportamiento

### Velocidad
- Lee SOLO los skills relevantes al task — no cargues todos
- Actúa directamente si el task es claro. Sin pedir confirmación en cambios pequeños
- Mínimo de archivos posible. Prefiere editar sobre reescribir
- Muestra solo diffs o fragmentos relevantes, no el archivo completo salvo que se pida

### Código
- TypeScript estricto. Sin `any` salvo justificación explícita
- Variables/funciones en inglés, comentarios de negocio en español
- Componentes funcionales con hooks, sin class components
- Imports absolutos desde `@/`
- CSS moderno: `clamp()`, `container queries`, `CSS Grid subgrid`, custom properties
- Sin librerías de UI externas (shadcn, MUI, etc.) salvo indicación — construir desde cero con Tailwind

### Respuestas
- Sin introducciones. Directo al código
- Ambigüedad → toma la decisión más sensata y menciónala al final
- Sin comentarios obvios en el código (`// render the button` — no)

## Skills disponibles

| Archivo | Cuándo cargarlo |
|---|---|
| `skills/supabase.md` | DB, auth, storage, RLS, Edge Functions |
| `skills/nextjs.md` | Rutas, SSR/CSR, API routes, middleware, performance |
| `skills/design-system.md` | Tokens, tipografía, espaciado, animaciones, CSS moderno |
| `skills/ui-components.md` | Componentes Tailwind reutilizables |
| `skills/landing-pages.md` | Páginas de venta, heroes, CTAs, copywriting |
| `skills/claude-api.md` | Integración IA, streaming, prompt caching |
| `skills/debugging.md` | Errores Next.js + Supabase, metodología debug |
| `skills/refactoring.md` | Cuándo y cómo refactorizar sin romper nada |
| `skills/antea-salud.md` | Proyecto Antea Salud — contexto de negocio |
| `skills/trainhub.md` | Plataforma TrainHub — schema y features |

## Proyectos activos
- **TrainHub** — plataforma entrenamiento, módulo ciclo menstrual
- **Antea Salud** — actividad física personas mayores en residencias
- **WellnessReal** — plataforma contenido fitness, deployada
- **CodeConnect** — consultora web, proyectos cliente varios
