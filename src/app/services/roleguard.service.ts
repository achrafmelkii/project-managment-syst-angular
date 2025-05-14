import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    const userRole = this.authService.getUserRole();
    const requiredRole = route.data['role'];

    console.log('RoleGuard Check:', {
      userRole,
      requiredRole,
      path: state.url,
    });

    // If no role, redirect to login
    if (!userRole) {
      console.log('No user role found, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }

    // Check if role matches
    // const hasAccess = userRole === requiredRole;
    // if (!hasAccess) {
    //   console.log(`Access denied. Redirecting to /${userRole}/dashboard`);
    //   this.router.navigate([`/${userRole}/dashboard`]);
    //   return false;
    // }

    console.log('Access granted');
    return true;
  }
}
