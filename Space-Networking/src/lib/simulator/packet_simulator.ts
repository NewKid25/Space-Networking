import Body from './definitions/space_body'

class Packet_Simulator{

    //connections

    start_stream(sender: Body,receiver: Body)
    {
        if(sender.sender && receiver.sender) // both bodies have a sender
        {
            //establish connection
            // new Connection(sender, reciever)
            // sender.add_connection()
            // reciever.add_connection()
        }
    }


    //update
        //send packets on communications
        //for each communication
            //send packet from sender to reciever

        //update in flight


    //send_packet(t)
        //send next packets on queue (# of packets equal to bandwidth)

    //update in flight
        //for each packet in flight
            //time == time when you are arrived -> be done
            // if (rand) drop packet
            //move along vector as speed of light


}