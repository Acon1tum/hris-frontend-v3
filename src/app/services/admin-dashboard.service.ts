import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  pendingLeaveRequests: number;
  payrollStatus: string;
  departmentStats: any[];
  employmentTypeStats: any[];
  recentActivities: any[];
  attendanceOverview: {
    present: number;
    absent: number;
    late: number;
    onLeave: number;
    total: number;
  };
}

export interface PersonnelStats {
  total: number;
  active: number;
  inactive: number;
  departmentStats: any[];
  employmentTypeStats: any[];
}

export interface LeaveStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get comprehensive dashboard statistics
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<{success: boolean, data: any}>(`${this.apiUrl}/personnel/dashboard-stats`)
      .pipe(
        map(response => ({
          totalEmployees: response.data.total,
          activeEmployees: response.data.active,
          pendingLeaveRequests: 0, // This would come from leave service
          payrollStatus: 'Ready', // This would come from payroll service
          departmentStats: response.data.departmentStats,
          employmentTypeStats: response.data.employmentTypeStats,
          recentActivities: response.data.recentActivities,
          attendanceOverview: response.data.attendanceOverview
        })),
        catchError(error => {
          console.error('Error fetching dashboard stats:', error);
          return of(this.getDefaultStats());
        })
      );
  }

  // Get personnel statistics
  getPersonnelStats(): Observable<PersonnelStats> {
    return this.http.get<{success: boolean, data: PersonnelStats}>(`${this.apiUrl}/personnel/stats`)
      .pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Error fetching personnel stats:', error);
          return of({
            total: 0,
            active: 0,
            inactive: 0,
            departmentStats: [],
            employmentTypeStats: []
          });
        })
      );
  }

  // Get leave statistics
  getLeaveStats(): Observable<LeaveStats> {
    return this.http.get<{success: boolean, data: any[]}>(`${this.apiUrl}/leave/applications/pending`)
      .pipe(
        map(response => ({
          pending: response.data?.length || 0,
          approved: 0, // Would need separate endpoint
          rejected: 0, // Would need separate endpoint
          total: 0 // Would need separate endpoint
        })),
        catchError(error => {
          console.error('Error fetching leave stats:', error);
          return of({
            pending: 0,
            approved: 0,
            rejected: 0,
            total: 0
          });
        })
      );
  }

  // Get attendance statistics
  getAttendanceStats(): Observable<AttendanceStats> {
    // This would need a proper attendance endpoint
    return of({
      present: 892,
      absent: 45,
      late: 23,
      onLeave: 12,
      total: 972
    });
  }

  // Get recent activities
  getRecentActivities(): Observable<any[]> {
    // This would need a proper activities/audit log endpoint
    return of([
      {
        action: 'New employee onboarded',
        user: 'John Smith',
        time: '2 hours ago',
        type: 'success'
      },
      {
        action: 'Leave request approved',
        user: 'Sarah Johnson',
        time: '4 hours ago',
        type: 'info'
      },
      {
        action: 'Payroll processed',
        user: 'System',
        time: '6 hours ago',
        type: 'success'
      },
      {
        action: 'Performance review due',
        user: 'Mike Wilson',
        time: '1 day ago',
        type: 'warning'
      }
    ]);
  }

  // Get dashboard employees (simplified list)
  getDashboardEmployees(): Observable<any[]> {
    return this.http.get<{success: boolean, data: any[]}>(`${this.apiUrl}/personnel/dashboard-employees`)
      .pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Error fetching dashboard employees:', error);
          return of([]);
        })
      );
  }

  // Get leave applications for approval
  getPendingLeaveApplications(): Observable<any[]> {
    return this.http.get<{success: boolean, data: any[]}>(`${this.apiUrl}/leave/applications/pending`)
      .pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Error fetching pending leave applications:', error);
          return of([]);
        })
      );
  }

  // Get system health status
  getSystemHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`)
      .pipe(
        catchError(error => {
          console.error('Error fetching system health:', error);
          return of({ status: 'Unknown' });
        })
      );
  }

  // Default stats for fallback
  private getDefaultStats(): DashboardStats {
    return {
      totalEmployees: 0,
      activeEmployees: 0,
      pendingLeaveRequests: 0,
      payrollStatus: 'Unknown',
      departmentStats: [],
      employmentTypeStats: [],
      recentActivities: [],
      attendanceOverview: {
        present: 0,
        absent: 0,
        late: 0,
        onLeave: 0,
        total: 0
      }
    };
  }
}
