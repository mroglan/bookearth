export type BookEvent = {
  id: string;
  title: string;
  description: string | null;
  lat: number;
  lon: number;
  zoom_level: number;
  importance: number | null;
  narrative_index: number | null;
};

export type MapComposition = {
  base?: "terrain" | "satellite" | "minimal" | string;
  overlays?: Array<{ type: string; variant?: string; opacity?: number }>;
  postProcessing?: {
    colorGrade?: "sepia" | "dark" | "muted" | string;
  };
};
