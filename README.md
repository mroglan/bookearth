# Book Earth

Book Earth is a literary map explorer. The MVP focuses on a 3D globe, an API that serves event data, and a simple local development loop.

## Repo Layout

- `frontend/`: Next.js app (UI + globe, TypeScript)
- `api/`: Node API service (REST endpoints, TypeScript)
- `planning/`: epics, tickets, and design notes

## Local Development

Node.js 24 is the expected runtime for this repo.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:3000`.

### API

```bash
cd api
npm install
npm run dev
```

Runs at `http://localhost:4000`. Health check at `http://localhost:4000/health`.

## Docker Builds

Dockerfiles live in `infrastructure/docker/Dockerfiles/`.

### Frontend

```bash
docker build -f infrastructure/docker/Dockerfiles/frontend.Dockerfile -t bookearth-frontend ./frontend
```

```bash
docker run --rm -p 3000:3000 bookearth-frontend
```

### API

```bash
docker build -f infrastructure/docker/Dockerfiles/api.Dockerfile -t bookearth-api ./api
```

```bash
docker run --rm -p 4000:4000 bookearth-api
```

## Notes

Design references live in `planning/opening-design/`.
