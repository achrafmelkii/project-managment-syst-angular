import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { getStyle } from '@coreui/utils';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { Router, RouterLink } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { UserService } from '../../../services/user.service';
import { ProjectsService } from '../../../services/projects.service';
import {
  RowComponent,
  ColComponent,
  WidgetStatAComponent,
  TemplateIdDirective,
  ThemeDirective,
  DropdownComponent,
  ButtonDirective,
  DropdownToggleDirective,
  DropdownMenuDirective,
  DropdownItemDirective,
  DropdownDividerDirective,
} from '@coreui/angular';
import { AuthService } from '../../../services/auth.service';
import { routes } from '../routes';
import { CommonModule } from '@angular/common'; // Add this import
import { TasksService } from '../../../services/tasks.service';

@Component({
  selector: 'app-widgets-dropdown',
  templateUrl: './widgets-dropdown.component.html',
  styleUrls: ['./widgets-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    CommonModule,
    RowComponent,
    ColComponent,
    WidgetStatAComponent,
    TemplateIdDirective,
    IconDirective,
    ThemeDirective,
    DropdownComponent,
    ButtonDirective,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    RouterLink,
    DropdownDividerDirective,
    ChartjsComponent,
  ],
})
export class WidgetsDropdownComponent implements OnInit {
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private userService: UserService,
    private projectService: ProjectsService,
    private authService: AuthService,
    private tasksService: TasksService,
    private router: Router
  ) {}

  totalUsers: number = 0;
  totalProjects: number = 0;
  totalManagers: number = 0;
  totalEmployees: number = 0;

  totalTasksObservable: number = 0;
  completedTasks: number = 0;

  data: any[] = [];
  options: any[] = [];
  labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    'January',
    'February',
    'March',
    'April',
  ];

  isEmployee: boolean = false;

  userRole: string | null = null; // Store the user role

  ngOnInit(): void {
    const hasToken = this.authService.hasToken();
    console.log('Has token:', hasToken);
    if (hasToken) {
      console.log('User is authenticated');
    } else {
      console.log('User is not authenticated');
      this.router.navigate(['/login']);
    }
    this.loadUserRole();
    this.fetchUsersCount();
    this.fetchManagersCount();
    this.fetchEmployeesCount();
    this.fetchProjectsCount();
    this.loadTasksCount();
  }

  loadTasksCount() {
    if (this.isEmployee) {
      this.tasksService.getAssignedTasks().subscribe({
        next: (response) => {
          this.totalTasksObservable = response.tasks.length || 0;
          this.completedTasks = response.tasks.filter(
            (task) => task.status === 'Complété'
          ).length;
          console.log('Completed tasks for employee:', this.completedTasks);
          console.log('Total tasks for employee:', this.totalTasksObservable);
        },
        error: (error) => {
          console.error('Failed to fetch tasks for employee:', error);
        },
      });
    } else {
      this.tasksService.getMyTasks().subscribe({
        next: (response) => {
          this.totalTasksObservable = response.tasks.length || 0;
          this.completedTasks = response.tasks.filter(
            (task) => task.status === 'Complété'
          ).length;
          console.log('Completed tasks for manager:', this.completedTasks);
          console.log('Total tasks for manager:', this.totalTasksObservable);
        },
        error: (error) => {
          console.error('Failed to fetch tasks for manager:', error);
        },
      });
    }
  }

  loadUserRole() {
    this.userRole = this.authService.getUserRole();
    this.isEmployee = this.userRole === 'employee';
    console.log('Is Employee:', this.isEmployee, 'Role:', this.userRole);
  }

  fetchProjectsCount() {
    if (this.isEmployee) {
      this.projectService.getEmployeProjectsList().subscribe({
        next: (response) => {
          this.totalProjects = response.projectsUsers || 0;
          console.log('Total employee projects:', this.totalProjects);
        },
        error: (error) => {
          console.error('Failed to fetch employee projects:', error);
        },
      });
    } else {
      this.projectService.getProjectsList({}).subscribe({
        next: (response) => {
          this.totalProjects = response.projectsUsers || 0;
          console.log('Total projects (non employee):', this.totalProjects);
        },
        error: (error) => {
          console.error('Failed to fetch projects:', error);
        },
      });
    }
  }

  fetchUsersCount() {
    this.userService.getUsersList({}).subscribe({
      next: (response) => {
        this.totalUsers = response.countUsers || 0;
        console.log('Total Users:', this.totalUsers);
      },
      error: (error) => {
        console.error('Failed to fetch users:', error);
      },
    });
  }

  fetchManagersCount() {
    this.userService.getManagerList({}).subscribe({
      next: (response) => {
        this.totalManagers = response.countUsers || 0;
        console.log('Total maangers:', this.totalManagers);
      },
      error: (error) => {
        console.error('Failed to fetch users:', error);
      },
    });
  }
  fetchEmployeesCount() {
    this.userService.getEmployeList({}).subscribe({
      next: (response) => {
        this.totalEmployees = response.countUsers || 0;
        console.log('Total employees:', this.totalEmployees);
      },
      error: (error) => {
        console.error('Failed to fetch users:', error);
      },
    });
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }
}
