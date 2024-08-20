
import { WebsocketInstance } from "./WebsocketInstance";

import WebSocket, { WebSocketServer } from 'ws';
import { getCurrentLiveMap } from "../utils/currentLiveMap";
// import { getLiveQueue } from "../utils/currentLiveQueue";

import { BasicQueue } from "../queue/basicQueue";

interface ExtWebSocket extends WebSocket {
    isAlive: boolean;
}

enum RvtLiveMessageType {
    LIVE_INFORMATION = 'LIVE_INFORMATION'
}

interface RvtLiveMessage {
    type: RvtLiveMessageType,
    channelId: string
}

function heartbeat(this: any) {
    this.isAlive = true;
}

// export class RvtWebsocketServer implements WebsocketInstance {
//     queue: import("/home/ubuntu/sources/rvt-websocket-server/src/queue/rxQueue").RxjsQueue;

//     constructor() {
//         this.queue = getLiveQueue()

export class RvtWebsocketServer implements WebsocketInstance {    
    static queue: any;
   
    constructor(queue: BasicQueue) {        
        RvtWebsocketServer.queue = queue
    }

    connectionFunc(ws: WebSocket, request: any): void {
        ws.on('error', console.error);
        ws.on('pong', heartbeat);

        RvtWebsocketServer.pushEventIntoQueue('');

        const extWs = ws as ExtWebSocket;
        extWs.isAlive = true;

        ws.on('message', function (message) {
            const rvtLiveMessage = JSON.parse(message.toString()) as RvtLiveMessage  
            console.log("_______ws________: ",rvtLiveMessage)          
            
            switch (rvtLiveMessage.type) {
                case RvtLiveMessageType.LIVE_INFORMATION:                    
                    RvtWebsocketServer.getLiveState(ws, rvtLiveMessage);
                    break;
                default:
                    break;
            }
        });

        ws.on('close', function () {
            const extWs = ws as ExtWebSocket;
            extWs.isAlive = false;
        });
        
    };    

    static pushEventIntoQueue(channelId: string) {
        this.queue?.addQueue({ 'channelId':  channelId, "type": "UPDATE_VIEWCOUNT" })
        
    }

    static getLiveState(ws: WebSocket, message: any) {
        const channelId = message['channelId'] as string
        const LiveMap = getCurrentLiveMap() 
        let defaultData = LiveMap.get(channelId) 
        defaultData = defaultData ? defaultData : {
            'health': 'HEALTHY',
            'state': 'LIVE',
            'viewerCount': 1,
            'channelId': channelId,
            'type': RvtLiveMessageType.LIVE_INFORMATION,
        }

        LiveMap.set(channelId, defaultData)
        
        ws.send(
            JSON.stringify(defaultData)
        )
    }

    messageFunc(event: WebSocket.MessageEvent): void {
    };

    pingFunc: (() => void) | undefined;
    pongFunc: (() => void) | undefined;

    errorFunc: ((event: WebSocket.ErrorEvent) => void) | undefined;
    closeFunc: ((event: WebSocket.CloseEvent) => void) | undefined;
}