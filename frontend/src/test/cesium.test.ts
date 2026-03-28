import { describe, expect, it } from "vitest";
import { getCompositionStyle } from "../utils/cesium";
import type { MapComposition } from "../utils/types";

describe("getCompositionStyle", () => {
  it("returns terrain default when composition is null", () => {
    expect(getCompositionStyle(null)).toEqual({ base: "terrain", filter: "" });
  });

  it("returns the base from composition", () => {
    const composition: MapComposition = { base: "satellite", overlays: [] };
    expect(getCompositionStyle(composition).base).toBe("satellite");
  });

  it("returns empty filter when no postProcessing", () => {
    const composition: MapComposition = { base: "terrain", overlays: [] };
    expect(getCompositionStyle(composition).filter).toBe("");
  });

  it.each([
    ["muted", "saturate(0.75) contrast(1.05)"],
    ["sepia", "sepia(0.35) saturate(0.8)"],
    ["dark", "brightness(0.9) saturate(0.85) contrast(1.05)"],
  ])("returns correct filter for colorGrade %s", (colorGrade, expectedFilter) => {
    const composition: MapComposition = {
      base: "terrain",
      overlays: [],
      postProcessing: { colorGrade },
    };
    expect(getCompositionStyle(composition).filter).toBe(expectedFilter);
  });

  it("returns empty filter for unknown colorGrade", () => {
    const composition: MapComposition = {
      base: "terrain",
      overlays: [],
      postProcessing: { colorGrade: "unknown" },
    };
    expect(getCompositionStyle(composition).filter).toBe("");
  });
});
