import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, map, Observable, of, tap} from 'rxjs';
import { API_URL } from '../global';
import { Task} from "../models/task";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {MessageServiceService} from "./message-service.service";
import {data} from "autoprefixer";
import * as http from "http";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private readonly apiUrl: string = `${API_URL}/tasks/`

  constructor(private http: HttpClient, private messageService: MessageServiceService) { }

  // Fetch Tasks
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl)
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(this.apiUrl+id).pipe(map(data => {
      data.dueDate = new Date(data.dueDate)
      return data
    }))
  }
  // Fetch Task by ID
  deleteTask(id: number) {
    this.http.delete(`${this.apiUrl}${id}`).subscribe();
  }

  finishTask(task: Task) {
    task.finished = new Date()
    this.updateTask(task)
  }

  updateTask(task: Task): Observable<any> {
    console.log(task)
    return this.http.put(this.apiUrl+task.id, task, this.httpOptions).pipe(
      tap(), catchError(this.handleError<any>('updateTask'))
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

  createTask(task: Task): Observable<any> {
    return this.http.post(this.apiUrl, task, this.httpOptions).pipe(
      tap(), catchError(this.handleError<any>('createTask'))
    )

  }
}
