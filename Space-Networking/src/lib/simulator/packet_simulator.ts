import Body from './definitions/space_body'
import Connection from './definitions/connection'
import Position from './definitions/position'
import Packet_In_Flight from './definitions/packet_in_flight'
import SpaceBody from './definitions/space_body'
import { interceptFromCartesian } from './definitions/types'
import Simulator_Engine from './simulator_engine'

class Packet_Simulator{

    connections : Connection[] = []
    packets_in_flight : Packet_In_Flight[] = []

    total_time:number

    constructor(total_time:number)
    {
        this.total_time =total_time
    }

    calculate_all_positions()
    {
        let all_packets :[Packet_In_Flight[]] = [[]]

        for(let i =0; i<= this.total_time; i++)
        {
            all_packets[i] = this.Packet_Sim_Update()
        }
        return all_packets
    }

    start_stream(sender: Body,receiver: Body)
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
            let dir : Position = this.get_direction_for_packet_send(connection) //does not yet work(probably)
            this.packets_in_flight.push(connection.sender.sender.send_packet(dir, connection.sender))

        }
        this.update_packets_in_flight()  

        return this.packets_in_flight
    }
 

    //update in flight
    update_packets_in_flight()
    {
        //remove 
        this.packets_in_flight = this.packets_in_flight.filter((packet)=> packet.arrival_timestep <= Simulator_Engine.current_time)

        let arrived_packets : Packet_In_Flight[] =[];
        [this.packets_in_flight, arrived_packets] = this.split_packets_in_flight_by_arrival(this.packets_in_flight)

        for(const packet_in_flight of this.packets_in_flight)
        {
            packet_in_flight.move_along_direction()
        }
        return arrived_packets;
    }


    //send_packet(t)
        //send next packets on queue (# of packets equal to bandwidth)

    //update in flight
        //for each packet in flight
            //time == time when you are arrived -> be done
            // if (rand) drop packet
            //move along vector as speed of light

    get_direction_for_packet_send(conn: Connection)
    {
        let A : SpaceBody = conn.sender;
        let B : SpaceBody = conn.receiver;

        const result = interceptFromCartesian({
            A: { x: 0, y: 0 },           // Station
            O: { x: 4000, y: 0 },        // Planet center
            B: { x: 4000 + 7000 * Math.cos(Math.PI / 4), 
                y: 7000 * Math.sin(Math.PI / 4) }, // Orbiter position
            r: 7000,
            vo: 2000,
            vl: 3000
            });

            if (result.ok) {
            console.log("θ₀ (auto):", result.thetaHit);
            console.log("Distance:", result.distance);
            console.log("Intercept time:", result.time);
            } else {
            console.error(result.message);
            }

        return new Position(1,0)
    }

    
    split_packets_in_flight_by_arrival(packets_in_flight:Packet_In_Flight[]):[Packet_In_Flight[], Packet_In_Flight[]]
    {
        let arrived_packets : Packet_In_Flight[] =[]
        let packets_in_transit : Packet_In_Flight[] =[]
        
        for(let i = packets_in_flight.length; i>=0; i--)
            {
                if (packets_in_flight[i].arrival_timestep > Simulator_Engine.current_time)//found first entry that has not arrived
                {
                    packets_in_transit =packets_in_flight.slice(i)
                    break;
                }
                arrived_packets.push(packets_in_flight[i])
            }
            return [packets_in_transit, arrived_packets]
    }
}
export default Packet_Simulator

