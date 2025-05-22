import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
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
  // Add DropdownModule if using CoreUI's Dropdown components,
  // but for a simple <select>, it's not needed.
  // FormSelectDirective, // For cFormSelect if you choose to use it
} from '@coreui/angular';
import { Skill, SkillsService } from '../../services/skills.service';
import { UserService, User } from '../../services/user.service'; // 👈 IMPORT UserService and User

// Updated Project interface to allow manager to be an ID string or a populated object
interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  assignments: string[];
  requiredSkills: string[]; // This should be an array of skill IDs after transformation
  tasks: string[];
  users: string[];
  manager:
    | string
    | {
        // Can be string (ID) for forms, or object when fetched
        _id: string;
        firstName: string;
        lastName: string;
        image?: string; // Make image optional as it might not always be populated
      };
  createdAt: string;
  // Add other fields like updatedAt, __v if you use them directly
}

@Component({
  selector: 'app-manager-project-list',
  imports: [
    GridModule,
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
    FormFeedbackComponent,
    // FormSelectDirective, // If you use <select cFormSelect>
  ],
  templateUrl: './manager-project-list.component.html',
  styleUrl: './manager-project-list.component.scss',
})
export class ManagerProjectListComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  // selectedProject will hold the project data being edited.
  // Its 'manager' field will be an ID (string) when in edit mode for ngModel binding.
  selectedProject: Project | null = null;
  isEditWidgetVisible = false;
  isCreateWidgetVisible = false;
  createProjectForm: FormGroup;
  availableSkills: Skill[] = [];
  availableManagers: User[] = []; // 👈 ADD for manager list

  search: string = '';
  currentPage: number = 1;
  pages: number = 0;
  loading = false;
  loadingManagers = false; // Optional: for manager loading state

  private subscriptions: Subscription[] = []; // Manage multiple subscriptions

  maxSkillsValidator(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedSkills = control.value as string[];
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
    private userService: UserService, // 👈 INJECT UserService
    private fb: FormBuilder
  ) {
    this.createProjectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['Ouvert', Validators.required], // Consider schema: "Ouvert", "En cours", "Complété"
      requiredSkills: [[], [Validators.required, this.maxSkillsValidator(5)]],
      manager: ['', Validators.required], // 👈 ADD manager FormControl
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.createProjectForm.get(controlName);
    if (!control) return '';
    const fieldName =
      controlName.charAt(0).toUpperCase() + controlName.slice(1);

    if (control.errors?.['required']) {
      if (
        controlName === 'requiredSkills' &&
        (!control.value || control.value.length === 0)
      ) {
        return 'At least one skill is required.';
      }
      return `${fieldName} is required.`;
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
    this.loadAvailableManagers(); // 👈 LOAD managers
  }

  loadAvailableSkills(): void {
    const skillsSub = this.skillsService
      .getAllSkills({ page: 1, pageSize: 1000 })
      .subscribe({
        next: (response) => {
          this.availableSkills = response.skills || [];
        },
        error: (err) => {
          console.error('Failed to load available skills:', err);
        },
      });
    this.subscriptions.push(skillsSub);
  }

  loadAvailableManagers(): void {
    this.loadingManagers = true;
    const managersSub = this.userService.getManagerList({ page: 1 }).subscribe({
      next: (response) => {
        this.availableManagers = response.users || [];
        this.loadingManagers = false;
      },
      error: (err) => {
        console.error('Failed to load managers:', err);
        this.loadingManagers = false;
      },
    });
    this.subscriptions.push(managersSub);
  }

  fetchProjects(): void {
    this.loading = true;
    const projectsSub = this.projectService
      .getProjectsList({ name: this.search, page: this.currentPage })
      .subscribe({
        next: (data) => {
          this.projects = data.projects as Project[]; // Cast to ensure type compatibility
          this.pages = data.pages;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
          this.loading = false;
        },
      });
    this.subscriptions.push(projectsSub);
  }

  onViewProject(project: Project) {
    // Create a deep copy for editing to avoid modifying the original list object
    this.selectedProject = JSON.parse(JSON.stringify(project));

    if (this.selectedProject) {
      // Ensure manager is an ID for ngModel binding in the edit form
      if (
        typeof this.selectedProject.manager === 'object' &&
        this.selectedProject.manager !== null
      ) {
        this.selectedProject.manager = this.selectedProject.manager._id;
      }
      // Ensure requiredSkills is an array of skill IDs
      this.selectedProject.requiredSkills =
        project.requiredSkills?.map((skill: any) =>
          typeof skill === 'string' ? skill : skill._id
        ) || [];
    }
    this.isEditWidgetVisible = true;
  }

  onCloseWidget() {
    this.selectedProject = null;
    this.isEditWidgetVisible = false;
    this.isCreateWidgetVisible = false;
    this.createProjectForm.reset({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'Ouvert',
      requiredSkills: [],
      manager: '', // 👈 RESET manager field
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
      status: 'Ouvert', // Default status
      requiredSkills: [],
      manager: '', // 👈 RESET manager field
    });
    this.createProjectForm.markAsPristine();
    this.createProjectForm.markAsUntouched();
  }

  createProject(): void {
    if (this.createProjectForm.invalid) {
      Object.values(this.createProjectForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

    const formValue = this.createProjectForm.value;
    const projectData = {
      ...formValue,
      requiredSkills: formValue.requiredSkills || [],
      manager: formValue.manager, // manager is already an ID from the form control
    };

    const createSub = this.projectService.createProject(projectData).subscribe({
      next: (response) => {
        console.log('Project created:', response);
        this.onCloseWidget();
        this.fetchProjects();
      },
      error: (error) => {
        console.error('Failed to create project:', error);
        // Optionally, display error to user in the modal
      },
    });
    this.subscriptions.push(createSub);
  }

  onSaveChanges(): void {
    if (!this.selectedProject || !this.isEditFormValid()) {
      // Add a validation check for edit form
      // Optionally, show an error or mark fields
      console.warn('Edit form is invalid or no project selected.');
      return;
    }

    // The selectedProject.manager is already an ID due to onViewProject transformation
    // Ensure requiredSkills is also an array of IDs
    const projectDataToUpdate = {
      ...this.selectedProject,
      manager: this.selectedProject.manager as string, // manager is an ID string
      requiredSkills: this.selectedProject.requiredSkills || [],
    };

    const updateSub = this.projectService
      .updateProject(this.selectedProject._id, projectDataToUpdate)
      .subscribe({
        next: () => {
          this.onCloseWidget();
          this.fetchProjects();
        },
        error: (err) => {
          console.error('Failed to update project:', err);
        },
      });
    this.subscriptions.push(updateSub);
  }

  // Helper for template-driven edit form validation (basic example)
  isEditFormValid(): boolean {
    if (!this.selectedProject) return false;
    return !!(
      this.selectedProject.name &&
      this.selectedProject.manager &&
      this.selectedProject.status
    );
    // Add more checks as needed for other required fields in edit form
  }

  deleteProject(project: Project): void {
    if (
      confirm(
        `Êtes-vous sûr de vouloir supprimer le projet "${project.name}" ?`
      )
    ) {
      const deleteSub = this.projectService
        .deleteProject(project._id)
        .subscribe({
          next: () => {
            this.fetchProjects();
            if (
              this.selectedProject &&
              this.selectedProject._id === project._id
            ) {
              this.onCloseWidget();
            }
          },
          error: (error) => {
            console.error('Failed to delete project:', error);
          },
        });
      this.subscriptions.push(deleteSub);
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

  // Utility to get manager display name, handling both object and ID cases
  getManagerName(
    manager:
      | string
      | { _id: string; firstName: string; lastName: string; image?: string }
  ): string {
    if (typeof manager === 'string') {
      const foundManager = this.availableManagers.find(
        (m) => m._id === manager
      );
      return foundManager
        ? `${foundManager.firstName} ${foundManager.lastName}`
        : 'N/A (ID: ' + manager + ')';
    } else if (manager && manager.firstName && manager.lastName) {
      return `${manager.firstName} ${manager.lastName}`;
    }
    return 'N/A';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
