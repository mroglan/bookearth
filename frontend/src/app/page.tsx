"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EventDetails } from "../components/EventDetails";
import { GlobeOverlay } from "../components/GlobeOverlay";
import { fetchEvents, fetchMapComposition, BOOK_ID } from "../services/books";
import { applyMapComposition } from "../utils/cesium";
import type { BookEvent, MapComposition } from "../utils/types";

type CesiumModule = typeof import("cesium");

const CESIUM_BASE_URL = "/cesium/";

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<import("cesium").Viewer | null>(null);
  const dataSourceRef = useRef<import("cesium").CustomDataSource | null>(null);
  const cesiumRef = useRef<CesiumModule | null>(null);
  const selectedEventRef = useRef<BookEvent | null>(null);

  const [events, setEvents] = useState<BookEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<BookEvent | null>(null);
  const [composition, setComposition] = useState<MapComposition | null>(null);
  const [baseStyle, setBaseStyle] = useState("terrain");
  const [status, setStatus] = useState("Loading Cesium...");
  const [filter, setFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const hasEvents = events.length > 0;

  const renderEvents = useCallback((Cesium: CesiumModule, nextEvents: BookEvent[]) => {
    const dataSource = dataSourceRef.current;
    if (!dataSource) {
      return;
    }
    dataSource.entities.removeAll();

    nextEvents.forEach((event) => {
      const entity = dataSource.entities.add({
        position: Cesium.Cartesian3.fromDegrees(event.lon, event.lat),
        point: {
          pixelSize: 10,
          color: Cesium.Color.fromCssColorString("#d14b2b"),
          outlineColor: Cesium.Color.fromCssColorString("#ffffff"),
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
        label: {
          text: event.title,
          font: "14px Fraunces",
          showBackground: true,
          backgroundColor: Cesium.Color.fromCssColorString("rgba(255, 248, 240, 0.9)"),
          fillColor: Cesium.Color.fromCssColorString("#1c1c1c"),
          pixelOffset: new Cesium.Cartesian2(0, -18),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 3_000_000.0),
        },
      });
      (entity as import("cesium").Entity & { eventData?: BookEvent }).eventData = event;
    });
  }, []);

  const refreshEvents = useCallback(async () => {
    const viewer = viewerRef.current;
    const Cesium = cesiumRef.current;
    if (!viewer || !Cesium) {
      return;
    }

    setStatus("Fetching events...");

    try {
      const data = await fetchEvents();
      setEvents(data);
      renderEvents(Cesium, data);
      const currentSelection = selectedEventRef.current;
      if (currentSelection && !data.find((event) => event.id === currentSelection.id)) {
        setSelectedEvent(null);
        selectedEventRef.current = null;
      }
      setStatus(`Loaded ${data.length} events`);
      setError(null);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unknown error");
      setStatus("Event fetch failed");
    }
  }, [renderEvents]);

  useEffect(() => {
    if (!composition || !viewerRef.current || !cesiumRef.current) {
      return;
    }
    const applied = applyMapComposition(cesiumRef.current, viewerRef.current, composition);
    setBaseStyle(applied.base);
    setFilter(applied.filter);
  }, [composition]);

  useEffect(() => {
    if (!containerRef.current || viewerRef.current) {
      return;
    }

    let handler: import("cesium").ScreenSpaceEventHandler | null = null;

    const initialize = async () => {
      const Cesium = await import("cesium");
      cesiumRef.current = Cesium;
      (window as Window & { CESIUM_BASE_URL?: string }).CESIUM_BASE_URL = CESIUM_BASE_URL;

      const baseLayer = new Cesium.ImageryLayer(
        new Cesium.OpenStreetMapImageryProvider({
          url: "https://tile.openstreetmap.org/",
        }),
      );

      const viewer = new Cesium.Viewer(containerRef.current as HTMLDivElement, {
        animation: false,
        timeline: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        navigationHelpButton: false,
        sceneModePicker: false,
        fullscreenButton: false,
        infoBox: false,
        selectionIndicator: false,
        shouldAnimate: false,
        baseLayer,
        terrainProvider: new Cesium.EllipsoidTerrainProvider(),
      });

      viewer.scene.globe.enableLighting = true;
      viewer.scene.globe.depthTestAgainstTerrain = true;
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(12, 24, 3_000_000),
      });

      viewerRef.current = viewer;
      const dataSource = new Cesium.CustomDataSource("events");
      viewer.dataSources.add(dataSource);
      dataSourceRef.current = dataSource;

      handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction((movement: { position: import("cesium").Cartesian2 }) => {
        const picked = viewer.scene.pick(movement.position) as { id?: unknown } | undefined;
        const pickedId = picked?.id as { eventData?: BookEvent } | undefined;
        const eventData = pickedId?.eventData ?? null;
        if (eventData) {
          setSelectedEvent(eventData);
          selectedEventRef.current = eventData;
        } else {
          setSelectedEvent(null);
          selectedEventRef.current = null;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      try {
        const data = await fetchMapComposition();
        setComposition(data);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Unknown error");
      }

      void refreshEvents();
      setStatus("Ready");

      return () => {};
    };

    let cleanup: (() => void) | null = null;
    void initialize().then((removeMoveListener) => {
      cleanup = removeMoveListener ?? null;
    });

    return () => {
      if (handler) {
        handler.destroy();
      }
      if (cleanup) {
        cleanup();
      }
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [refreshEvents]);

  const overlaysLabel = composition?.overlays?.length
    ? `${composition.overlays.length} overlay${composition.overlays.length === 1 ? "" : "s"}`
    : "No overlays";

  return (
    <>
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
          <p className="text-[0.72rem] uppercase tracking-[0.2em] text-slate-500">
            Selected Moment
          </p>
          <div className="mt-3">
            <EventDetails event={selectedEvent} />
          </div>
        </div>
        <div className="border-t border-[#e1d5c6] pt-4">
          <p className="text-[0.72rem] uppercase tracking-[0.2em] text-slate-500">
            Viewport Status
          </p>
          <div className="mt-2 grid gap-1 text-sm text-slate-600">
            <div>Status: {status}</div>
            <div>Events visible: {events.length}</div>
            {error ? <div>Error: {error}</div> : null}
          </div>
        </div>
      </section>
      <section className="relative min-h-[620px] overflow-hidden rounded-[28px] border border-[#e1d5c6] bg-[#efe5d9] shadow-[0_30px_80px_rgba(22,18,13,0.14)] lg:min-h-[720px]">
        <div className="absolute inset-0" ref={containerRef} style={{ filter }} />
        <GlobeOverlay
          hasEvents={hasEvents}
          eventCount={events.length}
          hasFilter={Boolean(filter)}
        />
      </section>
    </>
  );
}
