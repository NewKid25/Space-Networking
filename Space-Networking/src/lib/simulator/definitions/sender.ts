import Sender_Buffer from './sender_buffer'
import Position from './position';

class Sender {
    buffer: Sender_Buffer;

        constructor();
        constructor (x: Sender_Buffer);
        constructor (x?: Sender_Buffer) {
        if(x)
        {
            this.buffer = x;
        }
        else{
            this.buffer =  new Sender_Buffer()
        }
    }

    send_packet(direction: Position)
    {
        
    }
}

export default Sender