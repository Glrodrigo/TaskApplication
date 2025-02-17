import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TaskResponse } from '../domain/task-response';

@Injectable({
  providedIn: 'root'
})

export class SharedTaskDataService {
  private dataSubject: BehaviorSubject<TaskResponse> = new BehaviorSubject<TaskResponse>({} as TaskResponse);
  public data$: Observable<TaskResponse> = this.dataSubject.asObservable();

  constructor() {}

  setData(data: TaskResponse): void {
    this.dataSubject.next(data);
  }

  getData(): Observable<TaskResponse> {
    return this.data$;
  }
}
