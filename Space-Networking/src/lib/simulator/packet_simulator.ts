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

    source: SpaceBody;
    destination: SpaceBody;
    number_of_packets: number;
    
    network_rescan_time = 100;

    constructor(total_time:number, src: SpaceBody, dst: SpaceBody, num_packs: number, bodies: Array<SpaceBody>)
    {
        this.total_time = total_time;
        this.source = src;
        this.destination = dst;
        this.number_of_packets = num_packs;
        this.bodies = bodies;
    }

    calculate_all_positions()
    {
        let all_packets :[Packet_In_Flight[]] = [[]]

        for(let i =0; i<= this.total_time; i++)
        {
            if(i % this.network_rescan_time == 0)
            {
                // //check for current senders (each sender in all connections)
                // path = create_new_connections()
                // next hop
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
            const dir_and_arrival_time = this.get_direction_for_packet_send(connection, this.current_time)
            // console.log("Direction:", dir_and_arrival_time.vector, "Time:", dir_and_arrival_time.time)
            // console.log("Connection:", connection)

            dir = dir_and_arrival_time!.vector;
            arrival_time = dir_and_arrival_time!.time!;
            
            this.packets_in_flight.push(connection.sender.sender!.send_packet(dir, connection.sender, this.current_time, arrival_time))
            // console.log("Time:",  this.current_time, "Packets in flight:", this.packets_in_flight)
            // if (this.current_time == 100) {
            //     throw new Error()
            // }
        }
        this.update_packets_in_flight()  

        return JSON.parse(JSON.stringify(this.packets_in_flight));
    }
 

    //update in flight
    update_packets_in_flight()
    {
        
        let arrived_packets : Packet_In_Flight[] =[];
        [this.packets_in_flight, arrived_packets] = this.split_packets_in_flight_by_arrival(this.packets_in_flight)
        // console.log("Arrived_packets:", arrived_packets)
        
        // console.log("Time:", this.current_time)
        this.packets_in_flight.forEach((packet_in_flight)=>packet_in_flight.move_along_direction())
        // for(const packet_in_flight in this.packets_in_flight)
        // {
        //     packet_in_flight.move_along_direction()
        // }
        // console.log("Packets in Flight:", this.packets_in_flight)
        // console.log("this.packets X:", this.packets_in_flight[0].position.x)
        // if (this.current_time > 3) {
        //     throw new Error()
        // }
        return arrived_packets;
    }

    split_packets_in_flight_by_arrival(packets_in_flight:Packet_In_Flight[]):[Packet_In_Flight[], Packet_In_Flight[]]
    {
        let arrived_packets : Packet_In_Flight[] =[]
        let packets_in_transit : Packet_In_Flight[] =[]
        
        for(let i = 0; i<packets_in_flight.length; i++)
            {
                if (packets_in_flight[i]!.arrival_timestep > this.current_time)//found first entry that has not arrived
                {
                    packets_in_transit = packets_in_flight.slice(i, packets_in_flight.length)
                    // console.log("After slice:", packets_in_transit)
                    break;
                }
                arrived_packets.push(packets_in_flight[i]!)
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

            // console.log("A:", A.pos[t], "B:", B.pos[t], "O:", O.pos[t])

            if (B.pos[t] == undefined || A.pos[t] == undefined || O.pos[t] == undefined) { 
                return {
                    vector: new Position(0, 0),
                    time: t
                }
            }

            const result = interceptFromCartesian({
            A: { x: A.pos[t].x, y: A.pos[t].y },
            O: { x: O.pos[t].x, y: O.pos[t].y },
            B: { x: B.pos[t].x, y: B.pos[t].y },
            r: B.orbitRadius,
            vo: B.velocity,          // km/s (example orbital velocity)
            vl: c,
            });

            if (result.ok && result != undefined) {
                return {
                    vector: new Position(result.x! / result.distance!, result.y! / result.distance!),
                    time: result.time
                }
            }
        }
        else {
            // console.log("A:", A.pos[t], "B:", B.pos[t])
            if (B.pos[t] == undefined || A.pos[t] == undefined) { 
                return {
                    vector: new Position(0, 0),
                    time: t
                }
            }
            const dx = B.pos[t].x - A.pos[t].x;
            const dy = B.pos[t].y - A.pos[t].y;
            const distance = Math.hypot(dx, dy);
            const time = distance / c;
            return {
                vector: new Position(dx / distance, dy / distance),
                time: time                
            }
        }
    }



    create_path() //source:SpaceBody
    {
        
        //sorted araay on x
        //sorted array on y

        // while closest != terminal
            //current node = soucre
            //while (path not complete???)
                //closest = check neighbors (node)
                //create communication (source closest)

    }    

    check_neighbors()
    {
        //for each neighbor
            //check distance
                //source neight.pos-source.pos 

        //return closest
    }
}




export default Packet_Simulator

