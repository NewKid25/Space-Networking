import { exp } from "three/src/nodes/TSL.js";
import Position from "./definitions/position";


export function normalize_vector(vector: Position) : Position
{
    //chat gpt code
    const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    if (length === 0) {
        return new Position(0, 0); // avoid NaN
    }
    return new Position(vector.x / length, vector.y / length);
}

export function get_distance(p1:Position, p2:Position):number
{
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}
