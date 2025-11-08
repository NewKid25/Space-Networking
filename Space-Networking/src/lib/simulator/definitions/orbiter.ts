import Position from './position'
import Body from './body'

class Oribiter extends Body {
    velocity: number; // in km/s
    orbitRadius: number; // in km
    orbitingBody: string;

    constructor(id: number, name: string, p: Position, r:number, orbit_body:string) {
        super(id, name, p);
        this.velocity = this.calculate_velocity(orbit_body, r);
        this.orbitRadius = r;
        this.orbitingBody = orbit_body;
    }

    calculate_velocity(planet_name:string, radius:number) {
        if (planet_name == undefined) {
            planet_name = "Sun";
        }
        const gmConstant = GM_CONSTANTS.get(planet_name) ?? GM_CONSTANTS.get("Sun") ?? 0;
        return Math.sqrt(gmConstant / radius);
    }
}

