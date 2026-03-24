type GlobeOverlayProps = {
  zoomLevel: number;
  eventCount: number;
  hasFilter: boolean;
};

export function GlobeOverlay({ zoomLevel, eventCount, hasFilter }: GlobeOverlayProps) {
  return (
    <div className="absolute right-5 top-5 grid gap-2 rounded-2xl border border-[#e1d5c6] bg-white/90 px-3 py-2 text-xs text-slate-600 shadow-lg">
      <div className="flex items-center justify-between gap-6">
        <span className="font-semibold text-slate-900">Zoom</span>
        <span>{zoomLevel}</span>
      </div>
      <div className="flex items-center justify-between gap-6">
        <span className="font-semibold text-slate-900">Events</span>
        <span>{eventCount}</span>
      </div>
      <div className="flex items-center justify-between gap-6">
        <span className="font-semibold text-slate-900">Filter</span>
        <span>{hasFilter ? "On" : "Off"}</span>
      </div>
    </div>
  );
}
