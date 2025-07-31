import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface JobPosting {
  id?: string;
  position_title: string;
  department_id: string;
  job_description: string;
  qualifications: string;
  technical_competencies?: string;
  salary_range?: string;
  employment_type: string;
  num_vacancies: number;
  application_deadline: string;
  posting_status: string;
  created_by?: string;
  created_at?: string;
  department?: {
    id: string;
    department_name: string;
  };
  created_by_user?: {
    id: string;
    username: string;
    email: string;
  };
  _count?: {
    job_applications: number;
  };
}

export interface Department {
  id: string;
  department_name: string;
  description?: string;
}

export interface SalaryRange {
  id: string;
  range: string;
  min: number;
  max: number | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class JobPortalManagementService {
  private apiUrl = `${environment.apiUrl}/job-portal-management`;

  constructor(private http: HttpClient) {}

  // Get all job postings
  getAllJobPostings(page: number = 1, limit: number = 10, filters?: any): Observable<ApiResponse<JobPosting[]>> {
    let params = `?page=${page}&limit=${limit}`;
    
    if (filters) {
      if (filters.status) params += `&status=${filters.status}`;
      if (filters.department_id) params += `&department_id=${filters.department_id}`;
      if (filters.search) params += `&search=${filters.search}`;
    }
    
    return this.http.get<ApiResponse<JobPosting[]>>(`${this.apiUrl}/jobs${params}`);
  }

  // Get specific job posting
  getJobPosting(id: string): Observable<ApiResponse<JobPosting>> {
    return this.http.get<ApiResponse<JobPosting>>(`${this.apiUrl}/jobs/${id}`);
  }

  // Create new job posting
  createJobPosting(job: Partial<JobPosting>): Observable<ApiResponse<JobPosting>> {
    return this.http.post<ApiResponse<JobPosting>>(`${this.apiUrl}/jobs`, job);
  }

  // Update job posting
  updateJobPosting(id: string, job: Partial<JobPosting>): Observable<ApiResponse<JobPosting>> {
    console.log('Service: Updating job posting:', id, 'with data:', job);
    return this.http.put<ApiResponse<JobPosting>>(`${this.apiUrl}/jobs/${id}`, job);
  }

  // Update job posting status
  updateJobPostingStatus(id: string, status: string): Observable<ApiResponse<JobPosting>> {
    return this.http.patch<ApiResponse<JobPosting>>(`${this.apiUrl}/jobs/${id}/status`, { status });
  }

  // Delete job posting
  deleteJobPosting(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/jobs/${id}`);
  }

  // Get departments
  getDepartments(): Observable<ApiResponse<Department[]>> {
    console.log('Service: Getting departments from:', `${this.apiUrl}/departments`);
    return this.http.get<ApiResponse<Department[]>>(`${this.apiUrl}/departments`);
  }

  // Get salary ranges
  getSalaryRanges(): Observable<ApiResponse<SalaryRange[]>> {
    console.log('Service: Getting salary ranges from:', `${this.apiUrl}/salary-ranges`);
    return this.http.get<ApiResponse<SalaryRange[]>>(`${this.apiUrl}/salary-ranges`);
  }

  // Get dashboard data
  getDashboard(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/dashboard`);
  }
}