# Go Backend Migration Plan (Single-Swoop) — BE-9

Date: 2026-03-24

## Recommendation Framing (Long-Term Direction)
Given the product direction (3D globe UX, PostGIS-heavy queries, asset serving, and an AI pipeline), the backend will need:
- Reliable, low-footprint request handling as traffic grows.
- Clean boundaries for services (API, worker, storage).
- Durable performance under concurrent read-heavy workloads.

A full Go rewrite now can be justified **if** you treat this as a foundational platform decision and are willing to invest in tooling, testing, and data access rigor. Since there is no production yet, a single-swoop migration is viable, but it must be structured to avoid regressions and to preserve forward compatibility with the rest of the system.

## Goals
- Replace Node/TS API with a Go API that is **feature-parity** with current endpoints.
- Preserve current DB schema + PostGIS usage.
- Keep deployment workflow (Docker, single VPS) compatible.

## Non-Goals (for MVP)
- Do not change DB schema during migration.
- Do not implement new endpoints beyond existing ones.

## Proposed Go Stack
- Router: `chi` (lightweight, idiomatic)
- DB: `pgx` with connection pool
- Config: `envconfig` or `viper` (prefer minimal)
- Validation: `go-playground/validator`
- Logging: `zap` or `slog` (standard library in Go 1.21+)
- Migrations: `golang-migrate` (for future changes; can be added later)
- Testing: `testify` + `httptest`

## High-Level Architecture (Matches Existing)
- HTTP server with routes:
  - `GET /health`
  - `GET /books/:id/events`
  - `GET /books/:id/map-composition`
- DB module with pool + query helpers.
- Environment-based config (dev/test/prod).

## Migration Plan (Single Swoop)

### Phase 1 — Go Service Skeleton
- Create `backend/` folder (this will replace `/api`).
- Add `go.mod`, `Dockerfile`, and minimal server that responds to `/health`.
- Implement config loading for DB + data dir + CORS.
- Add CORS middleware matching current behavior.

### Phase 2 — DB + Models
- Implement DB pool using `pgx`.
- Create data models that match current API responses:
  - `EventRow` fields (id, book_id, parent_event_id, title, description, lat, lon, importance, narrative_index)
  - `MapComposition` as `map[string]any` (JSONB)
- Implement repository queries:
  - `fetchEventsByBook(bookId)`
  - `fetchMapCompositionByBook(bookId)`

### Phase 3 — Endpoint Parity
- Implement controllers for `/books/:id/events` and `/books/:id/map-composition`.
- Match validation semantics from Node:
  - missing/empty book id → 400
  - missing book → 404
- Add `/health` endpoint with DB connectivity check.

### Phase 3 — Switch-Over
- Update `docker-compose` to use Go API container.
- Remove Node API from compose.
- Run smoke tests locally.


### Phase 5 — Tests + Fixtures
- Add basic integration tests for endpoints.
- These tests should be similar to those in `/api` currently (i.e. should assume dev database is up, and just hit the api queries to confirm output is correct)


### Phase 6 — Cleanup
- Remove `api/` .
- Update docs to reflect Go stack.

## Risks + Mitigations
- **Learning curve**: keep the API thin; follow idiomatic Go patterns.
- **Behavior drift**: baseline tests + response fixture diffing.
- **DB performance**: no changes to schema; reuse PostGIS queries.
