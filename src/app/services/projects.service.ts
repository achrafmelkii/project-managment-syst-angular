import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectInput } from '../views/calendar/calendar-models';

export interface UsersApiResponse {
  users: any[];
  countUsers: number;
  page: number;
  pages: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private apiUrl = 'http://localhost:5000/api/projects';

  constructor(private http: HttpClient) {}

  // Helper method to set Authorization headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUsersForProject(projectId: string): Observable<any[]> {
  const headers = this.getAuthHeaders();
  // Call the new backend endpoint
  return this.http.get<any[]>(`${this.apiUrl}/${projectId}/users`, { headers });
}

  getManagerProjectsList(filter: {
    name: string;
    page: number;
  }): Observable<ProjectInput> {
    let params = new HttpParams();
    if (filter.name) {
      params = params.set('name', filter.name);
    }
    params = params.set('page', filter.page.toString());
    const headers = this.getAuthHeaders();

    return this.http.get<ProjectInput>(`${this.apiUrl}/manager/projects`, {
      headers,
      params,
    }); // Example endpoint
  }

  // Used in AddUserToProjectModal
  getEmployeListForProject(filter: {
    page: number;
    pageSize: number;
    projectId: string;
  }): Observable<UsersApiResponse> {
    let params = new HttpParams()
      .set('page', filter.page.toString())
      .set('pageSize', filter.pageSize.toString());

    const headers = this.getAuthHeaders();

    return this.http.get<UsersApiResponse>(
      `${this.apiUrl}/employe/${filter.projectId}`,
      { headers, params }
    );
  }

  // Used in AddUserToProjectModal & AssignmentModal
  addUsersToProject(payload: {
    _id: string;
    users?: string[];
    user?: string;
  }): Observable<any> {
   
        const headers = this.getAuthHeaders(); 

    const body = {
      users: payload.users || (payload.user ? [payload.user] : []),
    };
    return this.http.post(
      `${this.apiUrl}/${payload._id}`,
      body,
       { headers }
    );
  }


  deleteUserFromProject(payload: {
    _id: string;
    userId: string;
  }): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http.delete(
      `${this.apiUrl}/${payload._id}/users/${payload.userId}`,
      { headers } 
    );
  }
  getEmployeProjectsList(
    page: number = 1,
    pageSize: number = 10 // Make sure pageSize is also passed if you want to control it
  ): Observable<any> {
    const headers = this.getAuthHeaders();
    let params = new HttpParams();

    // Add page and pageSize to the query parameters
    params = params.set('page', page.toString());
    params = params.set('pageSize', pageSize.toString());

    return this.http.get(`${this.apiUrl}/employe`, { headers, params }); // Pass params here
  }

  // Get List of Projects with Optional Filtering
  getProjectsList(filter: { name?: string; page?: number }): Observable<any> {
    const headers = this.getAuthHeaders();
    let params = new HttpParams();

    if (filter.name) {
      params = params.set('name', filter.name);
    }
    if (filter.page) {
      params = params.set('page', filter.page.toString());
    }

    // Add populate parameter if your backend supports it
    params = params.set('populate', 'users,manager,requiredSkills,tasks');

    return this.http.get(`${this.apiUrl}`, { params, headers });
  }

  // Get Project by ID
  getProjectById(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/${id}`, { headers });
  }

  // Create a New Project
  createProject(project: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}`, project, { headers });
  }

  // Update an Existing Project
  updateProject(id: string, project: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/${id}`, project, { headers });
  }

  // Delete a Project
  deleteProject(id: string): Observable<{ message: string }> {
    const headers = this.getAuthHeaders();
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers,
    });
  }
}
