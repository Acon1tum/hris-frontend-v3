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
  getAllJobPostings(page: number = 1, limit: number = 100, filters?: any): Observable<ApiResponse<JobPosting[]>> {
    let params = `?page=${page}&limit=${limit}`;
    
    if (filters) {
      if (filters.status) params += `&status=${filters.status}`;
      if (filters.department_id) params += `&department_id=${filters.department_id}`;
      if (filters.search) params += `&search=${filters.search}`;
    }
    
    // Add all=true parameter to get all jobs without pagination
    params += '&all=true';
    
    return this.http.get<ApiResponse<JobPosting[]>>(`${this.apiUrl}/jobs${params}`);
  }

  // Get all job postings without any limits (for testing)
  getAllJobPostingsUnlimited(): Observable<ApiResponse<JobPosting[]>> {
    const params = '?all=true&limit=10000'; // Very high limit to get all jobs
    return this.http.get<ApiResponse<JobPosting[]>>(`${this.apiUrl}/jobs${params}`);
  }

  // ===== GET JOB POSTING BY ID =====
  getJobPosting(id: string): Observable<ApiResponse<JobPosting>> {
    console.log('Service: Getting job posting by ID:', id);
    return this.http.get<ApiResponse<JobPosting>>(`${this.apiUrl}/jobs/${id}`);
  }

  // ===== CREATE JOB POSTING =====
  createJobPosting(job: Partial<JobPosting>): Observable<ApiResponse<JobPosting>> {
    console.log('Service: Creating new job posting');
    console.log('Job data:', job);
    return this.http.post<ApiResponse<JobPosting>>(`${this.apiUrl}/jobs`, job);
  }

  // ===== UPDATE JOB POSTING =====
  updateJobPosting(id: string, job: Partial<JobPosting>): Observable<ApiResponse<JobPosting>> {
    console.log('Service: Updating job posting');
    console.log('Job ID:', id);
    console.log('Update data:', job);
    return this.http.put<ApiResponse<JobPosting>>(`${this.apiUrl}/jobs/${id}`, job);
  }

  // ===== DELETE JOB POSTING =====
  deleteJobPosting(id: string): Observable<ApiResponse<any>> {
    console.log('Service: Deleting job posting');
    console.log('Job ID:', id);
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/jobs/${id}`);
  }

  // ===== UPDATE JOB POSTING STATUS =====
  updateJobPostingStatus(id: string, status: string): Observable<ApiResponse<JobPosting>> {
    console.log('Service: Updating job posting status');
    console.log('Job ID:', id, 'New status:', status);
    return this.http.patch<ApiResponse<JobPosting>>(`${this.apiUrl}/jobs/${id}/status`, { status });
  }

  // ===== GET DEPARTMENTS =====
  getDepartments(): Observable<ApiResponse<Department[]>> {
    console.log('Service: Getting departments');
    console.log('Request URL:', `${this.apiUrl}/departments`);
    return this.http.get<ApiResponse<Department[]>>(`${this.apiUrl}/departments`);
  }

  // ===== GET SALARY RANGES =====
  getSalaryRanges(): Observable<ApiResponse<SalaryRange[]>> {
    console.log('Service: Getting salary ranges');
    console.log('Request URL:', `${this.apiUrl}/salary-ranges`);
    return this.http.get<ApiResponse<SalaryRange[]>>(`${this.apiUrl}/salary-ranges`);
  }
}