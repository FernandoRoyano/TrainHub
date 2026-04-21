# SKILL: Claude API Integration

## Setup

```typescript
// lib/claude.ts
import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const MODELS = {
  fast:     'claude-sonnet-4-6',   // respuestas rápidas, menor coste
  balanced: 'claude-sonnet-4-6',   // uso general
  powerful: 'claude-opus-4-7',     // tareas complejas, razonamiento profundo
} as const
```

---

## Llamada simple

```typescript
// app/api/ai/route.ts
import { anthropic, MODELS } from '@/lib/claude'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { message, systemPrompt, model = 'balanced' } = await request.json()

  const response = await anthropic.messages.create({
    model: MODELS[model as keyof typeof MODELS],
    max_tokens: 1024,
    system: systemPrompt ?? 'Eres un asistente útil. Responde siempre en español.',
    messages: [{ role: 'user', content: message }],
  })

  const text = response.content.find(b => b.type === 'text')?.text ?? ''
  return NextResponse.json({ response: text, usage: response.usage })
}
```

---

## Streaming — para UX tipo chat

```typescript
// app/api/ai/stream/route.ts
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { messages, systemPrompt } = await request.json()

  const stream = await anthropic.messages.stream({
    model: MODELS.balanced,
    max_tokens: 2048,
    system: systemPrompt,
    messages,
  })

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
```

---

## Hook de chat con streaming

```typescript
// hooks/useChat.ts
'use client'
import { useState, useCallback } from 'react'

interface Message { role: 'user' | 'assistant'; content: string }

export function useChat(systemPrompt?: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = { role: 'user', content }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setLoading(true)
    setError(null)

    // Placeholder para el streaming
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const response = await fetch('/api/ai/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, systemPrompt }),
      })

      if (!response.ok) throw new Error('Error en la solicitud')

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value)
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            role: 'assistant',
            content: updated[updated.length - 1].content + text,
          }
          return updated
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setMessages(prev => prev.slice(0, -1)) // eliminar placeholder
    } finally {
      setLoading(false)
    }
  }, [messages, systemPrompt])

  const clearMessages = () => setMessages([])

  return { messages, loading, error, sendMessage, clearMessages }
}
```

---

## Prompt caching — hasta 90% de ahorro

```typescript
// Para system prompts largos o documentos de contexto estático
const response = await anthropic.messages.create({
  model: MODELS.powerful,
  max_tokens: 2048,
  system: [
    {
      type: 'text',
      text: longSystemPrompt,       // prompt largo que no cambia entre requests
      cache_control: { type: 'ephemeral' }  // ← se cachea 5 minutos
    }
  ],
  messages: [{ role: 'user', content: userMessage }],
})

// Ver si se usó la caché
console.log('Cache hit:', response.usage.cache_read_input_tokens > 0)
```

---

## Structured outputs — respuestas en JSON

```typescript
const response = await anthropic.messages.create({
  model: MODELS.balanced,
  max_tokens: 1024,
  system: `Responde ÚNICAMENTE con JSON válido. Sin texto adicional, sin markdown.
  
  Schema esperado:
  {
    "title": string,
    "summary": string,
    "tags": string[],
    "sentiment": "positive" | "neutral" | "negative"
  }`,
  messages: [{ role: 'user', content: textToAnalyze }],
})

const text = response.content.find(b => b.type === 'text')?.text ?? ''
const result = JSON.parse(text) // manejar con try/catch
```

---

## Batch API — 50% más barato para tareas no urgentes

```typescript
// Para procesar muchos items sin tiempo real
const batch = await anthropic.messages.batches.create({
  requests: items.map((item, i) => ({
    custom_id: `item-${i}`,
    params: {
      model: MODELS.balanced,
      max_tokens: 512,
      messages: [{ role: 'user', content: `Analiza: ${item.text}` }],
    },
  })),
})

// Consultar resultado (puede tardar minutos)
const results = await anthropic.messages.batches.results(batch.id)
```

---

## System prompts por proyecto

```typescript
// TrainHub — asistente de salud y entrenamiento
export const TRAINHUB_SYSTEM = `Eres un asistente experto en entrenamiento y salud para la app TrainHub.
Tienes acceso al perfil de la usuaria, su fase del ciclo menstrual actual y su historial de síntomas.
Proporciona recomendaciones personalizadas basadas en evidencia científica.
Nunca diagnostiques ni sustituyas el consejo médico profesional.
Responde siempre en español, de forma cercana y motivadora.`

// Antea Salud — asistente para profesionales
export const ANTEA_SYSTEM = `Eres un asistente especializado en actividad física adaptada para personas mayores.
Ayuda a profesionales del sector con sugerencias de ejercicios, protocolos de seguridad y recursos de formación.
Usa lenguaje profesional pero accesible. Responde siempre en español.`

// Genérico para proyectos cliente
export const createSystemPrompt = (context: string) => `
Eres un asistente especializado para ${context}.
Responde siempre en español, de forma concisa y directa.
Si no tienes suficiente información para responder con precisión, dilo claramente.`
```

---

## Costes orientativos (abril 2026)

| Modelo | Input | Output | Prompt cache |
|---|---|---|---|
| claude-sonnet-4-6 | $3/M | $15/M | -90% cached |
| claude-opus-4-7   | $5/M | $25/M | -90% cached |
| Batch API         | -50% | -50% | — |

**Regla:** Usar `sonnet-4-6` por defecto. Solo `opus-4-7` para tareas que requieren razonamiento complejo.

---

## Variables requeridas
```env
ANTHROPIC_API_KEY=sk-ant-...
```
