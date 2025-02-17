import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, timeout } from "rxjs";
import { Task } from "../domain/task";
import { GeneralMethods } from "../shared-components/general/general-methods";
import { TaskResponse } from "../domain/task-response";
import { TaskParams } from "../domain/task-params";

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    private readonly url: string;
    private readonly timeoutValue: number;

    constructor(
        private _httpClient: HttpClient,
        private methods: GeneralMethods
    ){
        this.url = this.methods.url();
        this.timeoutValue = 60000;
    }

    getAll(): Observable<Array<TaskResponse>> {
        var route = this.url + `/v1/Task/All`;
        return this._httpClient.get<Array<TaskResponse>>(route).pipe(
            timeout(this.timeoutValue)
        );
    }

    getTask(taskId: string): Observable<Array<TaskResponse>> {
        var url = this.url + `/v1/Task/Get?id=${taskId}`
        return this._httpClient.get<Array<TaskResponse>>(url).pipe(
            timeout(this.timeoutValue)
        );
    }

    postTask(task: Task): Observable<boolean> {
        let route = this.url + `/v1/Task/Create`;
        return this._httpClient.post<boolean>(route, task).pipe(
            timeout(this.timeoutValue)
        )
    }

    putTask(taskParams: TaskParams): Observable<boolean> {
        var url = this.url + "/v1/Task/Update";
        return this._httpClient.put<boolean>(url, taskParams).pipe(
            timeout(this.timeoutValue)
        );
    }

    deleteTask(taskId: Number): Observable<boolean> {
        var url = this.url + `/v1/Task/Delete?id=${taskId}`
        return this._httpClient.delete<boolean>(url).pipe(
            timeout(this.timeoutValue)
        );
    }
}