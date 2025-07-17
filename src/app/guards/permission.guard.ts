import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Get required permissions from route data
    const requiredRoles: string[] = route.data['roles'] || [];
    
    // If no roles required, allow access (public route)
    if (requiredRoles.length === 0) {
      return true;
    }

    // Otherwise, require authentication
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check if user has any of the required roles
    const hasRole = this.authService.hasAnyRole(requiredRoles);
    
    if (!hasRole) {
      // Redirect to unauthorized page or dashboard
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
} 