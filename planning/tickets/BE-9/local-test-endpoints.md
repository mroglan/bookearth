# Local API Test Endpoints (Go Backend)

Use these against `http://localhost:4000`.

## Health
```bash
curl -i http://localhost:4000/health
```

Expected: `200` with JSON `{ "status": "ok", "db": "ok" }`.

## Book Events
```bash
curl -i http://localhost:4000/books/1/events
```

Expected: `200` with JSON `{ "events": [...] }`.

## Book Map Composition
```bash
curl -i http://localhost:4000/books/1/map-composition
```

Expected: `200` with JSON map composition, or `404` if book not found.

## Validation (Missing Book ID)
```bash
curl -i http://localhost:4000/books//events
curl -i http://localhost:4000/books//map-composition
```

Expected: `400` with JSON `{ "error": "book id is required" }`.

## CORS Preflight
```bash
curl -i -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  http://localhost:4000/books/1/events
```

Expected: `204` with CORS headers.
