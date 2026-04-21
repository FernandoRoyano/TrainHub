# CLAUDE.md — Fernando's Project Context

## Stack Principal
- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend/DB:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Deploy:** Vercel
- **Payments:** Stripe
- **AI:** Claude API (claude-sonnet-4-20250514 o superior)

## Reglas de comportamiento

### Velocidad
- Lee SOLO los skills relevantes al task actual — no cargues todos
- Si el task es claro, actúa directamente. No pidas confirmación para cambios pequeños
- Propón soluciones en el mínimo de archivos posible
- Prefiere editar sobre reescribir

### Código
- TypeScript estricto siempre. Sin `any` salvo justificación explícita
- Nombres en inglés para variables/funciones, español para comentarios de negocio
- Componentes funcionales con hooks, sin class components
- Imports absolutos desde `@/` (alias configurado en tsconfig)

### Respuestas
- Sin introducciones largas. Ve directo al código o la acción
- Si hay ambigüedad, toma la decisión más sensata y menciónala al final
- Muestra solo el diff o los fragmentos relevantes, no el archivo completo salvo que se pida

## Skills disponibles
| Archivo | Cuándo cargarlo |
|---|---|
| `skills/supabase.md` | Cualquier operación de DB, auth, storage, RLS |
| `skills/nextjs.md` | Estructura de rutas, SSR/CSR, API routes, middleware |
| `skills/ui-components.md` | Componentes Tailwind, layouts, design system |
| `skills/claude-api.md` | Integración de IA en cualquier proyecto |
| `skills/antea-salud.md` | Proyectos de Antea Salud — lógica de negocio |
| `skills/trainhub.md` | Plataforma TrainHub — schema y features activas |

## Proyectos activos
- **TrainHub** — plataforma entrenamiento con módulo ciclo menstrual
- **Antea Salud** — empresa actividad física personas mayores
- **WellnessReal** — plataforma contenido fitness + TFG DAW deployado
- **CodeConnect** — consultora web, proyectos cliente varios
