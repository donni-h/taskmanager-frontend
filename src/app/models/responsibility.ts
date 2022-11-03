import { BaseModel } from "./baseModel";
import {Task} from "./task";
import {ScheduledTask} from "./scheduledTask";

export interface Responsibility extends BaseModel{
    id: number;
    name?: string;
    email?: string;
    scheduledTask?: ScheduledTask;
    taskId?: Task;
}
