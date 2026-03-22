import { fetchMapCompositionByBook } from '../repositories';
import { MapComposition } from '../types';

export async function getMapCompositionByBook(bookId: string): Promise<MapComposition | null> {
  return fetchMapCompositionByBook(bookId);
}
