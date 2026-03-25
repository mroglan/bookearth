# Go Backend Feasibility Evaluation (BE-9)

Date: 2026-03-24

## Executive Summary
The current API is small, stable, and performance-sensitive mostly around database queries and static asset delivery, not application CPU. Moving the API to Go is feasible, but it is unlikely to deliver meaningful MVP value right now relative to the time cost and the team’s Go experience. If the goal is learning or long-term performance headroom, a staged approach (pilot service or shadow API) is safer than a full rewrite.

Recommendation: **Defer a full Go rewrite until there is concrete performance pain or scale requirements.** If you want to proceed anyway, do it incrementally with tight parity tests and a migration plan.

## Current Backend Snapshot (from repo + design notes)
- API: Node.js + TypeScript + Express
- Scope: small REST surface (`/health`, `/books/:id/events`, `/books/:id/map-composition`)
- DB: Postgres + PostGIS, spatial queries are the likely bottleneck
- Storage: filesystem-backed assets
- Deployment: Dockerized services on a single VPS

## Pros of Moving the API to Go
- **Runtime performance and latency headroom**: lower baseline CPU/memory usage, better throughput for concurrent requests.
- **Static binaries + simpler deploys**: smaller container runtime footprint, easy to run without Node.
- **Strong standard library**: HTTP, concurrency, and tooling are robust and stable.
- **Operational safety**: fewer runtime surprises (no transpilation/JS engine quirks).
- **Long-term scaling**: if the API becomes heavier (complex queries, aggregation, caching), Go can help.

## Cons / Risks
- **Learning curve**: the primary developer has minimal Go experience, which will slow velocity.
- **Rewrite cost**: even a small API needs config handling, validation, auth scaffolding, migrations, logging, and tests.
- **Ecosystem mismatch**: the repo is already TypeScript across API + frontend; switching stacks adds complexity.
- **Marginal performance gain for MVP**: the bottleneck is likely Postgres/PostGIS, filesystem IO, or tile delivery, not Node CPU.
- **Risk of regressions**: the API is already working; rewrite can introduce subtle behavior changes.

## Opportunity Cost
- Time spent rewriting the API likely delays MVP features (map UX, data pipeline, event density logic, etc.).
- The same time could improve the existing API with focused optimizations (DB indexes, query tuning, caching).

## Alternative Options (Lower Risk)
- **Stay on Node for MVP**, add perf profiling + DB indexes as needed.
- **Build a small Go pilot service** (e.g., a read-only `/books/:id/events` endpoint) and compare latency + ops overhead.
- **Use Go for the worker or future data pipeline**, where throughput and concurrency might matter more.

## Decision Gates (When Go Becomes Justified)
- The API becomes CPU-bound after DB tuning (verified by profiling).
- QPS increases beyond what the current Node service handles comfortably.
- Multiple services emerge and you want a consistent, low-footprint runtime.

## If You Want to Continue
I can provide a detailed migration plan with:
- tech stack choices (router, DB, migrations, config, logging, testing)
- endpoint parity checklist
- data model mapping
- docker + deployment steps
- phased rollout (shadow mode or reverse-proxy split)

Say the word and I’ll write the plan.
