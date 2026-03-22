# 🧭 1. Monorepo Strategy (Recommended)

## Why monorepo?

* Shared types (events, map config)
* Easier local dev (`docker compose -f infrastructure/prod/docker-compose.yml up`)
* Simpler deployment (one repo → one VPS)
* Clean coordination between API, worker, and storage layer

---

## Top-Level Structure

```text
literary-map-explorer/
│
├── apps/                # User-facing services
│   ├── frontend/        # Next.js (React + Cesium)
│   ├── api/             # Node API (REST/GraphQL)
│   └── worker/          # Python AI pipeline
│
├── packages/            # Shared code
│   ├── types/           # Shared TypeScript types
│   ├── config/          # Shared configs (ESLint, TS, etc.)
│   └── utils/           # Shared utilities
│
├── infrastructure/      # Deployment + infra config
│   ├── prod/
│   │   ├── docker-compose.yml
│   │   ├── initdb/      # Postgres init scripts
│   │   └── proxy/       # Caddy / NGINX config
│   ├── test/
│   │   ├── docker-compose.yml
│   │   └── initdb/      # Test Postgres init scripts
│   └── scripts/         # deploy, backup, etc.
│
├── data/                # Local filesystem storage (mounted volume)
│   ├── maps/            # Raster tiles
│   └── illustrations/   # Generated images
│
├── .env
├── package.json         # root workspace config
└── README.md
```

---

# 🧱 2. Apps Layer (Core Services)

---

## 🌍 `apps/frontend/`

```text
frontend/
├── app/                # Next.js app router
├── components/
│   ├── map/
│   │   ├── MapView.tsx
│   │   ├── useMapEngine.ts
│   │   └── layers/
│   ├── event/
│   └── ui/
├── lib/
│   ├── api.ts          # API client
│   └── hooks/
├── styles/
├── public/
├── next.config.js
└── package.json
```

---

## 🔌 `apps/api/`

```text
api/
├── src/
│   ├── routes/
│   │   ├── books.ts
│   │   ├── events.ts
│   │   └── map.ts
│   │
│   ├── services/
│   │   ├── eventService.ts
│   │   ├── mapService.ts
│   │   └── storage/
│   │       ├── index.ts              # interface + factory
│   │       ├── storageService.ts     # interface definition
│   │       ├── localStorage.ts       # filesystem implementation
│   │       └── s3Storage.ts          # future implementation
│   │
│   ├── db/
│   │   ├── client.ts
│   │   └── queries/
│   │
│   ├── middleware/
│   ├── utils/
│   └── index.ts
│
├── prisma/ OR sql/     # schema/migrations (choose one)
├── package.json
└── tsconfig.json
```

---

## 🤖 `apps/worker/`

```text
worker/
├── src/
│   ├── pipeline/
│   │   ├── extract_events.py
│   │   ├── resolve_locations.py
│   │   ├── build_hierarchy.py
│   │   └── generate_map_config.py
│   │
│   ├── services/
│   │   ├── llm_client.py
│   │   ├── geocoder.py
│   │   └── storage.py        # mirrors API storage abstraction
│   │
│   ├── models/               # pydantic schemas
│   └── main.py
│
├── requirements.txt
└── Dockerfile
```

---

# 🧩 3. Shared Packages

---

## 📦 `packages/types/`

This is **critical**.

```text
types/
├── src/
│   ├── event.ts
│   ├── map.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

---

### Example: `event.ts`

```ts
export type Event = {
  id: string;
  title: string;
  description: string;
  lat: number;
  lon: number;
  zoomLevel: "arc" | "scene" | "moment";
  importance: number;
};
```

---

### Example: `map.ts`

```ts
export type MapComposition = {
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

## Why this matters

* Frontend + API stay in sync
* No schema drift
* Easier refactoring

---

# 🐳 4. Infrastructure Layer

---

## `infrastructure/prod/`

```text
├── docker-compose.yml
├── initdb/
└── proxy/
```

---

## `infrastructure/test/`

```text
test/
└── docker-compose.yml
```

---

## Key Update: Shared Data Volume

```yaml
services:
  api:
    volumes:
      - data:/data

  worker:
    volumes:
      - data:/data

  proxy:
    volumes:
      - data:/data

volumes:
  data:
```

---

## `infrastructure/prod/proxy/`

```text
proxy/
├── Caddyfile
```

---

## Example `Caddyfile`

```text
yourdomain.com {
  reverse_proxy /api/* api:4000
  reverse_proxy /* frontend:3000

  handle /assets/* {
    root * /data
    file_server
  }
}
```

---

## `infrastructure/scripts/`

```text
scripts/
├── deploy.sh
├── backup-db.sh
├── backup-data.sh      # NEW: backs up /data
└── seed-data.sh
```

---

# ⚙️ 5. Root Configuration

---

## Root `package.json`

Use workspaces:

```json
{
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

---

## Optional: Use Turborepo

Turborepo

Adds:

* Caching
* Parallel builds
* Better DX

---

# 🔄 6. Data Flow (How Everything Connects)

---

## Frontend → API

```ts
GET /api/books/:id/events
```

---

## API → DB

* PostGIS queries

---

## API → Storage (filesystem via abstraction)

```ts
storage.getPublicUrl("illustrations/event_123.png")
```

---

## Worker → DB + Storage

```text
Book → Events → DB
Images → /data/illustrations
Tiles → /data/maps
Map config → DB
```

---

## 🔁 Future (No Code Changes)

```text
StorageService → S3-compatible backend
```

---

# 🧪 7. Local Development Flow

---

## Start everything

```bash
docker compose -f infrastructure/prod/docker-compose.yml up
```

---

## Access

* Frontend: `localhost:3000`
* API: `localhost:4000`
* Assets: `localhost/assets/...`

---

## Local Data

```text
/data → persisted via Docker volume
```

---

# 🚀 8. Why This Structure Works

---

## Today (Single VPS)

* Everything runs together
* Files stored locally
* Minimal infra complexity

---

## Tomorrow (Scaling)

You can split:

* `api` → separate service
* `worker` → async cluster
* `frontend` → CDN
* filesystem → S3 (SeaweedFS, Garage, R2, S3)

---

## Without changing repo structure

---

# 🔥 9. Opinionated Improvements

---

## 1. Keep API thin

* No business logic in routes
* Push into services

---

## 2. Storage abstraction is non-negotiable

* Never access `/data` directly outside storage layer
* Guarantees painless migration later

---

## 3. Keep worker independent

* No coupling to API
* Only DB + storage

---

## 4. Version your pipeline outputs

```json
{
  "version": 1,
  "events": [...]
}
```

---

## 5. Treat `/data` like an external system

Even though it’s local:

* Back it up
* Don’t assume durability
* Don’t tightly couple paths

---

# 🧠 Final Take

This repo structure now gives you:

* **Maximum simplicity today** (filesystem, single VPS)
* **Zero lock-in tomorrow** (S3-compatible abstraction ready)
* Clean separation of concerns
* Strong alignment between API, worker, and storage
* A frictionless path to scale without rewrites
