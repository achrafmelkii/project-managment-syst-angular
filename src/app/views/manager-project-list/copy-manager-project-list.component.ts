import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';
import { Subscription } from 'rxjs'; // Removed Observable as it's not directly used as a type here
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule, // Keep for template-driven edit form
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
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
  GridModule,
  FormFeedbackComponent,
  // If you use CoreUI icons explicitly, ensure IconModule is imported in app or standalone component
} from '@coreui/angular';
import { Skill, SkillsService } from '../../services/skills.service';

interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  assignments: string[];
  requiredSkills: string[]; // This should be an array of skill IDs
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
  selector: 'app-manager-project-list',
  // Ensure FormsModule is here if your edit form remains template-driven
  imports: [
    GridModule,
    CommonModule,
    FormsModule, // For template-driven edit form
    ReactiveFormsModule, // For reactive create form
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
    FormFeedbackComponent,
  ],
  templateUrl: './manager-project-list.component.html',
  styleUrl: './manager-project-list.component.scss',
  // standalone: true, // If this component is standalone
})
export class ManagerProjectListComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  selectedProject: Project | null = null;
  isEditWidgetVisible = false;
  isCreateWidgetVisible = false;
  createProjectForm: FormGroup;
  availableSkills: Skill[] = [];

  search: string = '';
  currentPage: number = 1;
  pages: number = 0;
  loading = false;

  private subscription?: Subscription;

  maxSkillsValidator(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedSkills = control.value as string[]; // Expecting an array of skill IDs (strings)
      if (selectedSkills && selectedSkills.length > max) {
        return {
          maxSkills: {
            requiredCount: max,
            actualCount: selectedSkills.length,
          },
        };
      }
      return null;
    };
  }

  constructor(
    private projectService: ProjectsService,
    private skillsService: SkillsService,
    private fb: FormBuilder
  ) {
    this.createProjectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['Ouvert', Validators.required],
      // Initialize with an empty array for multi-select
      // The value of this control will be an array of selected skill IDs
      requiredSkills: [[], [Validators.required, this.maxSkillsValidator(5)]],
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.createProjectForm.get(controlName);
    if (!control) return '';

    if (control.errors?.['required'] && controlName !== 'requiredSkills') {
      // Avoid "RequiredSkills is required"
      const fieldName =
        controlName.charAt(0).toUpperCase() + controlName.slice(1);
      return `${fieldName} is required.`;
    }
    if (
      control.errors?.['required'] &&
      controlName === 'requiredSkills' &&
      (!control.value || control.value.length === 0)
    ) {
      return 'At least one skill is required.';
    }
    if (control.errors?.['maxSkills']) {
      return `You can select a maximum of ${control.errors['maxSkills'].requiredCount} skills. You have selected ${control.errors['maxSkills'].actualCount}.`;
    }
    return '';
  }

  isInvalid(controlName: string): boolean {
    const control = this.createProjectForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  ngOnInit(): void {
    this.fetchProjects();
    this.loadAvailableSkills();
  }

  loadAvailableSkills(): void {
    this.skillsService.getAllSkills({ page: 1, pageSize: 1000 }).subscribe({
      next: (response) => {
        this.availableSkills = response.skills || [];
      },
      error: (err) => {
        console.error('Failed to load available skills:', err);
        // Optionally set an error message for the UI
      },
    });
  }

  // REMOVED onSkillSelect method as it's not needed for form value management
  // If you need it for logging or other side-effects, you can add it back,
  // but it should not patch the form value for reactive forms or ngModel.

  fetchProjects(): void {
    this.loading = true;
    this.subscription = this.projectService
      .getProjectsList({ name: this.search, page: this.currentPage })
      .subscribe({
        // Use object observer for better error handling
        next: (data) => {
          this.projects = data.projects;
          this.pages = data.pages;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
          this.loading = false;
        },
      });
  }

  onViewProject(project: Project) {
    // Use the defined Project interface
    this.selectedProject = {
      ...project,
      // Ensure requiredSkills is an array of skill IDs for ngModel binding in edit form
      requiredSkills:
        project.requiredSkills?.map((skill: any) =>
          typeof skill === 'string' ? skill : skill._id
        ) || [],
    };
    this.isEditWidgetVisible = true;
  }

  onCloseWidget() {
    this.selectedProject = null;
    this.isEditWidgetVisible = false;
    this.isCreateWidgetVisible = false;
    this.createProjectForm.reset({
      status: 'Ouvert',
      requiredSkills: [], // Reset skills to an empty array
    });
    this.createProjectForm.markAsPristine();
    this.createProjectForm.markAsUntouched();
  }

  handleSearch(event: Event): void {
    this.search = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.fetchProjects();
  }

  openCreateProjectModal(): void {
    this.isCreateWidgetVisible = true;
    this.createProjectForm.reset({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'Ouvert',
      requiredSkills: [], // Explicitly reset to empty array
    });
    // Mark as pristine and untouched to clear previous validation states
    this.createProjectForm.markAsPristine();
    this.createProjectForm.markAsUntouched();
  }

  createProject(): void {
    if (this.createProjectForm.valid) {
      const formValue = this.createProjectForm.value;
      // formValue.requiredSkills will already be an array of skill IDs
      // due to the multiple select bound with formControlName
      const projectData = {
        ...formValue,
        // Ensure requiredSkills is an array, even if somehow null/undefined from form
        requiredSkills: formValue.requiredSkills || [],
      };

      this.projectService.createProject(projectData).subscribe({
        next: (response) => {
          console.log('Project created:', response);
          this.onCloseWidget(); // Use onCloseWidget to reset and hide
          this.fetchProjects(); // Refresh the list
        },
        error: (error) => {
          console.error('Failed to create project:', error);
          // Optionally, display error to user in the modal
        },
      });
    } else {
      // Mark all controls as touched to display validation messages
      Object.values(this.createProjectForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    }
  }

  onSaveChanges(): void {
    if (this.selectedProject) {
      // Ensure requiredSkills in selectedProject is an array of IDs
      const projectDataToUpdate = {
        ...this.selectedProject,
        requiredSkills: this.selectedProject.requiredSkills || [],
      };

      this.projectService
        .updateProject(this.selectedProject._id, projectDataToUpdate)
        .subscribe({
          next: () => {
            this.onCloseWidget(); // Use onCloseWidget to reset and hide
            this.fetchProjects(); // Refresh list
          },
          error: (err) => {
            console.error('Failed to update project:', err);
            // Optionally, display error to user in the modal
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
          if (
            this.selectedProject &&
            this.selectedProject._id === project._id
          ) {
            this.onCloseWidget(); // Close edit widget if deleted project was being edited
          }
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

  get pagesArray(): number[] {
    return Array(this.pages)
      .fill(0)
      .map((_, index) => index + 1);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
