-- =====================================================
-- 00044: envolver auth.uid() en (SELECT auth.uid()) en TODAS
-- las políticas RLS de public.
--
-- Motivo (medido en load test 13-jul-2026): auth.uid() sin envolver
-- se re-evalúa POR FILA junto con la subquery de la política. El embed
-- de rutina completa (routines→days→exercises→groups) pasaba de 240ms
-- en solitario a >8s bajo 10 usuarios concurrentes, muriendo por
-- statement timeout (57014) en el 42% de los requests.
-- Envuelto en (SELECT ...), Postgres lo evalúa una vez por statement
-- (initplan). Semántica idéntica; es el fix oficial del Performance
-- Advisor de Supabase.
--
-- Se hace dinámicamente sobre pg_policies porque hay políticas creadas
-- desde el dashboard que no están en las migraciones del repo.
-- =====================================================

DO $$
DECLARE
  pol RECORD;
  new_qual text;
  new_check text;
  cmd text;
BEGIN
  FOR pol IN
    SELECT tablename, policyname, qual, with_check
    FROM pg_policies
    WHERE schemaname = 'public'
      AND (
        (qual LIKE '%auth.uid()%' AND qual NOT LIKE '%SELECT auth.uid()%')
        OR
        (with_check LIKE '%auth.uid()%' AND with_check NOT LIKE '%SELECT auth.uid()%')
      )
  LOOP
    new_qual := CASE
      WHEN pol.qual IS NOT NULL AND pol.qual NOT LIKE '%SELECT auth.uid()%'
      THEN replace(pol.qual, 'auth.uid()', '(SELECT auth.uid())')
      ELSE pol.qual
    END;
    new_check := CASE
      WHEN pol.with_check IS NOT NULL AND pol.with_check NOT LIKE '%SELECT auth.uid()%'
      THEN replace(pol.with_check, 'auth.uid()', '(SELECT auth.uid())')
      ELSE pol.with_check
    END;

    cmd := format('ALTER POLICY %I ON public.%I', pol.policyname, pol.tablename);
    IF new_qual IS NOT NULL THEN
      cmd := cmd || format(' USING (%s)', new_qual);
    END IF;
    IF new_check IS NOT NULL THEN
      cmd := cmd || format(' WITH CHECK (%s)', new_check);
    END IF;

    EXECUTE cmd;
    RAISE NOTICE 'Optimizada: %.%', pol.tablename, pol.policyname;
  END LOOP;
END $$;

-- Verificación: debe devolver 0 filas
-- SELECT tablename, policyname FROM pg_policies
-- WHERE schemaname = 'public'
--   AND (qual LIKE '%auth.uid()%' AND qual NOT LIKE '%SELECT auth.uid()%'
--     OR with_check LIKE '%auth.uid()%' AND with_check NOT LIKE '%SELECT auth.uid()%');
