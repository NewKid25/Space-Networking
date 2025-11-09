import Position from './position'
import {DISTANCE_FROM_SUN, GM_CONSTANTS} from '../constants'
import SpaceBody from './space_body'

class Orbiter extends SpaceBody {
    velocity: number; // in km/s
    orbitRadius: number; // in km
    orbitingBody: string;
    parentBody: SpaceBody;

    constructor(id: number, name: string, r: number, orbit_body: string, parent: SpaceBody, p?: Position) {
    // If explicit position is provided, use it
    if (p !== undefined) {
        super(id, name, [p]);
    } else {
        if (orbit_body === "Sun") {
        const distance = DISTANCE_FROM_SUN.get(name) ?? 0;
        super(id, name, [new Position(distance, 0.0)]);
        } else {
        const parent0 = parent.pos[parent.pos.length - 1] ?? new Position(0, 0);
        const theta0 = 0;
        const x0 = parent0.x + r * Math.cos(theta0);
        const y0 = parent0.y + r * Math.sin(theta0);
        super(id, name, [new Position(x0, y0)]);
        }
    }

    this.velocity = this.calculate_velocity(orbit_body, r);
    this.orbitRadius = r;
    this.orbitingBody = orbit_body;
    this.parentBody = parent;
    }

    calculate_velocity(planet_name:string, radius:number) {
        if (planet_name == undefined) {
            planet_name = "Sun";
        }
        const gmConstant = GM_CONSTANTS.get(planet_name) ?? GM_CONSTANTS.get("Sun") ?? 0;
        // console.log(gmConstant);
        return Math.sqrt(gmConstant / radius);
    }

    calculate_position_at_next_t(t: number) {
    if (t <= 0) throw new Error("Need t > 0");

    // Parent at previous and current frames
    const parentPrev = this.parentBody.pos[t - 1];
    const parentCurr = this.parentBody.pos[this.parentBody.pos.length - 1];

    // Orbiter previous position
    const orbPrev = this.pos[t - 1];

    const dt = 1; // your timestep
    const omega = this.velocity / this.orbitRadius; // rad/s; set sign for CW/CCW if needed

    // 1) Angle at the PREVIOUS frame, relative to the parent's PREVIOUS position
    const thetaPrev = Math.atan2(orbPrev!.y - parentPrev!.y, orbPrev!.x - parentPrev!.x);

    // 2) Advance angle
    const thetaNew = thetaPrev + omega * dt;

    // 3) Place orbiter around the parent's CURRENT position
    return {
        x: parentCurr!.x + this.orbitRadius * Math.cos(thetaNew),
        y: parentCurr!.y + this.orbitRadius * Math.sin(thetaNew),
    };
    }

    position_at_t(t: number) {
        if (t > 0) {
            return this.pos[t];
        }
        throw new Error("Need to have valid time step (> 0)")
    }
}

export default Orbiter