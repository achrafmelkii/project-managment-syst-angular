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
import { IconModule } from '@coreui/icons-angular';
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
  InputGroupTextDirective,
  GridModule, // Add this import
} from '@coreui/angular';
import { Skill, SkillsService } from '../../services/skills.service';
import {
  AssignmentInput,
  AssignmentService,
} from '../../services/assignment.service'; // Import AssignmentService

interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  assignments: {
    _id: string;
    user: { _id: string; image: string; firstName: string; lastName: string }; // Example: might need user name
    project: Project; // Example: might need project name
    startDate: string | Date;
    endDate: string | Date;
    createdAt: string | Date;
    updatedAt: string | Date;
  }[];
  requiredSkills: Skill[]; // Updated to expect populated skill objects
  tasks: any[]; // **Updated to expect populated task objects with title**
  users: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string;
    email: string;
    skills?: Skill[]; // Optional: if you want to show user skills
  }[];
  manager: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string; // Keep if manager also has an image
  };
  createdAt: string;
}
@Component({
  selector: 'app-manager-project-list',
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
    IconModule,
    InputGroupTextDirective,
    GridModule, // Add this import
  ],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  selectedProject: Project | null = null;
  isEditWidgetVisible = false;
  isUsersWidgetVisible = false; // New property for user assignment widget
  isAssignmentsModalOpen = false; // Add this property

  availableSkills: Skill[] = [];
  projectAssignments: AssignmentInput[] = []; // Add this property
  availableUsers: any[] = []; // Add this property

  search: string = '';
  currentPage: number = 1;
  pages: number = 0;
  loading = false;

  assignmentForm: FormGroup; // FormGroup for assignment form
  selectedEmployee: any = null; // Currently selected employee for assignment

  private subscription?: Subscription;

  constructor(
    private projectService: ProjectsService,
    private skillsService: SkillsService, // Inject SkillsService
    private fb: FormBuilder,
    private assignmentService: AssignmentService // Add this
  ) {
    // Initialize the assignment form
    this.assignmentForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      userId: ['', Validators.required],
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
          console.log('Fetched projects:', this.projects); // Debug log

          this.loading = false;
        },
        (error) => {
          console.error('Error fetching projects:', error);
          this.loading = false;
        }
      );
  }

  loadAvailableSkills(): void {
    this.skillsService.getAllSkills({ page: 1, pageSize: 1000 }).subscribe({
      // Fetch a large number
      next: (response) => {
        this.availableSkills = response.skills || [];
      },
      error: (err) => {
        console.error('Failed to load available skills:', err);
      },
    });
  }

  onCloseWidget() {
    this.selectedProject = null;
    this.isEditWidgetVisible = false;
  }

  isEditFormValid(): boolean {
    if (!this.selectedProject) return false;
    return !!(
      this.selectedProject.name &&
      this.selectedProject.manager &&
      this.selectedProject.status
    );
    // Add more checks as needed for other required fields in edit form
  }
  onViewProject(project: any) {
    this.selectedProject = { ...project }; // clone to avoid two-way binding issues
    this.isEditWidgetVisible = true;
  }

  handleSearch(event: Event): void {
    this.search = (event.target as HTMLInputElement).value;
    this.currentPage = 1; // Reset to the first page when searching
    this.fetchProjects();
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

  closeUsersWidget(): void {
    this.isUsersWidgetVisible = false;
    this.selectedProject = null;
    this.assignmentForm.reset();
  }

  assignUserToProject(): void {
    if (this.assignmentForm.valid && this.selectedProject) {
      const { startDate, endDate, employeeId } = this.assignmentForm.value;

      // Check if dates are within project dates
      const projectStart = new Date(this.selectedProject.startDate);
      const projectEnd = new Date(this.selectedProject.endDate);
      const assignmentStart = new Date(startDate);
      const assignmentEnd = new Date(endDate);

      if (assignmentStart < projectStart || assignmentEnd > projectEnd) {
        alert('Assignment dates must be within project dates');
        return;
      }

      const assignment = {
        user: employeeId,
        project: this.selectedProject._id,
        startDate,
        endDate,
      };

      this.assignmentService.createAssignment(assignment).subscribe({
        next: () => {
          this.fetchProjects();
          this.assignmentForm.reset();
          this.loadAvailableUsers();
        },
        error: (err) => console.error('Failed to assign user:', err),
      });
    }
  }

  removeUserFromProject(userId: string): void {
    if (
      this.selectedProject?._id &&
      confirm('Are you sure you want to remove this user?')
    ) {
      this.projectService
        .deleteUserFromProject({
          _id: this.selectedProject._id,
          userId,
        })
        .subscribe({
          next: () => {
            this.fetchProjects();
            this.loadAvailableUsers();
          },
          error: (err) => console.error('Failed to remove user:', err),
        });
    }
  }

  // New methods for assignment modal
  openAssignmentsModal(project: Project): void {
    this.selectedProject = { ...project };
    console.log('Selected project for user assignment:', this.selectedProject);

    this.isAssignmentsModalOpen = true;
    this.loadProjectAssignments();
    this.loadAvailableUsers();
  }

  closeAssignmentsModal(): void {
    this.isAssignmentsModalOpen = false;
    this.selectedProject = null;
    this.projectAssignments = [];
    this.assignmentForm.reset();
  }

  loadProjectAssignments(): void {
    if (this.selectedProject?._id) {
      this.assignmentService
        .getProjectAssignments(this.selectedProject._id)
        .subscribe({
          next: (assignments) => {
            this.projectAssignments = assignments || [];
            console.log('Loaded assignments:', this.projectAssignments);
          },
          error: (err) => console.error('Failed to load assignments:', err),
        });
    }
  }

  loadAvailableUsers(): void {
    if (this.selectedProject?._id) {
      this.projectService
        .getEmployeListForProject({
          page: 1,
          pageSize: 100,
          projectId: this.selectedProject._id,
        })
        .subscribe({
          next: (response) => {
            this.availableUsers = response.users || [];
          },
          error: (err) => console.error('Failed to load users:', err),
        });
    }
  }

  createAssignment(): void {
    if (this.assignmentForm.valid && this.selectedProject) {
      const formValue = this.assignmentForm.value;

      const assignmentData = {
        startDate: formValue.startDate,
        endDate: formValue.endDate,
        userId: formValue.userId,
        projectId: `${this.selectedProject._id}`, // Ensure project ID is a string
      };
      console.log('this.selectedProject._id:', this.selectedProject._id);

      this.assignmentService.createAssignment(assignmentData).subscribe({
        next: () => {
          this.loadProjectAssignments();
          this.assignmentForm.reset();
        },
        error: (err) => console.error('Failed to create assignment:', err),
      });
    }
  }

  deleteAssignment(assignmentId: string): void {
    if (confirm('Are you sure you want to delete this assignment?')) {
      this.assignmentService.deleteAssignment(assignmentId).subscribe({
        next: () => {
          this.loadProjectAssignments();
        },
        error: (err) => console.error('Failed to delete assignment:', err),
      });
    }
  }

  isAssignmentActive(assignment: AssignmentInput): boolean {
    const now = new Date();
    const startDate = new Date(assignment.startDate);
    const endDate = new Date(assignment.endDate);
    return now >= startDate && now <= endDate;
  }
}
