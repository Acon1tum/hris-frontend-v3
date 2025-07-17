import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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

export interface CreateLeaveTypeRequest {
  leave_type_name: string;
  description?: string;
  requires_document?: boolean;
  max_days?: number;
}

export interface UpdateLeaveTypeRequest {
  leave_type_name?: string;
  description?: string;
  requires_document?: boolean;
  max_days?: number;
  is_active?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveTypesService {
  private apiUrl = `${environment.apiUrl}/leave/types`;

  constructor(private http: HttpClient) {}

  /**
   * Get all leave types
   */
  getLeaveTypes(): Observable<LeaveType[]> {
    return this.http.get<ApiResponse<LeaveType[]>>(this.apiUrl)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to fetch leave types');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Create a new leave type
   */
  createLeaveType(leaveType: CreateLeaveTypeRequest): Observable<LeaveType> {
    return this.http.post<ApiResponse<LeaveType>>(this.apiUrl, leaveType)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to create leave type');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Update an existing leave type
   */
  updateLeaveType(id: string, leaveType: UpdateLeaveTypeRequest): Observable<LeaveType> {
    return this.http.put<ApiResponse<LeaveType>>(`${this.apiUrl}/${id}`, leaveType)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to update leave type');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Delete a leave type (hard delete)
   */
  deleteLeaveType(id: string): Observable<LeaveType> {
    return this.http.delete<ApiResponse<LeaveType>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to delete leave type');
          }
        }),
        catchError(this.handleError)
      );
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
        errorMessage = 'Leave type not found';
      } else if (error.status >= 500) {
        errorMessage = 'Server error occurred';
      } else {
        errorMessage = `Error: ${error.status} - ${error.statusText}`;
      }
    }
    
    console.error('Leave Types Service Error:', error);
    return throwError(() => new Error(errorMessage));
  };
} 