-- Idempotencia para webhooks de Stripe: evita procesar el mismo event_id dos veces
create table if not exists public.stripe_events (
  id text primary key,
  type text not null,
  received_at timestamptz not null default now()
);

alter table public.stripe_events enable row level security;

-- Solo el service_role accede; ningún rol cliente debe leer/escribir
create policy "stripe_events_service_only"
  on public.stripe_events
  for all
  using (false)
  with check (false);

-- Unique constraint sobre payment_intent_id evita pagos duplicados aunque la
-- idempotencia de eventos falle por alguna razón.
create unique index if not exists payments_payment_intent_unique
  on public.payments (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;
