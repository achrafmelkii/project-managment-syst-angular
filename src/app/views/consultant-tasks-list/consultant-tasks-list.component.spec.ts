import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantTasksListComponent } from './consultant-tasks-list.component';

describe('ConsultantTasksListComponent', () => {
  let component: ConsultantTasksListComponent;
  let fixture: ComponentFixture<ConsultantTasksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantTasksListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantTasksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
