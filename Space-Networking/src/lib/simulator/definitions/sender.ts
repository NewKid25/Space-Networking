import Sender_Buffer from './sender_buffer'
import Position from './position';
import Packet_In_Flight from './packet_in_flight';
import type SpaceBody from './space_body';
import { LOSS_RATE } from '../constants'; 
// import Simulator_Engine from '../simulator_engine';

class Sender {
    buffer: Sender_Buffer;
    next_packet_index:number =0;
    PACKET_SENTIEL:number = -1

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

    send_packet(direction: Position, sender: SpaceBody, current_time:number,  arrival_timestep: number) : Packet_In_Flight
    {
        let packet_in_flight:Packet_In_Flight;
        if(this.next_packet_index >= this.buffer.data.length)
        {
            packet_in_flight = new Packet_In_Flight(sender.pos[current_time], direction, this.PACKET_SENTIEL,  arrival_timestep,false)
        }
        else
        {
            const randomNum = Math.random();
            let drop = false;
            if (randomNum < LOSS_RATE) {
                drop = true;
            }
            packet_in_flight = new Packet_In_Flight(sender.pos[current_time], direction, this.buffer[this.next_packet_index],  arrival_timestep, drop)
        }

        this.next_packet_index ++;
        return packet_in_flight
    }
}

export default Sender