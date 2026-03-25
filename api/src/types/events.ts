export type EventRow = {
  id: string;
  book_id: string;
  parent_event_id: string | null;
  title: string;
  description: string | null;
  lat: number;
  lon: number;
  importance: number | null;
  narrative_index: number | null;
};
