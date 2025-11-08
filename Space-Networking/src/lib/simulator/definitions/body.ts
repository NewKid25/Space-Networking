import Position from './position'
import Sender from './sender'

class Body {
    id: number;
    name: string;
    pos: Array<Position>;
    sender: Sender = null;

    constructor(id: number, name: string, p: Array<Position>) {
            this.id = id;
            this.name = name;
            this.pos = p;
        }

    set attach_sender(x:Boolean)
    {
        if (x==true)
        {
            if (this.sender == null) //this body does not have sender
            {
                this.sender = new Sender()
            }
        }
        else
        {
            this.sender = null;
        }
    }
}

export default Body