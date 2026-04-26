-- Blinda el límite de clientes por tier en BD. La UI también lo enforce, pero
-- un trainer técnico podría llamar a Supabase directamente desde devtools y
-- saltarse la gate. Este trigger lo bloquea de raíz.
--
-- Tier limits (espejo de TIER_LIMITS en src/hooks/use-subscription.ts):
--   free  → 3 clientes
--   pro   → 25 clientes
--   elite → ilimitado

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

drop trigger if exists trg_enforce_client_limit on public.clients;
create trigger trg_enforce_client_limit
  before insert on public.clients
  for each row
  execute function public.enforce_client_limit();
