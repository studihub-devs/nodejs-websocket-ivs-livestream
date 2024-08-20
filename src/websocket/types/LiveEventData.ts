
import {LiveEventType} from './LiveEventType'

export class LiveEventData {
    type: LiveEventType | undefined;
    channelId: any;
    [x: string | number | symbol]: unknown;
}