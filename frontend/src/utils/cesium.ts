import type { MapComposition, RectangleLike } from "./types";

type CesiumModule = typeof import("cesium");

const COLOR_GRADES: Record<string, string> = {
  muted: "saturate(0.75) contrast(1.05)",
  sepia: "sepia(0.35) saturate(0.8)",
  dark: "brightness(0.9) saturate(0.85) contrast(1.05)",
};

export function toZoomLevel(height: number): number {
  if (height > 20_000_000) return 2;
  if (height > 12_000_000) return 3;
  if (height > 7_000_000) return 4;
  if (height > 4_000_000) return 5;
  if (height > 2_000_000) return 6;
  if (height > 1_000_000) return 7;
  if (height > 500_000) return 8;
  if (height > 250_000) return 9;
  return 10;
}

export function rectangleToBbox(
  Cesium: CesiumModule,
  rect: RectangleLike | undefined,
): [number, number, number, number] {
  if (!rect) {
    return [-180, -90, 180, 90];
  }
  const west = Cesium.Math.toDegrees(rect.west);
  const south = Cesium.Math.toDegrees(rect.south);
  const east = Cesium.Math.toDegrees(rect.east);
  const north = Cesium.Math.toDegrees(rect.north);
  return [west, south, east, north];
}

export function bboxKey(bbox: [number, number, number, number], zoomLevel: number): string {
  return `${bbox.map((value) => value.toFixed(3)).join(",")}:${zoomLevel}`;
}

export function applyMapComposition(
  Cesium: CesiumModule,
  viewer: import("cesium").Viewer,
  composition: MapComposition | null,
): { base: string; filter: string } {
  const base = composition?.base ?? "terrain";
  viewer.imageryLayers.removeAll();
  viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString("#efe5d9");

  if (base === "satellite") {
    viewer.imageryLayers.addImageryProvider(
      new Cesium.UrlTemplateImageryProvider({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      }),
    );
  } else if (base === "minimal") {
    viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString("#f1ede6");
  } else {
    viewer.imageryLayers.addImageryProvider(
      new Cesium.OpenStreetMapImageryProvider({
        url: "https://tile.openstreetmap.org/",
      }),
    );
  }

  const colorGrade = composition?.postProcessing?.colorGrade ?? "";
  const filter = COLOR_GRADES[colorGrade] ?? "";
  return { base, filter };
}
