import Packet_In_Flight from './definitions/packet_in_flight'
import Packet_Simulator from './packet_simulator';
import SpaceBody from './definitions/space_body';
import KineticSim from './kinetic_simulator';

export default class Simulator_Engine
{
    packet_simulator:Packet_Simulator; 
    kinetic_simulator: KineticSim;
    
    packets_in_flight : [Packet_In_Flight[]] = [[]]
    bodies: Array<SpaceBody> = new Array<SpaceBody>();

    constructor (bods: Array<SpaceBody>, total_time:number)
    {
        this.packet_simulator = new Packet_Simulator(total_time)
        this.kinetic_simulator = new KineticSim(bods, total_time)
    }
    


    calculate_all_positions()
    {
        this.packets_in_flight = this.packet_simulator.calculate_all_positions()
        this.kinetic_simulator.calculate_all_positions()
        this.bodies = this.kinetic_simulator.bodies
    }

    calculate_packet_positions()
    {
        this.packets_in_flight = this.packet_simulator.calculate_all_positions()
    }

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

