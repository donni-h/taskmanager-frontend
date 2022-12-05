import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Location} from "@angular/common";
import {ScheduledTaskService} from "../../services/scheduled-task.service";
import {ScheduledTask} from "../../models/scheduledTask";
import {Responsibility} from "../../models/responsibility";
import {getRecurrenceFromString, Recurrence} from "./Recurrence";

@Component({
  selector: 'app-scheduled-task-detail',
  templateUrl: './scheduled-task-detail.component.html',
  styleUrls: ['./scheduled-task-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ScheduledTaskDetailComponent implements OnInit {
  recurrence!: Recurrence
  task!: ScheduledTask;
  taskForm!: FormGroup
  selection = true
  loaded!: Promise<boolean>;
  DAY = 86400000
  people!: FormArray
  readonly max = 999;
  readonly min = 1;
  readonly weekdays = new Map<number, string>([[1, "Monday"], [2, "Tuesday"], [3, "Wednesday"], [4, "Thursday"], [5, "Friday"], [6, "Saturday"], [7, "Sunday"],])
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
          repetitions: 1,
          repetitionsLeft: null,
          length: 1,
          weekdays: [],
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
        this.loaded = Promise.resolve(true)
        return
      }


      this.taskService.getScheduledTask(params.get('id')!).subscribe( response => {
        this.task = response
        this.recurrence = getRecurrenceFromString(this.task.unit!)
        if (this.task.specialLength){
          this.selection = false
        }
        this.createForm()
        this.task.responsibilities.forEach(resp => {
          this.addResponsibility(resp)
        })
        this.people = this.responsibilities




        this.loaded = Promise.resolve(true)
      })
    })

  }
  get title() { return this.taskForm.get('title')!}

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
      email: ['', Validators.email]
    })
  }

  private createForm() {
    this.taskForm = this.formBuilder.group({
      title: new FormControl(this.task.title, [Validators.required, Validators.maxLength(45)]),
      description: new FormControl(this.task.description),
      people: this.formBuilder.array([]),
      repetitions: new FormControl(this.task.repetitions,[Validators.max(this.max), Validators.required, Validators.min(this.min)]),
      recurrence: new FormControl(this.recurrence, Validators.required),
      length: new FormControl(this.task.length, [Validators.required]),
      weekday: new FormControl(this.initWeekdayForm()),
      specialLength: new FormControl(this.task.specialLength),
      month: new FormControl(this.task.month == null? null : this.months[this.task.month-1]),
      day: new FormControl(this.task.day),
      start: new FormControl(this.task.start!.toISOString().slice(0,16), [Validators.required]),
      selection: new FormControl(this.selection)
    }, {validators: this.validateForm()})

  }

  onChangeRecurrence(rec: Recurrence) {
    this.recurrence = rec
    this.resetSelection()

  }


  initWeekdayForm(): null | number | number[] {
    if (this.task.weekdays == null || this.task.weekdays.length == 0 )
      return null
    if (this.task.weekdays.length == 1)
      return this.task.weekdays[0]
    return this.task.weekdays
  }
  resetSelection(){
    this.taskForm.controls['specialLength'].setValue(null)
    this.taskForm.controls['length'].setValue(1)

    if(this.recurrence.toString() == this.task.unit){
      this.taskForm.controls['selection'].setValue(this.selection)
      this.taskForm.controls['weekday'].setValue(this.initWeekdayForm())
      this.taskForm.controls['specialLength'].setValue(this.task.specialLength)
      this.taskForm.controls['month'].setValue(this.task.month == null? null : this.months[this.task.month-1])
      this.taskForm.controls['day'].setValue(this.task.day)
      return
    }

    this.taskForm.controls['weekday'].setValue(null)
    this.taskForm.controls['month'].setValue(null)
    this.taskForm.controls['selection'].setValue(true)
    this.taskForm.controls['day'].setValue(1)
  }


  onSubmit(){
   this.formToModel()
    this.save()
  }

  private formToModel(){
    this.task.title = this.taskForm.get('title')?.value
    this.task.description = this.taskForm.get('description')?.value
    this.task.repetitions = this.taskForm.get('repetitions')?.value
    this.task.unit = this.recurrence.toString()
    this.task.length = this.taskForm.get('length')?.value

    let weekdayArr = this.taskForm.get('weekday')?.value == null ? [] : this.taskForm.get('weekday')?.value
    Symbol.iterator in Object(weekdayArr) ? this.task.weekdays = weekdayArr : this.task.weekdays = [weekdayArr]

    this.task.specialLength = this.taskForm.get('specialLength')?.value
    this.task.month = this.months.indexOf(this.taskForm.get('month')?.value)+1
    this.task.day = this.taskForm.get('day')?.value
    this.task.start = new Date(this.taskForm.get('start')?.value) < new Date()? new Date() : new Date(this.taskForm.get('start')?.value)
    this.task.responsibilities.splice(0)
    this.taskForm.controls['people'].value.forEach((resp: Responsibility) => {
      if (resp.name == "" && resp.email == "") {
        return
      }

      if (!resp.id){
        this.task.responsibilities.push(resp)
        return
      }

      let i = this.task.responsibilities.findIndex(val => val.id == resp.id)
      this.task.responsibilities[i] = resp
    })
    console.log(this.task.responsibilities)
  }

  resetSelectionWeak() {
    this.taskForm.controls['specialLength'].setValue(null)
    this.taskForm.controls['day'].setValue(1)
    this.taskForm.controls['weekday'].setValue(null)

  }

    validateForm():ValidatorFn{
      return (form: AbstractControl): ValidationErrors | null => {
        const specialLength = form.get('specialLength')
        const length = form.get('length')
        const weekday = form.get('weekday')
        const selection = form.get('selection')
        const day = form.get('day')
        const month = form.get('month')

        switch (this.recurrence){

          case Recurrence.Daily: {
            if (specialLength?.value == 'WORKDAILY') {
              return null
            }

            return length?.value <= 0 || length?.value > 99 ? {invalidLength: true}: null
          }

          case Recurrence.Weekly: {
            if (length?.value <= 0 || length?.value > 99){
              return {invalidLength: true}
            }

            return weekday?.value != null ? null : {noWeekdays: true}
          }

          case Recurrence.Monthly: {
            if (length?.value <= 0 || length?.value > 99){
              return {invalidLength: true}
            }
            if(selection?.value) {
              return day?.value >= 0 && day?.value <= 99 && day?.value != null ? null : {invalidDay: true}
            }
            return this.specialLengths.includes(specialLength?.value) && this.weekdays.has(weekday?.value) ? null : {invalidSelection: true}
            }

          case Recurrence.Yearly: {
            if (!this.months.includes(month?.value))
              return {invalidMonth: true}
            if (selection?.value){
              return length?.value <= 0 || length?.value > 999 ? {invalidDay: true} : null
            }
            return this.specialLengths.includes(specialLength?.value)  && this.weekdays.has(weekday?.value)? null : {invalidSelection: true}
          }

          default: {
            return {illegalRecurrence: this.recurrence}
        }
        }

      }
    }

  private save() {
    if(this.task.id) {
      this.taskService.updateTask(this.task).subscribe(() => this.router.navigate(['scheduled-tasks']))
      return
    }
    this.taskService.createTask(this.task).subscribe(() => this.router.navigate(['scheduled-tasks']))
  }
}
