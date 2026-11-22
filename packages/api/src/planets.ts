export type PlanetId =
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune';

export interface Planet {
  id: PlanetId;
  name: string;
  size: number;
  orbit: number;
  angle: number;
  longitude: number | null;
  latitude: number | null;
  sign: string;
  retrograde: boolean;
}

export interface CelestialBody {
  type: string;
  longitude: number;
  latitude: number;
  longitude_speed: number;
  retrograde: boolean;
  sign: string;
  degrees_in_sign: number;
}

export interface PlanetApiResponse {
  datetime: string;
  zodiac: string;
  bodies: Partial<Record<PlanetId | 'sun' | 'moon' | 'pluto' | 'rahu' | 'ketu', CelestialBody>>;
}

export const API_URL =
  'https://freehoroscopeapi.com/api/v1/planetary-positions?zodiac=sidereal';

export const INITIAL_PLANETS: Planet[] = [
  { id: 'mercury', name: 'Mercury', size: 9, orbit: 8, angle: -90, longitude: null, latitude: null, sign: 'Unknown', retrograde: false },
  { id: 'venus', name: 'Venus', size: 12, orbit: 14, angle: -45, longitude: null, latitude: null, sign: 'Unknown', retrograde: false },
  { id: 'earth', name: 'Earth', size: 13, orbit: 20, angle: 0, longitude: null, latitude: null, sign: 'Unknown', retrograde: false },
  { id: 'mars', name: 'Mars', size: 11, orbit: 26, angle: 45, longitude: null, latitude: null, sign: 'Unknown', retrograde: false },
  { id: 'jupiter', name: 'Jupiter', size: 25, orbit: 33, angle: 90, longitude: null, latitude: null, sign: 'Unknown', retrograde: false },
  { id: 'saturn', name: 'Saturn', size: 24, orbit: 39, angle: 135, longitude: null, latitude: null, sign: 'Unknown', retrograde: false },
  { id: 'uranus', name: 'Uranus', size: 16, orbit: 45, angle: 180, longitude: null, latitude: null, sign: 'Unknown', retrograde: false },
  { id: 'neptune', name: 'Neptune', size: 16, orbit: 49, angle: 225, longitude: null, latitude: null, sign: 'Unknown', retrograde: false },
];

export async function getPlanetPositions(
  signal?: AbortSignal,
): Promise<PlanetApiResponse> {
  const response = await fetch(API_URL, {
    headers: { Accept: 'application/json' },
    signal,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json() as Promise<PlanetApiResponse>;
}

export function mergePlanetPositions(
  planets: Planet[],
  response: PlanetApiResponse,
): Planet[] {
  return planets.map((planet) => {
    if (planet.id === 'earth') return planet;
    const body = response.bodies[planet.id];
    if (!body) return planet;

    return {
      ...planet,
      angle: body.longitude,
      longitude: body.longitude,
      latitude: body.latitude,
      sign: body.sign,
      retrograde: body.retrograde,
    };
  });
}

export function formatDegrees(
  value: number | null,
  digits = 2,
  fallback = 'No API data',
) {
  return value === null ? fallback : `${value.toFixed(digits)}\u00B0`;
}
