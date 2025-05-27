import { Component, OnInit } from '@angular/core';
// import { DocsExampleComponent } from '@docs-components/public-api';

import { TablesComponent } from '../base/tables/tables.component';
import {
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  ButtonDirective,
  CardModule,
  GridModule,
  TableModule,
  ButtonModule,
  FormModule,
  ButtonGroupModule,
  SpinnerModule,
  TableDirective,
  FormControlDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  SpinnerComponent,
} from '@coreui/angular';
import { Task, TasksService } from '../../services/tasks.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { User, UserService } from '../../services/user.service';

import { IconModule, IconSetService } from '@coreui/icons-angular';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProjectsService } from '../../services/projects.service';
@Component({
  selector: 'app-tasks-list',
  imports: [
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ButtonDirective,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    GridModule,
    TableModule,
    ButtonModule,
    FormModule,
    ButtonGroupModule,
    SpinnerModule,
    // IconModule, // Removed as it is not defined
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ColComponent,
    TableDirective,
    ButtonDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    // InputGroupTextComponent,
    SpinnerComponent,
    IconModule,
  ],
  templateUrl: './consultant-tasks-list.component.html',
  styleUrl: './consultant-tasks-list.component.scss',
})
export class ConsultantTasksListComponent implements OnInit {
  tasks: Task[] = [];
  isLoading = false;
  page = 1;
  totalPages = 0;
  searchTerm = '';
  private searchSubject = new Subject<string>();
  selectedTask: Task | null = null;
  isModalOpen = false;
  currentStatus: string = '';

  userRole: string | null = null; // Store the user role

  readonly headData = ['Titre', 'Project', 'Status', 'Créé à', 'Actions'];

  isCreateModalOpen = false;
  createTaskForm: FormGroup;
  availableProjects: any[] = [];
  availableEmployees: any[] = [];

  taskCreator: any = null;

  isEditModalOpen = false;
  editTaskForm: FormGroup;

  constructor(
    private taskService: TasksService,
    private authService: AuthService,
    private projectsService: ProjectsService,
    private userService: UserService, // Add this

    private fb: FormBuilder
  ) {
    this.editTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      project: [{ value: '', disabled: true }],
      assignedTo: ['', Validators.required],
      status: ['', Validators.required],
    });

    this.loadUserRole();
    this.createTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      project: ['', Validators.required],
      assignedTo: ['', Validators.required], // Add this field

      status: ['Ouvert', Validators.required],
    });
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.loadTasks();
      });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  openEditTaskModal(task: Task): void {
    this.selectedTask = task;
    this.isEditModalOpen = true;
    this.loadProjects();
    this.loadEmployees();

    // Populate form with task data
    this.editTaskForm.patchValue({
      title: task.title,
      description: task.description,
      project: task.project?._id,
      assignedTo: task.assignedTo?._id,
      status: task.status,
    });
  }

  closeEditTaskModal(): void {
    this.isEditModalOpen = false;
    this.selectedTask = null;
    this.editTaskForm.reset();
  }
  // Add this method to load employees
  loadEmployees(): void {
    this.userService.getEmployeList({}).subscribe({
      next: (response) => {
        this.availableEmployees = response.users;
        console.log('Loaded employees:', this.availableEmployees);
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      },
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  loadUserRole() {
    this.userRole = this.authService.getUserRole(); // Assume you have this method in AuthService
    console.log('User role:', this.userRole);
  }

  openCreateTaskModal(): void {
    this.isCreateModalOpen = true;
    this.loadProjects();
    this.loadEmployees(); // Add this line
  }

  closeCreateTaskModal(): void {
    this.isCreateModalOpen = false;
    this.createTaskForm.reset({
      status: 'Ouvert',
    });
  }

  loadProjects(): void {
    this.projectsService.getProjectsList({}).subscribe({
      next: (response) => {
        this.availableProjects = response.projects;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      },
    });
  }

  createTask(): void {
    if (this.createTaskForm.valid) {
      const taskData = {
        title: this.createTaskForm.value.title,
        description: this.createTaskForm.value.description,
        project: this.createTaskForm.value.project,
        assignedTo: this.createTaskForm.value.assignedTo,
        status: this.createTaskForm.value.status,
      };

      this.taskService.createTask(taskData).subscribe({
        next: (response) => {
          console.log('Task created successfully:', response);
          this.loadTasks();
          this.closeCreateTaskModal();
        },
        error: (error) => {
          console.error('Error creating task:', error);
        },
      });
    } else {
      Object.keys(this.createTaskForm.controls).forEach((key) => {
        const control = this.createTaskForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  loadTasks(): void {
    this.isLoading = true;
    switch (this.userRole) {
      case 'employee': {
        this.taskService
          .getAssignedTasks(this.page, 10, this.searchTerm)
          .subscribe({
            next: (response) => {
              this.tasks = response.tasks;
              this.totalPages = response.pages;
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error loading tasks:', error);
              this.isLoading = false;
            },
          });
        break;
      }

      case 'manager': {
        this.taskService.getMyTasks(this.page, 10, this.searchTerm).subscribe({
          next: (response) => {
            this.tasks = response.tasks;
            this.totalPages = response.pages;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading tasks:', error);
            this.isLoading = false;
          },
        });
        break;
      }
      default: {
        console.log('Invalid user role:', this.userRole);
        this.isLoading = false;
      }
    }
  }
  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadTasks();
  }

  openTaskModal(task: Task): void {
    this.selectedTask = task;
    console.log('Selected task:', this.selectedTask);

    // Fetch creator details if we have a createdBy ID
    if (task.createdBy && typeof task.createdBy === 'string') {
      this.userService.getUserById(task.createdBy).subscribe({
        next: (user) => {
          this.taskCreator = user;
          console.log('Task creator:', this.taskCreator);
        },
        error: (error) => {
          console.error('Error fetching task creator:', error);
          this.taskCreator = null;
        },
      });
    }

    this.currentStatus = task.status ?? 'Ouvert';
    this.isModalOpen = true;
  }

  closeTaskModal(): void {
    this.isModalOpen = false;
    this.selectedTask = null;
    this.taskCreator = null; // Reset creator details
  }

  updateStatus(): void {
    if (!this.selectedTask) return;

    this.taskService
      .updateTaskStatus(
        this.selectedTask._id!,
        this.currentStatus as 'Ouvert' | 'En cours' | 'Complété'
      )
      .subscribe({
        next: () => {
          this.loadTasks();
          this.closeTaskModal();
          console.log('Status updated successfully ' + this.currentStatus);
        },
        error: (error) => {
          console.error('Error updating status:', error);
        },
      });
  }

  updateTask(): void {
    if (this.editTaskForm.valid && this.selectedTask) {
      const taskData = {
        ...this.editTaskForm.value,
        _id: this.selectedTask._id,
      };

      this.taskService.updateTask(this.selectedTask._id, taskData).subscribe({
        next: (response) => {
          console.log('Task updated successfully:', response);
          this.loadTasks();
          this.closeEditTaskModal();
        },
        error: (error) => {
          console.error('Error updating task:', error);
        },
      });
    } else {
      Object.keys(this.editTaskForm.controls).forEach((key) => {
        const control = this.editTaskForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  getStatusColor(status: string | undefined): string {
    switch (status) {
      case 'Ouvert':
        return 'badge bg-danger text-white';
      case 'En cours':
        return 'badge bg-warning text-dark';
      case 'Complété':
        return 'badge bg-success text-white';
      default:
        return 'badge bg-secondary text-white';
    }
  }
}
