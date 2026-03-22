# 🧭 **Literary Map Explorer — Technical Design**

---

# 1. 🧱 System Overview

## Core Principle

> Separate **content generation**, **data serving**, and **rendering** so each can evolve independently.

---

## High-Level Architecture

```text
                ┌────────────────────────────┐
                │        Frontend            │
                │ React + Cesium (3D Globe) │
                └────────────┬───────────────┘
                             │
                             ▼
                ┌────────────────────────────┐
                │        API Layer           │
                │   (GraphQL / REST)        │
                └────────────┬───────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌───────────────┐   ┌────────────────┐   ┌──────────────────┐
│ PostGIS DB    │   │ Object Storage │   │ Cache (Redis)     │
│ (events/maps) │   │ (images/tiles) │   │                  │
└───────────────┘   └────────────────┘   └──────────────────┘

        ▲
        │
┌──────────────────────────────────────────────┐
│     Offline Processing Pipeline (AI)         │
│  Text → Events → Locations → Map Config      │
└──────────────────────────────────────────────┘
```

---

# 2. 🌍 Frontend (3D Map Experience)

## Stack

* **React (Next.js)**
* **CesiumJS** (3D globe engine)
* Zustand (state)
* React Query (data fetching)

---

## Responsibilities

* Render 3D Earth
* Handle camera movement (zoom/tilt/pan)
* Load events dynamically based on viewport
* Apply map composition (layers)
* Display event UI (modal / panel)

---

## Core Modules

### 2.1 Map Engine Wrapper

Abstract Cesium behind your own API:

```ts
interface MapEngine {
  setMapComposition(composition: MapComposition): void;
  setEvents(events: Event[]): void;
  onCameraChange(cb: (viewport) => void): void;
}
```

---

### 2.2 Zoom-Level System

```ts
function getZoomLevel(height: number) {
  if (height > 5_000_000) return "arc";
  if (height > 500_000) return "scene";
  return "moment";
}
```

---

### 2.3 Event Rendering Strategy

* Use Cesium `Entity` or `Billboard`
* Cluster server-side (not client-side initially)
* Only render visible events

---

### 2.4 Map Composition Rendering

Apply layers:

```ts
composition = {
  base: "terrain",
  overlays: ["historical_borders"],
  postProcessing: "sepia"
}
```

Mapped to:

* Cesium imagery layers
* Shader adjustments

---

# 3. 🧠 Backend API Layer

## Stack

* Node.js (TypeScript)
* GraphQL (Apollo) or REST
* Hosted on Fly.io / Railway

---

## Core Endpoints

### 3.1 Map Configuration

```http
GET /books/:id/map-composition
```

Returns:

```json
{
  "base": "terrain",
  "overlays": ["roman_empire"],
  "postProcessing": "sepia"
}
```

---

### 3.2 Events Query (Spatial)

```http
GET /books/:id/events?bbox=...&zoomLevel=scene
```

---

### 3.3 Event Detail

```http
GET /events/:id
```

---

## Query Behavior

* Filter by bounding box
* Filter by zoom level
* Limit results (e.g., 200 max)

---

# 4. 🗄️ Data Layer (PostGIS)

## Database: PostgreSQL + PostGIS

---

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

### Locations

```sql
locations (
  id,
  name,
  lat,
  lon,
  confidence
)
```

---

## Key Query

```sql
SELECT *
FROM events
WHERE
  book_id = $1
  AND zoom_level = $2
  AND ST_Intersects(
    geom,
    ST_MakeEnvelope($bbox)
  )
LIMIT 200;
```

---

# 5. 🗺️ Map System (Hybrid Strategy)

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

### Phase 1 (Option A — Raster)

* Base: Cesium terrain / imagery
* Overlays: raster tile layers (S3 or external)
* Styling: shaders

---

### Phase 2 (Hybrid)

* Some books → raster
* Some books → vector tiles

---

### Phase 3 (Option B — Vector)

* Full feature-level styling
* Mapbox-style rules

---

## Key Design

> MapComposition is **engine-agnostic**

---

# 6. 🧠 Offline Processing Pipeline (AI Core)

## Stack

* Python
* LLM APIs
* spaCy / transformers
* Queue (Redis + Celery)

---

## Pipeline Stages

### 6.1 Text Ingestion

* Input: full book text
* Chunk into passages

---

### 6.2 Event Extraction

LLM prompt:

* Extract:

  * event description
  * location mention
  * importance
  * visual potential

---

### 6.3 Event Filtering

Score:

```text
importance + location clarity + visual richness
```

---

### 6.4 Location Resolution

Pipeline:

```text
NER → Geocoding → Coordinate
```

Store:

```json
{
  "lat": ...,
  "lon": ...,
  "confidence": "exact | approximate"
}
```

---

### 6.5 Hierarchy Construction

* Cluster events by:

  * geography
  * narrative proximity

---

### 6.6 Map Composition Generation

LLM + rules:

Input:

```json
{
  "timePeriod": "1800s",
  "setting": "Europe",
  "themes": ["travel", "war"]
}
```

Output:

```json
{
  "base": "terrain",
  "overlays": ["historical_borders"],
  "postProcessing": "muted"
}
```

---

### 6.7 Illustration Generation

* Prompt per event
* Apply book-level style
* Store in S3

---

# 7. 🧱 Storage & Assets

## Object Storage (S3)

Stores:

* Event illustrations
* Map overlay tiles
* Static assets

---

## Tile Storage Structure

```text
/maps/{overlay}/{z}/{x}/{y}.png
```

---

## CDN

* CloudFront (or similar)
* Cache tiles + images

---

# 8. ⚡ Performance Strategy

## Key Techniques

### 8.1 Spatial Querying

* PostGIS bounding box queries

---

### 8.2 Event Limits

* Max ~200 per request

---

### 8.3 Debounced Camera Updates

```ts
debounce(fetchEvents, 200ms)
```

---

### 8.4 Caching

* Redis for:

  * event queries
  * map configs

---

### 8.5 Progressive Loading

* Load arcs first
* Then scenes
* Then moments

---

# 9. ☁️ Deployment Strategy

## Environments

* Dev
* Staging
* Production

---

## Infrastructure

### Frontend

* Vercel (Next.js)

---

### Backend

* Fly.io / Railway (Node API)

---

### Database

* Supabase (Postgres + PostGIS)

---

### Storage

* AWS S3 + CloudFront

---

### Queue / Workers

* Redis (Upstash)
* Python workers (Fly.io / ECS)

---

## Deployment Flow

```text
Push → CI/CD → Deploy API + Frontend
```

---

## Processing Flow

```text
Upload Book
   ↓
Queue Job
   ↓
Worker processes:
   - events
   - locations
   - map composition
   ↓
Store results
```

---

# 10. 🔐 Access Patterns

## Read-heavy system

* Optimize for:

  * fast map loads
  * fast spatial queries

---

## Write patterns

* Mostly offline (pipeline)
* Rare updates

---

# 11. 🚀 MVP Scope

## Include

* 1–3 books
* ~100 events per book
* 3 zoom levels
* 1–2 overlays max
* Raster maps only

---

## Exclude

* Real-time editing
* Multi-user features
* Full vector styling

---

# 12. 🔥 Key Risks

## 1. Event Quality

Bad extraction = bad product

## 2. Location Ambiguity

Books are vague → need heuristics

## 3. Overengineering Maps

Start simple (raster)

---

# 13. 🧠 Guiding Principles

### 1. Layer-based map model

Not monolithic styles

### 2. Engine-agnostic configs

Future-proofing

### 3. Server-driven data

Client stays thin

### 4. Progressive complexity

Start simple → evolve
