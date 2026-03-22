# Metadata
Status: DONE

Epic: MVP

# User Statement

As a maintainer of Book Earth, I want the initial database schema and seed data in place, so that the API and frontend can query real events during MVP development.

# Notes
- This ticket consolidates MVP backlog items BE-7 (Create Schema) and BE-8 (Seed Initial Data).
- Coordinate with the PostGIS setup from BE-3.
- Seed data can be minimal but should be realistic enough to validate the API and globe UX.

# Acceptance Criteria
- `books` and `events` tables exist.
- `events.geom` has a GIST index.
- Database is seeded with 1 book and 20–50 events.
- A basic query returns meaningful event data.
