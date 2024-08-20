
import { BasicQueue } from './basicQueue';
import { Subject } from 'rxjs';

export class RxjsQueue extends BasicQueue {
    queue: Subject<any>;

    constructor() {
        super();
        this.queue = new Subject()
    }

    addQueue(data: any) {
        this.queue.next(data);
    }
    
    dequeue(): Promise<any> {
        throw new Error('Method not implemented.');
    }
}