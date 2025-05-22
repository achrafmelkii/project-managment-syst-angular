// src/app/services/assignment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssignmentInput } from '../views/calendar/calendar-models'; // Adjust path as needed

// Interface for the raw API response if it's paginated or nested
// If your API directly returns AssignmentInput[], you don't need this.
export interface AssignmentApiResponse {
  assignments: AssignmentInput[]; // Or however your API structures it
  count?: number;
  page?: number;
  pages?: number;
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

  /**
   * Fetches assignments.
   * IMPORTANT: Ensure your backend '/api/assignments' endpoint populates
   * the 'user' and 'project' fields in the assignment documents.
   * e.g., Assignment.find().populate('user', 'firstName lastName _id').populate('project', 'name _id')
   */
  getAssignments(params?: any): Observable<AssignmentInput[]> {
    const headers = this.getAuthHeaders();
    // If your API directly returns AssignmentInput[]
    return this.http.get<AssignmentInput[]>(this.apiUrl, { headers, params });

    // If your API returns a structured response like AssignmentApiResponse:
    // return this.http.get<AssignmentApiResponse>(this.apiUrl, { headers, params })
    //   .pipe(map(response => response.assignments)); // Extract the array
  }

  // Optional: Add other CRUD methods if needed for managing assignments elsewhere
  getAssignmentById(id: string): Observable<AssignmentInput> {
    const headers = this.getAuthHeaders();
    return this.http.get<AssignmentInput>(`${this.apiUrl}/${id}`, { headers });
  }

  createAssignment(
    assignmentData: Partial<AssignmentInput>
  ): Observable<AssignmentInput> {
    const headers = this.getAuthHeaders();
    return this.http.post<AssignmentInput>(this.apiUrl, assignmentData, {
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

  deleteAssignment(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}
