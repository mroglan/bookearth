"use client";

import { useCesiumGlobe } from "../hooks/useCesiumGlobe";
import type { BookEvent, MapComposition } from "../utils/types";
import { GlobeSection } from "./GlobeSection";
import { Sidebar } from "./Sidebar";

type BookViewProps = {
  events: BookEvent[];
  composition: MapComposition | null;
};

export function BookView({ events, composition }: BookViewProps) {
  const { containerRef, selectedEvent, baseStyle, filter, status, error } = useCesiumGlobe(
    events,
    composition,
  );
  // TODO: are baseStyle and filter necessary since they're just coming from composition?

  return (
    <>
      <Sidebar
        composition={composition}
        eventCount={events.length}
        selectedEvent={selectedEvent}
        baseStyle={baseStyle}
        status={status}
        error={error}
      />
      <GlobeSection
        containerRef={containerRef}
        filter={filter}
        eventCount={events.length}
        hasFilter={Boolean(filter)}
      />
    </>
  );
}
