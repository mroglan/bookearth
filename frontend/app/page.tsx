"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type CesiumModule = typeof import("cesium");

type BookEvent = {
  id: string;
  title: string;
  description: string | null;
  lat: number;
  lon: number;
  zoom_level: number;
  importance: number | null;
  narrative_index: number | null;
};

type MapComposition = {
  base?: "terrain" | "satellite" | "minimal" | string;
  overlays?: Array<{ type: string; variant?: string; opacity?: number }>;
  postProcessing?: {
    colorGrade?: "sepia" | "dark" | "muted" | string;
  };
};

type RectangleLike = {
  west: number;
  south: number;
  east: number;
  north: number;
};

const BOOK_ID = "1";
const CESIUM_BASE_URL = "/cesium/";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

const COLOR_GRADES: Record<string, string> = {
  muted: "saturate(0.75) contrast(1.05)",
  sepia: "sepia(0.35) saturate(0.8)",
  dark: "brightness(0.9) saturate(0.85) contrast(1.05)",
};

function toZoomLevel(height: number): number {
  if (height > 20_000_000) return 2;
  if (height > 12_000_000) return 3;
  if (height > 7_000_000) return 4;
  if (height > 4_000_000) return 5;
  if (height > 2_000_000) return 6;
  if (height > 1_000_000) return 7;
  if (height > 500_000) return 8;
  if (height > 250_000) return 9;
  return 10;
}

function rectangleToBbox(
  Cesium: CesiumModule,
  rect: RectangleLike | undefined,
): [number, number, number, number] {
  if (!rect) {
    return [-180, -90, 180, 90];
  }
  const west = Cesium.Math.toDegrees(rect.west);
  const south = Cesium.Math.toDegrees(rect.south);
  const east = Cesium.Math.toDegrees(rect.east);
  const north = Cesium.Math.toDegrees(rect.north);
  return [west, south, east, north];
}

function bboxKey(bbox: [number, number, number, number], zoomLevel: number): string {
  return `${bbox.map((value) => value.toFixed(3)).join(",")}:${zoomLevel}`;
}

