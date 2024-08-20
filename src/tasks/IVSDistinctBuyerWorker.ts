
import { IvsClient, CreateChannelCommand, GetStreamCommand, _Stream } from "@aws-sdk/client-ivs";
import { ITask } from "./ITask";
import { LiveInfoData, RvtLiveMessageType } from "../websocket/types/LiveInfoData";
import { Maybe } from "../websocket/types/Maybe";
import { RvtRestServer } from "../websocket/RestServer";
import { OutcomeMessage, OutcomeMessageType } from "../websocket/types/OutcomeMessage";
import { loadRunningLive } from "../utils/loadRunningLive";
import { loadBuyers } from "../utils/loaderBuyers";

const AwsRegion = ""
const AccessKeyId = ""
const SecretAccessKey = ""
const AccountId = ''


export class IVSDistinctBuyerWorker implements ITask {
    client: IvsClient;
    server: Maybe<RvtRestServer>;
    oldBuyerMap: Map<string, number> = new Map();

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

    async fetchDistinctBuyer() {
        const streamList = (await loadRunningLive()) as unknown as Array<any>
        console.log("streamList: ", streamList)

        let buyerMap = new Map()

        for (const channelId of streamList.map((live: any) => live.channelId)) {

            const buyers = (await loadBuyers(channelId)) as unknown as Array<any>

            if (!this.oldBuyerMap.has(channelId) || (this.oldBuyerMap.has(channelId) && this.oldBuyerMap.get(channelId) != buyers.length)) {
                const message = {
                    type: 'BUYER_INFO',
                    channelId: channelId,
                    buyers: buyers ? buyers.map(buyer => buyer.account) : []
                } as any as OutcomeMessage

                console.log(message)
                this.server?.broadcastTimedMetadata('/', message)
            }

            buyerMap.set(channelId, buyers.length)
        }
        this.oldBuyerMap = buyerMap
    }

    async run() {
        setInterval(() => {
            this.fetchDistinctBuyer()
            // const message = {
            //     'type': OutcomeMessageType.LIVE_MAP,
            //     'data': Object.fromEntries(getCurrentLiveMap())
            // } as OutcomeMessage
            // this.server?.broadcastMessage('/', message)
        }, 3000)
    }
}