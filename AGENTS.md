This is the monorepo for the Book Earth project, a literary map explorer.

# Project Context

The MVP centers on a 3D globe frontend and a lightweight API that serves book event data. Design references and planning docs live under `planning/opening-design/`.

# Repo Layout

- `frontend/`: Next.js app (UI + globe, TypeScript)
- `api/`: Node API service (REST endpoints, TypeScript)
- `planning/`: epics, tickets, and design notes

# Running Locally

- Node.js 24 is the expected runtime for this repo. If you are not on node 24 (i.e. check `node --version`), then run `nvm use` to switch to the correct version
- Frontend: `cd frontend && npm install && npm run dev` (defaults to port 3000)
- API: `cd api && npm install && npm run dev` (defaults to port 4000, `/health` endpoint)
- API + DB testing:
- You may need escalated permissions to `curl` `http://localhost:4000/*` from the sandbox.
- To rebuild the database after changing `infrastructure/initdb/*.sql`, bring volumes down and back up (for example: `cd infrastructure/docker && docker compose down -v && docker compose up`).

# Tickets

You should always know the ticket you're working on (e.g. BE-123). If you don't know, ask the human. Your ticket can be found in `planning/tickets/[ticket]`. You should do all your work in the git branch with the same ticket name.

Each ticket is part of an epic found in `planning/epics/`.
