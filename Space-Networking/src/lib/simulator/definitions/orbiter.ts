import Position from './position'
import SpaceBody from './space_body'
import {DISTANCE_FROM_SUN, GM_CONSTANTS} from '../constants'

class Oribiter extends SpaceBody {
    velocity: number; // in km/s
    orbitRadius: number; // in km
    orbitingBody: string;
    parentBody: SpaceBody;

    constructor(id: number, name: string, r: number, orbit_body: string, parent:SpaceBody, p?: Position) {
        if (p == undefined) {
            const distance = DISTANCE_FROM_SUN.get(orbit_body) ?? 0;
            super(id, name, [new Position(0.0, distance)]);
        }
        else {
            super(id, name, [p]);
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
        return Math.sqrt(gmConstant / radius);
    }

    calculate_position_at_next_t(t: number) {
        if (t > 0) {
            let planet_x = this.parentBody.pos[t - 1]?.x ?? 0;
            let planet_y = this.parentBody.pos[t - 1]?.y ?? 0;

            let orbiter_x = this.pos[t - 1]?.x ?? 0;
            let orbiter_y = this.pos[t - 1]?.y ?? 0;

            const dt = 1;
            const omega = this.velocity / this.orbitRadius;
            const theta = Math.atan2(orbiter_y - planet_y, orbiter_x - planet_y);
            const new_theta = theta + omega * dt;

            return {
                x: planet_x + this.orbitRadius * Math.cos(new_theta),
                y: planet_y + this.orbitRadius * Math.sin(new_theta)
            }
        }
        throw new Error("Need to have valid time step (> 0)")
    }

    position_at_t(t: number) {
        if (t > 0) {
            return this.pos[t];
        }
        throw new Error("Need to have valid time step (> 0)")
    }
}

export default Oribiter