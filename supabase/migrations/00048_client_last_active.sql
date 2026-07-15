-- =====================================================
-- 00048: último acceso real del cliente (heartbeat)
--
-- Antes "última conexión" salía de clients.updated_at, que solo cambia
-- al editar la ficha (no al entrar el cliente). Este campo lo estampa
-- un heartbeat cada vez que el cliente abre su app (POST /api/heartbeat,
-- service role), throttled a ~15 min. auth.last_sign_in_at no vale:
-- en una PWA con sesión persistente el cliente entra a diario sin
-- generar un login nuevo.
-- =====================================================

alter table public.clients
  add column if not exists last_active_at timestamptz;

-- Para ordenar/filtrar por inactividad por trainer
create index if not exists idx_clients_last_active
  on public.clients(trainer_id, last_active_at desc nulls last);

-- Siembra inicial: último login real de cada cliente ya registrado, para
-- que el dato no salga vacío el primer día. El heartbeat lo refina luego.
update public.clients c
set last_active_at = au.last_sign_in_at
from auth.users au
where c.user_id = au.id
  and c.last_active_at is null;
