-- Add unique constraint on invite_token (partial: only non-null values)
CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_invite_token_unique
  ON public.clients(invite_token) WHERE invite_token IS NOT NULL;
