import SpaceBody from "./definitions/space_body";
import Simulator_Engine from "./simulator_engine";
import Sender from "./definitions/sender";
import Sender_Buffer from "./definitions/sender_buffer";

class Experiment {
    source: SpaceBody;
    destination: SpaceBody;

    network: Array<SpaceBody>;
    number_packets: number;
    total_time:number;
    engine: Simulator_Engine;
    
    constructor (src: SpaceBody, dst: SpaceBody, net: Array<SpaceBody>, num_packs: number, total_time: number) {
        this.source = src;
        this.destination = dst;
        this.network = net;
        this.number_packets = num_packs;
        this.total_time = total_time;

        this.source.sender = new Sender( new Sender_Buffer( Array.from({length: num_packs}, (_, i) => i) ) );

        this.engine = new Simulator_Engine(this.network, this.total_time, this.source, this.destination, this.number_packets)
    }

}