function applyMapComposition(
  Cesium: CesiumModule,
  viewer: import("cesium").Viewer,
  composition: MapComposition | null,
): { base: string; filter: string } {
  const base = composition?.base ?? "terrain";
  viewer.imageryLayers.removeAll();
  viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString("#efe5d9");

  if (base === "satellite") {
    viewer.imageryLayers.addImageryProvider(
      new Cesium.UrlTemplateImageryProvider({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      }),
    );
  } else if (base === "minimal") {
    viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString("#f1ede6");
  } else {
    viewer.imageryLayers.addImageryProvider(
      new Cesium.OpenStreetMapImageryProvider({
        url: "https://tile.openstreetmap.org/",
      }),
    );
  }

  const colorGrade = composition?.postProcessing?.colorGrade ?? "";
  const filter = COLOR_GRADES[colorGrade] ?? "";
  return { base, filter };
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<import("cesium").Viewer | null>(null);
  const dataSourceRef = useRef<import("cesium").CustomDataSource | null>(null);
  const cesiumRef = useRef<CesiumModule | null>(null);
  const lastRequestRef = useRef<string | null>(null);

  const [events, setEvents] = useState<BookEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<BookEvent | null>(null);
  const [composition, setComposition] = useState<MapComposition | null>(null);
  const [baseStyle, setBaseStyle] = useState("terrain");
  const [status, setStatus] = useState("Loading Cesium...");
  const [zoomLevel, setZoomLevel] = useState(6);
  const [bbox, setBbox] = useState<[number, number, number, number]>([-180, -90, 180, 90]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  const bboxLabel = useMemo(() => bbox.map((value) => value.toFixed(2)).join(", "), [bbox]);

  const fetchComposition = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/books/${BOOK_ID}/map-composition`);
      if (!response.ok) {
        throw new Error("Failed to load map composition");
      }
      const data = (await response.json()) as MapComposition;
      setComposition(data);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unknown error");
    }
  }, []);

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

  const fetchEvents = useCallback(async () => {
    const viewer = viewerRef.current;
    const Cesium = cesiumRef.current;
    if (!viewer || !Cesium) {
      return;
    }

    const rect = viewer.camera.computeViewRectangle(viewer.scene.globe.ellipsoid) as
      | RectangleLike
      | undefined;
    const nextBbox = rectangleToBbox(Cesium, rect);
    const height = viewer.camera.positionCartographic.height;
    const nextZoom = toZoomLevel(height);
    const requestKey = bboxKey(nextBbox, nextZoom);

    if (lastRequestRef.current === requestKey) {
      return;
    }

    lastRequestRef.current = requestKey;
    setZoomLevel(nextZoom);
    setBbox(nextBbox);
    setStatus("Fetching events...");

    try {
      const params = new URLSearchParams({
        bbox: nextBbox.join(","),
        zoomLevel: String(nextZoom),
      });
      const response = await fetch(
        `${API_BASE_URL}/api/books/${BOOK_ID}/events?${params.toString()}`,
      );
      if (!response.ok) {
        throw new Error("Failed to load events");
      }
      const data = (await response.json()) as { events: BookEvent[] };
      setEvents(data.events);
      renderEvents(Cesium, data.events);
      if (selectedEvent && !data.events.find((event) => event.id === selectedEvent.id)) {
        setSelectedEvent(null);
      }
      setStatus(`Loaded ${data.events.length} events`);
      setError(null);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unknown error");
      setStatus("Event fetch failed");
    }
  }, [renderEvents, selectedEvent]);

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
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

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
        } else {
          setSelectedEvent(null);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      const onMoveEnd = () => {
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }
        debounceTimer = setTimeout(() => {
          void fetchEvents();
        }, 200);
      };

      viewer.camera.moveEnd.addEventListener(onMoveEnd);

      void fetchComposition();
      void fetchEvents();

      setStatus("Ready");

      return () => {
        viewer.camera.moveEnd.removeEventListener(onMoveEnd);
      };
    };

    let cleanup: (() => void) | null = null;
    void initialize().then((removeMoveListener) => {
      cleanup = removeMoveListener ?? null;
    });

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
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
  }, [fetchComposition, fetchEvents]);

  const overlaysLabel = composition?.overlays?.length
    ? `${composition.overlays.length} overlay${composition.overlays.length === 1 ? "" : "s"}`
    : "No overlays";

  return (
    <>
      <section className="panel">
        <div>
          <p className="section-title">Book Earth MVP</p>
          <h1>Around the World in Eighty Days</h1>
        </div>
        <p>
          This globe is live-wired to the MVP API. Pan, zoom, and tilt to watch the camera bounding
          box and zoom-level filter reshape the event constellation.
        </p>
        <div className="panel-meta">
          <div>Book id: {BOOK_ID}</div>
          <div>Base style: {baseStyle}</div>
          <div>Composition: {overlaysLabel}</div>
        </div>
        <div className="panel-section">
          <p className="section-title">Selected Moment</p>
          {selectedEvent ? (
            <div className="event-card">
              <h2>{selectedEvent.title}</h2>
              <p>{selectedEvent.description ?? "No description provided."}</p>
              <div className="badge-row">
                <span className="badge">Zoom {selectedEvent.zoom_level}</span>
                {selectedEvent.importance !== null && (
                  <span className="badge">Importance {selectedEvent.importance}</span>
                )}
              </div>
            </div>
          ) : (
            <p>Click an event marker to inspect the narrative details.</p>
          )}
        </div>
        <div className="panel-section">
          <p className="section-title">Viewport Status</p>
          <div className="panel-meta">
            <div>Status: {status}</div>
            <div>Zoom level: {zoomLevel}</div>
            <div>Events visible: {events.length}</div>
            <div>BBox: {bboxLabel}</div>
            {error ? <div>Error: {error}</div> : null}
          </div>
        </div>
      </section>
      <section className="globe-shell">
        <div className="globe" ref={containerRef} style={{ filter }} />
        <div className="globe-overlay">
          <div className="status-row">
            <span className="status-label">Zoom</span>
            <span>{zoomLevel}</span>
          </div>
          <div className="status-row">
            <span className="status-label">Events</span>
            <span>{events.length}</span>
          </div>
          <div className="status-row">
            <span className="status-label">Filter</span>
            <span>{filter ? "On" : "Off"}</span>
          </div>
        </div>
      </section>
    </>
  );
}
