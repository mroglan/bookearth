# 🧭 **Literary Map Explorer — Technical Design (VPS + Docker Edition)**

---

# 1. 🧱 System Overview

## Core Principle

> Design as a distributed system, deploy as a single node.

---

## High-Level Architecture

```text
                    ┌──────────────────────┐
                    │     Reverse Proxy    │
                    │   (Caddy / NGINX)   │
                    └─────────┬────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Frontend    │     │     API      │     │   MinIO      │
│ Next.js      │     │ Node (TS)    │     │ (S3 storage) │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │  Postgres    │
                    │  + PostGIS   │
                    └──────────────┘
                            ▲
                            │
                    ┌──────────────┐
                    │   Worker     │
                    │ (AI pipeline)│
                    └──────────────┘
```

---

# 2. 🐳 Deployment Architecture

## Docker Services

| Service    | Responsibility        |
| ---------- | --------------------- |
| `proxy`    | Routing + HTTPS       |
| `frontend` | React + Cesium UI     |
| `api`      | Data + business logic |
| `db`       | Postgres + PostGIS    |
| `minio`    | Object storage        |
| `worker`   | AI processing         |

---

## docker-compose (Conceptual)

```yaml
services:
  proxy:
    image: caddy

  frontend:
    build: ./frontend

  api:
    build: ./api

  db:
    image: postgis/postgis

  minio:
    image: minio/minio

  worker:
    build: ./worker
```

---

## Key Design Rule

> Every service is independently deployable later.

---

# 3. 🌍 Frontend (3D Map System)

## Stack

* React (Next.js)
* CesiumJS
* Zustand
* React Query

---

## Responsibilities

* 3D Earth rendering
* Camera control (zoom, tilt, pan)
* Event visualization
* Map composition rendering

---

## Core Abstractions

### Map Engine Interface

```ts
interface MapEngine {
  setMapComposition(composition: MapComposition): void;
  setEvents(events: Event[]): void;
  onCameraChange(cb: (viewport) => void): void;
}
```

---

## Zoom-Based Rendering

| Zoom     | Data    |
| -------- | ------- |
| Planet   | Arcs    |
| Regional | Scenes  |
| Local    | Moments |

---

## Data Fetching

```ts
GET /api/books/:id/events?bbox=...&zoomLevel=...
```

---

# 4. 🧠 API Layer

## Stack

* Node.js (TypeScript)
* Express / Fastify

---

## Responsibilities

* Serve events
* Serve map composition
* Handle filtering
* Interface with DB + MinIO

---

## Endpoints

```http
GET /api/books/:id/map-composition
GET /api/books/:id/events
GET /api/events/:id
```

---

## Internal Services

* `EventService`
* `MapService`
* `StorageService` (MinIO)

---

# 5. 🗄️ Database (Postgres + PostGIS)

## Schema

### Books

```sql
books (
  id,
  title,
  author,
  map_composition JSONB
)
```

---

### Events

```sql
events (
  id,
  book_id,
  parent_event_id,
  title,
  description,
  lat,
  lon,
  geom GEOGRAPHY(Point),
  zoom_level,
  importance,
  narrative_index
)
```

---

## Indexing

```sql
CREATE INDEX idx_events_geom ON events USING GIST (geom);
```

---

## Query Pattern

```sql
SELECT *
FROM events
WHERE
  book_id = $1
  AND zoom_level = $2
  AND ST_Intersects(geom, ST_MakeEnvelope(...))
LIMIT 200;
```

---

# 6. 🗺️ Map System (Layer-Based, Hybrid Ready)

## Core Abstraction: MapComposition

```ts
type MapComposition = {
  base: "terrain" | "satellite" | "minimal";

  overlays: Array<{
    type: "borders" | "routes";
    variant: string;
    opacity?: number;
  }>;

  postProcessing?: {
    colorGrade?: "sepia" | "dark" | "muted";
  };
};
```

---

## Rendering Strategy

### Phase 1 (MVP — Raster)

* Base: Cesium terrain
* Overlays: raster tiles (MinIO)
* Styling: shaders

---

### Phase 2 (Hybrid)

* Mix raster + vector

---

### Phase 3 (Advanced)

* Full vector styling

---

# 7. 📦 Object Storage (MinIO)

## Why MinIO

* S3-compatible
* Runs locally
* Easy migration to AWS later

---

## Buckets

```text
maps/
  overlay_name/{z}/{x}/{y}.png

illustrations/
  event_id.png
```

---

## Access Pattern

```ts
getPublicUrl("illustrations/event_123.png")
```

---

# 8. 🤖 Worker System (AI Pipeline)

## Stack

* Python (recommended)
* LLM APIs
* spaCy / NLP

---

## Responsibilities

1. Text ingestion
2. Event extraction
3. Location resolution
4. Hierarchy construction
5. Map composition generation
6. Illustration generation

---

## Execution Modes

### MVP

```bash
docker compose run worker process_book.py
```

---

### Later

* Add queue (Redis)
* Async processing

---

# 9. 🌐 Reverse Proxy

## Use: Caddy (recommended)

---

## Responsibilities

* HTTPS
* Routing
* Compression

---

## Routing

```text
/        → frontend
/api/*   → api
/assets/ → minio
```

---

# 10. ⚡ Performance Strategy

## Techniques

### 1. Spatial Queries

* PostGIS + GIST index

---

### 2. Event Limiting

* Max ~200 per request

---

### 3. Debounced Requests

```ts
debounce(fetchEvents, 200ms)
```

---

### 4. Future Additions

* Redis caching
* CDN (Cloudflare)

---

# 11. 🔐 Backups

## Database

* Daily `pg_dump`

---

## MinIO

* Snapshot or rsync

---

# 12. 🚀 Deployment Flow

## Manual Deploy

```bash
ssh server
git pull
docker compose up -d --build
```

---

## CI/CD (optional)

* GitHub Actions → SSH deploy

---

# 13. 📈 Scaling Path

## Step 1

* Move DB → managed Postgres

## Step 2

* Move MinIO → S3

## Step 3

* Scale API horizontally

## Step 4

* Add CDN

---

## No Rewrite Needed

Because:

* Services are containerized
* Interfaces are clean

---

# 14. 💸 Cost Structure

## VPS

* $10–$20/month

---

## Everything else

* $0 (self-hosted)

---

# 15. 🧪 MVP Scope

* 1–3 books
* ~100 events each
* Raster maps only
* Manual pipeline execution

---

# 16. 🔥 Risks

## 1. Event extraction quality

## 2. Location ambiguity

## 3. Tile performance (no CDN yet)

---

# 17. 🧠 Guiding Principles

* Container-first design
* Layer-based maps
* Engine-agnostic configs
* Offline-heavy processing
* Simple deployment
