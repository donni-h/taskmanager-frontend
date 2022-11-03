import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../global';
import { ScheduledTask } from '../models/scheduledTask';

@Injectable({
  providedIn: 'root'
})
export class ScheduledTaskService {

  private readonly apiUrl: string = (`${API_URL}/scheduled-tasks/`)
  constructor(private http: HttpClient) { }

  getScheduledTasks(): Observable<ScheduledTask[]> {
    return this.http.get<ScheduledTask[]>(this.apiUrl)
  }

  getScheduledTask(id: number): Observable<ScheduledTask> {
    return this.http.get<ScheduledTask>(`${this.apiUrl}/${id}`)
  }

  deleteTask(id: number) {
    this.http.delete(`${this.apiUrl}${id}`).subscribe();
  }
}
