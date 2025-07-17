import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface LeaveType {
  id: string;
  leave_type_name: string;
  description?: string;
  requires_document?: boolean;
  max_days?: number;
  is_active: boolean;
  created_at?: string;
}

export interface LeaveBalance {
  id: string;
  personnel_id: string;
  leave_type_id: string;
  year: string;
  total_credits: number;
  used_credits: number;
  earned_credits: number;
  last_updated: string;
  leave_type: LeaveType;
}

export interface LeaveApplication {
  id: string;
  personnel_id: string;
  leave_type_id: string;
  start_date: string;
  end_date: string;
  total_days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason?: string;
  supporting_document?: string;
  request_date: string;
  approval_date?: string;
  approval_comments?: string;
  leave_type: LeaveType;
}

export interface CreateLeaveApplicationRequest {
  leave_type_id: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason?: string;
  supporting_document?: File | string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LeaveEmployeeService {
  private apiUrl = `${environment.apiUrl}/leave`;

  constructor(private http: HttpClient) {}

  getLeaveTypes(): Observable<LeaveType[]> {
    return this.http.get<ApiResponse<LeaveType[]>>(`${this.apiUrl}/types`).pipe(
      map(res => {
        if (res.success) return res.data;
        throw new Error(res.message || 'Failed to fetch leave types');
      }),
      catchError(this.handleError)
    );
  }

  getMyLeaveBalance(): Observable<LeaveBalance[]> {
    return this.http.get<ApiResponse<LeaveBalance[]>>(`${this.apiUrl}/balance/my`).pipe(
      map(res => {
        if (res.success) return res.data;
        throw new Error(res.message || 'Failed to fetch leave balance');
      }),
      catchError(this.handleError)
    );
  }

  getMyLeaveApplications(): Observable<LeaveApplication[]> {
    return this.http.get<ApiResponse<LeaveApplication[]>>(`${this.apiUrl}/applications/my`).pipe(
      map(res => {
        if (res.success) return res.data;
        throw new Error(res.message || 'Failed to fetch leave applications');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Create a leave application. If supporting_document is a File, use FormData. Otherwise, send JSON.
   * Never send personnel_id from the frontend; backend derives it from the logged-in user.
   */
  createLeaveApplication(data: CreateLeaveApplicationRequest): Observable<LeaveApplication> {
    // Debug: Log outgoing payload
    console.log('[LeaveEmployeeService] Creating leave application with:', data);
    if (data.supporting_document && data.supporting_document instanceof File) {
      const formData = new FormData();
      formData.append('leave_type_id', data.leave_type_id);
      formData.append('start_date', data.start_date);
      formData.append('end_date', data.end_date);
      formData.append('total_days', data.total_days.toString());
      if (data.reason) formData.append('reason', data.reason);
      formData.append('supporting_document', data.supporting_document);
      return this.http.post<ApiResponse<LeaveApplication>>(`${this.apiUrl}/applications`, formData).pipe(
        map(res => {
          if (res.success) return res.data;
          throw new Error(res.message || 'Failed to create leave application');
        }),
        catchError(this.handleError)
      );
    } else {
      // Send as JSON
      const payload: any = {
        leave_type_id: data.leave_type_id,
        start_date: data.start_date,
        end_date: data.end_date,
        total_days: data.total_days,
        reason: data.reason || '',
        supporting_document: data.supporting_document || ''
      };
      // Debug: Log outgoing JSON payload
      console.log('[LeaveEmployeeService] JSON payload:', payload);
      return this.http.post<ApiResponse<LeaveApplication>>(`${this.apiUrl}/applications`, payload).pipe(
        map(res => {
          if (res.success) return res.data;
          throw new Error(res.message || 'Failed to create leave application');
        }),
        catchError(this.handleError)
      );
    }
  }

  cancelLeaveApplication(id: string): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/applications/${id}`).pipe(
      map(res => {
        if (res.success) return res.data;
        throw new Error(res.message || 'Failed to cancel leave application');
      }),
      catchError(this.handleError)
    );
  }

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check if the backend is running.';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized access';
      } else if (error.status === 403) {
        errorMessage = 'Access forbidden - insufficient permissions';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found';
      } else if (error.status >= 500) {
        errorMessage = 'Server error occurred. Please make sure the database migration has been run.';
      } else {
        errorMessage = `Error: ${error.status} - ${error.statusText}`;
      }
    }
    console.error('Leave Employee Service Error:', error);
    return throwError(() => new Error(errorMessage));
  };
} 