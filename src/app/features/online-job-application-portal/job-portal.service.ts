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
}

@Injectable({ providedIn: 'root' })
export class JobPortalService {
  private apiUrl = `${environment.apiUrl}/job-portal`;

  constructor(private http: HttpClient) {}

  getJobPostings(): Observable<JobPosting[]> {
    return this.http.get<{ success: boolean; data: JobPosting[] }>(`${this.apiUrl}/jobs`).pipe(
      map(res => res.data)
    );
  }
} 