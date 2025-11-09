import SpaceBody from "../definitions/space_body"
import Orbiter from "../definitions/orbiter"
import Position from "../definitions/position"
import { DISTANCE_FROM_SUN } from "../constants"

let sun = new SpaceBody(1, "Sun", [new Position(0, 0)])
let mercury = new Orbiter(2, "Mercury", DISTANCE_FROM_SUN.get("Mercury") ?? 0, "Sun", sun)
let venus = new Orbiter(3, "Venus", DISTANCE_FROM_SUN.get("Venus") ?? 0, "Sun", sun)
let earth = new Orbiter(4, "Earth", DISTANCE_FROM_SUN.get("Earth") ?? 0, "Sun", sun)
let mars = new Orbiter(5, "Mars", DISTANCE_FROM_SUN.get("Mars") ?? 0, "Sun", sun)
let satellite = new Orbiter(6, "Satellite", 150000, "Mercury", mercury)
let jupiter = new Orbiter(7, "Jupiter", DISTANCE_FROM_SUN.get("Jupiter") ?? 0, "Sun", sun);
export const TestDataScenario = [sun, mercury, venus, earth, mars, satellite, jupiter];