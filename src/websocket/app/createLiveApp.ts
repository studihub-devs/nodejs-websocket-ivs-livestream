import express from 'express';

import { BasicQueue } from "../../queue/basicQueue";
import { AppHandler, HandlerFunction, HandlerMethod } from "../handler/AppHandler";

import { v4 as uuidv4 } from 'uuid';
import ServerApplication from '../handler/ServerApplication';
import { getCurrentLiveMap } from '../../utils/currentLiveMap';
import { RvtLiveMessageType } from '../types/LiveInfoData';



export class LiveApp {
    queue: BasicQueue | undefined
    currentLiveMap: Map<any, any>;
    handlerList: AppHandler[]

    constructor(queue: BasicQueue) {
        this.queue = queue
        this.currentLiveMap = getCurrentLiveMap()
        this.handlerList = [
            {
                path: '/login',
                method: HandlerMethod.POST,
                handlerFunc: this.loginHandler
            },
            {
                path: '/live/start',
                method: HandlerMethod.POST,
                handlerFunc: this.startLiveHandler
            },
            {
                path: '/live/refresh',
                method: HandlerMethod.POST,
                handlerFunc: this.refreshLiveHandler
            },
            {
                path: '/live/stop',
                method: HandlerMethod.POST,
                handlerFunc: this.stopLiveHandler
            },
            {
                path: '/live/pin-product',
                method: HandlerMethod.POST,
                handlerFunc: this.pinProductLiveHandler
            },
            {
              path: '/live/pin-promotion',
              method: HandlerMethod.POST,
              handlerFunc: this.pinPromotionLiveHandler
            },
            {
                path: '/live/edit-product',
                method: HandlerMethod.POST,
                handlerFunc: this.editProductLiveHandler
            }
        ]
    }

    loginHandler: HandlerFunction = (req: any, resp: any) => {
        const id = uuidv4();
        console.log(`Updating session for user ${id}`);
        req.session.userId = id;
        resp.send({ result: 'OK', message: 'Session updated' });
    };

    startLiveHandler: HandlerFunction = (req: any, resp: any) => {
        const channelId = req.body.channelId ? req.body.channelId : 0
        const userId = req.userId ? req.userId : 0
        console.log('startLiveHandler', channelId)
        getCurrentLiveMap().set(channelId, {
            'health': 'HEALTHY',
            'state': 'LIVE',
            'viewerCount': 1,
            'channelId': channelId,
            'type': RvtLiveMessageType.LIVE_INFORMATION
        })

        console.log(`A new live session is started for channelId ${channelId}`);

        resp.send({ result: 'OK', message: 'Session updated' });
    };

    refreshLiveHandler: HandlerFunction = (req: any, resp: any) => {
        const channelId = req.body.channelId ? req.body.channelId : '0'
        this.queue?.addQueue({ 'channelId': channelId, "type": "REFRESH_LIVE" })
        resp.send({ result: 'OK', message: 'Session updated' });
    };

    stopLiveHandler: HandlerFunction = (req: any, resp: any) => {
        const channelId = req.body.channelId ? req.body.channelId : '0'
        this.queue?.addQueue({ 'channelId': channelId, "type": "STOP_LIVE" })
        getCurrentLiveMap().delete(channelId)
        resp.send({ result: 'OK', message: 'Session updated' });
    }

    pinProductLiveHandler: HandlerFunction = (req: any, resp: any) => {
        const channelId = req.body.channelId ? req.body.channelId : '0'
        const productId = req.body.productId ? req.body.productId : 0

        this.queue?.addQueue({ 'channelId': channelId, "type": "PIN_PRODUCT", 'productId': productId })

        resp.send({ result: 'OK', message: 'Session updated' });
    }

    pinPromotionLiveHandler: HandlerFunction = (req: any, resp: any) => {
      const channelId = req.body.channelId ? req.body.channelId : '0'
      const promotionId = req.body.promotionId ? req.body.promotionId : 0

      this.queue?.addQueue({ 'channelId': channelId, "type": "PIN_PROMOTION", 'promotionId': promotionId })

      resp.send({ result: 'OK', message: 'Session updated' });
    }
    
    editProductLiveHandler: HandlerFunction = (req: any, resp: any) => {
        const channelId = req.body.channelId ? req.body.channelId : '0'
        const productId = req.body.productId ? req.body.productId : 0
        const newPrice = req.body.newPrice ? req.body.newPrice : 0

        this.queue?.addQueue({ 'channelId': channelId, "type": "EDIT_PRODUCT", 'productId': productId, 'newPrice': newPrice })

        resp.send({ result: 'OK', message: 'Session updated' });
    }
}

export function createLiveApp(queue: any): express.Application { 
    const liveApp = new LiveApp(queue)    

    const application = new ServerApplication()
    
    application.makeHandler(liveApp.handlerList)

    return application.app;
}