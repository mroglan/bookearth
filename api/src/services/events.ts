import { query } from '../db';

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

export async function getEventsByBook(params: {
  bookId: string;
  bbox: [number, number, number, number];
  zoomLevel: number;
}): Promise<EventRow[]> {
  const [minLon, minLat, maxLon, maxLat] = params.bbox;
  const result = await query<EventRow>(
    `SELECT id, book_id, parent_event_id, title, description, lat, lon, zoom_level, importance, narrative_index
     FROM events
     WHERE book_id = $1
       AND zoom_level = $2
       AND ST_Intersects(geom::geometry, ST_MakeEnvelope($3, $4, $5, $6, 4326))
     LIMIT 200;`,
    [params.bookId, params.zoomLevel, minLon, minLat, maxLon, maxLat]
  );

  return result.rows;
}
