import { Task } from "./task";

export interface TaskParams extends Partial<Task> {
    id: Number;
}