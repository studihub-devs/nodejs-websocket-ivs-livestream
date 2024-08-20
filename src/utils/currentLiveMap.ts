// eslint-disable-next-line vars-on-top, no-var

import { RxjsQueue } from "../queue";
import { RvtLiveMessageType } from "../websocket/types/LiveInfoData";


interface LiveInfoData {
    'health': string,
    'state': string,
    'viewerCount': number,
    'channelId': string,
    'type': RvtLiveMessageType,
}

export type LiveMapType = Map<string, LiveInfoData>


declare global {
    var LiveMap: LiveMapType;
    var LiveQueue: RxjsQueue;
}

export function getCurrentLiveMap(): LiveMapType {
    if (!global.LiveMap) {
        global.LiveMap = new Map();

        global.LiveMap.set('FRfFLSvwrpEg', {
                channelId: 'FRfFLSvwrpEg',
                health: 'HEALTHY',
                state: 'LIVE',
                viewerCount: 3,
                type: RvtLiveMessageType.LIVE_INFORMATION
            })
    }

    return global.LiveMap;
}

