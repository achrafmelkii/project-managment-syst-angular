import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private apiUrl = '/projects'; //  Base URL for your projects API

  constructor(private http: HttpClient) {}

  getProjectsList(filter: { name?: string; page?: number }): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    let params = new HttpParams();
    if (filter.name) {
      params = params.set('name', filter.name);
    }
    if (filter.page) {
      params = params.set('page', filter.page.toString());
    }
    return this.http.get(this.apiUrl, { params, headers });
  }
  //added
  getProjectById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createProject(project: any): Observable<any> {
    return this.http.post(this.apiUrl, project);
  }

  updateProject(id: string, project: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, project);
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
