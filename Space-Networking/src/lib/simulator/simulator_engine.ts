import Packet_In_Flight from './definitions/packet_in_flight'
import Packet_Simulator from './packet_simulator';
import SpaceBody from './definitions/space_body';
import KineticSim from './kinetic_simulator';
import { LIGHT_SPEED } from './constants';

export default class Simulator_Engine
{
    packet_simulator:Packet_Simulator |undefined = undefined; 

    kinetic_simulator: KineticSim;
    
    packets_in_flight : [Packet_In_Flight[]] = [[]]
    bodies: Array<SpaceBody> = new Array<SpaceBody>();

    source: SpaceBody;
    destination: SpaceBody;
    number_of_packets: number;
    total_time:number;


    constructor (bods: Array<SpaceBody>, total_time:number, src:SpaceBody, dst:SpaceBody, num_packs:number)
    {
        this.kinetic_simulator = new KineticSim(bods, total_time)
        this.total_time = total_time
        this.source = src;
        this.destination = dst;
        this.source.attach_sender(true)
        this.source.sender!.buffer.data = Array.from({length: num_packs}, (_, i) => i) 
        this.destination.attach_sender(true)
        this.number_of_packets = num_packs;
        this.packet_simulator = new Packet_Simulator(this.total_time, this.bodies, this.destination, this.source, num_packs)

    }
    
    calculate_all_positions()
    {
        this.kinetic_simulator.calculate_all_positions()
        this.bodies = this.kinetic_simulator.bodies

        this.packet_simulator = new Packet_Simulator(this.total_time, this.bodies, this.destination, this.source, this.number_of_packets)
        this.packets_in_flight = this.packet_simulator.calculate_all_positions()
    }

    // calculate_packet_positions()
    // {
    //     this.packets_in_flight = this.packet_simulator.calculate_all_positions()
    // }

    calculate_spacebody_positions()
    {
        this.kinetic_simulator.calculate_all_positions()
        this.bodies = this.kinetic_simulator.bodies
    }


    get_packets_at_time(time: number)
    {
        return this.packets_in_flight[time]
    }

}

