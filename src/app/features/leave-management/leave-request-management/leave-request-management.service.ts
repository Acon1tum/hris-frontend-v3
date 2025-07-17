import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

// Interfaces matching Prisma schema
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
  approved_by?: string;
  approval_date?: string;
  approval_comments?: string;
  personnel: {
    id: string;
    first_name: string;
    last_name: string;
    department?: {
      id: string;
      department_name: string;
    };
  };
  leave_type: {
    id: string;
    leave_type_name: string;
    description?: string;
  };
  approved_by_user?: {
    id: string;
    username: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface LeaveApplicationFilter {
  status?: string;
  personnel_id?: string;
  department_id?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

export interface ApprovalRequest {
  status: 'Approved' | 'Rejected';
  comments?: string;
}

export interface Department {
  id: string;
  department_name: string;
}

export interface Personnel {
  id: string;
  first_name: string;
  last_name: string;
  department_id?: string;
  department?: Department;
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
export class LeaveRequestManagementService {
  private apiUrl = `${environment.apiUrl}/leave`;

  constructor(private http: HttpClient) {}

  /**
   * Get all leave applications with filters
   */
  getLeaveApplications(filters: LeaveApplicationFilter = {}): Observable<{applications: LeaveApplication[], pagination: any}> {
    let params = new HttpParams();
    
    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof LeaveApplicationFilter];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ApiResponse<LeaveApplication[]>>(`${this.apiUrl}/applications`, { params })
      .pipe(
        map(response => {
          if (response.success) {
            // Ensure data is always an array
            const applications = Array.isArray(response.data) ? response.data : [];
            return {
              applications,
              pagination: response.pagination || {}
            };
          } else {
            throw new Error(response.message || 'Failed to fetch leave applications');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get pending leave applications for approval
   */
  getPendingApplications(): Observable<LeaveApplication[]> {
    return this.http.get<ApiResponse<LeaveApplication[]>>(`${this.apiUrl}/applications/pending`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to fetch pending applications');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Approve a leave application
   */
  approveApplication(id: string, comments?: string): Observable<LeaveApplication> {
    const requestData: ApprovalRequest = {
      status: 'Approved',
      comments
    };

    return this.http.put<ApiResponse<LeaveApplication>>(`${this.apiUrl}/applications/${id}/approve`, requestData)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to approve application');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Reject a leave application
   */
  rejectApplication(id: string, comments?: string): Observable<LeaveApplication> {
    const requestData: ApprovalRequest = {
      status: 'Rejected',
      comments
    };

    return this.http.put<ApiResponse<LeaveApplication>>(`${this.apiUrl}/applications/${id}/reject`, requestData)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to reject application');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get all departments for filtering
   */
  getDepartments(): Observable<Department[]> {
    return this.http.get<ApiResponse<Department[]>>(`${environment.apiUrl}/system/departments`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to fetch departments');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get all personnel for filtering
   */
  getPersonnel(): Observable<Personnel[]> {
    return this.http.get<ApiResponse<Personnel[]>>(`${environment.apiUrl}/personnel`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to fetch personnel');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get supporting document URL for preview
   */
  getSupportingDocumentUrl(documentPath: string): string {
    if (!documentPath) return '';
    return `${environment.apiUrl.replace('/api', '')}/uploads/${documentPath}`;
  }

  /**
   * Handle HTTP errors
   */
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
        errorMessage = 'Unauthorized access';
      } else if (error.status === 403) {
        errorMessage = 'Access forbidden - insufficient permissions';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found';
      } else if (error.status >= 500) {
        errorMessage = 'Server error occurred';
      } else {
        errorMessage = `Error: ${error.status} - ${error.statusText}`;
      }
    }
    
    console.error('Leave Request Management Service Error:', error);
    return throwError(() => new Error(errorMessage));
  };
} 