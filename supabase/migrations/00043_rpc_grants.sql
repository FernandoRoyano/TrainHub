-- =====================================================
-- 00043: cerrar EXECUTE heredado de PUBLIC en los RPCs
-- El REVOKE de 00042 solo quitaba el grant directo a anon;
-- el grant implícito a PUBLIC seguía dejando ejecutar a anon
-- (sin sesión devuelve ceros, pero no debe ser invocable).
-- =====================================================

REVOKE EXECUTE ON FUNCTION public.get_dashboard_stats(date, timestamptz) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_sidebar_badges() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_dashboard_stats(date, timestamptz) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_sidebar_badges() FROM anon;

GRANT EXECUTE ON FUNCTION public.get_dashboard_stats(date, timestamptz) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_sidebar_badges() TO authenticated, service_role;
