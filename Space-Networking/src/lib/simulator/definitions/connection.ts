import SpaceBody from "./space_body"

class Connection
{
    sender:SpaceBody;
    receiver:SpaceBody;
    constructor (s:SpaceBody, r: SpaceBody)
    {
        this.sender = s
        this.receiver = r
    }
}

export default Connection