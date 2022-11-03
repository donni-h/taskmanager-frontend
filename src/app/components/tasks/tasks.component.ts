import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  constructor(private taskService: TaskService) { }

  tasks!: Task[];

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((data: any) => {
        this.tasks = data;
        console.log(this.tasks)
    });
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id)
    this.tasks = this.tasks.filter(task => task.id != id)
  }

  finishTask(task: Task) {
    this.taskService.finishTask(task)
    this.tasks = this.tasks.filter(task => task.finished == null)
  }
}
