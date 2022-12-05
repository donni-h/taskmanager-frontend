import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, map, max, Observable, of, tap} from 'rxjs';
import { API_URL } from '../global';
import { ScheduledTask } from '../models/scheduledTask';
import {MessageServiceService} from "./message-service.service";

@Injectable({
  providedIn: 'root'
})
export class ScheduledTaskService {

  private readonly apiUrl: string = (`${API_URL}/scheduled-tasks/`)
  constructor(private http: HttpClient, private messageService: MessageServiceService) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getScheduledTasks(): Observable<ScheduledTask[]> {
    return this.http.get<ScheduledTask[]>(this.apiUrl)
  }

  getScheduledTask(id: string): Observable<ScheduledTask> {
    return this.http.get<ScheduledTask>(`${this.apiUrl}${id}`).pipe(map(data => {
      data.start = new Date(data.start!)
      return data
    }))
  }

  deleteTask(id: number) {
    this.http.delete(`${this.apiUrl}${id}`).subscribe();
  }

  updateTask(task: ScheduledTask):Observable<any> {
     task = this.trimTask(task)
    return this.http.put(this.apiUrl+task.id, task, this.httpOptions).pipe(
      tap(), catchError(this.handleError<any>('updateTask'))
    )

  }

  createTask(task: ScheduledTask): Observable<any> {
    task = this.trimTask(task)
    task.nextSchedule = task.start
    return this.http.post(this.apiUrl, task, this.httpOptions).pipe(
      tap(), catchError(this.handleError<any>('createTask'))
    )
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T)
    }
  }

  private log(s: string) {
    this.messageService.display(`TaskService: ${s}`)

  }
  private trimTask(task: ScheduledTask): ScheduledTask{
    switch (task.unit?.toLowerCase()){
      case 'daily': {
       task.day = null
        return task
      }
      case 'weekly': {
        task.day = null
        return task
      }
      case 'monthly': {
        if(task.specialLength != null)
          task.day = null
        return task;
      }
      case 'yearly': {
        if(task.specialLength != null)
          task.day = null
        return task;
      }
      default: {
        throw new Error("couldn't handle task")
      }
    }
  }
}
