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
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss',
})
export class TasksListComponent implements OnInit {
  tasks: Task[] = [];
  isLoading = false;
  page = 1;
  totalPages = 0;
  searchTerm = '';
  private searchSubject = new Subject<string>();
  selectedTask: Task | null = null;
  isModalOpen = false;
  currentStatus: string = '';

  readonly headData = ['Titre', 'Project', 'Status', 'Créé à', 'Actions'];

  constructor(private taskService: TasksService) {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.loadTasks();
      });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  loadTasks(): void {
    this.isLoading = true;
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
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadTasks();
  }

  openTaskModal(task: Task): void {
    this.selectedTask = task;
    this.currentStatus = task.status ?? 'Ouvert';
    this.isModalOpen = true;
  }

  closeTaskModal(): void {
    this.isModalOpen = false;
    this.selectedTask = null;
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
