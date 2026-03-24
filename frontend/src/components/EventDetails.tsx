import type { BookEvent } from "../utils/types";

type EventDetailsProps = {
  event: BookEvent | null;
};

export function EventDetails({ event }: EventDetailsProps) {
  if (!event) {
    return (
      <p className="text-sm text-slate-600">
        Click an event marker to inspect the narrative details.
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-[#f0e3d4] bg-[#fef8f1] p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{event.title}</h2>
      <p className="mt-2 text-sm text-slate-600">
        {event.description ?? "No description provided."}
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-[0.7rem] uppercase tracking-[0.12em] text-slate-600">
        <span className="rounded-full bg-[#f3e8dc] px-3 py-1">Zoom {event.zoom_level}</span>
        {event.importance !== null && (
          <span className="rounded-full bg-[#f3e8dc] px-3 py-1">Importance {event.importance}</span>
        )}
      </div>
    </div>
  );
}
