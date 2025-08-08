import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

// Interfaces for leave balance data
export interface LeaveBalance {
  id: string;
  personnel_id: string;
  leave_type_id: string;
  year: string;
  total_credits: number;
  used_credits: number;
  earned_credits: number;
  last_updated: string;
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
}

export interface EmployeeLeaveBalance {
  id: string;
  name: string;
  department: string;
  leave_balances: LeaveBalance[];
  total_accrued: number;
  total_used: number;
  total_remaining: number;
}

export interface LeaveBalanceFilter {
  department_id?: string;
  year?: string;
}

export interface Department {
  id: string;
  department_name: string;
}

export interface LeaveType {
  id: string;
  leave_type_name: string;
  description?: string;
  max_days?: number;
}

export interface LeaveAdjustment {
  id: string;
  personnel_id: string;
  leave_type_id: string;
  year: string;
  adjustment_type: 'increase' | 'decrease';
  adjustment_amount: number;
  reason: string;
  previous_balance: number;
  new_balance: number;
  created_at: string;
  personnel: {
    first_name: string;
    last_name: string;
    department?: {
      department_name: string;
    };
  };
  leave_type: {
    leave_type_name: string;
  };
  created_by_user: {
    username: string;
  };
}

export interface LeaveAdjustmentRequest {
  personnel_id: string;
  leave_type_id: string;
  year: string;
  adjustment_type: 'increase' | 'decrease';
  adjustment_amount: number;
  reason: string;
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
export class LeaveBalanceService {
  private apiUrl = `${environment.apiUrl}/leave`;

  constructor(private http: HttpClient) {}

