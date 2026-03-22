# Goal

The goal of this epic is to create an MVP of the Book Earth product. 

# Supporting Documents

Take a look at the documents in planning/opening-design. It contains
* Broadly, the features the product is looking to support (features.md)
* Broadly, the technical design for the product (technical.md)
* Broadly, the repo structure for the product (repo_structure.md)

All these documents are just a starting point. As this epic is worked on, we should update those design documents to reflect changes we make during the MVP.


# 🧭 **MVP Story Backlog (Consolidated & Actionable)**

This backlog is not set in stone, and stories are not refined here yet. We refine a story when we pull the ticket in, or when necessary. We may change to create actual tickets for them, or remove some of them as we go along the mvp.

---

## ⚙️ **Infrastructure & Bootstrapping**

### **BE-1 — Monorepo + App Skeleton**

Set up repo with:

* `frontend/` (Next.js)
* `api/` (Node)

**Done when**

* All apps start locally (even if “hello world”)
* Basic README gives a basic overview of the project for humans, and explains how to run.
* AGENTS.md is updated to provide good general context of the project for future AIs.

---

### **BE-2 — Dockerize All Services**

Create Dockerfiles for:

* frontend
* api

**Done when**

* Each service builds successfully via Docker

---

### **BE-3 — Compose + Proxy + Persistence + PostGIS**

Add:

* proxy (Caddy)
* db (PostGIS) with extension enabled
* all services wired together via docker-compose
* reverse proxy routing
* shared `/data` volume

**Done when**

* `docker compose up` runs everything (proxy, frontend, API, DB)
* Frontend accessible at `/`
* API reachable at `/api/*`
* Static file serving works at `/assets/*` from `/data`
* File written by API persists after restart
* PostGIS extension enabled and ready

---

## 🗄️ **Database**

---

### **BE-6 — Postgres + PostGIS Ready**

Folded into **BE-3**.

---

### **BE-7 — Create Schema**

Tables:

* `books`
* `events`

**Done when**

* Tables exist
* GIST index on `geom`

---

### **BE-8 — Seed Initial Data**

Insert:

* 1 book
* 20–50 events

**Done when**

* Query returns meaningful data

---

## 🧠 **API**

---

### **BE-9 — API Server Boot**

Set up Express/Fastify

**Done when**

* `/health` returns OK
* DB connection works

---

### **BE-10 — Events Endpoint (Core MVP)**

```
GET /api/books/:id/events
```

**Done when**

* Accepts bbox + zoomLevel
* Returns ≤ 200 events
* Uses PostGIS filtering

---

### **BE-11 — Map Composition Endpoint**

```
GET /api/books/:id/map-composition
```

**Done when**

* Returns JSON config

---

### **BE-12 — StorageService (Filesystem)**

Implement local storage abstraction

**Done when**

* Can write + read files from `/data`
* Returns `/assets/...` URLs

---

## 🌍 **Frontend (Core Product Experience)**

---

### **BE-13 — Next.js App Running**

**Done when**

* Loads through proxy
* Basic UI visible

---

### **BE-14 — 3D Globe Rendering (Cesium)**

