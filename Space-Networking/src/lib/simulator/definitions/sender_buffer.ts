import type {Packet} from "./packet";

class Sender_Buffer{
    data:Packet[];

    constructor();
    constructor(data:Packet[]);
    constructor(data?:Packet[])
    {
        if(data)
        {
            this.data = data
        }
    }
    
}  

export default Sender_Buffer