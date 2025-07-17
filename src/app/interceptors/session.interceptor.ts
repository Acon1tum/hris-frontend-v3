import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { InactivityService } from '../services/inactivity.service';

@Injectable()
export class SessionInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private inactivityService: InactivityService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Don't add auth header here - let AuthInterceptor handle it
    // Just handle session management

    // Reset inactivity timer on API calls (user activity)
    if (this.authService.isAuthenticated()) {
      this.inactivityService.resetTimer();
    }

    return next.handle(req).pipe(
      tap({
        error: (error) => {
          if (error.status === 401 && this.authService.isAuthenticated()) {
            // Token expired or invalid, logout user
            this.authService.logout('session_expired');
          }
        }
      })
    );
  }
} 