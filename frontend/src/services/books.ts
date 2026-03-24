import type { BookEvent, MapComposition } from "../utils/types";

const BOOK_ID = "1";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function fetchMapComposition(): Promise<MapComposition> {
  const response = await fetch(`${API_BASE_URL}/api/books/${BOOK_ID}/map-composition`);
  if (!response.ok) {
    throw new Error("Failed to load map composition");
  }
  return (await response.json()) as MapComposition;
}

export async function fetchEvents(params: {
  bbox: [number, number, number, number];
  zoomLevel: number;
}): Promise<BookEvent[]> {
  const search = new URLSearchParams({
    bbox: params.bbox.join(","),
    zoomLevel: String(params.zoomLevel),
  });
  const response = await fetch(`${API_BASE_URL}/api/books/${BOOK_ID}/events?${search.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to load events");
  }
  const data = (await response.json()) as { events: BookEvent[] };
  return data.events;
}

export { BOOK_ID };
