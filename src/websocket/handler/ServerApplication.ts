import express from 'express';
import { AppHandler, HandlerMethod } from './AppHandler';

import bodyParser from 'body-parser';
import adminCors from './corsConfig';
import sessionMiddleware from './sessionManager';


class ServerApplication {
    app!: express.Application

    constructor() {
        this.app = express();
        this.initialize();
    }

    initialize() {
        this.app.use(bodyParser.json());
        this.app.use(adminCors);
        this.app.use(sessionMiddleware);
    }

    makeHandler(handleRequests: AppHandler[]) {
        for (const handler of handleRequests) {
            this.handle(handler)
        }
    }

    handle(request: AppHandler) {
        switch (request.method) {
            case HandlerMethod.GET:
                this.app.get(request.path, request.handlerFunc)
                break;
            case HandlerMethod.POST:
                this.app.post(request.path, request.handlerFunc)
                break;
            case HandlerMethod.PUT:
                this.app.put(request.path, request.handlerFunc)
                break;
            case HandlerMethod.DELETE:
                this.app.delete(request.path, request.handlerFunc)
                break;
            case HandlerMethod.PATCH:
                this.app.patch(request.path, request.handlerFunc)
                break;
        }
    }
}

export default ServerApplication;