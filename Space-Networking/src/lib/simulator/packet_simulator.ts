import Connection from './definitions/connection'
import Position from './definitions/position'
import Packet_In_Flight from './definitions/packet_in_flight'
import SpaceBody from './definitions/space_body'
import { interceptFromCartesian } from './definitions/types'
import Orbiter from './definitions/orbiter'
import {get_distance} from './ultility'
// import Simulator_Engine from './simulator_engine'

class Packet_Simulator{

    connections : Connection[] = []
    packets_in_flight : Packet_In_Flight[] = []

    current_time:number = 0;
    total_time:number;
    sending_bodies = {
        sorted_on_x: [] as SpaceBody[],
        sorted_on_y: [] as SpaceBody[]
    };

    source: SpaceBody;
    destination: SpaceBody;
    number_of_packets: number = 100;

    
    network_rescan_time = 100; //CONSTANT THAT USER SHOULD BE ABLE TO SET

    constructor(total_time:number, bodies:SpaceBody[], destination: SpaceBody, source: SpaceBody, packet_number:number)
    {
        this.total_time =total_time;
        //note that this is not sorted at the start we have to sort each time we use this anyway
        this.sending_bodies.sorted_on_x = bodies.filter((body)=>body.sender != null)
        this.sending_bodies.sorted_on_y = this.sending_bodies.sorted_on_x
        this.destination = destination
        this.source = source
        this.number_of_packets =packet_number
    }

    calculate_all_positions()
    {
        let all_packets :[Packet_In_Flight[]] = [[]]

        for(let i =0; i<= this.total_time; i++)
        {
            if(i % this.network_rescan_time == 0)
            {
                this.scan_for_path()
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

    end_stream(connection_index:number)
    {
        // connection.sender.stop_sending()
        this.connections.splice(connection_index,1) // remove connection from list 
    }

    end_stream_by_connection(key_connection: Connection)
    {
       const index_to_remove = this.connections.findIndex((connection)=> connection.sender == key_connection.sender && connection.receiver == key_connection.receiver)
        this.end_stream(index_to_remove)
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
            
            const packet_in_flight = connection.sender.sender!.send_packet(dir, connection.sender, this.current_time, arrival_time, connection.receiver.id)
            this.packets_in_flight.push(packet_in_flight)

            if(this.current_time % this.network_rescan_time-1 == 0 && packet_in_flight.packet == -1) //SENTIEL VALUE FOR END TRANSMISSION
            {
             this.end_stream_by_connection(connection)    
            }
            // console.log("Time:",  this.current_time, "Packets in flight:", this.packets_in_flight)
            // if (this.current_time == 100) {
            //     throw new Error()
            // }
        }
        const arrived_packets=this.update_packets_in_flight()  
        for(const packet_in_flight of arrived_packets)
        {
            const recipient = this.sending_bodies.sorted_on_x.find((body)=>body.id == packet_in_flight.recipient_id)
            recipient!.sender?.receive_packet(packet_in_flight.packet)
        }
        

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



    scan_for_path() //source:SpaceBody
    {

        if (this.connections.length > 0)
        {
            for(let i=0; i<this.connections.length;i++) //look at every reciever
            {
                let is_also_sender = false
                for(let j = 0; j < this.connections.length; i++)
                {
                    if(this.connections[i]?.receiver.id == this.connections[i]?.sender.id)
                    {
                        is_also_sender = true
                        break;
                    }
                }
                if(is_also_sender ==false && this.connections[i]?.receiver.id != this.destination.id)
                {
                    const nearest_neighbor = this.find_nearest_neighbor(this.connections[i]?.receiver!)
                    this.start_stream(this.connections[i]!.receiver, nearest_neighbor!)

                }
            }

            for(let i=0; i<this.connections.length;i++)
            {
                const nearest_neighbor =  this.find_nearest_neighbor(this.connections[i]!.sender)
                if(this.connections[i]!.receiver != nearest_neighbor)
                {
                    this.end_stream(i)
                    this.start_stream(this.connections[i]!.sender, nearest_neighbor!)
                }
            }
        }
        else// no connections
        {
            const nearest_neighbor =  this.find_nearest_neighbor(this.source)
            this.start_stream(this.source, nearest_neighbor!)
        }
       

    }    

    find_nearest_neighbor(key_body:SpaceBody)
    {
        //should probably do binary search but dont want to implement
        // console.log("x array",this.sending_bodies.sorted_on_x)
        // console.log("y array",this.sending_bodies.sorted_on_y)
        
        const x_index = this.sending_bodies.sorted_on_x.findIndex((body)=>body.id == key_body.id)
        const y_index = this.sending_bodies.sorted_on_y.findIndex((body)=>body.id == key_body.id)

        let neighbors:SpaceBody[] = []

        
        if (x_index - 1 >= 0) {
            neighbors.push(this.sending_bodies.sorted_on_x[x_index - 1]!);
        }
        if (x_index + 1 < this.sending_bodies.sorted_on_x.length) {
            neighbors.push(this.sending_bodies.sorted_on_x[x_index + 1]!);
        }
        if (y_index - 1 >= 0) {
            neighbors.push(this.sending_bodies.sorted_on_y[y_index - 1]!);
        }
        if (y_index + 1 < this.sending_bodies.sorted_on_y.length) {
            neighbors.push(this.sending_bodies.sorted_on_y[y_index + 1]!);
        }

        let closest_neighbor:SpaceBody | undefined = neighbors[0]; 
        let shortest_distance = get_distance(key_body.pos[this.current_time]!,neighbors[0]!.pos[this.current_time]!)

        for(const neighbor of neighbors)
        {
            // console.log("key_body", key_body)
            // console.log("neighbor", neighbor)
            let temp_dist = get_distance(key_body.pos[this.current_time]!,neighbor.pos[this.current_time]!)
            if(temp_dist <shortest_distance)
            {
                closest_neighbor = neighbor
                shortest_distance = temp_dist
            }
        }

        return closest_neighbor;
    }

    resort_sending_bodies()
    {
        this.sending_bodies.sorted_on_x = this.sending_bodies.sorted_on_x.sort((A, B)=> A.pos[this.current_time]!.x - B.pos[this.current_time]!.x)
        this.sending_bodies.sorted_on_y = this.sending_bodies.sorted_on_y.sort((A, B)=> A.pos[this.current_time]!.y - B.pos[this.current_time]!.y)
    }
    
}




export default Packet_Simulator

