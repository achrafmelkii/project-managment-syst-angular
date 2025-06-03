// src/app/services/assignment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectInput } from '../views/calendar/calendar-models';

// Interface for the raw API response if it's paginated or nested
// If your API directly returns AssignmentInput[], you don't need this.
export interface AssignmentApiResponse {
  assignments: AssignmentInput[]; // Or however your API structures it
  count?: number;
  page?: number;
  pages?: number;
}

// export interface AssignmentInput {
//   _id: string;
//   user: { _id: string; image: string; firstName: string; lastName: string }; // Example: might need user name
//   project: ProjectInput; // Example: might need project name
//   startDate: string | Date;
//   endDate: string | Date;
//   createdAt: string | Date;
//   updatedAt: string | Date;
// }

export interface AssignmentInput {
  _id: string;
  employee: string; // This is the formatted "firstName lastName" string
  email: string;
  projectName: string;
  startDate: string;
  endDate: string;
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  private apiUrl = 'http://localhost:5000/api/assignments'; // Adjust if your endpoint is different

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAssignments(params?: any): Observable<AssignmentInput[]> {
    const headers = this.getAuthHeaders();
    // If your API directly returns AssignmentInput[]
    return this.http.get<AssignmentInput[]>(this.apiUrl, { headers, params });

    // If your API returns a structured response like AssignmentApiResponse:
    // return this.http.get<AssignmentApiResponse>(this.apiUrl, { headers, params })
    //   .pipe(map(response => response.assignments)); // Extract the array
  }

  getUserAssignments(filter: {
    userId: string;
    projectId: string;
  }): Observable<AssignmentInput[]> {
    const params = new HttpParams()
      .set('userId', filter.userId)
      .set('projectId', filter.projectId);
    return this.http.get<AssignmentInput[]>(`${this.apiUrl}`, { params });
  }

  // Optional: Add other CRUD methods if needed for managing assignments elsewhere
  getAssignmentById(id: string): Observable<AssignmentInput> {
    const headers = this.getAuthHeaders();
    return this.http.get<AssignmentInput>(`${this.apiUrl}/${id}`, { headers });
  }

  getProjectAssignments(projectId: string): Observable<AssignmentInput[]> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<AssignmentApiResponse>(`${this.apiUrl}/project/${projectId}`, {
        headers,
      })
      .pipe(map((response) => response.assignments || []));
  }

  createAssignment(assignmentData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}`, assignmentData, {
      headers,
    });
  }

  updateAssignment(
    id: string,
    assignmentData: Partial<AssignmentInput>
  ): Observable<AssignmentInput> {
    const headers = this.getAuthHeaders();
    return this.http.put<AssignmentInput>(
      `${this.apiUrl}/${id}`,
      assignmentData,
      { headers }
    );
  }

  deleteAssignment(id: string): Observable<{ message: string }> {
    const headers = this.getAuthHeaders();
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers,
    });
  }
}
