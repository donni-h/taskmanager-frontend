import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './components/tasks/tasks.component';
import { ScheduledTasksComponent } from './components/scheduled-tasks/scheduled-tasks.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import { AboutComponent } from './components/about/about.component';
import {ScheduledTaskDetailComponent} from "./components/scheduled-task-detail/scheduled-task-detail.component";
const routes: Routes = [
  { path: 'tasks', component: TasksComponent},
  { path: 'scheduled-tasks', component: ScheduledTasksComponent},
  { path: 'task/:id', component: TaskDetailComponent},
  { path: 'about', component:AboutComponent},
  { path: 'scheduled-task/:id', component:ScheduledTaskDetailComponent},
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
