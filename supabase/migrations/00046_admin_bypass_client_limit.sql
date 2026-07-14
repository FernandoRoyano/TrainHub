-- =====================================================
-- 00046: los admins de la plataforma no tienen límite de clientes
--
-- Contexto: el trigger 00035 trata "sin fila en subscriptions" como
-- free (3 clientes). La cuenta del dueño de la plataforma quedó
-- bloqueada al intentar añadir el cliente nº 10. Bypass explícito
-- por rol, espejado en use-subscription.ts (UI).
-- =====================================================

create or replace function public.enforce_client_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tier text;
  v_count int;
  v_limit int;
begin
  -- Admins de la plataforma: sin límite
  if exists (
    select 1 from public.users
    where id = new.trainer_id and role = 'admin'
  ) then
    return new;
  end if;

  -- Obtener tier activo del trainer (default 'free' si no tiene fila en subscriptions)
  select coalesce(s.tier, 'free') into v_tier
  from public.subscriptions s
  where s.user_id = new.trainer_id
    and s.status in ('active', 'trialing')
  order by s.created_at desc
  limit 1;

  v_tier := coalesce(v_tier, 'free');

  v_limit := case v_tier
    when 'pro'   then 25
    when 'elite' then 2147483647  -- max int = ilimitado en la práctica
    else 3                         -- free
  end;

  select count(*) into v_count
  from public.clients
  where trainer_id = new.trainer_id;

  if v_count >= v_limit then
    raise exception 'CLIENT_LIMIT_REACHED: tier % allows max % clients', v_tier, v_limit
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;
