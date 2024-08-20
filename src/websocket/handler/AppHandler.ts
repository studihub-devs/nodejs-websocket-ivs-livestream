import express from 'express';

export type HandlerFunction = (req: express.Request, resp: express.Response) => void;

export type AppHandler = {
    path: string;
    method: HandlerMethod;
    handlerFunc: HandlerFunction;
}


export enum HandlerMethod {
    POST,
    GET,
    PUT,
    DELETE,
    PATCH
}
