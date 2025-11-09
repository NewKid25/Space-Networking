class Sender_Buffer{
    data:number[];

    constructor();
    constructor(data:number[]);
    constructor(data?:number[])
    {
        if(data)
        {
            this.data = data
        }
    }
    
}  

export default Sender_Buffer