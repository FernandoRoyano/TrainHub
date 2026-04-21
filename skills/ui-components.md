# SKILL: UI Components

## Utilidad base — siempre presente

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
```

---

## Button — con variantes y estados

```typescript
// components/ui/Button.tsx
import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const variants: Record<string, string> = {
  primary:   'bg-accent text-white hover:brightness-110 shadow-soft hover:shadow-glow active:scale-[0.98]',
  secondary: 'bg-transparent border border-border text-primary hover:bg-surface-alt active:scale-[0.98]',
  ghost:     'bg-transparent text-muted hover:text-primary hover:bg-surface-alt',
  danger:    'bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]',
  link:      'underline-offset-4 hover:underline text-accent p-0 h-auto',
}

const sizes: Record<string, string> = {
  xs: 'h-7  px-3   text-xs  gap-1.5',
  sm: 'h-8  px-4   text-sm  gap-2',
  md: 'h-10 px-5   text-sm  gap-2',
  lg: 'h-12 px-6   text-base gap-2.5',
  xl: 'h-14 px-8   text-lg  gap-3',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary', size = 'md', loading, icon, iconPosition = 'left',
  className, children, disabled, ...props
}, ref) => (
  <button
    ref={ref}
    disabled={disabled || loading}
    className={cn(
      'inline-flex items-center justify-center font-medium rounded-lg',
      'transition-all duration-[var(--duration-base)] ease-[var(--ease-out-expo)]',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
      variants[variant],
      sizes[size],
      className
    )}
    {...props}
  >
    {loading && (
      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    )}
    {!loading && icon && iconPosition === 'left' && icon}
    {children}
    {!loading && icon && iconPosition === 'right' && icon}
  </button>
))
Button.displayName = 'Button'
```

---

## Input — con label, error, hint e iconos

```typescript
// components/ui/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

export function Input({ label, error, hint, iconLeft, iconRight, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-primary">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {iconLeft && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
            {iconLeft}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full rounded-lg border bg-surface text-primary placeholder:text-muted',
            'px-3 py-2.5 text-sm transition-all duration-[var(--duration-fast)]',
            'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-alt',
            error ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : 'border-border',
            iconLeft  && 'pl-10',
            iconRight && 'pr-10',
            className
          )}
          {...props}
        />
        {iconRight && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
            {iconRight}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500 flex items-center gap-1">⚠ {error}</p>}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
    </div>
  )
}
```

---

## Card — con variantes

```typescript
// components/ui/Card.tsx
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'ghost'
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

const cardVariants = {
  default:   'bg-surface border border-border shadow-soft',
  bordered:  'bg-surface border-2 border-border',
  elevated:  'bg-surface shadow-lg border-0',
  ghost:     'bg-surface-alt border-0',
}