  /**
   * Get leave balance report with filters
   */
  getLeaveBalanceReport(filters: LeaveBalanceFilter = {}): Observable<EmployeeLeaveBalance[]> {
    let params = new HttpParams();
    
    if (filters.department_id) {
      params = params.set('department_id', filters.department_id);
    }
    
    if (filters.year) {
      params = params.set('year', filters.year);
    }

    // Add pagination parameters
    params = params.set('page', '1');
    params = params.set('limit', '1000'); // Get all records for now, pagination will be handled in frontend

    return this.http.get<ApiResponse<LeaveBalance[]>>(`${this.apiUrl}/reports/balance`, { params })
      .pipe(
        map(response => {
          if (response.success) {
            return this.transformLeaveBalances(response.data);
          } else {
            throw new Error(response.message || 'Failed to fetch leave balance report');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get my leave balance
   */
  getMyLeaveBalance(): Observable<LeaveBalance[]> {
    return this.http.get<ApiResponse<LeaveBalance[]>>(`${this.apiUrl}/balance/my`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to fetch my leave balance');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get personnel leave balance
   */
  getPersonnelLeaveBalance(personnelId: string, year?: string): Observable<LeaveBalance[]> {
    let params = new HttpParams();
    if (year) {
      params = params.set('year', year);
    }

    return this.http.get<ApiResponse<LeaveBalance[]>>(`${this.apiUrl}/balance/${personnelId}`, { params })
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to fetch personnel leave balance');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Initialize leave balances
   */
  initializeLeaveBalance(personnelId: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/balance/initialize`, {
      personnel_id: personnelId,
      year: new Date().getFullYear().toString(),
      leave_type_id: '', // This will be set by the backend
      total_credits: 0 // This will be set by the backend
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message || 'Failed to initialize leave balance');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Preview bulk initialize leave balances for all personnel without credits
   */
  previewBulkInitializeLeaveBalances(year?: string): Observable<any> {
    const currentYear = year || new Date().getFullYear().toString();
    const params = new HttpParams().set('year', currentYear);
    
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/balance/bulk-initialize-preview`, { params })
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to preview bulk initialize leave balances');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Bulk initialize leave balances for all personnel without credits
   */
  bulkInitializeLeaveBalances(year?: string): Observable<any> {
    const currentYear = year || new Date().getFullYear().toString();
    
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/balance/bulk-initialize`, {
      year: currentYear
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message || 'Failed to bulk initialize leave balances');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Create leave credit adjustment
   */
  createLeaveAdjustment(adjustmentRequest: LeaveAdjustmentRequest): Observable<LeaveAdjustment> {
    return this.http.post<ApiResponse<LeaveAdjustment>>(`${this.apiUrl}/adjustments`, adjustmentRequest)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to create leave adjustment');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get leave adjustments
   */
  getLeaveAdjustments(filters: any = {}): Observable<{adjustments: LeaveAdjustment[], pagination: any}> {
    let params = new HttpParams();
    
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ApiResponse<LeaveAdjustment[]>>(`${this.apiUrl}/adjustments`, { params })
      .pipe(
        map(response => {
          if (response.success) {
            return {
              adjustments: response.data,
              pagination: response.pagination || {}
            };
          } else {
            throw new Error(response.message || 'Failed to fetch leave adjustments');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get personnel adjustments
   */
  getPersonnelAdjustments(personnelId: string, year?: string): Observable<{adjustments: LeaveAdjustment[], pagination: any}> {
    let params = new HttpParams();
    if (year) {
      params = params.set('year', year);
    }

    return this.http.get<ApiResponse<LeaveAdjustment[]>>(`${this.apiUrl}/adjustments/${personnelId}`, { params })
      .pipe(
        map(response => {
          if (response.success) {
            return {
              adjustments: response.data,
              pagination: response.pagination || {}
            };
          } else {
            throw new Error(response.message || 'Failed to fetch personnel adjustments');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get departments for filtering
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
   * Get leave types
   */
  getLeaveTypes(): Observable<LeaveType[]> {
    return this.http.get<ApiResponse<LeaveType[]>>(`${this.apiUrl}/types`)
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
   * Transform leave balances grouped by employee
   */
  private transformLeaveBalances(leaveBalances: LeaveBalance[]): EmployeeLeaveBalance[] {
    const employeeMap = new Map<string, EmployeeLeaveBalance>();

    leaveBalances.forEach(balance => {
      const employeeId = balance.personnel.id;
      const employeeName = `${balance.personnel.first_name} ${balance.personnel.last_name}`;
      const department = balance.personnel.department?.department_name || 'Unknown Department';

      if (!employeeMap.has(employeeId)) {
        employeeMap.set(employeeId, {
          id: employeeId,
          name: employeeName,
          department: department,
          leave_balances: [],
          total_accrued: 0,
          total_used: 0,
          total_remaining: 0
        });
      }

      const employee = employeeMap.get(employeeId)!;
      employee.leave_balances.push(balance);
      employee.total_accrued += balance.total_credits;
      employee.total_used += balance.used_credits;
      employee.total_remaining += (balance.total_credits - balance.used_credits);
    });

    return Array.from(employeeMap.values()).sort((a, b) => 
      a.department.localeCompare(b.department) || a.name.localeCompare(b.name)
    );
  }

  /**
   * Export to CSV
   */
  exportToCSV(data: EmployeeLeaveBalance[]): void {
    const csvData = this.prepareCSVData(data);
    const csvContent = this.convertToCSV(csvData);
    this.downloadFile(csvContent, 'leave-balances.csv', 'text/csv');
  }

  /**
   * Export to PDF
   */
  exportToPDF(data: EmployeeLeaveBalance[]): void {
    // Import jsPDF dynamically
    import('jspdf').then(({ jsPDF }) => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(16);
        doc.text('Leave Balance Report', 20, 20);
        
        // Add date
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
        
        // Prepare table data
        const tableData = data.map(employee => [
          employee.name,
          employee.department,
          employee.total_accrued.toString(),
          employee.total_used.toString(),
          employee.total_remaining.toString()
        ]);
        
        // Add table
        (doc as any).autoTable({
          head: [['Employee', 'Department', 'Total Credits', 'Used Credits', 'Remaining']],
          body: tableData,
          startY: 40,
          theme: 'grid',
          styles: {
            fontSize: 8,
            cellPadding: 2
          },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255
          }
        });
        
        // Save the PDF
        doc.save('leave-balances.pdf');
      });
    });
  }

  /**
   * Prepare CSV data
   */
  private prepareCSVData(data: EmployeeLeaveBalance[]): any[] {
    const csvData: any[] = [];
    
    // Add header
    csvData.push({
      'Employee Name': 'Employee Name',
      'Department': 'Department',
      'Total Credits': 'Total Credits',
      'Used Credits': 'Used Credits',
      'Remaining Credits': 'Remaining Credits'
    });
    
    // Add employee data
    data.forEach(employee => {
      csvData.push({
        'Employee Name': employee.name,
        'Department': employee.department,
        'Total Credits': employee.total_accrued,
        'Used Credits': employee.total_used,
        'Remaining Credits': employee.total_remaining
      });
    });
    
    return csvData;
  }

  /**
   * Convert data to CSV format
   */
  private convertToCSV(data: any[]): string {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.slice(1).map(row => 
        headers.map(header => `"${row[header] || ''}"`).join(',')
      )
    ].join('\n');
    
    return csvContent;
  }

  /**
   * Download file
   */
  private downloadFile(content: string, filename: string, contentType: string): void {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
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
    
    console.error('Leave Balance Service Error:', error);
    return throwError(() => new Error(errorMessage));
  };
} 