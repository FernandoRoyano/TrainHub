# SKILL: Claude API Integration

## Setup base

```typescript
// lib/claude.ts
import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Modelo estándar — actualizar según proyecto
export const CLAUDE_MODEL = 'claude-opus-4-7' // o claude-sonnet-4-6 para menor coste
export const MAX_TOKENS = 1024
```

## Llamada simple (API Route)

```typescript
// app/api/ai/route.ts
import { anthropic, CLAUDE_MODEL } from '@/lib/claude'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { message, context } = await request.json()

  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: `Eres un asistente especializado en [CONTEXTO].
Responde siempre en español.
Sé conciso y directo.`,
    messages: [
      { role: 'user', content: message }
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return NextResponse.json({ response: text })
}
```

## Streaming (para UX tipo chat)

```typescript
// app/api/ai/stream/route.ts
import { anthropic } from '@/lib/claude'

export async function POST(request: NextRequest) {
  const { messages, systemPrompt } = await request.json()

  const stream = await anthropic.messages.stream({
    model: 'claude-opus-4-7',
    max_tokens: 2048,
    system: systemPrompt,
    messages,
  })

  // Devolver como ReadableStream
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta') {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}

// Client component para consumir el stream
'use client'
async function streamResponse(message: string) {
  const response = await fetch('/api/ai/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: message }] }),
  })

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const text = decoder.decode(value)
    setOutput(prev => prev + text) // actualizar estado incremental
  }
}
```

## Con historial de conversación

```typescript
// Mantener historial en estado del componente
const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([])

async function sendMessage(userMessage: string) {
  const newMessages = [...messages, { role: 'user' as const, content: userMessage }]
  setMessages(newMessages)

  const response = await fetch('/api/ai', {
    method: 'POST',
    body: JSON.stringify({ messages: newMessages }),
  })

  const { response: assistantMessage } = await response.json()
  setMessages([...newMessages, { role: 'assistant', content: assistantMessage }])
}
```

## Prompt caching (ahorro hasta 90%)

```typescript
// Para system prompts largos o documentos de contexto
const response = await anthropic.messages.create({
  model: 'claude-opus-4-7',
  max_tokens: 1024,
  system: [
    {
      type: 'text',
      text: largeSystemPrompt,
      cache_control: { type: 'ephemeral' } // ← cachea este bloque
    }
  ],
  messages: [{ role: 'user', content: userMessage }],
})
```

## Uso por proyecto

### TrainHub — Health Assistant
```typescript
const TRAINHUB_SYSTEM = `Eres un asistente de salud y entrenamiento para la plataforma TrainHub.
Tienes acceso al historial de la usuaria, su fase del ciclo menstrual actual, y su historial de síntomas.
Proporciona recomendaciones personalizadas basadas en evidencia científica.
Nunca diagnostiques ni reemplaces consejo médico profesional.`
```

### Antea Salud — Asistente para residencias
```typescript
const ANTEA_SYSTEM = `Eres un asistente para profesionales de actividad física con personas mayores.
Proporciona sugerencias de ejercicios adaptados, protocolos de seguridad, y recursos de formación.
Usa lenguaje accesible y profesional.`
```

## Variables requeridas
```env
ANTHROPIC_API_KEY=sk-ant-...
```

## Costes orientativos (Opus 4.7)
- Input: $5 / millón tokens
- Output: $25 / millón tokens
- Con prompt caching: hasta 90% menos en tokens repetidos
- Con batch API: 50% menos (para tareas no tiempo-real)
