import Sender_Buffer from './sender_buffer'
import Position from './position';
import Packet_In_Flight from './packet_in_flight';
import SpaceBody from './space_body';
import Simulator_Engine from '../simulator_engine';

class Sender {
    buffer: Sender_Buffer;
    next_packet_index:number =0;

        constructor();
        constructor (x: Sender_Buffer);
        constructor (x?: Sender_Buffer) {
        if(x)
        {
            this.buffer = x;
        }
        else{
            this.buffer =  new Sender_Buffer()
        }
    }

    send_packet(direction: Position, sender: SpaceBody,  arrival_timestep: number) : Packet_In_Flight
    {
        const packet_in_flight = new Packet_In_Flight(sender.pos[Simulator_Engine.current_time], direction, this.buffer[this.next_packet_index],  arrival_timestep)
        this.next_packet_index ++;
        return packet_in_flight
    }
}

export default Sender