# ADR-0004: Multi-currency via Stripe `currency_options`, not Adaptive Pricing

- **Status:** Accepted
- **Date:** 2026-07-14

## Context

Trainers outside the euro zone (e.g. Mexico) were quoted in EUR at Checkout. We want buyers to
see and pay in their local currency (USD, MXN) while we still settle in EUR. Stripe offers two
mechanisms:

- **Adaptive Pricing** — an account-level toggle; Stripe auto-converts and shows local currency.
- **`currency_options`** — per-price fixed amounts you set for each currency.

A hard constraint: the Stripe account is **shared with another project** (WellnessReal), so
any account-level setting would affect the other product's Checkout too.

## Decision

Use **`currency_options`** on the four TrainHub prices (EUR/USD/MXN, monthly & yearly). This is
scoped per-price, so it doesn't touch the shared account's other products. Amounts are set with
a small margin over the spot rate and keep the yearly discount.

## Consequences

- **+** Buyers see local currency; settlement stays in EUR; the shared account is untouched.
- **+** Full control of the exact displayed price per currency (no FX surprises for the buyer).
- **−** Prices are manually maintained per currency; large FX moves require an update.
- **−** More price configuration to keep in sync with `src/lib/stripe/plans.ts`.
- **Revisit if:** the Stripe account is separated — Adaptive Pricing then becomes attractive for
  its automatic coverage of many currencies.

## Alternatives considered

- **Adaptive Pricing.** Simplest and covers many currencies automatically, but account-level →
  would change WellnessReal's Checkout. Rejected due to the shared-account constraint.
- **Do nothing (EUR only).** Any card can still pay a EUR price, but showing foreign buyers a
  foreign-currency amount hurts conversion.

## Note

While implementing this, a verification step revealed the Stripe env vars in production
carried trailing `\r\n` (added via CLI on Windows), which had **silently broken payments in
production**. Caught and fixed before it reached a real customer — a reminder that "it
deployed" ≠ "it works". See the incident note in
[PRODUCTION-READINESS.md](../PRODUCTION-READINESS.md#incident-log).
