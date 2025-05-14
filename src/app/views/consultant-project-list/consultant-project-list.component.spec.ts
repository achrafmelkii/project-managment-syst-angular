import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantProjectListComponent } from './consultant-project-list.component';

describe('ConsultantProjectListComponent', () => {
  let component: ConsultantProjectListComponent;
  let fixture: ComponentFixture<ConsultantProjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantProjectListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
