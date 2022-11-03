import { Component, OnInit } from '@angular/core';
import { ScheduledTask } from 'src/app/models/scheduledTask';
import { ScheduledTaskService } from 'src/app/services/scheduled-task.service';

@Component({
  selector: 'app-scheduled-tasks',
  templateUrl: './scheduled-tasks.component.html',
  styleUrls: ['./scheduled-tasks.component.css']
})
export class ScheduledTasksComponent implements OnInit {

  constructor(private sTaskService: ScheduledTaskService) { }
  sTasks!: ScheduledTask[]
  ngOnInit(): void {
    this.sTaskService.getScheduledTasks().subscribe((data: any) => {
      this.sTasks = data;
      console.log(this.sTasks)
  });
  }

  deleteTask(id: number) {
    this.sTaskService.deleteTask(id)
    this.sTasks = this.sTasks.filter(task => task.id != id)
  }

}
