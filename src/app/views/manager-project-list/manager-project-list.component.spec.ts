import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerProjectListComponent } from './manager-project-list.component';

describe('ManagerProjectListComponent', () => {
  let component: ManagerProjectListComponent;
  let fixture: ComponentFixture<ManagerProjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerProjectListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
