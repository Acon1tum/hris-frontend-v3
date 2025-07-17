import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { 
  User, 
  LoginRequest, 
  LoginResponse, 
  ApiResponse, 
  MenuItem 
} from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is logged in from localStorage
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(environment.auth.tokenKey);
    const userData = localStorage.getItem(environment.auth.userKey);
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.logout();
      }
    }
  }

  private enhanceUserData(user: User): User {
    const enhancedUser = { ...user };

    // Set display name from personnel data
    if (user.personnel && user.personnel.length > 0) {
      const personnel = user.personnel[0];
      enhancedUser.name = `${personnel.first_name} ${personnel.last_name}`;
    } else {
      enhancedUser.name = user.username;
    }

    // Fix: Map single role to roles array if needed
    if (!user.roles && user.role) {
      enhancedUser.roles = [user.role];
    }

    // Set primary role for display
    if (enhancedUser.roles && enhancedUser.roles.length > 0) {
      enhancedUser.role = enhancedUser.roles[0];
    } else {
      enhancedUser.role = 'User';
    }

    enhancedUser.avatar = user.avatar || this.generateAvatarUrl(enhancedUser.name || user.username);

    return enhancedUser;
  }

  private generateAvatarUrl(name: string): string {
    // Generate a default avatar URL using a service like UI Avatars or similar
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=40`;
  }

  login(username: string, password: string): Observable<User> {
    const loginData: LoginRequest = { username, password };
    
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, loginData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            const { user, token, refreshToken } = response.data;
            
            // Enhance user data with display properties
            const enhancedUser = this.enhanceUserData(user);
            
            // Store tokens and user data
            localStorage.setItem(environment.auth.tokenKey, token);
            if (refreshToken) {
              localStorage.setItem(environment.auth.refreshTokenKey, refreshToken);
            }
            localStorage.setItem(environment.auth.userKey, JSON.stringify(enhancedUser));
            
            // Update current user
            this.currentUserSubject.next(enhancedUser);
            
            return enhancedUser;
          } else {
            throw new Error(response.message || 'Login failed');
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(reason?: string): void {
    localStorage.removeItem(environment.auth.tokenKey);
    localStorage.removeItem(environment.auth.userKey);
    localStorage.removeItem(environment.auth.refreshTokenKey);
    
    // Store logout reason for display on login page
    if (reason) {
      localStorage.setItem('logout_reason', reason);
    }
    
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(environment.auth.tokenKey);
    const user = this.currentUserSubject.value;
    return !!(token && user);
  }

  getToken(): string | null {
    return localStorage.getItem(environment.auth.tokenKey);
  }

  getAndClearLogoutReason(): string | null {
    const reason = localStorage.getItem('logout_reason');
    if (reason) {
      localStorage.removeItem('logout_reason');
    }
    return reason;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return !!(user && user.role && roles.includes(user.role));
  }

  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem(environment.auth.refreshTokenKey);
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<ApiResponse<{ token: string }>>(`${environment.apiUrl}/auth/refresh-token`, {
      refreshToken
    }).pipe(
      map(response => {
        if (response.success && response.data) {
          const { token } = response.data;
          localStorage.setItem(environment.auth.tokenKey, token);
          return token;
        } else {
          throw new Error(response.message || 'Token refresh failed');
        }
      }),
      catchError(this.handleError)
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/auth/change-password`, {
      currentPassword,
      newPassword
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Demo login functionality for testing
  demoLogin(role: string): Observable<User> {
    let username: string;
    let password: string;

    switch (role.toLowerCase()) {
      case 'admin':
        username = 'admin';
        password = 'Admin123!';
        break;
      case 'hr':
        username = 'hr_manager';
        password = 'HR123!';
        break;
      case 'employee':
        username = 'employee';
        password = 'Employee123!';
        break;
      default:
        username = 'admin';
        password = 'Admin123!';
    }

    return this.login(username, password);
  }

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server';
      } else if (error.status === 401) {
        errorMessage = 'Invalid credentials';
        this.logout(); // Auto logout on 401
      } else if (error.status >= 500) {
        errorMessage = 'Server error occurred';
      } else {
        errorMessage = `Error: ${error.status} - ${error.statusText}`;
      }
    }
    
    console.error('Auth Service Error:', error);
    return throwError(() => new Error(errorMessage));
  };
} 