interface OrbitPlanet {
  orbit: number;
  angle: number;
}

export function calculateOrbitPosition(planet: OrbitPlanet, containerSize: number) {
  const radius = (planet.orbit / 100) * containerSize;
  const radians = (planet.angle * Math.PI) / 180;
  return { x: Math.cos(radians) * radius, y: Math.sin(radians) * radius };
}

export function calculateAngle(x: number, y: number, centerX: number, centerY: number) {
  'worklet';
  return Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
}

export function getMobileOrbitRadius(orbit: number, diagramSize: number) {
  const progress = (orbit - 8) / (49 - 8);
  const radiusFraction = 0.11 + 0.325 * Math.pow(progress, 0.85);
  return radiusFraction * diagramSize;
}
