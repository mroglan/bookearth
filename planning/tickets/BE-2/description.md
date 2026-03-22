# Metadata
Status: NOT STARTED

Epic: MVP

# User Statement

As a maintainer of Book Earth, I would like the frontend and API services to be Dockerized, so that I can build and run the core services in consistent, containerized environments.

# Notes
- See `planning/opening-design/repo_structure.md` for repo layout context.
- Align Docker setup with expected Node.js 24 runtime.
- Each service should build independently via Docker.

# Acceptance Criteria
- Repo includes a Dockerfile for `frontend/`.
- Repo includes a Dockerfile for `api/`.
- Each service builds successfully via Docker.
