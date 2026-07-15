# ADR-0006: Explicit consent & handling for GDPR special-category health data

- **Status:** Accepted
- **Date:** 2026-07-13

## Context

TrainHub stores body measurements, injuries/limitations, fasting logs and an optional
**menstrual-cycle module**. Under GDPR these are *special-category* data (Art. 9) — the
highest bar. The product targets the EU (Spain) and, before charging money, must have a lawful
basis, consent, and the mandatory legal pages. None existed: no privacy policy, terms, or
consent capture.

## Decision

Treat compliance as a launch blocker and build the minimum correct baseline:

1. **Public legal pages** (`/privacy`, `/terms`, `/legal`), bilingual, covering the Art. 9
   processing explicitly, the processor chain (Supabase, Vercel, Stripe, Google, Cloudflare)
   and data-subject rights.
2. **Explicit consent at sign-up** — a required checkbox (Zod-validated) linking to the terms
   and privacy policy, for both trainer and client-by-invite flows.
3. **Auditable record** — `terms_accepted_at` + `terms_version` stored in auth metadata on
   registration.
4. **Trainer/TrainHub relationship** framed as controller/processor (Art. 28) in the policy.

## Consequences

- **+** A defensible baseline for handling health data and charging EU customers.
- **+** Consent is provable (timestamp + version), not implied.
- **−** The legal text is a structured baseline that still needs review by a qualified
  professional and the real business owner's details before commercial launch — flagged in
  [PRODUCTION-READINESS.md](../PRODUCTION-READINESS.md).
- **Revisit if:** new special-category processing is added, or the processor chain changes.

## Alternatives considered

- **Ship first, comply later.** Rejected: with Art. 9 data this is a real sanction risk, not
  paperwork.
- **Drop the menstrual-cycle module to avoid Art. 9.** Rejected: it's a differentiating feature;
  the correct answer is to handle the data lawfully, not to remove value.
