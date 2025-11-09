import Sender_Buffer from './sender_buffer'

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
}

export default Sender