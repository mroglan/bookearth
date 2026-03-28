"use client";

import { useCesiumGlobe } from "../hooks/useCesiumGlobe";
import { getCompositionStyle } from "../utils/cesium";
import type { BookEvent, MapComposition } from "../utils/types";
import { GlobeSection } from "./GlobeSection";
import { Sidebar } from "./Sidebar";

type BookViewProps = {
  events: BookEvent[];
  composition: MapComposition | null;
};

export function BookView({ events, composition }: BookViewProps) {
  const { containerRef, selectedEvent } = useCesiumGlobe(events, composition);
  const { base, filter } = getCompositionStyle(composition);

  return (
    <>
      <Sidebar
        composition={composition}
        eventCount={events.length}
        selectedEvent={selectedEvent}
        baseStyle={base}
      />
      <GlobeSection containerRef={containerRef} filter={filter} eventCount={events.length} />
    </>
  );
}
