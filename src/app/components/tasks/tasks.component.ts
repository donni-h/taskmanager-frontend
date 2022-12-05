import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Task} from '../../models/task';
import {TaskService} from '../../services/task.service';
import {MarkdownService} from "ngx-markdown";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TasksComponent implements OnInit {

  constructor(private taskService: TaskService, private markdownService: MarkdownService) { }

  tasks!: Task[];
  searchText = ""
  ngOnInit(): void {
    this.taskService.getTasks().subscribe((data: any) => {
        this.tasks = data;
        console.log(this.tasks)
      this.tasks.forEach(task => {
        console.log(task.description)
      })
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
