import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Sidebar } from "../components/Sidebar";
import type { BookEvent, MapComposition } from "../utils/types";

const composition: MapComposition = {
  base: "terrain",
  overlays: [{ type: "borders", variant: "classic", opacity: 0.6 }],
  postProcessing: { colorGrade: "muted" },
};

const event: BookEvent = {
  id: "1",
  title: "London Departure",
  description: "Phileas Fogg departs London.",
  lat: 51.5074,
  lon: -0.1278,
  importance: 1,
  narrative_index: 1,
};

describe("Sidebar", () => {
  it("shows overlay count from composition", () => {
    render(
      <Sidebar
        composition={composition}
        eventCount={20}
        selectedEvent={null}
        baseStyle="terrain"
      />,
    );
    expect(screen.getByText(/1 overlay/)).toBeInTheDocument();
  });

  it("shows no overlays when composition has none", () => {
    render(
      <Sidebar
        composition={{ base: "terrain", overlays: [] }}
        eventCount={0}
        selectedEvent={null}
        baseStyle="terrain"
      />,
    );
    expect(screen.getByText(/No overlays/)).toBeInTheDocument();
  });

  it("shows placeholder when no event is selected", () => {
    render(
      <Sidebar
        composition={composition}
        eventCount={20}
        selectedEvent={null}
        baseStyle="terrain"
      />,
    );
    expect(screen.getByText(/click an event marker/i)).toBeInTheDocument();
  });

  it("shows selected event details", () => {
    render(
      <Sidebar
        composition={composition}
        eventCount={20}
        selectedEvent={event}
        baseStyle="terrain"
      />,
    );
    expect(screen.getByText("London Departure")).toBeInTheDocument();
    expect(screen.getByText("Phileas Fogg departs London.")).toBeInTheDocument();
    expect(screen.getByText("Importance 1")).toBeInTheDocument();
  });
});
