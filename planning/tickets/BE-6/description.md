# Metadata
Status: DONE

Epic: MVP

# User Statement

As a Book Earth user, I want the core 3D globe experience wired to live event data, so that I can explore a book's events on an interactive map with meaningful styling and interactions.

# Notes
- This ticket consolidates MVP backlog items BE-13 (Next.js App Running), BE-14 (3D Globe Rendering), BE-15 (Render Event Markers), BE-16 (Click Interaction), BE-17 (Fetch Events from API), BE-18 (Camera -> API Sync), BE-20 (Zoom-Level Filtering), and BE-21 (Apply Map Composition).
- Coordinate with BE-3 for proxy routing, BE-4 for seeded events, and BE-5 for the events + map composition endpoints.
- Use Cesium for globe rendering as described in `planning/opening-design/technical.md`.
- Keep the initial UX lightweight and reliable; avoid extra features outside the consolidated scope.

# Acceptance Criteria
- Next.js frontend loads through the proxy and shows a basic UI shell.
- A 3D globe renders with pan, zoom, and tilt controls.
- Event markers render on the globe using lat/lon from the API.
- Clicking a marker shows at least the event title and description.
- Frontend fetches events from `GET /api/books/:id/events` (no hardcoded data).
- Camera movement computes a bbox and refetches events from the API.
- Zoom-level filtering changes which events appear as zoom changes.
- Frontend reads `GET /api/books/:id/map-composition` and applies at least the base style.
