# Metadata
Status: TODO

Epic: MVP

# User Statement

As a maintainer of Book Earth, I want the MVP API surface (server boot, core endpoints, and local storage) implemented in one pass, so that the frontend can query real map data and asset URLs without waiting on multiple backend tickets.

# Notes
- This ticket consolidates MVP backlog items BE-9 (API Server Boot), BE-10 (Events Endpoint), BE-11 (Map Composition Endpoint), and BE-12 (StorageService).
- Coordinate with BE-3 for proxy routing and shared `/data` volume, and BE-4 for schema + seed data.
- API endpoints should live under `/api/*` and respect the MVP constraints from the epic.
- Refer to `planning/opening-design/technical.md` for map composition, storage layout, and API responsibilities context.

# Acceptance Criteria
- API server boots and `/health` returns OK.
- Database connection works against the PostGIS container.
- `GET /api/books/:id/events` accepts `bbox` + `zoomLevel` and returns at most 200 events using PostGIS filtering.
- `GET /api/books/:id/map-composition` returns JSON config data.
- Storage service can write + read files from `/data` and returns `/assets/...` URLs.
