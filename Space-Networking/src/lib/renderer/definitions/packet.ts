import type Position from "./position"

export default interface Packet {
	pos: Position,
	streamID: String
}