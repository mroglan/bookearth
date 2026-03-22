# 🧭 1. Monorepo Strategy (Recommended)

## Why monorepo?

* Shared types (events, map config)
* Easier local dev (`docker compose up`)
* Simpler deployment (one repo → one VPS)

---

## Top-Level Structure

```text
literary-map-explorer/
│
├── apps/                # User-facing services
│   ├── frontend/       # Next.js (React + Cesium)
│   ├── api/            # Node API (REST/GraphQL)
│   └── worker/         # Python AI pipeline
│
├── packages/           # Shared code
│   ├── types/          # Shared TypeScript types
│   ├── config/         # Shared configs (ESLint, TS, etc.)
│   └── utils/          # Shared utilities
│
├── infrastructure/     # Deployment + infra config
│   ├── docker/
│   │   ├── docker-compose.yml
│   │   └── Dockerfiles/
│   ├── proxy/          # Caddy / NGINX config
│   └── scripts/        # deploy, backup, etc.
│
├── data/               # (optional) local dev data
│
├── .env
├── package.json        # root workspace config
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
│   │   └── storageService.ts
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
│   │   └── storage.py
│   │
│   ├── models/        # pydantic schemas
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

## `infrastructure/docker/`

```text
docker/
├── docker-compose.yml
└── Dockerfiles/
    ├── frontend.Dockerfile
    ├── api.Dockerfile
    └── worker.Dockerfile
```

---

## `infrastructure/proxy/`

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
}
```

---

## `infrastructure/scripts/`

```text
scripts/
├── deploy.sh
├── backup-db.sh
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

## API → MinIO

```ts
getImageUrl(eventId)
```

---

## Worker → DB + MinIO

```text
Book → Events → DB
Images → MinIO
Map config → DB
```

---

# 🧪 7. Local Development Flow

---

## Start everything

```bash
docker compose up
```

---

## Access

* Frontend: `localhost:3000`
* API: `localhost:4000`
* MinIO: `localhost:9000`

---

# 🚀 8. Why This Structure Works

---

## Today (Single VPS)

* Everything runs together
* Simple deploy

---

## Tomorrow (Scaling)

You can split:

* `api` → separate service
* `worker` → async cluster
* `frontend` → CDN
* `minio` → S3

---

## Without changing repo structure

---

# 🔥 9. Opinionated Improvements

---

## 1. Keep API thin

* No business logic in routes
* Push into services

---

## 2. Keep worker independent

* No coupling to API
* Only DB + storage

---

## 3. Version your pipeline outputs

```json
{
  "version": 1,
  "events": [...]
}
```

---

# 🧠 Final Take

This repo structure gives you:

* Clean separation of concerns
* Easy local + VPS deployment
* Shared types across system
* Seamless path to scale