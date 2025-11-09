import type {Packet} from "./packet";
import Position from "./position";
import {normalize_vector} from "../ultility";
import { LIGHT_SPEED } from "../constants";

class Packet_In_Flight
{
    position:Position;
    direction:Position; //okat position is just a 2d vector so we can treat it as a direction vector
    packet: Packet;
    arrival_timestep: number;
    dropped: boolean = false;

    constructor(position: Position, direction: Position, packet: Packet,  arrival_timestep: number, drop: boolean) {
        this.position = new Position(position.x, position.y);
        this.direction = normalize_vector(direction);
        this.packet = packet;   
        this.arrival_timestep = arrival_timestep;
        this.dropped = drop;
    }

    move_along_direction()
    {
        console.log("X", this.position.x, "Y:", this.position.y)
        this.position.x += this.direction.x * LIGHT_SPEED
        this.position.y += this.direction.y * LIGHT_SPEED
        console.log("X", this.position.x, "Y:", this.position.y)
    }
}

export default Packet_In_Flight 