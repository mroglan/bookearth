import { fetchEventsByBook } from '../repositories';

export async function getEventsByBook(params: {
  bookId: string;
  bbox: [number, number, number, number];
  zoomLevel: number;
}): Promise<Awaited<ReturnType<typeof fetchEventsByBook>>> {
  return fetchEventsByBook(params);
}
