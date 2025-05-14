// auth.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserRole } from '../layout';

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
    withCredentials: false, // Changed to false if you don't need credentials
  };

  private authStatus = new BehaviorSubject<boolean>(this.hasToken());
  authStatus$ = this.authStatus.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    const body = { email, password };
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/login`,
      body,
      this.httpOptions
    );
  }

  // old
  // getUserRole(): UserRole {
  //   // Add console.log to debug
  //   const role = localStorage.getItem('userRole') as UserRole;
  //   console.log('Current user role:', role);
  //   return role || 'EMPLOYEE'; // Default to EMPLOYEE if no role found
  // }
  getUserRole(): string {
    const role = localStorage.getItem('userRole');
    console.log('Getting user role:', role); // Debug log
    return role?.toLowerCase() || ''; // Convert to lowercase to match route data
  }

  // Make sure to set the role when user logs in
  setUserRole(role: UserRole): void {
    localStorage.setItem('userRole', role);
  }

  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.authStatus.next(true);
  }

  setUserID(userId: string): void {
    localStorage.setItem('userId', userId);
  }

  getUserId(): string {
    return localStorage.getItem('userId') || '';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    console.log('Token and auth status removed from localStorage');

    this.authStatus.next(false); // Notify other parts of the app
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
