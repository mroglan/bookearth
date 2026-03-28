# Book Earth

Book Earth is a literary map explorer. The MVP focuses on a 3D globe, an API that serves event data, and a simple local development loop.

## Repo Layout

- `frontend/`: Next.js app (UI + globe, TypeScript)
- `backend/`: Go API service (REST endpoints)
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

### Backend API

```bash
cd backend
go run ./cmd/server
```

Runs at `http://localhost:4000`. Health check at `http://localhost:4000/health`.

## Docker Builds

Dockerfiles live in `frontend/` and `backend/`.

### Frontend

```bash
docker build -f frontend/Dockerfile -t bookearth-frontend ./frontend
```

```bash
docker run --rm -p 3000:3000 bookearth-frontend
```

### Backend API

```bash
docker build -f backend/Dockerfile -t bookearth-backend ./backend
```

```bash
docker run --rm -p 4000:4000 bookearth-backend
```

## Docker Compose (Full Stack)

Compose file lives at `infrastructure/prod/docker-compose.yml`.

### Build and run

```bash
docker compose -f infrastructure/prod/docker-compose.yml up --build
```

### Run without rebuild

```bash
docker compose -f infrastructure/prod/docker-compose.yml up
```

### Stop

```bash
docker compose -f infrastructure/prod/docker-compose.yml down
```

### Reset data volumes (destructive)

```bash
docker compose -f infrastructure/prod/docker-compose.yml down -v
```

## Tests

```bash
./run-test-suite.sh
```

## Notes

Design references live in `planning/opening-design/`.
