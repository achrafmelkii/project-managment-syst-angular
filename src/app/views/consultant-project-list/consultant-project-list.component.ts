import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  SpinnerComponent,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  ColComponent,
  ButtonDirective,
  TableDirective,
  ButtonModule,
} from '@coreui/angular';
import { Skill } from '../../services/skills.service';

interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  requiredSkills: Skill[];
  users: any[];
  manager: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string;
    email: string;
  };
  createdAt: string;
}

@Component({
  selector: 'app-consultant-project-list',
  imports: [
    CommonModule,
    FormsModule,
    SpinnerComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ColComponent,
    ButtonDirective,
    TableDirective,
    ButtonModule,
  ],
  templateUrl: './consultant-project-list.component.html',
  styleUrl: './consultant-project-list.component.scss',
  standalone: true,
})
export class ConsultantProjectListComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  selectedProject: Project | null = null;
  isViewModalOpen = false;
  currentPage: number = 1;
  pages: number = 0;
  loading = false;
  private subscription?: Subscription;

  constructor(private projectService: ProjectsService) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects(): void {
    this.loading = true;
    this.subscription = this.projectService
      .getEmployeProjectsList(this.currentPage)
      .subscribe({
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
    this.selectedProject = { ...project };
    this.isViewModalOpen = true;
  }

  closeViewModal() {
    this.selectedProject = null;
    this.isViewModalOpen = false;
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
