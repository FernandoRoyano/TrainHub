# SKILL: Landing Pages

## Estructura — orden que convierte

```
1. Nav           → logo + links + CTA
2. Hero          → headline + subheadline + CTA + visual
3. Social Proof  → logos o números (credibilidad inmediata)
4. Problema      → agitar el dolor
5. Solución      → features → beneficios
6. Cómo funciona → proceso en 3 pasos
7. Testimonials  → prueba social real
8. Pricing       → claro, sin trampa
9. FAQ           → eliminar objeciones
10. CTA Final    → repetir oferta
11. Footer       → legal + links
```

Mínimo viable: **Hero + Solución + CTA Final**

---

## Nav — Sticky con blur

```typescript
'use client'
export function Nav({ logo, links, cta }: {
  logo: React.ReactNode
  links: { label: string; href: string }[]
  cta?: { label: string; href: string }
}) {
  return (
    <header className="fixed top-0 inset-x-0 z-[var(--z-sticky)]">
      {/* Glassmorphism */}
      <div className="absolute inset-0 bg-surface/80 backdrop-blur-xl border-b border-border/50" />
      <nav className="relative max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="font-display font-bold text-xl">{logo}</div>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href}
              className="text-sm text-muted hover:text-primary transition-colors duration-[var(--duration-fast)]">
              {l.label}
            </a>
          ))}
        </div>
        {cta && (
          <Button size="sm" className="hidden md:flex">
            {cta.label}
          </Button>
        )}
      </nav>
    </header>
  )
}
```

---

## Hero — Varios patrones

### Patrón A — Centrado con gradiente de fondo
```typescript
export function HeroCentered({ badge, headline, subheadline, ctaPrimary, ctaSecondary, stats }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Fondo con gradiente radial animado */}
      <div className="absolute inset-0 bg-[var(--color-primary)]" />
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(var(--color-accent-rgb),0.3), transparent)' }} />
      {/* Grid decorativo */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(var(--color-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative text-center max-w-4xl mx-auto px-6 py-24 space-y-8">
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/70 text-sm animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {badge}
          </div>
        )}
        <h1 className="text-fluid-7xl font-display font-bold text-white leading-[1.05] animate-fade-up">
          {headline}
        </h1>
        <p className="text-fluid-xl text-white/60 max-w-2xl mx-auto leading-relaxed animate-fade-up [animation-delay:100ms]">
          {subheadline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up [animation-delay:200ms]">
          <Button size="lg">{ctaPrimary}</Button>
          {ctaSecondary && <Button variant="secondary" size="lg" className="border-white/20 text-white hover:bg-white/5">{ctaSecondary}</Button>}
        </div>
        {stats && (
          <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-white/10 animate-fade-up [animation-delay:300ms]">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-fluid-3xl font-display font-bold text-white">{s.value}</div>
                <div className="text-sm text-white/40">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
```

### Patrón B — Split con visual a la derecha
```typescript
export function HeroSplit({ badge, headline, subheadline, ctaPrimary, ctaSecondary, visual, socialProof }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-surface-alt" />
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 animate-fade-up">
          {badge && (
            <Badge variant="accent">{badge}</Badge>
          )}
          <h1 className="text-fluid-6xl font-display font-bold text-primary leading-[1.08]">
            {headline}
          </h1>
          <p className="text-fluid-lg text-muted leading-relaxed max-w-lg">
            {subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg">{ctaPrimary}</Button>
            {ctaSecondary && <Button variant="ghost" size="lg">{ctaSecondary} →</Button>}
          </div>
          {socialProof && <p className="text-sm text-muted">{socialProof}</p>}
        </div>
        {visual && (
          <div className="animate-fade-up [animation-delay:150ms]">
            {visual}
          </div>
        )}
      </div>
    </section>
  )
}
```

---

## Social Proof — Logos

```typescript
export function LogoBar({ title = 'Usado por equipos de', logos }: {
  title?: string
  logos: { name: string; src: string }[]
}) {
  return (
    <section className="py-14 border-y border-border">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-xs text-muted uppercase tracking-[0.2em] mb-10">{title}</p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {logos.map(l => (
            <img key={l.name} src={l.src} alt={l.name}
              className="h-7 object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-[var(--duration-slow)]" />
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## Features → Beneficios

```typescript
// Regla: título = beneficio para el usuario, no nombre de la feature
// ❌ "Dashboard analítico"
// ✅ "Ves exactamente qué funciona y qué no"

interface Feature {
  icon: React.ReactNode | string
  benefit: string
  description: string
  tag?: string
}

