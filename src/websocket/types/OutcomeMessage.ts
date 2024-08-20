export enum OutcomeMessageType {
    LIVE_MAP = 'LIVE_MAP',
    REFRESH_LIVE = "REFRESH_LIVE",
    EDIT_PRODUCT = "EDIT_PRODUCT",
    PIN_PRODUCT = "PIN_PRODUCT",
    STOP_LIVE = "STOP_LIVE",
    BUYER_INFO = "BUYER_INFO",
    UPDATE_VIEWCOUNT = "UPDATE_VIEWCOUNT",
    PIN_PROMOTION = 'PIN_PROMOTION',
}
export interface OutcomeMessage {
    type: OutcomeMessageType;
    [x: string | number | symbol]: unknown;
}