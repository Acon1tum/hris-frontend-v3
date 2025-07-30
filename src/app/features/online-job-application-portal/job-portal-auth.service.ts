import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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

export interface JobPortalLoginRequest {
  email: string;
  password: string;
}

export interface JobPortalLoginResponse {
  success: boolean;
  token?: string;
  data?: JobApplicant;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobPortalAuthService {
  private currentApplicantSubject = new BehaviorSubject<JobApplicant | null>(null);
  public currentApplicant$ = this.currentApplicantSubject.asObservable();

  private readonly TOKEN_KEY = 'job_portal_token';
  private readonly APPLICANT_KEY = 'job_portal_applicant';

  constructor(private http: HttpClient) {
    this.loadApplicantFromStorage();
  }

  private loadApplicantFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const applicantData = localStorage.getItem(this.APPLICANT_KEY);
    
    if (token && applicantData) {
      try {
        const applicant = JSON.parse(applicantData);
        this.currentApplicantSubject.next(applicant);
      } catch (error) {
        console.error('Error parsing stored applicant data:', error);
        this.logout();
      }
    }
  }

  login(email: string, password: string): Observable<JobApplicant> {
    const loginData: JobPortalLoginRequest = { email, password };
    
    return this.http.post<JobPortalLoginResponse>(`${environment.apiUrl}/job-portal/login`, loginData)
      .pipe(
        map(response => {
          if (response.success && response.data && response.token) {
            // Store token and applicant data
            localStorage.setItem(this.TOKEN_KEY, response.token);
            localStorage.setItem(this.APPLICANT_KEY, JSON.stringify(response.data));
            
            // Update current applicant
            this.currentApplicantSubject.next(response.data);
            
            return response.data;
          } else {
            throw new Error(response.message || 'Login failed');
          }
        })
      );
  }

  logout(): void {
    // Clear stored data
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.APPLICANT_KEY);
    
    // Update current applicant
    this.currentApplicantSubject.next(null);
  }

  getCurrentApplicant(): JobApplicant | null {
    return this.currentApplicantSubject.value;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Register new applicant
  register(registrationData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/job-portal/register`, registrationData);
  }

  // Get applicant profile
  getProfile(applicantId: string): Observable<JobApplicant> {
    return this.http.get<{ success: boolean; data: JobApplicant }>(
      `${environment.apiUrl}/job-portal/profile?applicantId=${applicantId}`
    ).pipe(
      map(response => response.data)
    );
  }

  // Update applicant profile
  updateProfile(applicantId: string, updateData: any): Observable<JobApplicant> {
    return this.http.put<{ success: boolean; data: JobApplicant }>(
      `${environment.apiUrl}/job-portal/profile?applicantId=${applicantId}`,
      updateData
    ).pipe(
      map(response => response.data)
    );
  }
} 