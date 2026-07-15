# Production Readiness

An honest assessment of what is solid, what is a risk, and what would block a paying customer.
The point of this document is not to look finished — it's to show that the gaps are **known,
prioritised, and have a remediation plan**. Being able to name your own red flags is the job.

Legend: ✅ solid · 🟡 risk / tech-debt · 🔴 blocker before a real paying customer.

## Scorecard

| Area | State | Notes |
|---|---|---|
| Security (authz) | ✅ | RLS is the boundary; policies audited; `(select auth.uid())` initplan fix |
| Testing | ✅ | 490 unit + Playwright E2E + a load-test harness |
| Performance | ✅ | Cache strategy measured; capacity load-tested (~40 concurrent, 2 orders of magnitude of headroom) |
| GDPR / legal | 🟡 | Baseline built; needs professional review + owner's legal details |
| Payments | ✅ | Idempotent webhook; multi-currency; **tested E2E in test mode** |
| Migrations workflow | 🔴 | Applied by hand in the SQL editor — not CI-driven |
| Secrets management | 🔴 | Keys were exposed during setup; env vars had `\r\n`; Stripe account shared |
| CI/CD | ✅ | GitHub Actions: typecheck + lint + tests + build, all merge-blocking |
| Observability | 🔴 | No error tracking, structured logging or uptime monitoring |
| Backups / DR | 🔴 | Supabase free tier has no automated backups |
| Environments | 🟡 | Local + prod only; no staging |
| Branching / review | 🟡 | Commits to `main`; no PR review (solo) |

## Blockers before a paying customer (🔴)

### Migrations
Schema changes are written as versioned SQL in `supabase/migrations/` **but applied manually**
by pasting into the Supabase SQL editor. This means the DB can drift from the repo (it did — see
[migration 00045](../supabase/migrations/00045_dashboard_policies.sql), which reconciled
dashboard-created policies back into version control).
**Remediation:** run `supabase db push` from CI on merge to `main`, with the migration files as
the single source of truth; forbid dashboard schema edits.

### Secrets
During setup, Stripe keys were pasted in plaintext and some Vercel env vars carried trailing
`\r\n`/BOM (added via CLI on Windows) that silently broke payments in production. The Stripe
account is shared with another product.
**Remediation:** rotate every exposed key; adopt a secrets policy (never in chat/commits;
`printf '%s'` not `echo` when setting via CLI); separate the Stripe account per product;
consider a secrets manager.

### Observability
There is no way to know a production error happened unless a user reports it.
**Remediation:** Sentry (client + server), structured logs, an uptime check, and alerting on the
Stripe webhook and cron.

### Backups / DR
Free-tier Supabase keeps no automated backups; a data loss is unrecoverable.
**Remediation:** Supabase Pro (daily backups + PITR) *before* the first paying customer;
document a restore procedure.

## Risks / tech-debt (🟡)

- **GDPR text** is a structured baseline that must be reviewed by a professional and have the
  owner's legal identity filled in ([ADR-0006](adr/0006-gdpr-health-data.md)).
- **No staging environment** — changes are validated locally then go to prod. A staging project
  mirroring prod would de-risk migrations and Stripe.
- **Solo Git flow** — direct commits to `main`. In a team: feature branches, PRs, required CI
  checks, review. The CI added here is the first step.
- **Rate limiting** uses an in-memory `Map` (`src/lib/simple-rate-limit.ts`) — fine for one
  instance, leaks across many; move to Upstash/Redis if it scales.
- **CSP** still uses `'unsafe-inline'` for Next.js compatibility; tightening with nonces is a
  larger change.

## What's genuinely solid (✅) — and worth saying in an interview

- **Authorisation model**: RLS enforced in the database, audited for drift, tuned for load.
- **Testing depth**: not just unit tests — an E2E suite and a load test that *changed an
  architecture decision* ([ADR-0002](adr/0002-flat-queries-over-nested-embeds.md)).
- **Performance work is measured**, not vibes: dashboard 15 requests → 1 RPC, p50 ~500 → ~162 ms;
  capacity sized against real concurrency.
- **Payments** verified end-to-end (Checkout → webhook → plan activation → billing portal) in
  test mode, idempotent, multi-currency.

## Incident log

A short record of production incidents and what they taught — kept because post-mortems are how
teams get better.

- **2026-07-14 — Payments silently broken in prod.** Stripe env vars in Vercel had trailing
  `\r\n`/BOM from CLI-on-Windows; the secret key, webhook secret and price IDs were all
  malformed at runtime. Impact: payments never actually worked in production (undetected — no
  real checkout had run yet). Found while adding multi-currency, by verifying the live prices
  instead of trusting "it deployed". Fix: rewrote the 9 vars cleanly + redeploy. Lesson: *"it
  deployed" ≠ "it works"*; verify the running system, and treat CLI env entry on Windows as
  hostile to whitespace.
- **2026-07-13 — RLS policy drift.** Policies granting clients access to their routines existed
  only in the database, not in the repo migrations — a rebuild from migrations would have locked
  clients out. Found by diffing `pg_policies` against the repo. Fix:
  [migration 00045](../supabase/migrations/00045_dashboard_policies.sql). Lesson: the database is
  not a source of truth; the migrations are — enforce it (see Migrations blocker).

## Remediation order (if this were going to a real customer)

1. Rotate exposed secrets · separate Stripe account.
2. Migrations via CI; forbid dashboard schema edits.
3. Supabase Pro (backups) + documented restore.
4. Sentry + uptime + webhook/cron alerting.
5. Staging environment.
6. Legal review + owner details.
