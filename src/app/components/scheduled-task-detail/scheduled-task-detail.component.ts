import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Location} from "@angular/common";
import {ScheduledTaskService} from "../../services/scheduled-task.service";
import {ScheduledTask} from "../../models/scheduledTask";
import {Responsibility} from "../../models/responsibility";
import {Recurrence} from "./Recurrence";

@Component({
  selector: 'app-scheduled-task-detail',
  templateUrl: './scheduled-task-detail.component.html',
  styleUrls: ['./scheduled-task-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ScheduledTaskDetailComponent implements OnInit {
  recurrences: Recurrence[] = [Recurrence.Daily, Recurrence.Weekly, Recurrence.Monthly, Recurrence.Yearly]
  recurrence: Recurrence | undefined
  task!: ScheduledTask;
  taskForm!: FormGroup
  DAY = 86400000
  people!: FormArray
  constructor(private taskService: ScheduledTaskService, private activatedRoute: ActivatedRoute, private location: Location, private router: Router, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      if(params.get('id')==='add'){
        let date = new Date()
        this.task = {
          id: null,
          title: null,
          description: null,
          unit: null,
          start: null,
          end: null,
          repetitions: null,
          repetitionsLeft: null,
          length: null,
          weekday: null,
          specialLength: null,
          month: null,
          day: null,
          nextSchedule: null,
          tasks: [],
          responsibilities: [],
          deleted: null,
          createdAt: date,
          updatedAt: date
        }
        this.createForm()
        this.people = this.responsibilities
        return
      }
    })
  }

  get responsibilities() {
    return this.taskForm.controls["people"] as FormArray
  }

  addResponsibility(resp?: Responsibility){
    let respForm: FormGroup
    if(resp){
      respForm = this.formBuilder.group({
        id: [resp.id? resp.id : null],
        name: [resp.name],
        email: [resp.email, Validators.email]
      })
    } else {
      respForm = this.createResponsibility()
    }

    this.responsibilities.push(respForm)
  }

  removeResponsibility(resp?: Responsibility, index?: number){
    if (!resp){
      this.task.responsibilities.pop()
      this.responsibilities.removeAt(this.responsibilities.length -1)
      return
    }
    this.task.responsibilities.filter(responsibility => responsibility.name != resp.name && responsibility.email != resp.email)
    this.responsibilities.removeAt(index!)
  }

  createResponsibility(): FormGroup {
    return this.formBuilder.group({
      name: '',
      email: ''
    })
  }

  private createForm() {
    this.taskForm = this.formBuilder.group({
      title: new FormControl(this.task.title, [Validators.required, Validators.maxLength(45)]),
      description: new FormControl(this.task.description),
      people: this.formBuilder.array([]),
      repetitions: new FormControl([Validators.max(999), Validators.min(1)])
    })
  }

  changeRecurrence(rec: Recurrence) {
    this.recurrence = rec
    console.log(typeof  this.recurrence)
  }
}
