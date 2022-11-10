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
  recurrence!: Recurrence
  isWorkDaily = false
  task!: ScheduledTask;
  taskForm!: FormGroup
  DAY = 86400000
  people!: FormArray
  readonly max = 999;
  readonly min = 1;
  readonly weekdays = new Map<number, string>([[1, "Monday"], [2, "Tuesday"], [4, "Wednesday"], [8, "Thursday"], [16, "Friday"], [32, "Saturday"], [64, "Sunday"],])
  readonly recurrences: Recurrence[] = [Recurrence.Daily, Recurrence.Weekly, Recurrence.Monthly, Recurrence.Yearly]
  readonly specialLengths = ["First", "Second", "Third", "Fourth", "Last"]
  readonly months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]


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
          unit: Recurrence.Daily,
          start: new Date(),
          end: null,
          repetitions: null,
          repetitionsLeft: null,
          length: 1,
          weekday: null,
          specialLength: null,
          month: null,
          day: 1,
          nextSchedule: null,
          tasks: [],
          responsibilities: [],
          deleted: null,
          createdAt: date,
          updatedAt: date
        }

        this.recurrence = Recurrence.Daily
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
      repetitions: new FormControl([Validators.max(this.max), Validators.min(this.min)]),
      recurrence: new FormControl(this.recurrence, Validators.required),
      length: new FormControl(this.task.length, Validators.required),
      weekday: new FormControl(this.task.weekday),
      specialLength: new FormControl(this.task.specialLength),
      month: new FormControl(this.task.month),
      day: new FormControl(this.task.day),
      start: new FormControl(this.task.start!.toISOString().slice(0,16), Validators.required),
      end: new FormControl(this.task.end),
      selection: new FormControl(true)
    })
  }

  onChangeRecurrence(rec: Recurrence) {
    this.recurrence = rec
    this.resetSelection()
  }


  resetSelection(){
    this.taskForm.controls['specialLength'].setValue(null)
    this.taskForm.controls['length'].setValue(1)
    this.taskForm.controls['weekday'].setValue(this.task.weekday)
    this.taskForm.controls['specialLength'].setValue(this.task.specialLength)
    this.taskForm.controls['month'].setValue(this.task.month)
    this.taskForm.controls['day'].setValue(this.task.day)
    }


}
