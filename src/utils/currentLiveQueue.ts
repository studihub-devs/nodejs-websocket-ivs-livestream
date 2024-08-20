// eslint-disable-next-line vars-on-top, no-var

import { RxjsQueue } from "../queue";

declare global {
    var LiveQueue: RxjsQueue;
}


export function getLiveQueue(): RxjsQueue {
    if (!global.LiveQueue) {
        global.LiveQueue = new RxjsQueue();
    }

    return global.LiveQueue;
}