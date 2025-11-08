import Position from './position'

const DISTANCE_FROM_SUN: Map<string, number> = new Map([
    ["Mercury", 58*10^6],
    ["Venus", 109*10^6],
    ["Earth", 150*10^6],
    ["Mars", 228*10^6],
    ["Jupiter", 778*10^6],
    ["Saturn", 1.4*10^9],
    ["Uranus", 2.9*10^9],
    ["Neptune", 4.5*10^9]
])

const GM_CONSTANTS: Map<string, number> = new Map([
    ["Sun", 1.327*10^11],
    ['Mercury', 22031.868551],
    ['Venus', 324858.592000],
    ['Earth', 398600.435507],
    ['Mars', 42828.375816],
    ['Jupiter', 126712764.10],
    ['Saturn', 37940584.8418],
    ['Uranus', 5794556.40],
    ['Neptune', 6836527.10058]
])

class Body {
    id: number;
    name: string;
    pos: Position;

    constructor(id: number, name: string, p: Position) {
            this.id = id;
            this.name = name;
            this.pos = p;
        }
}

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

