// auth.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5000/api';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    withCredentials: true,
  };

  constructor(private http: HttpClient) {}

  // login(credentials: LoginCredentials): Observable<LoginResponse> {
  //   return this.http.post<LoginResponse>(
  //     `${this.apiUrl}/auth/login`,
  //     credentials,
  //     this.httpOptions
  //   );
  // }
  // login(email: string, password: string): Observable<any> {
  //   const body = { email, password };

  //   return this.http.post('http://localhost:5000/api/auth/login', body, {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  //     withCredentials: true, // important if backend uses cookies
  //   });
  // }

  login(email: string, password: string): Observable<any> {
    const body = { email, password };

    console.log('Sending login request with:', body);

    return this.http.post('http://localhost:5000/api/auth/login', body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true,
      observe: 'response', // <- to inspect full HTTP response
    });
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
