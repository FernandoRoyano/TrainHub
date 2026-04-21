# SKILL: UI Components & Design System

## Paletas de color por proyecto

```typescript
// WellnessReal
const wellnessreal = {
  primary: '#16122B',   // Deep purple
  accent: '#FCEE21',    // Yellow
  white: '#FFFFFF',
}

// Antea Salud (usar verde bienestar + azul confianza)
const anteaSalud = {
  primary: '#2D6A4F',   // Verde oscuro
  secondary: '#40916C', // Verde medio
  accent: '#74C69D',    // Verde claro
  trust: '#1D3557',     // Azul confianza
}

// Tarfayah Luxury Pets
const tarfayah = {
  gold: '#C9A84C',
  dark: '#1C1C1C',
  light: '#F5F0E8',
}
```

## Componentes base — Patrones Tailwind

### Button
```typescript
// components/ui/Button.tsx
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variants = {
  primary: 'bg-primary text-white hover:bg-primary/90',
  secondary: 'border border-primary text-primary hover:bg-primary/5',
  ghost: 'text-gray-600 hover:bg-gray-100',
  danger: 'bg-red-500 text-white hover:bg-red-600',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="animate-spin mr-2">⟳</span> : null}
      {children}
    </button>
  )
}
```

### Input con label y error
```typescript
// components/ui/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        className={cn(
          'px-3 py-2 border rounded-lg text-sm transition-colors outline-none',
          'focus:ring-2 focus:ring-primary/20 focus:border-primary',
          error ? 'border-red-400' : 'border-gray-300',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
}
```

### Card
```typescript
export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-white rounded-xl border border-gray-200 shadow-sm p-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}
```

### Modal
```typescript
'use client'
import { useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 p-6">
        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
```

## Layout patterns

### Dashboard con sidebar
```typescript
// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* nav items */}
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
```

### Section con heading
```typescript
export function PageHeader({ title, description, action }: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-gray-500 mt-1">{description}</p>}
      </div>
      {action}
    </div>
  )
}
```

## cn utility — Siempre usar
```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Tipografías por proyecto
- **WellnessReal:** Bebas Neue (headings) + Barlow (body)
- **Antea Salud:** Inter (todo) — legibilidad para personas mayores, mínimo 16px
- **Proyectos cliente:** Inter por defecto salvo indicación
