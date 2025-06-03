import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'Ouvert' | 'En cours' | 'Complété';
  project: {
    _id: string;
    name: string;
  };
  assignedTo: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string;
  };
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateTaskRequest {
  title: string;
  description: string;
  project: string;
  assignedTo: string;
  status: 'Ouvert' | 'En cours' | 'Complété';
}
export interface TaskResponse {
  tasksCount: number;
  tasks: Task[];
  page: number;
  pages: number;
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private apiUrl = 'http://localhost:5000/api/tasks';

  // private apiUrl = `${environment.apiUrl}/api/tasks`;

  constructor(private http: HttpClient) {}

  // Helper to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Get tasks created by current user
  getMyTasks(
    page: number = 1,
    pageSize: number = 10,
    name: string = ''
  ): Observable<TaskResponse> {
    const headers = this.getAuthHeaders();

    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (name) {
      params = params.set('name', name);
    }

    return this.http.get<TaskResponse>(this.apiUrl, { params, headers });
  }

  // Get tasks assigned to current user
  getAssignedTasks(
    page: number = 1,
    pageSize: number = 10,
    name: string = ''
  ): Observable<TaskResponse> {
    const headers = this.getAuthHeaders();

    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (name) {
      params = params.set('name', name);
    }

    return this.http.get<TaskResponse>(`${this.apiUrl}/employe`, {
      params,
      headers,
    });
  }

  createTask(
    task: CreateTaskRequest
  ): Observable<{ message: string; task: Task }> {
    const headers = this.getAuthHeaders();

    // Validate data before sending
    if (!task.title || !task.description || !task.project || !task.assignedTo) {
      return throwError(() => new Error('Missing required fields'));
    }

    const requestBody = {
      title: task.title.trim(),
      description: task.description.trim(),
      project: task.project,
      assignedTo: task.assignedTo,
      status: task.status || 'Ouvert',
    };

    console.log('Sending request with body:', requestBody);

    return this.http
      .post<{ message: string; task: Task }>(this.apiUrl, requestBody, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Task creation error:', error);
          if (error.error?.message) {
            return throwError(() => new Error(error.error.message));
          }
          return throwError(() => new Error('Failed to create task'));
        })
      );
  }

  // Create new task
  // createTask(task: {
  //   title: string;
  //   description: string;
  //   project: string;
  //   assignedTo: string;
  //   status: string;
  // }): Observable<any> {
  //   const headers = this.getAuthHeaders();
  //   console.log('Creating task with data:', task); // Debug log

  //   return this.http
  //     .post<{ message: string }>(
  //       this.apiUrl,
  //       {
  //         ...task,
  //         status: task.status || 'Ouvert', // Ensure status is set
  //       },
  //       { headers }
  //     )
  //     .pipe(
  //       catchError((error) => {
  //         console.error('Task creation error details:', error);
  //         return throwError(() => error);
  //       })
  //     );
  // }

  // Update task
  updateTask(
    taskId: string,
    task: {
      title?: string;
      description?: string;
      project?: string;
      assignedTo?: string;
    }
  ): Observable<{ message: string }> {
    const headers = this.getAuthHeaders();

    return this.http.put<{ message: string }>(
      `${this.apiUrl}/${taskId}`,
      task,
      { headers }
    );
  }

  // Update task status
  updateTaskStatus(
    taskId: string,
    status: 'Ouvert' | 'En cours' | 'Complété'
  ): Observable<{ message: string }> {
    const headers = this.getAuthHeaders();
    console.log('updateTaskStatus', taskId, status);

    return this.http.put<{ message: string }>(
      `${this.apiUrl}/employe/${taskId}`,
      { status },
      { headers }
    );
  }

  // Delete task
  deleteTask(taskId: string): Observable<{ message: string }> {
    const headers = this.getAuthHeaders();

    return this.http.delete<{ message: string }>(`${this.apiUrl}/${taskId}`, {
      headers,
    });
  }
}
