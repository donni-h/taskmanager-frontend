import { ScheduledTask} from "./scheduledTask";
import { Responsibility } from "./responsibility";
import { BaseModel } from "./baseModel";
export interface Task extends BaseModel {
    id: number | null;
    title: string;
    description: string;
    finished: Date | null;
    dueDate: Date;
    scheduledTask?: ScheduledTask;
    responsibilities: Responsibility[];
    deleted?: Date;
}
