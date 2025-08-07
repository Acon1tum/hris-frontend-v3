import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/auth.interface';

export interface JobApplicant {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  phone: string;
  current_employer?: string;
  highest_education?: string;
  resume_path?: string;
  is_existing_employee: boolean;
  application_date: string;
}

export interface JobPortalLoginResponse {
  success: boolean;
  token?: string;
  data?: {
    user: User;
    applicant: JobApplicant;
  };
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobPortalAuthService {
  private currentApplicantSubject = new BehaviorSubject<JobApplicant | null>(null);
  public currentApplicant$ = this.currentApplicantSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  login(email: string, password: string): Observable<JobApplicant> {
    // Generate a unique request ID for tracking
    const requestId = Math.random().toString(36).substring(2, 15);
    const startTime = Date.now();
    
    // Helper function for consistent logging
    const log = (message: string, data?: any) => {
      const timestamp = new Date().toISOString();
      const logData = data ? JSON.stringify(data, null, 2) : '';
      console.log(`[${timestamp}] [${requestId}] ${message}`, logData);
    };

    log('=== Job Portal Login Request ===');
    log('Email:', email);
    log('Environment API URL:', environment.apiUrl);
    
    // Input validation
    if (!email?.trim()) {
      const errorMsg = 'Email is required';
      log('Validation error:', errorMsg);
      return throwError(() => new Error(errorMsg));
    }
    
    if (!password) {
      const errorMsg = 'Password is required';
      log('Validation error:', errorMsg);
      return throwError(() => new Error(errorMsg));
    }

    log('Sending login request to server...');
    
    return this.http.post<JobPortalLoginResponse>(`${environment.apiUrl}/job-portal/login`, { 
      email: email.trim(),
      password: password 
    }).pipe(
      map(response => {
        log('Login response received:', {
          success: response?.success,
          hasToken: !!response?.token,
          hasUserData: !!response?.data?.user,
          hasApplicantData: !!response?.data?.applicant,
          responseTime: `${Date.now() - startTime}ms`
        });

        if (response && response.success && response.token && response.data) {
          // Store the authentication data using the main auth service
          const { user, applicant } = response.data;
          
          // Store token in localStorage
          localStorage.setItem(environment.auth.tokenKey, response.token);
          localStorage.setItem(environment.auth.userKey, JSON.stringify(user));
          
          // Update the main auth service
          this.authService.setCurrentUser(user);
          
          // Update the current applicant subject
          this.currentApplicantSubject.next(applicant);
          
          log('User authenticated successfully', {
            userId: user?.id,
            email: user?.email,
            role: user?.role,
            applicantId: applicant?.id
          });
          
          return applicant;
        } else {
          log('Login response missing required data', response);
          throw new Error(response?.message || 'Invalid response from server');
        }
      }),
      catchError(error => {
        log('Login error:', {
          status: error.status,
          message: error.message,
          error: error.error,
          responseTime: `${Date.now() - startTime}ms`
        });
        
        // Enhance error message based on status code
        let userFriendlyMessage = 'Login failed. Please try again.';
        
        if (error.status === 0) {
          userFriendlyMessage = 'Cannot connect to server. Please check your internet connection.';
        } else if (error.status === 400) {
          userFriendlyMessage = error.error?.message || 'Invalid request. Please check your input.';
        } else if (error.status === 401) {
          userFriendlyMessage = 'Invalid email or password. Please try again.';
        } else if (error.status === 403) {
          userFriendlyMessage = 'Access denied. This portal is for applicants only.';
        } else if (error.status === 404) {
          userFriendlyMessage = 'User not found. Please check your email or register for an account.';
        } else if (error.status === 500) {
          userFriendlyMessage = 'A server error occurred. Please try again later.';
          log('Server error details:', error.error);
        }
        
        return throwError(() => new Error(userFriendlyMessage));
      })
    );
  }

  logout(): void {
    // Use the main auth service to log out
    this.authService.logout();
    // Clear any applicant-specific data
    this.currentApplicantSubject.next(null);
  }

  isAuthenticated(): boolean {
    // Defer to the main auth service
    return this.authService.isAuthenticated();
  }

  getToken(): string | null {
    // Get token from the main auth service
    return this.authService.getToken();
  }

  getCurrentApplicant(): JobApplicant | null {
    return this.currentApplicantSubject.value;
  }

  getCurrentApplicantProfile(): Observable<JobApplicant> {
    return this.http.get<{ success: boolean; data: JobApplicant }>(
      `${environment.apiUrl}/job-portal/current-profile`
    ).pipe(
      map(response => response.data)
    );
  }

  register(registrationData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/job-portal/register`, registrationData);
  }

  getProfile(applicantId: string): Observable<JobApplicant> {
    return this.http.get<{ success: boolean; data: JobApplicant }>(
      `${environment.apiUrl}/job-portal/profile?applicantId=${applicantId}`
    ).pipe(
      map(response => response.data)
    );
  }

  updateProfile(applicantId: string, updateData: any): Observable<JobApplicant> {
    return this.http.put<{ success: boolean; data: JobApplicant }>(
      `${environment.apiUrl}/job-portal/profile?applicantId=${applicantId}`,
      updateData
    ).pipe(
      map(response => response.data)
    );
  }
}