import Body from './definitions/space_body'
import Connection from './definitions/connection'
import Position from './definitions/position'
import Packet_In_Flight from './definitions/packet_in_flight'

class Packet_Simulator{

    connections : Connection[]
    packets_in_flight : Packet_In_Flight[]

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
            let dir : Position = this.get_direction_for_packet_send()

        }
            
    }
 

        //update in flight


    //send_packet(t)
        //send next packets on queue (# of packets equal to bandwidth)

    //update in flight
        //for each packet in flight
            //time == time when you are arrived -> be done
            // if (rand) drop packet
            //move along vector as speed of light

    get_direction_for_packet_send()
    {
        return new Position(1,0)
    }

}