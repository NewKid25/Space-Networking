// src/lib/simulator/scenarios/simple_line_scenario.ts
import SpaceBody from "../definitions/space_body";
import Position from "../definitions/position";
import { DISTANCE_FROM_SUN } from "../constants";

// Real distances from your map (km)
const earthReal = DISTANCE_FROM_SUN.get("Earth") ?? 150 * 10 ** 4;
const marsReal = DISTANCE_FROM_SUN.get("Mars") ?? 228 * 10 ** 4;
const realDelta = marsReal - earthReal; // 780,000 in your scale

// We want everything to fit nicely in view AND not overlap:
// choose a view span comfortably inside the camera (~400,000)
const viewSpan = 400_000;              // total distance from Earth to Mars in scene units
const halfSpan = viewSpan / 2;

// Map real distances into this span (linear scaling)
const scale = viewSpan / realDelta;

// Place Earth and Mars using scaled real offsets, centered around 0
// (this preserves the "Earth–Mars gap" proportionally)
const earthX = -halfSpan;
const marsX = +halfSpan;

// Number of satellites between them
const numSatellites = 3;

// Even segments between Earth and Mars (4 gaps for 3 sats)
const segment = (marsX - earthX) / (numSatellites + 1);

// Static bodies: no Orbiters here, just fixed points
const earth = new SpaceBody(1, "Earth", [new Position(earthX, 0)]);
const mars = new SpaceBody(2, "Mars", [new Position(marsX, 0)]);

// Three evenly spaced satellites between Earth and Mars
const satellites: SpaceBody[] = Array.from({ length: numSatellites }, (_, i) => {
  const x = earthX + (i + 1) * segment; // -100000, 0, +100000
  return new SpaceBody(3 + i, `Satellite ${i + 1}`, [new Position(x, 0)]);
});

// Export in order: Earth — S1 — S2 — S3 — Mars
export const SimpleLineScenario: SpaceBody[] = [earth, ...satellites, mars];
