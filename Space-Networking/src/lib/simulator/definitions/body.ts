import Position from './position'
import Sender from './sender'

class Body {
    id: number;
    name: string;
    pos: Position;
    sender: Sender = null;

    constructor(id: number, name: string, p: Position) {
            this.id = id;
            this.name = name;
            this.pos = p;
        }
}

export default Body