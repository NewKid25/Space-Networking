import Position from './position'
import Sender from './sender'

class SpaceBody {
    id: number;
    name: string;
    pos: Array<Position>;
    sender?: Sender = undefined;

    constructor(id: number, name: string, p: Array<Position>) {
            this.id = id;
            this.name = name;
            this.pos = p;
        }

    attach_sender(x:Boolean)
    {
        if (x==true)
        {
            if (this.sender == undefined) //this body does not have sender
            {
                this.sender = new Sender()
            }
        }
        else
        {
            this.sender = undefined;
        }
    }
}

export default SpaceBody;