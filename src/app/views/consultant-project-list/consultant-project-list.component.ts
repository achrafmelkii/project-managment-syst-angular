import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common'; // 👈 Needed for *ngIf, *ngFor, date pipe, ngClass
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  SpinnerComponent,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  ColComponent,
  InputGroupComponent,
  FormControlDirective,
  ButtonDirective,
  TableDirective,
  ButtonModule,
} from '@coreui/angular';
import { Skill } from 'src/app/services/skills.service';
interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  assignments: string[];
  requiredSkills: Skill[];
  tasks: string[];
  users: string[];
  manager: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string;
  };
  createdAt: string;
}
@Component({
  selector: 'app-consultant-project-list',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ColComponent,
    InputGroupComponent,
    FormControlDirective,
    ButtonDirective,
    TableDirective,
    ButtonModule,
  ],
  templateUrl: './consultant-project-list.component.html',
  styleUrl: './consultant-project-list.component.scss',
})
export class ConsultantProjectListComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  selectedProject: Project | null = null;
  isEditWidgetVisible = false;
  isCreateWidgetVisible = false;
  createProjectForm: FormGroup;

  search: string = '';
  currentPage: number = 1;
  pages: number = 0;
  loading = false;

  private subscription?: Subscription;

  constructor(
    private projectService: ProjectsService,
    private fb: FormBuilder
  ) {
    this.createProjectForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      startDate: [''],
      endDate: [''],
      status: ['Ouvert', Validators.required],
    });
  }
  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects(): void {
    this.loading = true;
    this.subscription = this.projectService
      .getProjectsList({ name: this.search, page: this.currentPage })
      .subscribe(
        (data) => {
          this.projects = data.projects;
          this.pages = data.pages;
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching projects:', error);
          this.loading = false;
        }
      );
  }

  onViewProject(project: any) {
    this.selectedProject = { ...project }; // clone to avoid two-way binding issues
    this.isEditWidgetVisible = true;
  }
  onCloseWidget() {
    this.selectedProject = null;
    this.isEditWidgetVisible = false;
    this.isCreateWidgetVisible = false;
    this.createProjectForm.reset(); // Reset the form on close
  }

  handleSearch(event: Event): void {
    this.search = (event.target as HTMLInputElement).value;
    this.currentPage = 1; // Reset to the first page when searching
    this.fetchProjects();
  }

  openCreateProjectModal(): void {
    this.isCreateWidgetVisible = true;
    this.createProjectForm.reset();
  }

  createProject(): void {
    if (this.createProjectForm.valid) {
      this.projectService
        .createProject(this.createProjectForm.value)
        .subscribe({
          next: (response) => {
            console.log('Project created:', response);
            this.isCreateWidgetVisible = false;
            this.createProjectForm.reset();
            this.fetchProjects();
          },
          error: (error) => {
            console.error('Failed to create project:', error);
          },
        });
    } else {
      console.warn('Form is invalid:', this.createProjectForm.errors);
    }
  }

  onSaveChanges(): void {
    if (this.selectedProject) {
      this.projectService
        .updateProject(this.selectedProject._id, this.selectedProject)
        .subscribe({
          next: () => {
            this.isEditWidgetVisible = false;
            this.fetchProjects();
          },
          error: (err) => {
            console.error('Failed to update project:', err);
          },
        });
    }
  }

  deleteProject(project: Project): void {
    if (
      confirm(
        `Êtes-vous sûr de vouloir supprimer le projet "${project.name}" ?`
      )
    ) {
      this.projectService.deleteProject(project._id).subscribe({
        next: () => {
          this.fetchProjects();
        },
        error: (error) => {
          console.error('Failed to delete project:', error);
        },
      });
    }
  }

  setPage(page: number): void {
    this.currentPage = page;
    this.fetchProjects();
  }

  // Create an array of numbers for the pagination
  get pagesArray(): number[] {
    return Array(this.pages)
      .fill(0)
      .map((_, index) => index + 1);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
