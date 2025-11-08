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
}

export default Body