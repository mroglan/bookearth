import { config } from "../utils/config";
import type { BookEvent, MapComposition } from "../utils/types";

const BOOK_ID = "1";

export async function fetchMapComposition(): Promise<MapComposition> {
  const response = await fetch(`${config.apiBaseUrl}/books/${BOOK_ID}/map-composition`);
  if (!response.ok) {
    throw new Error("Failed to load map composition");
  }
  return (await response.json()) as MapComposition;
}

export async function fetchEvents(): Promise<BookEvent[]> {
  const response = await fetch(`${config.apiBaseUrl}/books/${BOOK_ID}/events`);
  if (!response.ok) {
    throw new Error("Failed to load events");
  }
  const data = (await response.json()) as { events: BookEvent[] };
  return data.events;
}

export { BOOK_ID };
