import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/services/projects.service';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common'; // 👈 Needed for *ngIf, *ngFor, date pipe, ngClass
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Project {
  // Define an interface for your project data
  _id: string;
  name: string;
  manager: {
    firstName: string;
    lastName: string;
    image: string;
  };
  startDate: string;
  endDate: string;
  createdAt: string;
  // Add other properties as needed
}
@Component({
  selector: 'app-manager-project-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './manager-project-list.component.html',
  styleUrl: './manager-project-list.component.scss',
})
export class ManagerProjectListComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  pages: number = 0;
  currentPage: number = 1;
  search: string = '';
  loading: boolean = false;
  private subscription?: Subscription;

  constructor(private projectService: ProjectsService) {}

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

  handleSearch(event: Event): void {
    this.search = (event.target as HTMLInputElement).value;
    this.currentPage = 1; // Reset to the first page when searching
    this.fetchProjects();
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
