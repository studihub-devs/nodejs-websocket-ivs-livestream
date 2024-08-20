
import { IvsClient, CreateChannelCommand, GetStreamCommand, _Stream, DeleteStreamKeyCommand } from "@aws-sdk/client-ivs";
import { ITask } from "./ITask";
import { getCurrentLiveMap } from "../utils/currentLiveMap";
import { LiveInfoData, RvtLiveMessageType } from "../websocket/types/LiveInfoData";
import { Maybe } from "../websocket/types/Maybe";
import { RvtRestServer } from "../websocket/RestServer";
import { OutcomeMessage, OutcomeMessageType } from "../websocket/types/OutcomeMessage";
import { loadRunningLive } from "../utils/loadRunningLive";
import { sendEyeLogs } from "../utils/sendEyeLogs";

const AwsRegion = "ap-northeast-2"
const AccessKeyId = ""
const SecretAccessKey = ""
const AccountId = ''


export class IVSBroadcastWorker implements ITask {
  client: IvsClient;
  server: Maybe<RvtRestServer>;

  constructor(server: RvtRestServer) {
    const ivsConfig = {
      region: AwsRegion,
      credentials: {
        accessKeyId: AccessKeyId,
        secretAccessKey: SecretAccessKey,
      },
    }
    this.client = new IvsClient(ivsConfig);

    this.server = server;
  }

  async fetchStreamDetails(channelId: any): Promise<_Stream | undefined> {
    const input = {
      'channelArn': `arn:aws:ivs:${AwsRegion}:${AccountId}:channel/${channelId}`,
    };
    const command = new GetStreamCommand(input);
    try {
      const response = await this.client.send(command);
      return response['stream'];
    } catch (error) {
      return undefined
    }
  }

  async updateLiveStreamsStatus() {
    const LiveMap = getCurrentLiveMap()

    const streamList = (await loadRunningLive()) as unknown as Array<any>
    for (const channelId of streamList.map((live: any) => live.channelId)) {
      const streamInfo = await this.fetchStreamDetails(channelId)
      if (streamInfo) {
        let message = streamInfo as any as LiveInfoData
        message['type'] = RvtLiveMessageType.LIVE_INFORMATION
        message['channelId'] = channelId

        LiveMap.set(channelId, streamInfo as LiveInfoData)
        
        this.server?.broadcastTimedMetadata('/', message as any as OutcomeMessage)
      
        try {
          Promise.all([this.sendLogs(message as any as OutcomeMessage)]).then(() => { })
        } catch (error) {}

      } else {
        LiveMap.set(channelId, {
          'health': 'OFF',
          'state': 'OFF',
          'viewerCount': this.server?.wssMap.get('/')?.clients.size,
          'channelId': channelId,
          'type': RvtLiveMessageType.LIVE_INFORMATION,
        } as LiveInfoData)
      }
    }
  }

  async sendLogs(message: OutcomeMessage) {
    console.log(JSON.stringify(message))
    sendEyeLogs(JSON.stringify(message))
  }

  async deleteStreamKey(channelId: any) {
    const input = {
      'arn': `arn:aws:ivs:${AwsRegion}:${AccountId}:stream-key/${channelId}`,
    };
    const command = new DeleteStreamKeyCommand(input);
    try {
      const response = await this.client.send(command);
      console.log(response)
    } catch (error) {
      console.log(error)
      return undefined
    }
  }

  async runWithoutInterval() {
      this.updateLiveStreamsStatus()
      const message = {
        'type': OutcomeMessageType.LIVE_MAP,
        'data': Object.fromEntries(getCurrentLiveMap())
      } as OutcomeMessage
      this.server?.broadcastMessage('/', message)
  }

  async run() {
    setInterval(() => {
      this.updateLiveStreamsStatus()
      const message = {
        'type': OutcomeMessageType.LIVE_MAP,
        'data': Object.fromEntries(getCurrentLiveMap())
      } as OutcomeMessage
      this.server?.broadcastMessage('/', message)
    }, 3000)
  }
}