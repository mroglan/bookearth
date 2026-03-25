import { query } from "../db";
import { EventRow } from "../types";

export async function fetchEventsByBook(bookId: string): Promise<EventRow[]> {
  const result = await query<EventRow>(
    `SELECT id, book_id, parent_event_id, title, description, lat, lon, importance, narrative_index
     FROM events
     WHERE book_id = $1
     ORDER BY narrative_index NULLS LAST, id`,
    [bookId],
  );

  return result.rows;
}
