-- =====================================================
-- 00047: cupo de clientes personalizado por trainer (admin)
--
-- El admin puede fijar un límite de clientes por trainer que gana
-- sobre el del plan (upsell manual o acceso de cortesía a amigos).
-- NULL = usar el límite del tier. Se guarda en users porque toda
-- cuenta tiene fila garantizada (no requiere fila en subscriptions).
--
-- Resolución del límite (trigger + use-subscription.ts):
--   1. admin                → ilimitado
--   2. client_limit_override → ese valor (si no es NULL)
--   3. tier                  → free 3 / pro 25 / elite ilimitado
-- =====================================================

alter table public.users
  add column if not exists client_limit_override int
  check (client_limit_override is null or client_limit_override >= 0);

create or replace function public.enforce_client_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
  v_override int;
  v_tier text;
  v_count int;
  v_limit int;
begin
  select role, client_limit_override into v_role, v_override
  from public.users
  where id = new.trainer_id;

  -- Admins de la plataforma: sin límite
  if v_role = 'admin' then
    return new;
  end if;

  if v_override is not null then
    -- Cupo personalizado fijado por el admin
    v_limit := v_override;
  else
    -- Límite del tier activo (default 'free' si no hay fila en subscriptions)
    select coalesce(s.tier, 'free') into v_tier
    from public.subscriptions s
    where s.user_id = new.trainer_id
      and s.status in ('active', 'trialing')
    order by s.created_at desc
    limit 1;

    v_tier := coalesce(v_tier, 'free');

    v_limit := case v_tier
      when 'pro'   then 25
      when 'elite' then 2147483647  -- ilimitado en la práctica
      else 3                         -- free
    end;
  end if;

  select count(*) into v_count
  from public.clients
  where trainer_id = new.trainer_id;

  if v_count >= v_limit then
    raise exception 'CLIENT_LIMIT_REACHED: max % clients', v_limit
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;
