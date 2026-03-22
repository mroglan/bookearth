import { Request, Response } from 'express';
import { getEventsByBook } from '../services/events';
import { getMapCompositionByBook } from '../services/books';
import { ApiError } from '../errors';

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
    throw new ApiError('bbox and zoomLevel are required', 400);
  }

  const bookId = parseBookId(req.params.id);
  if (!bookId) {
    throw new ApiError('book id is required', 400);
  }

  const events = await getEventsByBook({ bookId, bbox, zoomLevel });
  res.status(200).json({ events });
}

export async function handleBookMapComposition(req: Request, res: Response): Promise<void> {
  const bookId = parseBookId(req.params.id);
  if (!bookId) {
    throw new ApiError('book id is required', 400);
  }

  const composition = await getMapCompositionByBook(bookId);
  if (!composition) {
    throw new ApiError('book not found', 404);
  }

  res.status(200).json(composition);
}
