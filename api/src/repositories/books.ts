import { query } from "../db";
import { MapComposition, MapCompositionRow } from "../types";

export async function fetchMapCompositionByBook(bookId: string): Promise<MapComposition | null> {
  const result = await query<MapCompositionRow>(
    "SELECT map_composition FROM books WHERE id = $1 LIMIT 1;",
    [bookId],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0].map_composition ?? {};
}
