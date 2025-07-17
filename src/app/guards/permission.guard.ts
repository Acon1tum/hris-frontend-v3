import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Permission } from '../interfaces/auth.interface';

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
    const requiredPermissions: Permission[] = route.data['permissions'] || [];
    
    // If no permissions required, allow access (public route)
    if (requiredPermissions.length === 0) {
      return true;
    }

    // Otherwise, require authentication
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check if user has any of the required permissions
    const hasPermission = this.authService.hasAnyPermission(requiredPermissions);
    
    if (!hasPermission) {
      // Redirect to unauthorized page or dashboard
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
} 