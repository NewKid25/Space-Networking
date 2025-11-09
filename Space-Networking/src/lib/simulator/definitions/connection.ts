import SpaceBody from "./space_body"
import Packet_In_Flight from "./packet_in_flight"

class Connection
{
    sender:SpaceBody;
    receiver:SpaceBody;
    constructor (s:SpaceBody, r: SpaceBody)
    {
        this.sender = s
        this.receiver = r
    }
}

//reciever.sender_buffer.most recent index = Packet


export default Connection