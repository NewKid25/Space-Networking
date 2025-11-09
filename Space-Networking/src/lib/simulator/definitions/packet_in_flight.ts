import Packet from "./packet";
import Position from "./position";

class Packet_In_Flight
{
    position:Position;
    direction:Position; //okat position is just a 2d vector so we can treat it as a direction vector
    packet: Packet;

    constructor(position: Position, direction: Position, packet: Packet) {
        this.position = position;
        this.direction = direction;
        this.packet = packet;
    }
}

export default Packet_In_Flight 