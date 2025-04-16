// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api'; // optionally set via environment

  constructor(private http: HttpClient) {}

  getUsersList(params: any): Observable<any[]> {
    // getUsersList(filter: { name?: string; page?: number }): Observable<any> {
    // let params = new HttpParams();
    // // if (filter.name) params = params.set('name', filter.name);
    // // if (filter.page !== undefined)
    // //   params = params.set('page', filter.page.toString());

    // return this.http.get(`${this.apiUrl}/users`, { params });
    return this.http.get<any[]>('/users', { params });
  }

  getManagerList(filter: { page?: number }): Observable<any> {
    let params = new HttpParams();
    if (filter.page !== undefined)
      params = params.set('page', filter.page.toString());

    return this.http.get(`${this.apiUrl}/users/manager`, { params });
  }

  getEmployeList(filter: { page?: number }): Observable<any> {
    let params = new HttpParams();
    if (filter.page !== undefined)
      params = params.set('page', filter.page.toString());

    return this.http.get(`${this.apiUrl}/users/employe`, { params });
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  updateProfile(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/profile/${user._id}`, user);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${user._id}`, user);
  }

  updateUserImage(user: { _id: string; image: File }): Observable<any> {
    const formData = new FormData();
    formData.append('image', user.image);

    return this.http.put(`${this.apiUrl}/uploads/image/${user._id}`, formData);
  }
}
