import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

export interface JobPosting {
  id: string;
  position_title: string;
  department: { department_name: string };
  job_description: string;
  qualifications: string;
  salary_range: string;
  employment_type: string;
  application_deadline: string;
  posting_status: string;
  // Add other fields as needed
  logoUrl?: string; // Optional logo URL for UI/UX
  technical_competencies?: string;
  num_vacancies?: number;
  created_at?: string;
  created_by?: string;
}

export interface SalaryRange {
  value: string;
  label: string;
}

export interface JobFilters {
  keywords?: string;
  department?: string;
  salary_range?: string;
}

@Injectable({ providedIn: 'root' })
export class JobPortalService {
  private apiUrl = `${environment.apiUrl}/job-portal`;

  constructor(private http: HttpClient) {}

  getJobPostings(filters?: JobFilters): Observable<JobPosting[]> {
    let params = new URLSearchParams();
    
    if (filters) {
      if (filters.keywords) params.append('keywords', filters.keywords);
      if (filters.department) params.append('department', filters.department);
      if (filters.salary_range) params.append('salary_range', filters.salary_range);
    }
    
    const url = filters ? `${this.apiUrl}/jobs?${params.toString()}` : `${this.apiUrl}/jobs`;
    
    return this.http.get<{ success: boolean; data: JobPosting[] }>(url).pipe(
      map(res => res.data)
    );
  }

  getSalaryRanges(): Observable<SalaryRange[]> {
    return this.http.get<{ success: boolean; data: string[] }>(`${this.apiUrl}/salary-ranges`).pipe(
      map(res => {
        const ranges = res.data || [];
        return [
          { value: '', label: 'All salary ranges' },
          ...ranges.map(range => ({ value: range, label: range }))
        ];
      })
    );
  }

  getDepartments(): Observable<string[]> {
    return this.http.get<{ success: boolean; data: string[] }>(`${this.apiUrl}/departments`).pipe(
      map(res => res.data || [])
    );
  }
} 