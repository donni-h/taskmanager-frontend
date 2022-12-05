import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {TaskService} from "../../services/task.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Task} from "../../models/task";
import {Location} from "@angular/common";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule} from "@angular/forms";
import {Responsibility} from "../../models/responsibility";

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TaskDetailComponent implements OnInit {
  task!: Task;
  taskForm!: FormGroup
  DAY = 86400000
  people!: FormArray
  constructor(private taskService: TaskService, private activatedRoute: ActivatedRoute, private location: Location, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {

      if (params.get('id') === 'add'){
        let date = new Date()
        this.task = {
          createdAt: date,
          responsibilities: [],
          updatedAt: date,
          id: null,
          title: "",
          description: "",
          dueDate: date,
          finished: null
        }
        this.createForm()
        this.people = this.responsibilities
        return
      }

      this.taskService.getTask(params.get('id')!).subscribe((response: Task) => {
        this.task = response
        this.createForm()
        this.task.responsibilities.forEach(resp => {
          this.addResponsibility(resp)
        })

        this.people = this.responsibilities
        console.log(this.task)
      })
    })
  }

  goBack() {
    this.location.back()
  }

  save() {
    if(this.task.id) {
      this.taskService.updateTask(this.task).subscribe(() => this.router.navigate(['tasks']))
      return
    }
    this.taskService.createTask(this.task).subscribe(() => this.router.navigate(['tasks']))
  }

  getStatusStyle() {
    if(this.task.dueDate! <= new Date()) {
      return "overdue"
    } else if(Date.now() - this.task.dueDate!?.getDate() <= this.DAY){
      return "due-soon"
    }

    return "not-due-yet"
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
      email: ['', Validators.email]
    })
  }

  onSubmit() {
    this.task.title = this.taskForm.controls['title'].value
    this.task.description = this.taskForm.controls['description'].value
    this.task.dueDate = new Date(this.taskForm.controls['dueDate'].value)
    this.taskForm.controls['people'].value.forEach((resp: Responsibility) => {
      console.log(resp)
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
    console.log(this.task)
    this.save()
  }

  hasStatus(): boolean {
    return this.task.id != null
  }

  createForm() {
    this.taskForm = this.formBuilder.group({
      title: new FormControl(this.task.title, [Validators.required, Validators.maxLength(45)]),
      description: new FormControl(this.task.description),
      isPending: new FormControl({value: this.task.finished, disabled: true}),
      dueDate: new FormControl((this.task.dueDate!).toISOString().slice(0,16), Validators.required),
      people: this.formBuilder.array([])
    })
  }
}
