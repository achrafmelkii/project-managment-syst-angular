import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  deleteProject(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}
