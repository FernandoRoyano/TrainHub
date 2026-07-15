# ADR-0001: Client-side data fetching with RLS instead of a backend API layer

- **Status:** Accepted
- **Date:** 2026-03 (documented retroactively 2026-07)

## Context

TrainHub is multi-tenant: every trainer must see only their own clients and data. A classic
approach is a backend API (controllers + service layer) that authorises each request. Supabase
offers an alternative: the browser talks to PostgreSQL directly with an anon key, and
**Row-Level Security** policies authorise every row. The product is solo-built and needs to
ship fast without a hand-written, hand-secured endpoint for every entity.

## Decision

Fetch data **directly from the browser** through a thin per-domain service layer
(`src/services/*`) using the RLS-scoped Supabase client. Authorisation is expressed once, in
Postgres policies, not repeated in application code. Only operations that must exceed the
user's own rights (Stripe, admin, cron, invitations) get a server-side `/api/*` route using
the service-role key.

## Consequences

- **+** Authorisation lives in one place (the database) and is enforced even if the frontend
  is bypassed via devtools — the frontend is explicitly *not* a trust boundary.
- **+** No boilerplate CRUD endpoints; feature velocity is high.
- **−** Security correctness now depends on RLS policy correctness. This raised the stakes of
  policy quality and led to [ADR-0007](0007-rls-initplan-optimization.md) (performance) and a
  policy-drift audit ([migration 00045](../../supabase/migrations/00045_dashboard_policies.sql)).
- **−** No natural server-side cache; caching is a client concern (TanStack Query) and query
  shape matters a lot under load ([ADR-0002](0002-flat-queries-over-nested-embeds.md)).
- **Revisit if:** we need server-only business logic that's awkward in SQL/RPCs, or a public
  API for third parties.

## Alternatives considered

- **Dedicated backend (NestJS/Express).** More control and a place for complex logic, but
  duplicates the auth boundary Postgres already gives us and is heavier for a solo build.
- **Next.js Route Handlers for everything.** Would centralise data access server-side, but
  loses RLS's per-row guarantee unless re-implemented, and adds a hop for every read.