![Image](https://images.openai.com/static-rsc-4/Y3wmer9VJOnRxIkPkB_gVkPrT9bVsA2Z8EWRlLI3w9Q7IUoq19slbt40B91uBKi-0D88SRycRwGAo7mS2rjLAmZas_QTMZ1BEHO4fhGTHjKnN84PnWeqjTekz0m5i2qkzg2LDxdP08Io_Hatdqck_TAvkVSHH-hDNFQKnb04r9keiGIddekd22LyutZXJ52S?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/t05-DRBNQfwqsUU2WbMG2RUo_r8lB7vUkx8n2DYnoNcPThxOqVBVXhvya_n2BOlN8of4Am_DjR-nfS4Pr8ulzrClBL-YRNcvXLfzEe700Nzhg635jcdBh09AQblqbxoGaeVdnE6W9WLa29Xj7CM1ouZLTXCl6UfDaDaf-CSimmYwujtDCieiYMmqpRx_QQTh?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/dqrHK3YggY31d-ZTedFvgxq8nroiTrWkHUSSkmC62Z6yrGTvEVuCRvBt-dgfwP3nYvUAbz2KTguflOWMyy9avsO2BUqrLacCLfiYF3nijWrCiRTVxyQrjnyMu7WDpkrVSojm5P_cBLzRgwse7Rer8791k8Ez6BV7k7a9lSsjFp2zFE_sNFQnQt05MFJGe2Fs?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/IJu7yJxZc_vtZc8CtCLP_-IPKXmxfDws4XTvA48SjClQ3F0eF6s9PrpxwzA2nDNiyNqUtxk2c59nrbtxU7FA0c_BXW0-P0fF2lJgEotpuPl2RAkWpRt0j7Zr45euXtKs3vQA8t-wQYf9dOvIR1dLfioQkXZlKByiulvhqRv40XYfR-OogcFzZ5y6Bkvfx5MP?purpose=fullsize)

**Done when**

* Earth renders
* User can zoom, pan, tilt

---

### **BE-15 — Render Event Markers**

**Done when**

* Events plotted using lat/lon
* Visible on globe

---

### **BE-16 — Click Interaction**

**Done when**

* Clicking marker shows:

  * title
  * description

---

### **BE-17 — Fetch Events from API**

**Done when**

* Events loaded from backend
* No hardcoded data

---

### **BE-18 — Camera → API Sync**

**Done when**

* On camera move:

  * compute bbox
  * fetch events

---

### **BE-19 — Debounced Fetching**

**Done when**

* No request spam while moving camera

---

### **BE-20 — Zoom-Level Filtering**

**Done when**

* Different events appear at different zoom levels

---

## 🗺️ **Map Feel (Lightweight MVP)**

---

### **BE-21 — Apply Map Composition**

**Done when**

* Frontend reads composition config
* Applies at least base style

---

### **BE-22 — (Optional) Raster Overlay Support**

![Image](https://images.openai.com/static-rsc-4/0q9bnc2vMsmKo_Dibpkx-jT09PGqmLBfMj3vughFFfWCRL50SaNcQITA-gWNk8wQT53PUat908LblgB6nFNEpGosAZEE_KduiXy7oaz7cK117wEMgITgxUpkzEf-83PxlpJzalh49y9lwiltLU8KnMC8ABjYH0tvmpAJtUY4PqErfyrvHnThtWL911_2rb1u?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/0MnYyKvxf1Rw7HVOyx9_cwREXozvMNjQTS8ZHZZc3AqnOPQXEeLTbt298ekv2QfnpfTO17e70c4o8JghembmP0s-kbZqg0XNNUbTLuxDOz7ZuABnRBoOHIf02DjIepJ7iJo1MtY194lPO9XQsmCw6My7hABcTNjCGraTLLPdmItkgnfaEhcBnvEuayBvY_Ae?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/ZlZKUtG5YfoOooKLOyoc1wwpZ67ZZvEPPzlnZojbNfPZyp-OS2K5qIDa_HyWIaA4jNw2bf-68i5XvxXqAB9TqYmePYWZ-qTOhF1HrEnRHfCewq7JRhqk1yac4NKsBb3JqlZsGB49s3KMHgN24Yl12ucXAbkDcDFIRlcVqivG2enPD6lmV1bWNPrH9mu90CT5?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/ceK2Vb4jAGmV_br6BMfTMopiix27YReb0l29EZnZ6wLA5RSdl9aJPsZPu7lAKtfUQkRAw99bZRaGZwXiTj2P-7iGcBZXeGM7GIyK2uukdyZhRXlAFM74ua3RLlfCPMLcX0qGQGUVjU6sqRda-s5Jdgq2QnisydmsJZHRHnjGN98wWwq5jRHaQ9iG0N_W04a1?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/xKEkcGWr-4aesgbGyXFuTv3850qhuh8AAEi5ikd_I8FfLUrJFduXk38gKiIuXRb0oGpjCDNfMfFwa7Ke_oV-ogWv-xMVVDZWDIbe29r_BrT3e2Yp57bO0OFBjl3NysCdWZXtbmT6ZQZttSq3ICSiZumBlKpJ8I2vhCzm-72a7SDuWhj8rFQBe8QErNbKExDE?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/S1buQjMHxqaDF78sMhRrtWTeRxy3equckF5W53fHQtiq_HR4zlwz8MUlauFJ0L7ACoea0v88ECcayOnNJbQfQmsmJReYbskickLJ-tHQGFVNUWBaY5CVOf8CHZTCHHmt2yuDrsoVuTldM3Sm9hCYqbg96O2Wpy7UTpDYrcvYLjP6XhkKRLeJgP6rMga4cpA6?purpose=fullsize)

**Done when**

* Tiles load from `/data/maps`
* Overlay visible on map

---

## 🤖 **Worker (Manual Pipeline Only)**

---

### **BE-23 — Worker Runs via Docker**

**Done when**

* Command executes:

  ```
  docker compose run worker
  ```

---

### **BE-24 — Extract Events from Text**

**Done when**

* Script outputs JSON:

  * title
  * description
  * lat/lon

---

### **BE-25 — Insert Events into DB**

**Done when**

* Script writes events to Postgres

---

### **BE-26 — (Optional) Generate Illustrations**

**Done when**

* Images saved to `/data/illustrations`

---

## 🌐 **Assets**

---

### **BE-27 — Serve Static Assets**

**Done when**

* `/assets/...` returns files

---

### **BE-28 — Attach Images to Events**

**Done when**

* Clicking event shows image (if exists)

---

## ⚡ **Performance Safeguards**

---

### **BE-29 — Limit Events per Request**

**Done when**

* API enforces ≤ 200 events

---

### **BE-30 — Efficient Spatial Query**

**Done when**

* Query uses GIST index
* No full table scans

---

## 🔐 **Backup (Bare Minimum)**

---

### **BE-31 — Database Backup Script**

**Done when**

* `pg_dump` works

---

### **BE-32 — Filesystem Backup**

**Done when**

* `/data` can be copied/restored

---

# 🚀 **What You Actually Build First (Critical Path)**

If you want to move fast, do ONLY this subset first:

1 → 3 → 7 → 8 → 9 → 10 → 13 → 14 → 15 → 16 → 17

That gives you:

> ✅ A working 3D literary map with real data

---

# 🧠 Reality Check

Right now, your true MVP is just:

* One book
* ~30 events
* A globe
* Clickable points

Everything else is **infrastructure for future scale**, not validation.
