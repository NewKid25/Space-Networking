import Connection from './definitions/connection'
import Position from './definitions/position'
import Packet_In_Flight from './definitions/packet_in_flight'
import SpaceBody from './definitions/space_body'
import { interceptFromCartesian } from './definitions/types'
import Orbiter from './definitions/orbiter'
// import Simulator_Engine from './simulator_engine'

class Packet_Simulator{

    connections : Connection[] = []
    packets_in_flight : Packet_In_Flight[] = []

    current_time:number = 0;
    total_time:number;
    bodies:Array<SpaceBody>;
    
    network_rescan_time = 100;

    constructor(total_time:number)
    {
        this.total_time =total_time;
    }

    calculate_all_positions()
    {
        let all_packets :[Packet_In_Flight[]] = [[]]

        for(let i =0; i<= this.total_time; i++)
        {
            if(i % this.network_rescan_time == 0)
            {
                
            }
            all_packets[i] = this.Packet_Sim_Update()
            this.current_time ++;
        }
        return all_packets
    }

    start_stream(sender: SpaceBody,receiver: SpaceBody)
    {
        if(sender.sender && receiver.sender) // both bodies have a sender
        {
            //establish connection
            this.connections.push(new Connection(sender, receiver))
        }
    }


    Packet_Sim_Update()
    {
       //send packets on communications
        for(const connection of this.connections) // this will calculate a new direction each second (probably too much)
        {
            //send packet from sender to reciever
            let dir : Position
            let arrival_time: number
            const dir_and_arrival_time = this.get_direction_for_packet_send(connection, this.current_time) //does not yet work(probably)
            dir = dir_and_arrival_time.vector;
            arrival_time = dir_and_arrival_time.time;
            this.packets_in_flight.push(connection.sender.sender.send_packet(dir, connection.sender, this.current_time, arrival_time))

        }
        this.update_packets_in_flight()  

        return this.packets_in_flight
    }
 

    //update in flight
    update_packets_in_flight()
    {
        
        let arrived_packets : Packet_In_Flight[] =[];
        [this.packets_in_flight, arrived_packets] = this.split_packets_in_flight_by_arrival(this.packets_in_flight)

        for(const packet_in_flight of this.packets_in_flight)
        {
            packet_in_flight.move_along_direction()
        }
        return arrived_packets;
    }

    split_packets_in_flight_by_arrival(packets_in_flight:Packet_In_Flight[]):[Packet_In_Flight[], Packet_In_Flight[]]
    {
        let arrived_packets : Packet_In_Flight[] =[]
        let packets_in_transit : Packet_In_Flight[] =[]
        
        for(let i = packets_in_flight.length - 1; i>=0; i--)
            {
                if (packets_in_flight[i].arrival_timestep > this.current_time)//found first entry that has not arrived
                {
                    packets_in_transit =packets_in_flight.slice(i)
                    break;
                }
                arrived_packets.push(packets_in_flight[i])
            }
            return [packets_in_transit, arrived_packets]
    }

    get_direction_for_packet_send(conn: Connection, t: number)
    {
        let A : SpaceBody = conn.sender;
        let B : SpaceBody = conn.receiver;

        const c = 299_792.458; // km/s

        if (B instanceof Orbiter) {
            let O : SpaceBody = B.parentBody;

            const result = interceptFromCartesian({
            A: { x: A.pos[t].x, y: A.pos[t].y },
            O: { x: O.pos[t].x, y: O.pos[t].y },
            B: { x: B.pos[t].x, y: B.pos[t].y },
            r: B.orbitRadius,
            vo: B.velocity,          // km/s (example orbital velocity)
            vl: c,
            });

            if (result.ok) {
                return {
                    vector: new Position(result.x / result.distance, result.y / result.distance),
                    time: result.time
                }
            }
        }
        else {
            const dx = B.pos[t].x - A.pos[t].x;
            const dy = B.pos[t].y - A.pos[t].y;
            const distance = Math.hypot(dx, dy);
            const time = distance /c;
            return {
                vector: new Position(dx / distance, dy / distance),
                time: time                
            }
        }
    }

}

export default Packet_Simulator

