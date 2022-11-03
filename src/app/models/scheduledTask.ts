import { BaseModel } from "./baseModel";
import { Responsibility } from "./responsibility";

export interface ScheduledTask extends BaseModel {
    id: number | null;
    title: string | null  ;
    description: string | null;
    unit: string | null;
    start: Date | null;
    end: Date | null;
    repetitions: number | null;
    repetitionsLeft: number | null;
    length: number | null;
    weekday: number | null;
    specialLength: string | null;
    month: number | null;
    day: number | null;
    nextSchedule: Date | null;
    tasks: Task[];
    responsibilities: Responsibility[];
    deleted: Date | null;
}
