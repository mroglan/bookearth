import { GlobeOverlay } from "./GlobeOverlay";

type GlobeSectionProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  filter: string;
  eventCount: number;
  hasFilter: boolean;
};

export function GlobeSection({ containerRef, filter, eventCount, hasFilter }: GlobeSectionProps) {
  return (
    <section className="relative min-h-[620px] overflow-hidden rounded-[28px] border border-[#e1d5c6] bg-[#efe5d9] shadow-[0_30px_80px_rgba(22,18,13,0.14)] lg:min-h-[720px]">
      <div className="absolute inset-0" ref={containerRef} style={{ filter }} />
      <GlobeOverlay hasEvents={eventCount > 0} eventCount={eventCount} hasFilter={hasFilter} />
    </section>
  );
}