export function Features({ eyebrow, title, subtitle, features, layout = 'grid' }: {
  eyebrow?: string
  title: string
  subtitle?: string
  features: Feature[]
  layout?: 'grid' | 'list' | 'bento'
}) {
  return (
    <section className="py-[var(--space-2xl)] bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          {eyebrow && <p className="text-xs text-accent font-semibold uppercase tracking-[0.2em]">{eyebrow}</p>}
          <h2 className="text-fluid-4xl font-display font-bold text-primary">{title}</h2>
          {subtitle && <p className="text-fluid-lg text-muted">{subtitle}</p>}
        </div>

        {layout === 'bento' ? (
          // Bento grid — moderno, asimétrico
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
            {features.map((f, i) => (
              <Card key={i} hover
                className={cn('group', i === 0 && 'lg:col-span-2', i === 3 && 'lg:col-span-2')}
                padding="lg"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-[var(--duration-base)]">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">{f.benefit}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.description}</p>
                {f.tag && <Badge variant="accent" className="mt-4">{f.tag}</Badge>}
              </Card>
            ))}
          </div>
        ) : (
          <div className={cn(
            'grid gap-6',
            layout === 'grid' && 'md:grid-cols-2 lg:grid-cols-3',
            layout === 'list' && 'max-w-3xl mx-auto'
          )}>
            {features.map((f, i) => (
              <Card key={i} hover padding="lg" className="group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-[var(--duration-base)]">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">{f.benefit}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.description}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
```

---

## Proceso en pasos

```typescript
export function Steps({ eyebrow, title, steps }: {
  eyebrow?: string
  title: string
  steps: { num: string; title: string; desc: string; icon?: React.ReactNode }[]
}) {
  return (
    <section className="py-[var(--space-2xl)] bg-surface-alt">
      <div className="max-w-5xl mx-auto px-6">
        {eyebrow && <p className="text-center text-xs text-accent font-semibold uppercase tracking-[0.2em] mb-4">{eyebrow}</p>}
        <h2 className="text-fluid-4xl font-display font-bold text-center text-primary mb-16">{title}</h2>
        <div className="relative">
          <div className="absolute left-[2.25rem] top-10 bottom-10 w-px bg-gradient-to-b from-accent via-border to-transparent hidden md:block" />
          <div className="space-y-10">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-8 items-start group animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="shrink-0 w-[4.5rem] h-[4.5rem] rounded-2xl bg-accent text-white flex items-center justify-center font-display font-bold text-xl relative z-10 shadow-glow group-hover:scale-105 transition-transform duration-[var(--duration-base)]">
                  {s.icon ?? s.num}
                </div>
                <div className="pt-4">
                  <h3 className="text-xl font-semibold text-primary mb-2">{s.title}</h3>
                  <p className="text-muted leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

---

## Testimonials

```typescript
export function Testimonials({ title, testimonials }: {
  title?: string
  testimonials: { quote: string; author: string; role: string; avatar?: string; rating?: number; company?: string }[]
}) {
  return (
    <section className="py-[var(--space-2xl)] bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {title && <h2 className="text-fluid-4xl font-display font-bold text-center text-primary mb-16">{title}</h2>}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((t, i) => (
            <Card key={i} variant="bordered" className="break-inside-avoid">
              {t.rating && (
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className={j < t.rating! ? 'text-yellow-400' : 'text-border'}>★</span>
                  ))}
                </div>
              )}
              <p className="text-primary leading-relaxed mb-6 text-fluid-sm">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <Avatar src={t.avatar} fallback={t.author[0]} size="sm" />
                <div>
                  <p className="font-semibold text-sm text-primary">{t.author}</p>
                  <p className="text-xs text-muted">{t.role}{t.company && ` · ${t.company}`}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## Pricing

```typescript
export function Pricing({ eyebrow, title, subtitle, plans, toggle }: {
  eyebrow?: string
  title: string
  subtitle?: string
  plans: { name: string; price: string; priceAnnual?: string; period?: string; description?: string; features: string[]; cta: string; featured?: boolean; badge?: string }[]
  toggle?: boolean
}) {
  return (
    <section className="py-[var(--space-2xl)] bg-surface-alt">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          {eyebrow && <p className="text-xs text-accent font-semibold uppercase tracking-[0.2em]">{eyebrow}</p>}
          <h2 className="text-fluid-4xl font-display font-bold text-primary">{title}</h2>
          {subtitle && <p className="text-muted text-fluid-lg">{subtitle}</p>}
        </div>
        <div className={cn('grid gap-6 items-center', plans.length === 2 && 'md:grid-cols-2', plans.length >= 3 && 'md:grid-cols-3')}>
          {plans.map((p, i) => (
            <div key={i} className={cn(
              'relative rounded-2xl p-8 border transition-all duration-[var(--duration-base)]',
              p.featured
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xl scale-105'
                : 'bg-surface border-border shadow-soft hover:shadow-md'
            )}>
              {p.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-semibold px-4 py-1 rounded-full">
                  {p.badge}
                </span>
              )}
              <h3 className="text-xl font-bold mb-1">{p.name}</h3>
              {p.description && <p className={cn('text-sm mb-6', p.featured ? 'text-white/60' : 'text-muted')}>{p.description}</p>}
              <div className="flex items-end gap-1 my-6">
                <span className="text-5xl font-display font-bold">{p.price}</span>
                {p.period && <span className={cn('text-sm mb-2', p.featured ? 'text-white/50' : 'text-muted')}>/{p.period}</span>}
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map((f, j) => (
                  <li key={j} className={cn('flex items-start gap-3 text-sm', p.featured ? 'text-white/80' : 'text-muted')}>
                    <span className="text-accent mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Button variant={p.featured ? 'secondary' : 'primary'} className="w-full">{p.cta}</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## FAQ — Accordion

```typescript
'use client'
export function FAQ({ title, items }: { title: string; items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="py-[var(--space-2xl)]">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-fluid-4xl font-display font-bold text-center text-primary mb-12">{title}</h2>
        <div className="divide-y divide-border">
          {items.map((item, i) => (
            <div key={i}>
              <button
                className="w-full flex justify-between items-center py-5 text-left gap-4 hover:text-accent transition-colors duration-[var(--duration-fast)]"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className={cn('font-medium text-fluid-base', open === i ? 'text-accent' : 'text-primary')}>
                  {item.q}
                </span>
                <span className={cn('shrink-0 text-muted transition-transform duration-[var(--duration-base)]', open === i && 'rotate-45')}>
                  +
                </span>
              </button>
              {open === i && (
                <div className="pb-5 text-muted text-fluid-sm leading-relaxed animate-fade-down">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## CTA Final

```typescript
export function FinalCTA({ headline, subheadline, ctaPrimary, ctaSecondary, disclaimer, variant = 'dark' }: {
  headline: string
  subheadline?: string
  ctaPrimary: string
  ctaSecondary?: string
  disclaimer?: string
  variant?: 'dark' | 'accent' | 'gradient'
}) {
  const backgrounds = {
    dark:     'bg-[var(--color-primary)]',
    accent:   'bg-accent',
    gradient: 'bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary)] to-accent/80',
  }
  return (
    <section className={cn('py-[var(--space-2xl)] text-white text-center relative overflow-hidden', backgrounds[variant])}>
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="relative max-w-3xl mx-auto px-6 space-y-8">
        <h2 className="text-fluid-5xl font-display font-bold leading-tight">{headline}</h2>
        {subheadline && <p className="text-white/70 text-fluid-lg">{subheadline}</p>}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="xl" className="bg-white text-[var(--color-primary)] hover:bg-white/90">{ctaPrimary}</Button>
          {ctaSecondary && <Button variant="ghost" size="xl" className="text-white border-white/20">{ctaSecondary}</Button>}
        </div>
        {disclaimer && <p className="text-white/40 text-xs">{disclaimer}</p>}
      </div>
    </section>
  )
}
```

---

## Copywriting — Fórmulas universales

| Elemento | Fórmula | Ejemplo |
|---|---|---|
| Headline | Beneficio + resultado/plazo | "Lanza tu SaaS en 7 días" |
| Subheadline | Quién + qué + cómo | "Para developers que quieren clientes sin perder semanas en setup" |
| Badge hero | Social proof breve | "Usado por +500 equipos" |
| CTA | Verbo acción + beneficio | "Empezar gratis" / "Ver demo en vivo" |
| Social proof | Números concretos | "2.400 webs publicadas" > "miles de clientes" |

## CTA por tipo de proyecto

| Tipo | CTA primario | CTA secundario |
|---|---|---|
| SaaS / app | "Empezar gratis" | "Ver demo" |
| Servicio / consultoría | "Agendar llamada" | "Ver casos" |
| E-commerce | "Comprar ahora" | "Ver detalles" |
| Curso / infoproducto | "Acceder ahora" | "Ver programa" |
| Portfolio | "Ver proyectos" | "Contactar" |
| App móvil | "Descargar gratis" | "Ver capturas" |
| Evento | "Reservar plaza" | "Ver agenda" |
