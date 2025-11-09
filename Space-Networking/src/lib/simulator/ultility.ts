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
