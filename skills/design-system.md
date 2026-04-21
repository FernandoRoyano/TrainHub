# SKILL: Design System

## Filosofía
Diseño moderno = CSS nativo potente + Tailwind para utilidades + componentes con personalidad.
Nunca: gradientes morados genéricos, Inter en todo, layouts planos y simétricos.
Siempre: intención visual clara, jerarquía fuerte, motion con propósito.

---

## CSS Custom Properties — globals.css

```css
/* app/globals.css */
@import url('https://fonts.googleapis.com/css2?family=...'); /* fuente del proyecto */

@layer base {
  :root {
    /* Colores — sobreescribir por proyecto */
    --color-primary: #0f172a;
    --color-primary-rgb: 15, 23, 42;
    --color-secondary: #1e293b;
    --color-accent: #6366f1;
    --color-accent-rgb: 99, 102, 241;
    --color-surface: #ffffff;
    --color-surface-alt: #f8fafc;
    --color-border: #e2e8f0;
    --color-text: #0f172a;
    --color-text-muted: #64748b;

    /* Tipografía fluida — clamp() para responsive automático */
    --text-xs:   clamp(0.7rem,  0.7rem  + 0.1vw, 0.75rem);
    --text-sm:   clamp(0.8rem,  0.8rem  + 0.15vw, 0.875rem);
    --text-base: clamp(0.9rem,  0.875rem + 0.2vw, 1rem);
    --text-lg:   clamp(1rem,    0.95rem  + 0.3vw, 1.125rem);
    --text-xl:   clamp(1.1rem,  1rem     + 0.5vw, 1.25rem);
    --text-2xl:  clamp(1.25rem, 1.1rem   + 0.8vw, 1.5rem);
    --text-3xl:  clamp(1.5rem,  1.2rem   + 1.2vw, 2rem);
    --text-4xl:  clamp(1.875rem,1.4rem   + 2vw,   2.5rem);
    --text-5xl:  clamp(2.25rem, 1.6rem   + 3vw,   3.5rem);
    --text-6xl:  clamp(2.75rem, 1.8rem   + 4vw,   4.5rem);
    --text-7xl:  clamp(3.5rem,  2rem     + 5vw,   6rem);

    /* Espaciado fluido */
    --space-xs:  clamp(0.25rem, 0.2rem  + 0.2vw, 0.5rem);
    --space-sm:  clamp(0.5rem,  0.4rem  + 0.4vw, 0.75rem);
    --space-md:  clamp(1rem,    0.8rem  + 0.8vw, 1.5rem);
    --space-lg:  clamp(1.5rem,  1rem    + 2vw,   3rem);
    --space-xl:  clamp(2rem,    1.2rem  + 3vw,   5rem);
    --space-2xl: clamp(3rem,    1.5rem  + 5vw,   8rem);

    /* Transiciones */
    --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-in-out:   cubic-bezier(0.4, 0, 0.2, 1);
    --ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);
    --duration-fast: 150ms;
    --duration-base: 250ms;
    --duration-slow: 400ms;
    --duration-xslow: 700ms;

    /* Sombras con color */
    --shadow-xs:  0 1px 2px rgba(var(--color-primary-rgb), 0.05);
    --shadow-sm:  0 2px 8px rgba(var(--color-primary-rgb), 0.08);
    --shadow-md:  0 4px 20px rgba(var(--color-primary-rgb), 0.1);
    --shadow-lg:  0 8px 40px rgba(var(--color-primary-rgb), 0.15);
    --shadow-xl:  0 20px 60px rgba(var(--color-primary-rgb), 0.2);
    --shadow-glow: 0 0 40px rgba(var(--color-accent-rgb), 0.25);

    /* Border radius */
    --radius-sm: 0.375rem;
    --radius-md: 0.75rem;
    --radius-lg: 1rem;
    --radius-xl: 1.5rem;
    --radius-2xl: 2rem;
    --radius-full: 9999px;

    /* Z-index scale */
    --z-base: 0;
    --z-raised: 10;
    --z-dropdown: 100;
    --z-sticky: 200;
    --z-overlay: 250;
    --z-modal: 300;
    --z-toast: 400;
    --z-tooltip: 500;
  }

  /* Dark mode automático */
  @media (prefers-color-scheme: dark) {
    :root {
      --color-primary: #f8fafc;
      --color-surface: #0f172a;
      --color-surface-alt: #1e293b;
      --color-border: #334155;
      --color-text: #f1f5f9;
      --color-text-muted: #94a3b8;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }

  html {
    scroll-behavior: smooth;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  ::selection {
    background: rgba(var(--color-accent-rgb), 0.2);
    color: var(--color-text);
  }

  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 3px;
    border-radius: var(--radius-sm);
  }
}
```

---

