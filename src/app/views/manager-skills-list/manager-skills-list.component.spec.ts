import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerSkillsListComponent } from './manager-skills-list.component';

describe('ManagerSkillsListComponent', () => {
  let component: ManagerSkillsListComponent;
  let fixture: ComponentFixture<ManagerSkillsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerSkillsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerSkillsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
