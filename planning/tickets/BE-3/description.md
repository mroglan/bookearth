# Metadata
Status: DONE

Epic: MVP

# User Statement

As a maintainer of Book Earth, I want a single docker-compose setup that runs the full core stack (proxy, API, frontend, and PostGIS) with persistent storage, so that I can boot the MVP locally with one command and have a stable environment for further development.

# Notes
- This ticket consolidates MVP backlog items BE-3 (docker-compose orchestration), BE-4 (reverse proxy routing), BE-5 (persistent volume), and BE-6 (Postgres + PostGIS ready).
- See `planning/opening-design/repo_structure.md` for structure guidance and sample compose/proxy layouts.
- Align with Node.js 24 runtime expectations.
- If any existing Dockerfiles require adjustment for compose, do so here.

# Acceptance Criteria
- `docker compose up` runs proxy, frontend, API, and Postgres with PostGIS enabled.
- Frontend is accessible at `/` via the proxy.
- API is reachable at `/api/*` via the proxy.
- Static file serving works at `/assets/*` from the shared `/data` volume.
- A shared `/data` volume persists files written by the API across restarts.
- Database container has PostGIS extension enabled and ready for use.
