# Architecture Decision Records

An ADR captures a single architectural decision: its **context**, the **decision** taken, and
its **consequences** (including the downsides). They are immutable — if a decision changes, a
new ADR supersedes the old one rather than editing history.

Why keep them: six months from now, "why is it built this way?" has a written answer, and a
new teammate can understand the *reasoning*, not just the code.

| # | Title | Status |
|---|---|---|
| [0001](0001-client-side-data-with-rls.md) | Client-side data fetching with RLS instead of a backend API layer | Accepted |
| [0002](0002-flat-queries-over-nested-embeds.md) | Flat batched queries over nested PostgREST embeds | Accepted (reversed a prior choice) |
| [0003](0003-defense-in-depth-business-rules.md) | Enforce business rules in the database and the UI | Accepted |
| [0004](0004-multi-currency-currency-options.md) | Multi-currency via Stripe `currency_options`, not Adaptive Pricing | Accepted |
| [0005](0005-heartbeat-last-active.md) | Heartbeat for real last-access, not `auth.last_sign_in_at` | Accepted |
| [0006](0006-gdpr-health-data.md) | Explicit consent & handling for GDPR special-category health data | Accepted |
| [0007](0007-rls-initplan-optimization.md) | Wrap `auth.uid()` as `(select auth.uid())` in RLS policies | Accepted |

**Template:** [`_template.md`](_template.md).
