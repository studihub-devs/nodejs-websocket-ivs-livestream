import { WebsocketInstance } from "../websocket/WebsocketInstance";
import { ITask } from "./ITask";

export class BackgroundHandler {
    taskList: ITask[];
    constructor (taskList: ITask[]) {
        this.taskList = taskList
    }

    run() {
        for (const task of this.taskList) {
            task.run()
        }
    }
}