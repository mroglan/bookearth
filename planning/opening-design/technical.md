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
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│  Frontend    │     │     API      │     │   Local Storage   │
│ Next.js      │     │ Node (TS)    │     │   (/data volume)  │
└──────────────┘     └──────┬───────┘     └──────────────────┘
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
    volumes:
      - data:/data

  db:
    image: postgis/postgis

  worker:
    build: ./worker
    volumes:
      - data:/data

  # Optional future replacement for filesystem:
  # seaweedfs:
  #   image: chrislusf/seaweedfs
  #   command: "server -dir=/data -s3"

volumes:
  data:
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
* Interface with DB + StorageService

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
* `StorageService` (filesystem-backed, S3-compatible interface)

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
* Overlays: raster tiles (filesystem-served)
* Styling: shaders

---

### Phase 2 (Hybrid)

* Mix raster + vector

---

### Phase 3 (Advanced)

* Full vector styling

---

# 7. 📦 Object Storage (Filesystem with Future S3 Compatibility)

## Philosophy

> Use the local filesystem now, but design as if using S3.

---

## Storage Layout

```text
/data
  /maps
    /overlay_name/{z}/{x}/{y}.png

  /illustrations
    /event_id.png
```

---

## Access Pattern

```ts
getPublicUrl("illustrations/event_123.png")
→ /assets/illustrations/event_123.png
```

---

## Reverse Proxy Serving

### Caddy Example

```caddy
handle /assets/* {
  root * /data
  file_server
}
```

---

## Storage Abstraction (Critical)

### Interface (stable, never changes)

```ts
interface StorageService {
  getPublicUrl(path: string): string;

  putObject(path: string, data: Buffer): Promise<void>;

  getObject(path: string): Promise<Buffer>;

  deleteObject(path: string): Promise<void>;
}
```

---

### Local Implementation (MVP)

```ts
class LocalStorageService implements StorageService {
  basePath = "/data";

  getPublicUrl(path: string) {
    return `${process.env.ASSET_BASE_URL || ""}/assets/${path}`;
  }

  async putObject(path: string, data: Buffer) {
    const fullPath = `${this.basePath}/${path}`;
    await fs.promises.mkdir(dirname(fullPath), { recursive: true });
    await fs.promises.writeFile(fullPath, data);
  }

  async getObject(path: string) {
    return fs.promises.readFile(`${this.basePath}/${path}`);
  }

  async deleteObject(path: string) {
    return fs.promises.unlink(`${this.basePath}/${path}`);
  }
}
```

---

## Future Migration (No Rewrite Required)

Swap implementation only:

* SeaweedFS (S3 gateway)
* Garage (S3-compatible)
* AWS S3 / Cloudflare R2

```ts
const storage: StorageService =
  process.env.STORAGE === "s3"
    ? new S3StorageService()
    : new LocalStorageService();
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
6. Illustration generation (saved to `/data/illustrations`)
7. Tile generation (saved to `/data/maps`)

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
* Static asset serving

---

## Routing

```text
/        → frontend
/api/*   → api
/assets/ → local filesystem (/data)
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

### 4. Static Asset Efficiency

* OS-level file caching
* Proxy-level caching headers

---

### 5. Future Additions

* Redis caching
* CDN (Cloudflare)
* Object storage (S3-compatible)

---

# 11. 🔐 Backups

## Database

* Daily `pg_dump`

---

## Filesystem (`/data`)

* rsync to backup server
* Snapshot (provider-level)

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

* Replace filesystem with S3-compatible storage

  * SeaweedFS
  * Garage
  * AWS S3 / R2

## Step 3

* Scale API horizontally

## Step 4

* Add CDN

---

## No Rewrite Needed

Because:

* Storage is abstracted
* Services are containerized
* Interfaces are stable

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

## 4. Single-node storage durability

---

# 17. 🧠 Guiding Principles

* Container-first design
* Layer-based maps
* Engine-agnostic configs
* Storage abstraction from day one
* Offline-heavy processing
* Simple deployment
