
"use client";

import { useEffect, useRef, useState } from "react";

import {
  DndContext,
  PointerSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import type {
  DragStartEvent,
  DragMoveEvent,
} from "@dnd-kit/core";

import {
  fetchPlanets,
  selectPlanet,
  setPlanetAngle,
  calculateOrbitPosition,
  calculateAngle,
  useAppDispatch,
  useAppSelector,
  type Planet,
  type PlanetId,
} from "@solar-system/store";

import { formatDegrees } from "@solar-system/api";
import Image from "next/image";
import { getArtworkDataUri, type ArtworkId } from "@solar-system/ui";

interface SolarSystemProps {
  refreshKey?: number;
}

interface DragPosition {
  id: PlanetId;
  angle: number;
}

function PlanetIcon({
  id,
  size,
}: {
  id: ArtworkId;
  size: number;
}) {
  return (
    <Image
      src={getArtworkDataUri(id)}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="pointer-events-none overflow-visible"
      alt={id}
      unoptimized
    />
  );
}

interface DraggablePlanetProps {
  planet: Planet;
  selected: boolean;
  onSelect: () => void;
  containerSize: number;
}

function DraggablePlanet({
  planet,
  selected,
  onSelect,
  containerSize,
}: DraggablePlanetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useDraggable({
    id: planet.id,
  });

  const { x, y } = calculateOrbitPosition(
    planet,
    containerSize
  );

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...listeners}
      {...attributes}
      onClick={onSelect}
      className={`absolute z-20 flex items-center justify-center rounded-full outline-none transition-[filter] duration-200 ${
        selected
          ? "z-30 brightness-125"
          : "hover:brightness-125"
      } ${isDragging ? "scale-110 cursor-grabbing" : "cursor-grab"}`}
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        width: planet.size * 2 + 28,
        height: planet.size * 2 + 28,
        transform: "translate(-50%, -50%)",
        touchAction: "none",
      }}
      title={planet.name}
    >
      <PlanetIcon
        id={planet.id}
        size={planet.size * 2}
      />

      <span
        className={`absolute top-full mt-1 whitespace-nowrap text-[10px] tracking-wide ${
          selected
            ? "text-[var(--text)]"
            : "text-[var(--text-muted)]"
        }`}
      >
        {planet.name}
      </span>
    </button>
  );
}

