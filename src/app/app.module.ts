import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { ScheduledTasksComponent } from './components/scheduled-tasks/scheduled-tasks.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import { AboutComponent } from './components/about/about.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import {DialogModule} from "primeng/dialog";
import {FormsModule} from "@angular/forms";
import {ReactiveFormsModule} from "@angular/forms";
import { ScheduledTaskDetailComponent } from './components/scheduled-task-detail/scheduled-task-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    TasksComponent,
    ScheduledTasksComponent,
    DashboardComponent,
    TaskDetailComponent,
    AboutComponent,
    ConfirmationComponent,
    ScheduledTaskDetailComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        DialogModule,
        FormsModule,
        ReactiveFormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
