import type { MapComposition } from "./types";

type CesiumModule = typeof import("cesium");

const COLOR_GRADES: Record<string, string> = {
  muted: "saturate(0.75) contrast(1.05)",
  sepia: "sepia(0.35) saturate(0.8)",
  dark: "brightness(0.9) saturate(0.85) contrast(1.05)",
};

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
