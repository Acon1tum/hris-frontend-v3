import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS, HttpInterceptorFn } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { inject } from '@angular/core';

import { routes } from './app.routes';
import { AuthService } from './services/auth.service';
import { InactivityService } from './services/inactivity.service';
import { environment } from '../environments/environment';

// Create functional interceptors for Angular 18+
const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  console.log('🔍 Auth Interceptor called for:', req.url);
  
  // Only add auth header for API requests
  if (req.url.startsWith(environment.apiUrl)) {
    const token = authService.getToken();
    
    if (token) {
      console.log('🔐 Adding auth token to request:', req.url);
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next(authReq);
    } else {
      console.warn('❌ No token found for request:', req.url);
    }
  }
  
  return next(req);
};

const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const inactivityService = inject(InactivityService);
  
  // Reset inactivity timer on API calls (user activity)
  if (authService.isAuthenticated()) {
    inactivityService.resetTimer();
  }

  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptors([authInterceptor, sessionInterceptor]))
  ]
}; 