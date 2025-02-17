import { Task } from "./task";

export interface TaskResponse extends Task {
    id: Number;
    creationDate: string;
    selectedStatus?: Number
}