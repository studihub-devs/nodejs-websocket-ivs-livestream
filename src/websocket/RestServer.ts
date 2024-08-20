
import express from 'express';

import { parse } from 'url';
import WebSocket, { WebSocketServer } from "ws";
import { createServer, Server } from 'http';

import { WebsocketInstance } from "./WebsocketInstance";
import { OutcomeMessage, OutcomeMessageType } from './types/OutcomeMessage';

import { IvsClient, CreateChannelCommand, GetStreamCommand, GetStreamSessionCommand, PutMetadataCommand } from "@aws-sdk/client-ivs";
import { sendEyeLogs } from '../utils/sendEyeLogs';

const client = new IvsClient({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: '',
    secretAccessKey: '',
  },
});


interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
}

export type HandlerFunction = (req: express.Request, resp: express.Response) => void;

export type RestHandler = {
  path: string;
  method: string;
  handlerFunc: HandlerFunction;
}

export class RvtRestServer {
  port: number = 8080;
  handler: RestHandler[] = [];
  server: Server | undefined;
  websocketInstance: WebsocketInstance | undefined;
  wssMap: Map<string, WebSocketServer>;

  constructor(port: number, instance: WebsocketInstance) {
    this.port = port;
    this.websocketInstance = instance;
    this.wssMap = new Map<string, WebSocketServer>()
  }

  listen() {
    if (this.server) {
      this.server.listen(this.port)
    } else {
      throw new Error('Server not implemented.');
    }
  }

  createServer(app: express.Application) {
    this.server = createServer(app);
    this.distributeRequestsByPath()
  }

  distributeRequestsByPath() {
    const self = this;
    this.server?.on('upgrade', function upgrade(request: any, socket: any, head: any) {
      let { path } = parse(request.url);
      path = path ? path : ''
      const wss = self.wssMap?.get(path)
      if (wss && self.validatePath(path)) {
        wss.handleUpgrade(request, socket, head, function done(ws: any) {
          wss.emit('connection', ws, request);
        });
      } else {
        socket.destroy();
      }
    });
  }

  validatePath(pathname: string) {
    return this.wssMap?.has(pathname);
  }

  createPath(path: string) {
    const wss = new WebSocketServer({ noServer: true });
    this.setInstanceCallback(wss);
    this.setConnCleaner(path, wss)
    this.wssMap?.set(path, wss)
  }

  setConnCleaner(path: string, wss: WebSocketServer) {
    const _ = setInterval(function ping() {
      wss.clients.forEach(function each(ws) {
        const extWs = ws as unknown as ExtWebSocket;
        if (extWs.isAlive === false) return ws.terminate();
        extWs.isAlive = false;
        ws.ping();
      });
      console.log("Nb connected clients ", path, " : ", wss.clients.size)
    }, 2000);
  }

  setInstanceCallback(wss: WebSocketServer) {
    this.websocketInstance?.connectionFunc ? wss.on('connection', this.websocketInstance?.connectionFunc) : ''
  }

  broadcastMessage(path: string, message: OutcomeMessage) {
    try {
      Promise.all([this.sendTimedMetadata(message)]).then(() => { })
    } catch (error) {

    }

    const wss = this.wssMap.get(path);
    wss?.clients.forEach(function each(client: any) {
      if (client.readyState === WebSocket.OPEN) {
        // if (message.type == OutcomeMessageType.LIVE_MAP) {
        //   for ()
        //   message.viewerCount = wss.clients.size
        // }
        client.send(JSON.stringify(message));
      }
    });
  };

  broadcastTimedMetadata(path: string, message: OutcomeMessage) {
    try {
      Promise.all([this.sendTimedMetadata(message)]).then(() => { })
    } catch (error) {

    }
  };

  async sendLogs(message: OutcomeMessage) {
    sendEyeLogs(JSON.stringify(message))
  }

  async sendTimedMetadata(message: OutcomeMessage) {
    // console.log('message', message)
    try {
      const channelId = message.channelId
      if (channelId) {
        const input = {
          "channelArn": `arn:aws:ivs:ap-northeast-2:339126146861:channel/${channelId}`,
          "metadata": JSON.stringify(message)
        }

        const command = new PutMetadataCommand(input)

        const response = await client.send(command);
        // console.log(channelId, response)
        return response
      }
    } catch (error) {
      console.log(error)
    }

  }
}