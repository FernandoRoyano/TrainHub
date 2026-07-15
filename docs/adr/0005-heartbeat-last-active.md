# ADR-0005: Heartbeat for real last-access, not `auth.last_sign_in_at`

- **Status:** Accepted
- **Date:** 2026-07-14

## Context

Trainers need to know when a client last *actually used* the app, and to spot clients who have
gone quiet for several days. Two tempting but wrong sources existed in the codebase:

- `clients.updated_at` — only changes when the client record is *edited*, not when the client
  logs in. This is what was shown, so trainers effectively saw the account-creation/edit date.
- `auth.last_sign_in_at` — the real last login, but in a **persistent-session PWA** a client
  opens the installed app daily *without a fresh sign-in*, so it goes stale within days.

## Decision

Track a dedicated `clients.last_active_at`, stamped by a **throttled heartbeat**: on app open,
the client layout calls `POST /api/heartbeat`, which updates the timestamp via the service-role
key (RLS forbids the client updating its own row), but only if the last stamp is null or older
than 15 minutes. Existing clients are back-filled once from `auth.last_sign_in_at` in the
migration so the field isn't empty on day one.

## Consequences

- **+** "Last access" reflects real usage, even with persistent sessions.
- **+** An inactivity signal ("N days without logging in") that is distinct from — and
  complementary to — the workout-based "at risk" signal on the dashboard.
- **−** One extra write per active client roughly every 15 min; negligible, and the throttle
  caps it.
- **−** Requires a service-role route because RLS (correctly) doesn't let a client write its own
  row; a heartbeat is a small privileged surface to maintain.
- **Revisit if:** we need finer-grained analytics (session length, feature usage) — then a
  proper event pipeline replaces the single timestamp.

## Alternatives considered

- **`auth.last_sign_in_at` directly.** Zero schema change, but stale for a persistent-session
  PWA — the exact failure mode we're trying to fix.
- **An RLS UPDATE policy letting clients write only `last_active_at`.** RLS can't easily
  restrict *which columns* a policy permits, so this risks a wider write surface than intended.
