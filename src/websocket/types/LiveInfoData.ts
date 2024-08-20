
export enum RvtLiveMessageType {
    LIVE_INFORMATION = 'LIVE_INFORMATION'
}


export interface LiveInfoData {
    'health': string,
    'state': string,
    'viewerCount': number,
    'channelId': string,
    'type': RvtLiveMessageType,
    'buyers': string,
}

