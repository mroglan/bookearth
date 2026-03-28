import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GlobeOverlay } from "../components/GlobeOverlay";

describe("GlobeOverlay", () => {
  it("shows event count when events are loaded", () => {
    render(<GlobeOverlay hasEvents={true} eventCount={20} hasFilter={false} />);
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("shows Loading when events are not yet loaded", () => {
    render(<GlobeOverlay hasEvents={false} eventCount={0} hasFilter={false} />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("shows filter On when filter is active", () => {
    render(<GlobeOverlay hasEvents={true} eventCount={5} hasFilter={true} />);
    expect(screen.getByText("On")).toBeInTheDocument();
  });

  it("shows filter Off when filter is inactive", () => {
    render(<GlobeOverlay hasEvents={true} eventCount={5} hasFilter={false} />);
    expect(screen.getByText("Off")).toBeInTheDocument();
  });
});
