# ADR-0003: Enforce business rules in the database and the UI

- **Status:** Accepted
- **Date:** 2026-04 (client-limit); extended 2026-07 (admin override)

## Context

Subscription tiers cap how many clients a trainer can have (free 3 / pro 25 / elite ∞). The UI
already hid the "add client" button past the limit. But because the browser talks to Postgres
directly ([ADR-0001](0001-client-side-data-with-rls.md)), a technical user could call the
database from devtools and bypass a UI-only check.

## Decision

Enforce the cap in **two layers**:

1. **Database** — a `BEFORE INSERT` trigger `enforce_client_limit` on `clients` that raises on
   violation. This is the real guarantee.
2. **UI** — the `useSubscription` hook mirrors the same logic to disable the action and explain
   why, for good UX.

The two layers share one precedence rule: **admin (unlimited) → per-trainer override → tier
limit**. When the rule grew (an admin-set custom quota for upsells/comps), *both* layers were
updated together and the migration comment cross-references the hook.

## Consequences

- **+** The limit cannot be bypassed; the UI still gives a friendly experience.
- **+** A clear, documented precedence that lives in one sentence in both the SQL and the TS.
- **−** The rule is expressed twice, so the two must be kept in sync. Mitigated by explicit
  cross-references in comments and by keeping the logic tiny.
- **−** Trigger errors surface as Postgres exceptions; the UI must translate `CLIENT_LIMIT_REACHED`
  into a human message.
- **Revisit if:** business rules grow complex enough that duplicating them is error-prone — then
  centralise in a single RPC called by both.

## Alternatives considered

- **UI-only check.** Rejected: not a real security/business boundary given direct DB access.
- **DB-only check.** Rejected: correct but poor UX (the user only learns the limit *after*
  filling a form and hitting an opaque error).
