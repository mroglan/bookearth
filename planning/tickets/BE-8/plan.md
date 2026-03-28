# BE-8 Refactor Plan

## Problem

`page.tsx` does too much: it initializes Cesium, fetches data, renders entities, manages click state, and drives the UI — all in one client component. This makes it hard to develop the data-fetching and the display logic independently, and unnecessarily forces the entire page to be client-side.

## Approach

`page.tsx` becomes an async server component that fetches data. It renders a single `<BookView>` client wrapper that owns shared state and wires together `<Sidebar>` and `<GlobeSection>`.

### `src/app/page.tsx` — async server component (no `"use client"`)
- `await fetchEvents()` and `await fetchMapComposition()` directly
- Renders `<BookView events={events} composition={composition} />`
- No hooks, no Cesium, no browser APIs

### `src/components/BookView.tsx` — `"use client"`
- Calls `useCesiumGlobe(events, composition)` to get all display state
- Passes display state as props to `<Sidebar>` and `<GlobeSection>`
- This is the only place that manages client-side state; both children are purely presentational

### `src/hooks/useCesiumGlobe.ts` — `"use client"` hook
- Owns all Cesium logic: viewer init/teardown, entity rendering, click handling, composition application
- Inputs: `events: BookEvent[]`, `composition: MapComposition | null`
- Returns: `{ containerRef, selectedEvent, baseStyle, filter, status, error }`

### `src/components/Sidebar.tsx` — presentational (replaces `EventDetails`)
- Renders the full left panel: book header, metadata, selected event details, status
- Receives all data as props — no hooks, no state

### `src/components/GlobeSection.tsx` — presentational
- Receives `containerRef`, `filter`, and overlay props
- Renders the Cesium container div and `<GlobeOverlay>`
- No hooks, no state

## File Changes

| File | Action |
|------|--------|
| `src/hooks/useCesiumGlobe.ts` | Create |
| `src/components/BookView.tsx` | Create |
| `src/components/Sidebar.tsx` | Create (replaces EventDetails) |
| `src/components/GlobeSection.tsx` | Create |
| `src/app/page.tsx` | Convert to async server component |
| `src/components/EventDetails.tsx` | Delete |

## What stays the same

- API service layer (`services/books.ts`)
- Cesium utilities (`utils/cesium.ts`)
- `GlobeOverlay` component
- Type definitions (`utils/types.ts`)
- Visual output (no UX changes)
