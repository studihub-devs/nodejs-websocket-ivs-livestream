import { RxjsQueue } from "../queue/rxQueue";
import { getLiveQueue } from "../utils/currentLiveQueue";
import { RvtRestServer } from "../websocket/RestServer";
import { LiveEventData } from "../websocket/types/LiveEventData";
import { LiveEventType } from "../websocket/types/LiveEventType";
import { LiveInfoData } from "../websocket/types/LiveInfoData";
import { Maybe } from "../websocket/types/Maybe";
import { OutcomeMessage, OutcomeMessageType } from "../websocket/types/OutcomeMessage";
import { ITask } from "./ITask";
import { IVSBroadcastWorker } from "./IVSBroadcastWorker";

export class RvtLiveEventWorker implements ITask {
  queue: Maybe<RxjsQueue>
  server: Maybe<RvtRestServer>;
  ivsWorker: IVSBroadcastWorker;


  constructor(server: RvtRestServer) {
    this.server = server;
    this.queue = getLiveQueue()
    this.ivsWorker = new IVSBroadcastWorker(server)
  }

  run() {
    this.queue?.queue.subscribe(data => {
      // console.log(data)
      this.processQueue(data)
    })
  }

  processQueue(data: LiveEventData) {
    let message = {}
    switch (data.type) {
      case LiveEventType.REFRESH_LIVE:
        message = { 'channelId': data.channelId, "type": OutcomeMessageType.REFRESH_LIVE }
        break;
      case LiveEventType.EDIT_PRODUCT:
        message = { 'channelId': data.channelId, "type": OutcomeMessageType.EDIT_PRODUCT, "productId": data.productId, "newPrice": data.newPrice }
        break;
      case LiveEventType.PIN_PRODUCT:
        message = { 'channelId': data.channelId, "type": OutcomeMessageType.PIN_PRODUCT, "productId": data.productId }
        break;
      case LiveEventType.PIN_PROMOTION:
          message = { 'channelId': data.channelId, "type": OutcomeMessageType.PIN_PROMOTION, "promotionId": data.promotionId }
          break;
      case LiveEventType.STOP_LIVE:
        message = { 'channelId': data.channelId, "type": OutcomeMessageType.STOP_LIVE }
        break;
      case LiveEventType.UPDATE_VIEWCOUNT:
        message = this.getMessageInfo('', message)
        break;
    }

    console.log(message)

    this.server?.broadcastMessage('/', message as OutcomeMessage)

    if (data.type == LiveEventType.STOP_LIVE) {
      this.ivsWorker.deleteStreamKey(data.channelId)
    }
  }

  async getMessageInfo(channelId: string, message: any) {

    const worker = this.server ? new IVSBroadcastWorker(this.server) : null
    worker?.runWithoutInterval()

    // const streamInfo = await this.ivsWorker.fetchStreamDetails(channelId)
    // if (streamInfo) {
    //   let messageInfo = streamInfo as any as LiveInfoData
    //   message = {
    //     type: 'UPDATE_VIEWCOUNT',
    //     channelId: channelId,
    //     viewerCount: messageInfo['viewerCount']
    //   }
    // } else {
    //   message = {
    //     type: 'UPDATE_VIEWCOUNT',
    //     channelId: channelId,
    //     viewerCount: 0
    //   }
    // }
  }
  
}