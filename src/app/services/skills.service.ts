import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Optional: Define interfaces for better type safety
export interface Skill {
  _id?: string; // Optional because it's not present when creating
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SkillsApiResponse {
  countSkills: number;
  skills: Skill[];
  page: number;
  pages: number;
}

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  private apiUrl = 'http://localhost:5000/api/skills'; // Base URL for your skills API

  constructor(private http: HttpClient) {}

  // Helper to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * Get a list of skills with optional filtering and pagination.
   * Corresponds to your backend's getAllSkills.
   */
  getAllSkills(filter: {
    name?: string;
    page?: number;
    pageSize?: number; // Added based on your backend controller
  }): Observable<SkillsApiResponse> {
    // Changed <any> to <SkillsApiResponse>
    const headers = this.getAuthHeaders();
    let params = new HttpParams();

    if (filter.name && filter.name !== 'all') {
      // 'all' check from your backend
      params = params.set('name', filter.name);
    }
    if (filter.page) {
      params = params.set('page', filter.page.toString());
    }
    if (filter.pageSize) {
      params = params.set('pageSize', filter.pageSize.toString());
    }

    return this.http.get<SkillsApiResponse>(this.apiUrl, { params, headers });
  }

  /**
   * Create a new skill.
   * Corresponds to your backend's createSkill.
   */
  createSkill(skillData: { name: string }): Observable<any> {
    // Backend expects { name }
    const headers = this.getAuthHeaders();
    return this.http.post(this.apiUrl, skillData, { headers });
    // The backend returns { message: "La compétence a été créé avec succès" }
  }

  /**
   * Update an existing skill by its ID.
   * Corresponds to your backend's updateSkill.
   */
  updateSkill(id: string, skillData: { name: string }): Observable<any> {
    // Backend expects { name }
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/${id}`, skillData, { headers });
    // The backend returns { message: "La compétence a été mise à jour avec succès" }
  }

  /**
   * Delete a skill by its ID.
   * Corresponds to your backend's deleteSkill.
   */
  deleteSkill(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
    // The backend returns { message: "La compétence a été supprimé avec succès" }
  }

  // Note: Your backend controller doesn't have a getSkillById endpoint.
  // If you add one, you can implement a method here similar to:
  /*
  getSkillById(id: string): Observable<Skill> {
    const headers = this.getAuthHeaders();
    return this.http.get<Skill>(`${this.apiUrl}/${id}`, { headers });
  }
  */
}
