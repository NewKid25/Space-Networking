import Sender_Buffer from './sender_buffer'
import Position from './position';
import Packet_In_Flight from './packet_in_flight';
import type SpaceBody from './space_body';
import { LOSS_RATE } from '../constants'; 
import type { Packet } from './packet';
// import Simulator_Engine from '../simulator_engine';

const PACKET_SENTIEL:number = -1
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

    send_packet(direction: Position, sender: SpaceBody, current_time:number,  arrival_timestep: number, recipient_id:number) : Packet_In_Flight
    {
        // console.log("current time + arrive time", arrival_timestep+current_time)
        let packet_in_flight:Packet_In_Flight;
        if(this.next_packet_index >= this.buffer.data.length)
        {
            packet_in_flight = new Packet_In_Flight(sender.pos![current_time]!, direction, PACKET_SENTIEL,  arrival_timestep+current_time,false, recipient_id)
        }
        else
        {
            const randomNum = Math.random();
            let drop = false;
            if (randomNum < LOSS_RATE) {
                drop = true;
            }
            packet_in_flight = new Packet_In_Flight(sender.pos![current_time]!, direction, this.buffer.data[this.next_packet_index]!,  arrival_timestep+current_time, drop, recipient_id)
        }

        this.next_packet_index ++;
        return packet_in_flight
    }

    receive_packet(packet:Packet)
    {
        this.buffer.data.push(packet)
    }
}

export default Sender