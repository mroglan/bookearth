This is the monorepo for the Book Earth project, a literary map explorer.

# Project Context

The MVP centers on a 3D globe frontend and a lightweight API that serves book event data. Design references and planning docs live under `planning/opening-design/`.

# Repo Layout

- `frontend/`: Next.js app (UI + globe, TypeScript)
- `backend/`: Go API service (REST endpoints)
- `planning/`: epics, tickets, and design notes

# Running Locally

- Node.js 24 is the expected runtime for this repo. If you are not on node 24 (i.e. check `node --version`), then run `nvm use` to switch to the correct version
- Frontend: `cd frontend && npm install && npm run dev` (defaults to port 3000)
- Backend API: `cd backend && go run ./cmd/server` (defaults to port 4000)
- Database: to rebuild and start back up, run `cd infrastructure/prod && docker compose down -v && docker compose up`.
- After large changes, run `pre-commit run --all-files` to catch formatting and lint issues.

# Tickets

- You should always know the ticket you're working on (e.g. BE-123). If you don't know, ask the human. Your ticket can be found in `planning/tickets/[ticket]`. You should do all your work in the git branch with the same ticket name.
- Each ticket is part of an epic found in `planning/epics/`.
- No ticket is complete until code is tested. Use `run-test-suite.sh` to run tests.
