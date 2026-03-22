import { fetchMapCompositionByBook } from '../repositories/books';
import { MapComposition } from '../types/books';

export async function getMapCompositionByBook(bookId: string): Promise<MapComposition | null> {
  return fetchMapCompositionByBook(bookId);
}
