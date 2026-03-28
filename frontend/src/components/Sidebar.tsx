import type { BookEvent, MapComposition } from "../utils/types";
import { BOOK_ID } from "../services/books";

type SidebarProps = {
  composition: MapComposition | null;
  eventCount: number;
  selectedEvent: BookEvent | null;
  baseStyle: string;
  status: string;
  error: string | null;
};

export function Sidebar({
  composition,
  eventCount,
  selectedEvent,
  baseStyle,
  status,
  error,
}: SidebarProps) {
  const overlaysLabel = composition?.overlays?.length
    ? `${composition.overlays.length} overlay${composition.overlays.length === 1 ? "" : "s"}`
    : "No overlays";

  return (
    <section className="flex h-full flex-col gap-5 rounded-[28px] border border-[#e1d5c6] bg-white/90 p-7 shadow-[0_24px_60px_rgba(21,17,11,0.08)]">
      <div>
        <p className="text-[0.72rem] uppercase tracking-[0.2em] text-slate-500">Book Earth MVP</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Around the World in Eighty Days
        </h1>
      </div>
      <p className="text-sm leading-relaxed text-slate-600">
        This globe is live-wired to the MVP API. Pan, zoom, and tilt to explore the full event set
        for the book.
      </p>
      <div className="grid gap-2 text-sm text-slate-600">
        <div>Book id: {BOOK_ID}</div>
        <div>Base style: {baseStyle}</div>
        <div>Composition: {overlaysLabel}</div>
      </div>
      <div className="border-t border-[#e1d5c6] pt-4">
        <p className="text-[0.72rem] uppercase tracking-[0.2em] text-slate-500">Selected Moment</p>
        <div className="mt-3">
          {selectedEvent ? (
            <div className="rounded-2xl border border-[#f0e3d4] bg-[#fef8f1] p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">{selectedEvent.title}</h2>
              <p className="mt-2 text-sm text-slate-600">
                {selectedEvent.description ?? "No description provided."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[0.7rem] uppercase tracking-[0.12em] text-slate-600">
                {selectedEvent.importance !== null && (
                  <span className="rounded-full bg-[#f3e8dc] px-3 py-1">
                    Importance {selectedEvent.importance}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600">
              Click an event marker to inspect the narrative details.
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-[#e1d5c6] pt-4">
        <p className="text-[0.72rem] uppercase tracking-[0.2em] text-slate-500">Viewport Status</p>
        <div className="mt-2 grid gap-1 text-sm text-slate-600">
          <div>Status: {status}</div>
          <div>Events visible: {eventCount}</div>
          {error ? <div>Error: {error}</div> : null}
        </div>
      </div>
    </section>
  );
}
