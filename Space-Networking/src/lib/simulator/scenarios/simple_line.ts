import SpaceBody from "../definitions/space_body";
import Position from "../definitions/position";


const EARTH_RADIUS = 12756 * 3;
const MARS_RADIUS = 6792 * 3;
const SAT_RADIUS = 8000;


const GAP = 90000;

const radii = [EARTH_RADIUS, SAT_RADIUS, SAT_RADIUS, SAT_RADIUS, MARS_RADIUS];

const centers: number[] = [];
centers[0] = 0; 

for (let i = 1; i < radii.length; i++) {
  centers[i] = centers[i - 1] + radii[i - 1] + GAP + radii[i];
}

const mid = (centers[0] + centers[centers.length - 1]) / 2;
for (let i = 0; i < centers.length; i++) {
  centers[i] -= mid;
}

const earth = new SpaceBody(1, "Earth", [new Position(centers[0], 0)]);
const sat1  = new SpaceBody(2, "Satellite", [new Position(centers[1], 0)]);
const sat2  = new SpaceBody(3, "Satellite", [new Position(centers[2], 0)]);
const sat3  = new SpaceBody(4, "Satellite", [new Position(centers[3], 0)]);
const mars  = new SpaceBody(5, "Mars", [new Position(centers[4], 0)]);


export const SimpleLineScenario: SpaceBody[] = [earth, sat1, sat2, sat3, mars];
