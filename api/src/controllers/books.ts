import { Request, Response } from 'express';
import { getEventsByBook } from '../services/events';
import { getMapCompositionByBook } from '../services/books';

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

function parseBookId(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  return value.trim() ? value : null;
}

export async function handleBookEvents(req: Request, res: Response): Promise<void> {
  const bbox = parseBbox(req.query.bbox);
  const zoomLevel = parseZoomLevel(req.query.zoomLevel);
  if (!bbox || zoomLevel === null) {
    res.status(400).json({
      error: 'bbox and zoomLevel are required',
      expected: 'bbox=minLon,minLat,maxLon,maxLat&zoomLevel=number'
    });
    return;
  }

  const bookId = parseBookId(req.params.id);
  if (!bookId) {
    res.status(400).json({ error: 'book id is required' });
    return;
  }

  try {
    const events = await getEventsByBook({ bookId, bbox, zoomLevel });
    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ error: 'failed to fetch events' });
  }
}

export async function handleBookMapComposition(req: Request, res: Response): Promise<void> {
  const bookId = parseBookId(req.params.id);
  if (!bookId) {
    res.status(400).json({ error: 'book id is required' });
    return;
  }

  try {
    const composition = await getMapCompositionByBook(bookId);
    if (!composition) {
      res.status(404).json({ error: 'book not found' });
      return;
    }

    res.status(200).json(composition);
  } catch (error) {
    res.status(500).json({ error: 'failed to fetch map composition' });
  }
}
