// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skill } from './skills.service';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  image: 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png';
  assignments: [];
  isActive: true;
  skills: Skill[];
  availability: [];
}

export interface UserListResponse {
  countUsers: number;
  users: User[];
  page: number;
  pages: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api'; // optionally set via environment

  constructor(private http: HttpClient) {}

  getUsersList(params: any): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/users`, {
      params,
      headers,
    });
  }

  getManagerList(filter: { page?: number }): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/users/manager`, {
      // params,
      headers,
    });
  }
  // getManagerList(filter: { page?: number }): Observable<any> {
  //   const token = localStorage.getItem('token') || '';
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  //   return this.http.get(`${this.apiUrl}/users/manager`, {
  //     params,
  //     headers,
  //   });
  // }

  getEmployeList(filter: { page?: number }): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/users/employe`, {
      // params,
      headers,
    });
  }

  createUser(user: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    console.log('creating user');
    return this.http.post(`${this.apiUrl}/users`, user, {
      headers,
    });
  }

  getUserById(id: string): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/users/${id}`, {
      // params,
      headers,
    });
  }

  deleteUser(id: string): Observable<any> {
    const token = localStorage.getItem('token'); // or sessionStorage depending on your app

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    console.log('Deleting user');

    return this.http.delete(`${this.apiUrl}/users/${id}`, {
      headers,
    });
  }

  updateProfile(user: any): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(`${this.apiUrl}/users/profile/${user._id}`, user, {
      // params,
      headers,
    });
  }

  updateUser(id: string, data: any): Observable<any> {
    const token = localStorage.getItem('token'); // or sessionStorage depending on your app

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put(`${this.apiUrl}/users/profile/${id}`, data, {
      headers,
    });
  }

  updateUserImage(user: { _id: string; image: File }): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const formData = new FormData();
    formData.append('image', user.image);

    return this.http.put(`${this.apiUrl}/uploads/image/${user._id}`, formData, {
      // params,
      headers,
    });
  }
}
