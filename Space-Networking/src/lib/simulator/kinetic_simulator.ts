import SpaceBody from "./definitions/space_body";
// import Orbiter from "./definitions/orbiter"
import Position from "./definitions/position";

class KineticSim {
    bodies: Array<SpaceBody>;
    total_time: number;

    constructor (bods: Array<SpaceBody>, time:number) {
        this.bodies = bods;
        this.total_time = time;

        this.order_bodies()
        this.calculate_all_positions()
    }

    getPriority(body: SpaceBody): number {
        const planets = [
        "Mercury", "Venus", "Earth", "Mars",
        "Jupiter", "Saturn", "Uranus", "Neptune"
        ];

        if (body.name === "Sun") return 0;
        if (planets.includes(body.name)) return 1;
        return 2;
    }

    order_bodies() { 
        this.bodies.sort((a, b) => {
        const pa = this.getPriority(a);
        const pb = this.getPriority(b);
        if (pa !== pb) return pa - pb;
        return a.name.localeCompare(b.name);
        });
    }

    calculate_all_positions() {
        let t = 1;

        while (t < this.total_time) {
            for (const body of this.bodies) {
                if ('calculate_position_at_next_t' in body && typeof (body as any).calculate_position_at_next_t === 'function') {
                    let result = (body as any).calculate_position_at_next_t(t)
                    body.pos.push(new Position(result.x, result.y));
                }
                else {
                    body.pos.push(new Position(0, 0)) 
                }

                //console.log("Time - %d, Body - %s, x - %s, y - %s", t, body.name, body.pos[t].x.toFixed(2), body.pos[t].y.toFixed(2));
            }
            // if (this.bodies[1].pos[t].y > 0 && t > 10000) {
            //     break;
            // }
            t = t + 1;
        }
    }
}

export default KineticSim