export default function SolarSystem({
  refreshKey = 0,
}: SolarSystemProps) {
  const dispatch = useAppDispatch();

  const planets = useAppSelector(
    (state) => state.planets.planets
  );

  const selectedPlanet = useAppSelector(
    (state) => state.planets.selectedPlanet
  );

  const loading = useAppSelector(
    (state) => state.planets.status === "loading"
  );

  const error = useAppSelector(
    (state) => state.planets.error
  );

  const updatedAt = useAppSelector(
    (state) => state.planets.updatedAt
  );

  const [containerSize, setContainerSize] = useState(700);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragPosition = useRef<DragPosition | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    })
  );

  useEffect(() => {
    const request = dispatch(fetchPlanets());

    return () => {
      request.abort();
    };
  }, [dispatch, refreshKey]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      const size = Math.min(
        entry.contentRect.width,
        entry.contentRect.height
      );

      setContainerSize(size);
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  function handleDragStart(event: DragStartEvent) {
    const planet = planets.find(
      (item) => item.id === event.active.id
    );

    if (!planet) return;

    dragPosition.current = {
      id: planet.id,
      angle: planet.angle,
    };

    dispatch(selectPlanet(planet.id));
  }

  function handleDragMove(event: DragMoveEvent) {
    const drag = dragPosition.current;

    if (!drag || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const planet = planets.find(
      (item) => item.id === drag.id
    );

    if (!planet) return;

    const radius =
      (planet.orbit / 100) * containerSize;

    if (radius === 0) return;

    const startRadians = (drag.angle * Math.PI) / 180;

    const startX =
      rect.width / 2 + Math.cos(startRadians) * radius;

    const startY =
      rect.height / 2 + Math.sin(startRadians) * radius;

    const currentX = startX + event.delta.x;
    const currentY = startY + event.delta.y;

    const angle = calculateAngle(
      currentX,
      currentY,
      rect.width / 2,
      rect.height / 2
    );

    dispatch(
      setPlanetAngle({
        id: drag.id,
        angle,
      })
    );
  }

  function handleDragEnd() {
    dragPosition.current = null;
  }

  const selected = planets.find(
    (planet) => planet.id === selectedPlanet
  );

  return (
    <section className="min-h-[calc(100vh-72px)] overflow-hidden bg-[var(--background)] text-[var(--text)]">
      <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-[1600px] flex-col px-5 py-8 lg:px-10 lg:py-10">

        <header className="mb-8 flex flex-col justify-between gap-4 border-b border-[var(--border)] pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)]">
              Interactive planetary system
            </p>

            <h1 className="mt-2 text-2xl font-light tracking-wide md:text-3xl">
              Explore the Solar System
            </h1>

            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Перетягуй планети та досліджуй їхні характеристики
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
            <span
              className={`h-2 w-2 rounded-full ${
                loading
                  ? "bg-amber-400"
                  : error
                    ? "bg-red-400"
                    : "bg-emerald-400"
              }`}
            />

            {loading
              ? "Updating data..."
              : error
                ? "Connection error"
                : "System online"}
          </div>
        </header>

        <div className="grid flex-1 grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px]">

          <div className="flex min-w-0 items-center justify-center">
            <DndContext
              id="solar-system-drag"
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragEnd}
            >
              <div
                ref={containerRef}
                className="relative aspect-square w-full max-w-[850px] select-none"
              >

                {planets.map((planet) => (
                  <div
                    key={planet.id}
                    className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-[var(--orbit)]"
                    style={{
                      width: `${planet.orbit * 2}%`,
                      height: `${planet.orbit * 2}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                ))}

                <div
                  className="absolute left-1/2 top-1/2 z-10 flex items-center justify-center"
                  style={{
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="absolute h-32 w-32 rounded-full bg-orange-500/10 blur-3xl" />

                  <PlanetIcon id="sun" size={76} />
                </div>

                {planets.map((planet) => (
                  <DraggablePlanet
                    key={planet.id}
                    planet={planet}
                    selected={selectedPlanet === planet.id}
                    onSelect={() =>
                      dispatch(selectPlanet(planet.id))
                    }
                    containerSize={containerSize}
                  />
                ))}
              </div>
            </DndContext>
          </div>

          <aside className="flex flex-col gap-5 lg:border-l lg:border-[var(--border)] lg:pl-6 xl:pl-8">

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
                Selected object
              </p>

              {selected ? (
                <>
                  <div className="mt-5 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--surface-soft)]">
                      <PlanetIcon
                        id={selected.id}
                        size={selected.size * 2}
                      />
                    </div>

                    <div>
                      <h2 className="text-xl font-medium">
                        {selected.name}
                      </h2>

                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        {selected.id === "earth"
                          ? "Static position"
                          : "Planet"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <InfoRow
                      label="Longitude"
                      value={
                        selected.longitude !== null
                          ? formatDegrees(selected.longitude, 2)
                          : "No API data"
                      }
                    />

                    <InfoRow
                      label="Latitude"
                      value={
                        selected.latitude !== null
                          ? formatDegrees(selected.latitude, 2)
                          : "No API data"
                      }
                    />

                    <InfoRow
                      label="Zodiac sign"
                      value={selected.sign}
                    />

                    <InfoRow
                      label="Movement"
                      value={
                        selected.retrograde
                          ? "Retrograde"
                          : "Direct"
                      }
                    />
                  </div>
                </>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-[var(--text-muted)]">
                    No planet selected
                  </p>

                  <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
                    Натисни на планету, щоб переглянути її інформацію
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
                Planet list
              </p>

              <div className="mt-4 space-y-1">
                {planets.map((planet) => (
                  <button
                    key={planet.id}
                    type="button"
                    onClick={() =>
                      dispatch(selectPlanet(planet.id))
                    }
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors ${
                      selectedPlanet === planet.id
                        ? "bg-blue-500/10 text-[var(--text)]"
                        : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <PlanetIcon
                        id={planet.id}
                        size={22}
                      />

                      <span className="text-sm">
                        {planet.name}
                      </span>
                    </span>

                    <span className="text-[10px] text-[var(--text-muted)]">
                      {planet.longitude !== null
                        ? formatDegrees(planet.longitude, 1)
                        : "—"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
                Data source
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">
                  API connection
                </span>

                <span
                  className={`text-xs ${
                    error
                    ? "text-[var(--status-error)]"
                      : loading
                        ? "text-[var(--status-warning)]"
                        : "text-[var(--status-success)]"
                  }`}
                >
                  {error
                    ? "Error"
                    : loading
                      ? "Loading"
                      : "Connected"}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">
                  Planets
                </span>

                <span className="text-xs text-[var(--text)]">
                  8 objects
                </span>
              </div>

              <div className="mt-3 border-t border-[var(--border)] pt-3">
                <p className="text-[10px] text-[var(--text-muted)]">
                  {updatedAt
                    ? `Last update: ${new Date(updatedAt).toLocaleString()}`
                    : "Waiting for API response"}
                </p>
              </div>

              {error && (
                <p className="mt-3 text-xs text-[var(--status-error)]">
                  {error}
                </p>
              )}
            </div>
          </aside>
        </div>

        <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-[var(--border)] pt-5 text-[10px] text-[var(--text-muted)] sm:flex-row">
          <span>Solar System Explorer</span>
          <span>Planet positions provided by FreeHoroscopeAPI</span>
        </footer>
      </div>
    </section>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-[var(--text-muted)]">
        {label}
      </span>

      <span className="text-xs text-[var(--text)]">
        {value}
      </span>
    </div>
  );
}
