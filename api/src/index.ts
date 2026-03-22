import express, { Request, Response } from 'express';
import { config } from './config';
import { checkDbConnection, query } from './db';
import { storage } from './storage';

const app = express();
app.use(express.json());

type EventRow = {
  id: string;
  book_id: string;
  parent_event_id: string | null;
  title: string;
  description: string | null;
  lat: number;
  lon: number;
  zoom_level: number;
  importance: number | null;
  narrative_index: number | null;
};

type MapCompositionRow = {
  map_composition: Record<string, unknown> | null;
};

function parseBbox(value: unknown): [number, number, number, number] | null {
  if (typeof value !== 'string') {
    return null;
  }
  const parts = value.split(',').map((part) => Number(part.trim()));
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return null;
  }
  const [minLonRaw, minLatRaw, maxLonRaw, maxLatRaw] = parts;
  const minLon = Math.min(minLonRaw, maxLonRaw);
  const maxLon = Math.max(minLonRaw, maxLonRaw);
  const minLat = Math.min(minLatRaw, maxLatRaw);
  const maxLat = Math.max(minLatRaw, maxLatRaw);
  return [minLon, minLat, maxLon, maxLat];
}

function parseZoomLevel(value: unknown): number | null {
  if (typeof value !== 'string') {
    return null;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return Math.floor(parsed);
}

app.get('/health', async (_req: Request, res: Response) => {
  try {
    await checkDbConnection();
    res.status(200).json({ status: 'ok', db: 'ok' });
  } catch (error) {
    res.status(500).json({ status: 'error', db: 'unavailable' });
  }
});

app.get('/api/books/:id/events', async (req: Request, res: Response) => {
  const bbox = parseBbox(req.query.bbox);
  const zoomLevel = parseZoomLevel(req.query.zoomLevel);
  if (!bbox || zoomLevel === null) {
    res.status(400).json({
      error: 'bbox and zoomLevel are required',
      expected: 'bbox=minLon,minLat,maxLon,maxLat&zoomLevel=number'
    });
    return;
  }

  const bookIdRaw = req.params.id;
  const bookId = Array.isArray(bookIdRaw) ? bookIdRaw[0] : bookIdRaw;
  if (!bookId) {
    res.status(400).json({ error: 'book id is required' });
    return;
  }

  const [minLon, minLat, maxLon, maxLat] = bbox;

  try {
    const result = await query<EventRow>(
      `SELECT id, book_id, parent_event_id, title, description, lat, lon, zoom_level, importance, narrative_index
       FROM events
       WHERE book_id = $1
         AND zoom_level = $2
         AND ST_Intersects(geom::geometry, ST_MakeEnvelope($3, $4, $5, $6, 4326))
       LIMIT 200;`,
      [bookId, zoomLevel, minLon, minLat, maxLon, maxLat]
    );

    res.status(200).json({ events: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'failed to fetch events' });
  }
});

app.get('/api/books/:id/map-composition', async (req: Request, res: Response) => {
  const bookIdRaw = req.params.id;
  const bookId = Array.isArray(bookIdRaw) ? bookIdRaw[0] : bookIdRaw;
  if (!bookId) {
    res.status(400).json({ error: 'book id is required' });
    return;
  }

  try {
    const result = await query<MapCompositionRow>(
      'SELECT map_composition FROM books WHERE id = $1 LIMIT 1;',
      [bookId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'book not found' });
      return;
    }

    res.status(200).json(result.rows[0].map_composition ?? {});
  } catch (error) {
    res.status(500).json({ error: 'failed to fetch map composition' });
  }
});

async function waitForDb(attempts = 10, delayMs = 1000): Promise<void> {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await checkDbConnection();
      return;
    } catch (error) {
      if (attempt === attempts) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

async function start(): Promise<void> {
  await storage.ensureReady();
  await waitForDb();

  app.listen(config.port, () => {
    console.log(`Book Earth API listening on http://localhost:${config.port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start Book Earth API', error);
  process.exit(1);
});
