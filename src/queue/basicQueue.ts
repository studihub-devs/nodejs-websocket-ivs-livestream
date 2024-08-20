import { Maybe } from "../websocket/types/Maybe";

export abstract class BasicQueue<T = any> {
    
    queue: any;
    size = 0;

    constructor() {}

    /**
     * 
     * @param data 
     */
    abstract addQueue(data: T): void

    /**
     * Dequeue
     */
    abstract dequeue() : Promise<T>
}