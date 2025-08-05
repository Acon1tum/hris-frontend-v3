import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface JobPosting {
  id: string;
  position_title: string;
  department_id: string;
  department?: {
    department_name: string;
  };
  job_description: string;
  qualifications: string;
  technical_competencies: string;
  salary_range: string;
  employment_type: string;
  num_vacancies: number;
  application_deadline: string;
  posting_status: string;
  created_at: string;
  updated_at: string;
}

export interface SalaryRange {
  range: string;
  count: number;
  value?: string; // For backward compatibility
  label?: string; // For backward compatibility
}

export interface JobFilters {
  keywords?: string;
  department?: string;
  salary_range?: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobPortalService {
  private currentApplicantSubject = new BehaviorSubject<any>(null);
  public currentApplicant$ = this.currentApplicantSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get all published job postings
  getJobs(filters?: JobFilters): Observable<JobPosting[]> {
    let url = `${environment.apiUrl}/job-portal/jobs`;
    
    if (filters) {
      const params = new URLSearchParams();
      if (filters.keywords) params.append('keywords', filters.keywords);
      if (filters.department) params.append('department', filters.department);
      if (filters.salary_range) params.append('salary_range', filters.salary_range);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    return this.http.get<{ success: boolean; data: JobPosting[] }>(url)
      .pipe(
        map(response => response.data || [])
      );
  }

  // Get a specific job posting
  getJob(id: string): Observable<JobPosting> {
    return this.http.get<{ success: boolean; data: JobPosting }>(`${environment.apiUrl}/job-portal/jobs/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  // Get salary ranges
  getSalaryRanges(): Observable<string[]> {
    return this.http.get<{ success: boolean; data: string[] }>(`${environment.apiUrl}/job-portal/salary-ranges`)
      .pipe(
        map(response => response.data || [])
      );
  }

  // Get departments
  getDepartments(): Observable<string[]> {
    return this.http.get<{ success: boolean; data: string[] }>(`${environment.apiUrl}/job-portal/departments`)
      .pipe(
        map(response => response.data || [])
      );
  }

  // Apply to a job
  applyToJob(jobId: string, applicationData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/job-portal/applications`, {
      position_id: jobId,
      ...applicationData
    });
  }

  // Get current applicant
  getCurrentApplicant(): any {
    return this.currentApplicantSubject.value;
  }

  // Set current applicant
  setCurrentApplicant(applicant: any): void {
    this.currentApplicantSubject.next(applicant);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('hris_token');
    return !!token;
  }

  // Get authentication token
  getToken(): string | null {
    return localStorage.getItem('hris_token');
  }

  // Logout
  logout(): void {
    localStorage.removeItem('hris_token');
    localStorage.removeItem('hris_user');
    this.currentApplicantSubject.next(null);
  }
} 