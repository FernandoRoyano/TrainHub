-- =====================================================
-- 00049: suscripciones Web Push (notificaciones nativas)
--
-- La campanita in-app ya existía (tabla notifications + polling), pero no
-- entregaba nada al sistema operativo. Esta tabla guarda las suscripciones
-- Web Push (una por navegador/dispositivo instalado) para poder empujar
-- notificaciones al bloqueo de pantalla vía VAPID/web-push desde el servidor.
--
-- Un usuario puede tener varias filas (móvil + escritorio). El endpoint es
-- único global: si el mismo navegador se re-suscribe, se hace upsert por
-- endpoint. Al recibir 404/410 del push service, la fila se borra (endpoint
-- caducado) desde el emisor.
--
-- iOS: solo entrega push si la PWA está añadida a la pantalla de inicio
-- (iOS 16.4+). La fila se crea igual; la limitación es del cliente.
-- =====================================================

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- El usuario solo ve y borra sus propias suscripciones. La inserción/borrado
-- efectivos los hace el service role desde /api/push/*, que ignora RLS.
CREATE POLICY "Users view own push subscriptions"
  ON public.push_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own push subscriptions"
  ON public.push_subscriptions FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user
  ON public.push_subscriptions(user_id);
