"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Cartesian2, CustomDataSource, Entity, ScreenSpaceEventHandler, Viewer } from "cesium";
import { applyMapComposition } from "../utils/cesium";
import type { BookEvent, MapComposition } from "../utils/types";

type CesiumModule = typeof import("cesium");
type CesiumEntityWithEvent = Entity & { eventData: BookEvent };

const CESIUM_BASE_URL = "/cesium/";

export function useCesiumGlobe(events: BookEvent[], composition: MapComposition | null) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const dataSourceRef = useRef<CustomDataSource | null>(null);
  const cesiumRef = useRef<CesiumModule | null>(null);

  const [selectedEvent, setSelectedEvent] = useState<BookEvent | null>(null);

  const renderEvents = useCallback((Cesium: CesiumModule, nextEvents: BookEvent[]) => {
    const dataSource = dataSourceRef.current;
    if (!dataSource) return;
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
      (entity as CesiumEntityWithEvent).eventData = event;
    });
  }, []);

  // Re-render entities when events change
  useEffect(() => {
    const Cesium = cesiumRef.current;
    if (!Cesium || !viewerRef.current) return;
    renderEvents(Cesium, events);
  }, [events, renderEvents]);

  // Apply composition when it changes
  useEffect(() => {
    const Cesium = cesiumRef.current;
    const viewer = viewerRef.current;
    if (!Cesium || !viewer || !composition) return;
    applyMapComposition(Cesium, viewer, composition);
  }, [composition]);

  // Initialize Cesium viewer once
  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;

    let handler: ScreenSpaceEventHandler | null = null;

    const initialize = async () => {
      const Cesium = await import("cesium");
      cesiumRef.current = Cesium;
      (window as Window & { CESIUM_BASE_URL?: string }).CESIUM_BASE_URL = CESIUM_BASE_URL;

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
      handler.setInputAction((movement: { position: Cartesian2 }) => {
        const picked = viewer.scene.pick(movement.position) as { id?: unknown } | undefined;
        const entity = picked?.id as CesiumEntityWithEvent | undefined;
        setSelectedEvent(entity?.eventData ?? null);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      if (composition) {
        applyMapComposition(Cesium, viewer, composition);
      }

      renderEvents(Cesium, events);
    };

    void initialize();

    return () => {
      handler?.destroy();
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
    // Only run on mount — events/composition are handled by their own effects
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { containerRef, selectedEvent };
}
