import { query } from '../db';

type MapCompositionRow = {
  map_composition: Record<string, unknown> | null;
};

export async function getMapCompositionByBook(bookId: string): Promise<Record<string, unknown> | null> {
  const result = await query<MapCompositionRow>(
    'SELECT map_composition FROM books WHERE id = $1 LIMIT 1;',
    [bookId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0].map_composition ?? {};
}
