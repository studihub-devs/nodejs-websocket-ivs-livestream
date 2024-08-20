
import { RxjsQueue } from './src/queue';
import { BackgroundHandler } from './src/tasks/BackgroundHandler';
import { IVSBroadcastWorker } from './src/tasks/IVSBroadcastWorker';
import { IVSDistinctBuyerWorker } from './src/tasks/IVSDistinctBuyerWorker';
import { RvtLiveEventWorker } from './src/tasks/RvtLiveEventWorker';
import { getCurrentLiveMap } from './src/utils/currentLiveMap';
import { getLiveQueue } from './src/utils/currentLiveQueue';
import { decorateLog } from './src/utils/decorateLog';

import { RvtRestServer } from './src/websocket/RestServer';
import { RvtWebsocketServer } from './src/websocket/RvtWebSocketServer';
import { createLiveApp } from './src/websocket/app/createLiveApp';

require('dotenv').config();


decorateLog()

const PORT = Number(process.env.PORT) || 8088

const socketInstance = new RvtWebsocketServer(getLiveQueue());
const server = new RvtRestServer(8088, socketInstance);

const liveApp = createLiveApp(getLiveQueue())

server.createServer(liveApp)
server.createPath('/')


const backgroundHandler = new BackgroundHandler([
  new IVSBroadcastWorker(server), 
  new RvtLiveEventWorker(server),
  new IVSDistinctBuyerWorker(server)
]);

const tasks = [server.listen(), backgroundHandler.run()];

Promise.all(tasks)
  .then((result) => {
    console.log('System is up and running.');
  })
  .catch((error) => {
    console.error('An error occurred:', error);
  });
