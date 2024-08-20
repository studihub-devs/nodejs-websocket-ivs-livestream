import WebSocket, { WebSocketServer } from 'ws';
import { Maybe } from './types/Maybe';


type OnConnCallback = (ws: WebSocket , request: any) => void;
type OnMessageCallback = (event: WebSocket.MessageEvent) => void;
type OnErrorCallback = (event: WebSocket.ErrorEvent) => void;
type OnCloseCallback = (event: WebSocket.CloseEvent) => void;

type OnPingCallback = () => void;
type OnPongCallback = () => void;

export class WebsocketInstance {
    connectionFunc: Maybe<OnConnCallback>;
    messageFunc: Maybe<OnMessageCallback>;
    pingFunc: Maybe<OnPingCallback>;
    pongFunc: Maybe<OnPongCallback> ;
    errorFunc: Maybe<OnErrorCallback> ;
    closeFunc: Maybe<OnCloseCallback> ;
}