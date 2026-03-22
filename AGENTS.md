This is the monorepo for the Book Earth project, a literary map explorer.

# Project Context

The MVP centers on a 3D globe frontend and a lightweight API that serves book event data. Design references and planning docs live under `planning/opening-design/`.

# Repo Layout

- `frontend/`: Next.js app (UI + globe, TypeScript)
- `api/`: Node API service (REST endpoints, TypeScript)
- `planning/`: epics, tickets, and design notes

# Running Locally

- Frontend: `cd frontend && npm install && npm run dev` (defaults to port 3000)
- API: `cd api && npm install && npm run dev` (defaults to port 4000, `/health` endpoint)

# Tickets

You should always know the ticket you're working on (e.g. BE-123). If you don't know, ask the human. Your ticket can be found in `planning/tickets/[ticket]`.
