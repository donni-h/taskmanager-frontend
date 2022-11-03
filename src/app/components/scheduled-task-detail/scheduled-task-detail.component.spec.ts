import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledTaskDetailComponent } from './scheduled-task-detail.component';

describe('ScheduledTaskDetailComponent', () => {
  let component: ScheduledTaskDetailComponent;
  let fixture: ComponentFixture<ScheduledTaskDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduledTaskDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduledTaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