const cardPadding = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({ variant = 'default', hover = false, padding = 'md', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl',
        cardVariants[variant],
        cardPadding[padding],
        hover && 'transition-all duration-[var(--duration-base)] ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-lg cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

---

## Badge / Chip

```typescript
interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent'
  size?: 'sm' | 'md'
  dot?: boolean
}

const badgeVariants = {
  default: 'bg-surface-alt text-primary border border-border',
  success: 'bg-green-50  text-green-700  border border-green-200',
  warning: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  error:   'bg-red-50    text-red-700    border border-red-200',
  info:    'bg-blue-50   text-blue-700   border border-blue-200',
  accent:  'bg-accent/10 text-accent     border border-accent/20',
}

export function Badge({ children, variant = 'default', size = 'md', dot }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-medium rounded-full',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs',
      badgeVariants[variant]
    )}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', {
        'bg-gray-400':   variant === 'default',
        'bg-green-500':  variant === 'success',
        'bg-yellow-500': variant === 'warning',
        'bg-red-500':    variant === 'error',
        'bg-blue-500':   variant === 'info',
        'bg-accent':     variant === 'accent',
      })} />}
      {children}
    </span>
  )
}
```

---

## Modal / Dialog

```typescript
// components/ui/Modal.tsx
'use client'
import { useEffect, useRef } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  children: React.ReactNode
}

const modalSizes = {
  sm:   'max-w-sm',
  md:   'max-w-lg',
  lg:   'max-w-2xl',
  xl:   'max-w-4xl',
  full: 'max-w-[95vw]',
}

export function Modal({ open, onClose, title, description, size = 'md', children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4"
      onClick={e => e.target === overlayRef.current && onClose()}
    >
      {/* Backdrop con blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

      {/* Panel */}
      <div className={cn(
        'relative w-full bg-surface rounded-2xl shadow-xl animate-scale-in',
        'border border-border/50',
        modalSizes[size]
      )}>
        {/* Header */}
        {(title || description) && (
          <div className="px-6 pt-6 pb-4 border-b border-border">
            {title && <h2 className="text-lg font-semibold text-primary">{title}</h2>}
            {description && <p className="text-sm text-muted mt-1">{description}</p>}
          </div>
        )}

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:text-primary hover:bg-surface-alt transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
```

---

## Skeleton — Loading state

```typescript
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      'rounded-md bg-gradient-to-r from-surface-alt via-border to-surface-alt',
      'bg-[length:200%_100%] animate-shimmer',
      className
    )} />
  )
}

// Skeletons compuestos
export function CardSkeleton() {
  return (
    <div className="p-6 rounded-xl border border-border space-y-3">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-8 w-24 mt-4" />
    </div>
  )
}
```

---

## Toast / Notificaciones

```typescript
// Usar con un estado global mínimo o Zustand
'use client'
interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

const toastStyles = {
  success: 'bg-green-50  border-green-200 text-green-800',
  error:   'bg-red-50    border-red-200   text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info:    'bg-blue-50   border-blue-200  text-blue-800',
}

const toastIcons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' }

export function ToastItem({ toast }: { toast: Toast }) {
  return (
    <div className={cn(
      'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg',
      'animate-slide-right text-sm font-medium min-w-64 max-w-sm',
      toastStyles[toast.type]
    )}>
      <span>{toastIcons[toast.type]}</span>
      <span>{toast.message}</span>
    </div>
  )
}
```

---

## Avatar

```typescript
interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string  // iniciales
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const avatarSizes = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-lg' }

export function Avatar({ src, alt, fallback, size = 'md' }: AvatarProps) {
  return (
    <div className={cn('rounded-full overflow-hidden bg-accent/10 flex items-center justify-center font-semibold text-accent shrink-0', avatarSizes[size])}>
      {src ? <img src={src} alt={alt ?? ''} className="w-full h-full object-cover" /> : (fallback ?? '?')}
    </div>
  )
}
```

---

## PageHeader — Cabecera de página estándar

```typescript
export function PageHeader({ title, description, action, breadcrumb }: {
  title: string
  description?: string
  action?: React.ReactNode
  breadcrumb?: { label: string; href?: string }[]
}) {
  return (
    <div className="mb-8">
      {breadcrumb && (
        <nav className="flex items-center gap-2 text-sm text-muted mb-3">
          {breadcrumb.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              {item.href ? <a href={item.href} className="hover:text-primary transition-colors">{item.label}</a> : <span>{item.label}</span>}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-fluid-3xl font-display font-bold text-primary">{title}</h1>
          {description && <p className="text-muted mt-1 text-fluid-base">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  )
}
```

---

## EmptyState — Estado vacío

```typescript
export function EmptyState({ icon, title, description, action }: {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && <div className="text-5xl mb-4 text-muted">{icon}</div>}
      <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
      {description && <p className="text-muted text-sm max-w-xs mb-6">{description}</p>}
      {action}
    </div>
  )
}
```

---

## Paletas por proyecto — referencia rápida

```css
/* WellnessReal */
--color-primary: #16122B;
--color-accent:  #FCEE21;

/* Antea Salud */
--color-primary: #2D6A4F;
--color-accent:  #74C69D;

/* Tarfayah Luxury */
--color-primary: #1C1C1C;
--color-accent:  #C9A84C;

/* Dark SaaS (genérico) */
--color-primary: #0f172a;
--color-accent:  #6366f1;

/* Light Professional (genérico) */
--color-primary: #111827;
--color-accent:  #2563eb;
```
