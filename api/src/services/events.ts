import { fetchEventsByBook } from "../repositories";

export async function getEventsByBook(
  bookId: string,
): Promise<Awaited<ReturnType<typeof fetchEventsByBook>>> {
  return fetchEventsByBook(bookId);
}
