# ADR-0007: Wrap `auth.uid()` as `(select auth.uid())` in RLS policies

- **Status:** Accepted
- **Date:** 2026-07-13

## Context

RLS policies filtered rows with `auth.uid() = trainer_id` and, on child tables, an `EXISTS`
subquery also calling `auth.uid()`. Postgres re-evaluates a bare volatile function call like
`auth.uid()` **per row** during a scan. On large scans and under concurrency this is wasted
work, and it compounds across the ~20 policies that reference it. A load test surfaced timeouts
on the heaviest read paths.

## Decision

Wrap the call as `(select auth.uid())` in every policy in `public`. Postgres then evaluates it
**once per statement** (an initplan) instead of once per row. The rewrite was applied
programmatically over `pg_policies` (migration 00044) because some policies had been created in
the dashboard and weren't in the repo. Semantics are identical; only the evaluation frequency
changes. It is the fix recommended by Supabase's own Performance Advisor.

## Consequences

- **+** Fewer per-row function evaluations on every RLS-protected query; measurably better
  behaviour under load.
- **+** Applying it over `pg_policies` also surfaced and normalised dashboard-created policies.
- **−** The migration mutates policies dynamically, which is less obvious to read than static
  `CREATE POLICY` statements; the migration is commented to explain why.
- **Revisit if:** never, really — this is pure upside. It did, however, reveal a deeper process
  gap: policies created via the dashboard drift from the repo (see
  [migration 00045](../../supabase/migrations/00045_dashboard_policies.sql) and the migrations
  gap in [PRODUCTION-READINESS.md](../PRODUCTION-READINESS.md#migrations)).

## Alternatives considered

- **Leave policies as-is.** At current volume it wasn't yet the bottleneck, but it's a known
  cliff and the fix is free — deferring it would be false economy.
- **Denormalise ownership onto child tables** to avoid the `EXISTS` subquery entirely. Bigger
  change, more write-time coupling; not justified once the initplan fix removed the hotspot.