## Tailwind config — tokens del sistema

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent:    'var(--color-accent)',
        surface:   'var(--color-surface)',
        'surface-alt': 'var(--color-surface-alt)',
        border:    'var(--color-border)',
        muted:     'var(--color-text-muted)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)',    'sans-serif'],
        mono:    ['var(--font-mono)',    'monospace'],
      },
      fontSize: {
        'fluid-xs':  'var(--text-xs)',
        'fluid-sm':  'var(--text-sm)',
        'fluid-base':'var(--text-base)',
        'fluid-lg':  'var(--text-lg)',
        'fluid-xl':  'var(--text-xl)',
        'fluid-2xl': 'var(--text-2xl)',
        'fluid-3xl': 'var(--text-3xl)',
        'fluid-4xl': 'var(--text-4xl)',
        'fluid-5xl': 'var(--text-5xl)',
        'fluid-6xl': 'var(--text-6xl)',
        'fluid-7xl': 'var(--text-7xl)',
      },
      boxShadow: {
        'xs':   'var(--shadow-xs)',
        'soft': 'var(--shadow-sm)',
        'md':   'var(--shadow-md)',
        'lg':   'var(--shadow-lg)',
        'xl':   'var(--shadow-xl)',
        'glow': 'var(--shadow-glow)',
      },
      borderRadius: {
        'sm':  'var(--radius-sm)',
        'md':  'var(--radius-md)',
        'lg':  'var(--radius-lg)',
        'xl':  'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      transitionTimingFunction: {
        'expo':   'var(--ease-out-expo)',
        'spring': 'var(--ease-spring)',
      },
      animation: {
        'fade-in':       'fadeIn var(--duration-base) var(--ease-out-expo)',
        'fade-up':       'fadeUp var(--duration-slow) var(--ease-out-expo)',
        'fade-down':     'fadeDown var(--duration-base) var(--ease-out-expo)',
        'scale-in':      'scaleIn var(--duration-fast) var(--ease-spring)',
        'slide-right':   'slideRight var(--duration-base) var(--ease-out-expo)',
        'shimmer':       'shimmer 2s linear infinite',
        'float':         'float 6s ease-in-out infinite',
        'pulse-glow':    'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        fadeUp:    { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeDown:  { from: { opacity: '0', transform: 'translateY(-12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:   { from: { opacity: '0', transform: 'scale(0.92)' }, to: { opacity: '1', transform: 'scale(1)' } },
        slideRight:{ from: { opacity: '0', transform: 'translateX(-20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        shimmer:   { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 20px rgba(var(--color-accent-rgb),0.3)' }, '50%': { boxShadow: '0 0 50px rgba(var(--color-accent-rgb),0.6)' } },
      },
    },
  },
  plugins: [],
} satisfies Config
```

---

## Técnicas CSS modernas — usar siempre que aplique

### Container Queries
```css
/* Componente que responde a su contenedor, no al viewport */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

### CSS Grid avanzado
```css
/* Subgrid — alineación perfecta entre filas de cards */
.grid-parent {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.grid-child {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid; /* hereda filas del padre */
}

/* Layout masonry nativo (Chrome 125+) */
.masonry {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: masonry;
  gap: 1rem;
}
```

### Scroll-driven animations
```css
/* Animación ligada al scroll — sin JavaScript */
@keyframes reveal {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

.reveal-on-scroll {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}
```

### View Transitions API
```typescript
// Transiciones entre páginas — Next.js 14+
// app/layout.tsx
import { unstable_ViewTransition as ViewTransition } from 'react'

// En el componente
<ViewTransition>
  <PageContent />
</ViewTransition>
```

### CSS Nesting nativo
```css
/* Sin preprocesador */
.button {
  padding: 0.75rem 1.5rem;
  transition: all var(--duration-base) var(--ease-out-expo);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  &.variant-ghost {
    background: transparent;
    border: 1px solid var(--color-border);
  }
}
```

### @property — Animación de custom properties
```css
@property --gradient-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.animated-border {
  background: conic-gradient(from var(--gradient-angle), #6366f1, #ec4899, #6366f1);
  animation: rotate-gradient 4s linear infinite;
}

@keyframes rotate-gradient {
  to { --gradient-angle: 360deg; }
}
```

---

## Jerarquía visual — Reglas inamovibles

1. **Una acción primaria por pantalla** — un solo botón `primary`, resto `secondary/ghost`
2. **Contraste mínimo WCAG AA** — 4.5:1 texto normal, 3:1 texto grande
3. **Máximo 2 familias tipográficas** — display (headings) + body
4. **Máximo 3 pesos** — regular (400), semibold (600), bold (700)
5. **Escala de espaciado** — solo valores del sistema, nunca `mt-[13px]`
6. **5 estados siempre** — idle, loading, success, error, empty
7. **Empty states diseñados** — icono + texto + CTA, nunca página en blanco

---

## Checklist antes de entregar

- [ ] Responsive: 375px (móvil) → 768px (tablet) → 1440px (desktop)
- [ ] Los 5 estados implementados en componentes de datos
- [ ] `prefers-reduced-motion` respetado
- [ ] Focus visible en todos los interactivos
- [ ] Contraste suficiente texto/fondo
- [ ] Imágenes con `alt` descriptivo y `loading="lazy"` donde aplique
- [ ] Sin valores arbitrarios de CSS (`mt-[13px]` → usar escala)
- [ ] `tsc --noEmit` sin errores
