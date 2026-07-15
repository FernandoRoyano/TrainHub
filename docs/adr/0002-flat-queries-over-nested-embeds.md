# ADR-0002: Flat batched queries over nested PostgREST embeds

- **Status:** Accepted — reverses an earlier optimisation
- **Date:** 2026-07-13

## Context

Loading a full routine or meal plan means reading a 3-level tree
(`routine → days → groups → exercises → exercise`). The elegant PostgREST way is a single
**nested embed**:

```
.select("*, routine_days(*, exercise_groups(*), routine_exercises(*, exercise:exercises(*)))")
```

It was faster in isolation (one round-trip) and the plan looked good. We shipped it as part of
a caching/perf pass.

## Decision

**Revert to flat, batched queries** (`routines`, then `routine_days`, then
`routine_exercises` + `exercise_groups` via `.in()`), assembled in JS. Shared helpers
`fetchRoutineDetail` / `fetchMealPlanDetail` are used by both the trainer and client views.

## Why — the evidence

A **load test with real user sessions** (RLS active) drove the decision:

| Scenario | Solo request | 10 concurrent, sustained |
|---|---|---|
| Nested embed | ~240 ms | **100% statement timeouts (57014)** |
| Flat batched `.in()` | ~1 s | 0 errors |

Under concurrency, the single big query — `json_agg` across four RLS-protected tables — became
a query-plan cliff on the shared instance. The flat pattern, though slower alone, degraded
gracefully. **Measurement beat intuition.**

## Consequences

- **+** The hot paths (opening a routine / plan, on both trainer and client apps) survive
  concurrency instead of collapsing.
- **+** One shared assembler per entity removed duplicated trainer/client code.
- **−** Slightly slower single-request latency and more application-side assembly code.
- **−** A code comment now warns future contributors *not* to "optimise" this back into a
  nested embed without re-running the load test.
- **Revisit if:** we move to a larger Supabase compute tier where the query planner handles
  the aggregation under load, or add read replicas.

## Alternatives considered

- **Keep the embed, add indexes.** Indexes (00041) helped solo latency but did not prevent the
  concurrency collapse — the bottleneck was the plan, not missing indexes.
- **A `SECURITY DEFINER` RPC returning the tree.** Would bypass per-row RLS re-evaluation but
  moves the authorisation logic into the function (riskier for a solo dev) for a gain the flat
  pattern already delivers.
