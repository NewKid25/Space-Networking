import SpaceBody from "./definitions/space_body";
import Orbiter from "./definitions/orbiter"

class KineticSim {
    bodies: Array<SpaceBody>;
    total_time: number;

    constructor (bods: Array<SpaceBody>, time:number) {
        this.bodies = bods;
        this.total_time = time;

        this.order_bodies()
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
        let t = 0;

        while (t < this.total_time) {
            for (const body of this.bodies) {
                if (body instanceof Orbiter) {
                    console.log(this.bodies.map(b => b.name));
                }
                else {
                    body.pos
                }
            }
            t = t + 1;
        }
    }
}

export default KineticSim