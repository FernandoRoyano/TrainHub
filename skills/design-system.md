# TrainHub — Sistema de diseño (REAL, refleja el código)

> Actualizado jul-2026 tras la modernización visual. Este documento describe lo que
> el código HACE, no aspiraciones. Si cambias tokens, actualiza esto.

## Identidad

- **Dark-first enérgico**: base casi-negra neutra + UN acento eléctrico (el verde de marca).
- No es Harbiz: nada de blanco clínico; energía de gimnasio, números grandes, glass sutil.
- `next-themes` con `defaultTheme="dark"`; light mode soportado como secundario.

## Tokens (fuente de verdad: `src/app/globals.css`)

Sistema shadcn/ui "new-york" con variables HSL. Los importantes:

| Token | Dark (default) | Light |
|---|---|---|
| `--background` | `228 20% 4%` (≈#08090c) | `0 0% 98%` |
| `--card` | `228 18% 7%` | blanco |
| `--primary` | `105 62% 62%` (verde eléctrico) | `105 58% 59%` (#6dbd57) |
| `--radius` | `1rem` | `1rem` |
| `--success` | = familia primary | verde oscuro legible |
| `--warning` | ámbar 38° | ámbar oscuro |
| `--info` | cian 199° | cian oscuro |
| `--chart-1..5` | verde→cian→violeta→ámbar→rosa brillantes | mismos hues, más oscuros |

**theme-color** unificado: `#08090c` (viewport de layout.tsx + manifest.ts).

## Regla de oro del color

**PROHIBIDO** usar colores Tailwind literales (`emerald-500`, `cyan-400`, `#6dbd57`…)
fuera de `src/lib/ui-tokens.ts`. Siempre:

- Estados: `success` / `warning` / `info` / `destructive` (patrón `bg-X/10 text-X border-X/25`).
- Acentos decorativos (KPIs, features, avatares): `ACCENT_STYLES` / `AVATAR_GRADIENTS` de `@/lib/ui-tokens`.
- Mapas de estado: `STATUS_STYLES` de `@/lib/ui-tokens`.
- Series de gráficas (recharts): `CHART_COLORS` o `hsl(var(--chart-N))` — NUNCA hex.
- Excepción: emails (`src/lib/email/**`) usan hex literal `#6dbd57` (no soportan CSS vars).

## Tipografía

- **Body**: Inter (`--font-inter`, `font-sans`).
- **Display**: Space Grotesk (`--font-display`, clase `font-display`) — títulos de página (h1),
  números grandes (KPIs, timers, macros, precios) y el logo "TrainHub".
- Números siempre con `tabular-nums`.
- Escala fluida `text-fluid-xs..7xl` (clamp) para landing y héroes; escala fija Tailwind en la app densa.

## Superficies (glassmorphism propio, en globals.css)

- `.glass` — Card por defecto (blur 16). `.glass-shimmer` añade el borde superior iridiscente.
- `.glass-elevated` — KPIs y tarjetas hero (blur 32, sombra profunda).
- `.glass-sidebar` / `.glass-topbar` — navegación.
- `.mesh-gradient-bg` + `--section-hue` — fondo por sección (cada área del trainer tiñe distinto).
- `.surface-overlay` — superficies OPACAS para dialogs/sheets/dropdowns (nunca glass en overlays).

## Componentes base (`src/components/ui/`, shadcn modificado)

- **Button**: `rounded-lg`; primary con glow (`shadow-lg shadow-primary/25`) y `active:scale-[0.98]`;
  hover con `brightness-110`. `lg` = `h-11 rounded-xl`.
- **Card**: `rounded-2xl` + glass por defecto + `data-slot="card"` (hover-lift de globals).
- **Badge**: pill (`rounded-full`); variantes `success`/`warning`/`info` además de las shadcn.
- **Tabs**: pill; trigger activo en `text-primary`.
- **Input**: `rounded-lg`, foco `ring-2 ring-ring/40 border-primary/50`.

## Navegación

- Sidebar trainer: item activo = `bg-primary/10 text-primary` + barra de acento vertical a la izquierda.
- Bottom navs (trainer/cliente/admin): `bg-card/95 backdrop-blur-xl border-t` +
  `pb-[env(safe-area-inset-bottom)]`; item activo `text-primary`.

## Movimiento

- Easings custom: `--ease-out-expo`, `--ease-spring`.
- Utilities: `.press-scale`, `.animate-fade-in-up`, `.reveal-on-scroll` (scroll-driven, solo landing),
  `.pulse-glow`, `.float-y`, `.animated-border` (pricing destacado).
- TODO respeta `prefers-reduced-motion` (guard en globals).

## Gráficas (recharts)

- Sin axis/tick lines; ticks en `muted-foreground`; tooltip `bg-card + border + radius 8`.
- Series con `CHART_COLORS`/`--chart-N`; barras con radius superior `[6,6,0,0]`.

## Checklist al añadir UI nueva

1. ¿Colores? → tokens/ui-tokens, jamás literales.
2. ¿Título de página o número grande? → `font-display` (+ `tabular-nums` si es número).
3. ¿Card? → el Card base ya trae glass; `glass-elevated` solo si es KPI/hero.
4. ¿Overlay? → `surface-overlay`, no glass.
5. ¿Estado (activo/pendiente/…)? → `STATUS_STYLES`.
6. Probar en dark Y light, y móvil 390px.
