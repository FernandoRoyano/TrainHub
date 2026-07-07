-- Las columnas de invitación se crearon a mano en el proyecto de producción
-- y nunca quedaron versionadas (00015 solo creó el índice único sobre ellas).
-- Esta migración las incorpora al schema versionado; en producción los
-- IF NOT EXISTS la convierten en no-op.
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS invite_token TEXT,
  ADD COLUMN IF NOT EXISTS invite_token_expires_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_invite_token_unique
  ON public.clients(invite_token) WHERE invite_token IS NOT NULL;
