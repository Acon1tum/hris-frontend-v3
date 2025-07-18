import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface JobPosting {
  id?: string | number;
  position_title: string;
  department_id: string;
  job_description: string;
  qualifications: string;
  technical_competencies: string;
  salary_range: string;
  employment_type: string;
  num_vacancies: number;
  application_deadline: string;
  posting_status: string;
  created_by: string;
  created_at: string;
  department: string;
  created_by_user: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobPortalManagementService {
  private apiUrl = `${environment.apiUrl}/job-portal`;

  constructor(private http: HttpClient) {}

  getAllJobPostings(): Observable<{ success: boolean, data: any[] }> {
    return this.http.get<{ success: boolean, data: any[] }>(`${this.apiUrl}/jobs`);
  }

  createJobPosting(job: Partial<JobPosting>) {
    return this.http.post<{ success: boolean, data: JobPosting }>(`${this.apiUrl}/jobs`, job);
  }
}