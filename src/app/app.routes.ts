import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PermissionGuard } from './guards/permission.guard';
import { Permission } from './interfaces/auth.interface';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [PermissionGuard],
    data: { permissions: [] } // Dashboard accessible to all authenticated users
  },
  {
    path: 'system-administration',
    loadComponent: () => import('./features/system-administration/index.component').then(m => m.SystemAdministrationComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.user_read, Permission.role_read, Permission.permission_read] }
  },
  {
    path: 'system-administration/user-management',
    loadComponent: () => import('./features/system-administration/user-management/user-management.component').then(m => m.UserManagementComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.user_read, Permission.user_create, Permission.user_update] }
  },
  {
    path: 'system-administration/role-management',
    loadComponent: () => import('./features/system-administration/role-management/role-management.component').then(m => m.RoleManagementComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.role_read, Permission.role_create, Permission.role_update] }
  },
  {
    path: 'system-administration/audit-trail',
    loadComponent: () => import('./features/system-administration/audit-trail/audit-trail.component').then(m => m.AuditTrailComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.audit_log_read, Permission.audit_trail_read] }
  },
  {
    path: 'system-administration/system-parameters',
    loadComponent: () => import('./features/system-administration/system-parameters/system-parameters.component').then(m => m.SystemParametersComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.parameter_read, Permission.config_read] }
  },
  {
    path: 'personnel-information-management',
    loadComponent: () => import('./features/personnel-information-management/index.component').then(m => m.PersonnelInformationManagementComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.employee_read] }
  },
  {
    path: 'personnel-information-management/admin-dashboard',
    loadComponent: () => import('./features/personnel-information-management/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.employee_read] }
  },
  {
    path: 'personnel-information-management/admin-custom',
    loadComponent: () => import('./features/personnel-information-management/admin-custom/admin-custom.component').then(m => m.AdminCustomComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.custom_field_read, Permission.custom_field_create] }
  },
  {
    path: 'personnel-information-management/admin-request',
    loadComponent: () => import('./features/personnel-information-management/admin-request/admin-request.component').then(m => m.AdminRequestComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.request_read, Permission.request_update] }
  },
  {
    path: 'personnel-information-management/personnel-201-file',
    loadComponent: () => import('./features/personnel-information-management/personnel-201-file/personnel-201-file.component').then(m => m.Personnel201FileComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.employee_read, Permission.employment_record_read] }
  },
  {
    path: 'personnel-information-management/personnel-movement',
    loadComponent: () => import('./features/personnel-information-management/personnel-movement/personnel-movement.component').then(m => m.PersonnelMovementComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.employee_read, Permission.employment_record_read] }
  },
  {
    path: 'personnel-information-management/workflows',
    loadComponent: () => import('./features/personnel-information-management/personnel-movement/workflows/workflows.component').then(m => m.WorkflowsComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.employee_read, Permission.request_read] }
  },
  {
    path: 'personnel-information-management/audit-trail',
    loadComponent: () => import('./features/personnel-information-management/personnel-movement/audit-trail/audit-trail.component').then(m => m.AuditTrailComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.audit_log_read, Permission.audit_trail_read] }
  },
  {
    path: 'employee-self-service',
    loadComponent: () => import('./features/employee-self-service/index.component').then(m => m.EmployeeSelfServiceComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [] } // Accessible to all employees
  },
  {
    path: 'employee-self-service/my-profile',
    loadComponent: () => import('./features/employee-self-service/my-profile/my-profile.component').then(m => m.MyProfileComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.employee_read] }
  },
  {
    path: 'employee-self-service/my-requests',
    loadComponent: () => import('./features/employee-self-service/my-requests/my-requests.component').then(m => m.MyRequestsComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.request_read, Permission.leave_request_read] }
  },
  {
    path: 'employee-self-service/my-reports',
    loadComponent: () => import('./features/employee-self-service/my-reports/my-reports.component').then(m => m.MyReportsComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.report_read] }
  },
  {
    path: 'timekeeping-attendance',
    loadComponent: () => import('./features/timekeeping-attendance/index.component').then(m => m.TimekeepingAttendanceComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.attendance_log_read] }
  },
  {
    path: 'timekeeping-attendance/attendance-overview',
    loadComponent: () => import('./features/timekeeping-attendance/attendance-overview/attendance-overview.component').then(m => m.AttendanceOverviewComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.attendance_log_read] }
  },
  {
    path: 'timekeeping-attendance/attendance-logs',
    loadComponent: () => import('./features/timekeeping-attendance/attendance-logs/attendance-logs.component').then(m => m.AttendanceLogsComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.attendance_log_read] }
  },
  {
    path: 'timekeeping-attendance/time-schedules',
    loadComponent: () => import('./features/timekeeping-attendance/time-schedules/time-schedules.component').then(m => m.TimeSchedulesComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.schedule_read, Permission.schedule_create] }
  },
  {
    path: 'timekeeping-attendance/dtr-adjustment',
    loadComponent: () => import('./features/timekeeping-attendance/dtr-adjustment/dtr-adjustment.component').then(m => m.DtrAdjustmentComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.dtr_adjustment_read, Permission.dtr_adjustment_create] }
  },
  {
    path: 'timekeeping-attendance/employee-attendance',
    loadComponent: () => import('./features/timekeeping-attendance/employee-attendance/employee-attendance.component').then(m => m.EmployeeAttendanceComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.attendance_log_read] }
  },
  {
    path: 'payroll-management',
    loadComponent: () => import('./features/payroll-management/index.component').then(m => m.PayrollManagementComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.payroll_record_read] }
  },
  {
    path: 'payroll-management/payroll-overview',
    loadComponent: () => import('./features/payroll-management/payroll-overview/payroll-overview.component').then(m => m.PayrollOverviewComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.payroll_record_read] }
  },
  {
    path: 'payroll-management/master-payroll',
    loadComponent: () => import('./features/payroll-management/master-payroll/master-payroll.component').then(m => m.MasterPayrollComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.payroll_record_read, Permission.payroll_record_create] }
  },
  {
    path: 'payroll-management/deductions',
    loadComponent: () => import('./features/payroll-management/deductions/deductions.component').then(m => m.DeductionsComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.payroll_record_read, Permission.salary_adjustment_read] }
  },
  {
    path: 'payroll-management/loan-management',
    loadComponent: () => import('./features/payroll-management/loan-management/loan-management.component').then(m => m.LoanManagementComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.loan_balance_read, Permission.loan_balance_create] }
  },
  {
    path: 'payroll-management/payroll-adjustment',
    loadComponent: () => import('./features/payroll-management/payroll-adjustment/payroll-adjustment.component').then(m => m.PayrollAdjustmentComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.salary_adjustment_read, Permission.salary_adjustment_create] }
  },
  {
    path: 'payroll-management/payroll-run',
    loadComponent: () => import('./features/payroll-management/payroll-run/payroll-run.component').then(m => m.PayrollRunComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.payroll_record_create, Permission.payroll_record_update] }
  },
  {
    path: 'payroll-management/employee-payroll',
    loadComponent: () => import('./features/payroll-management/employee-payroll/employee-payroll.component').then(m => m.EmployeePayrollComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.payroll_record_create, Permission.payroll_record_update] }
  },
  {
    path: 'leave-management',
    loadComponent: () => import('./features/leave-management/index.component').then(m => m.LeaveManagementComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.leave_request_read, Permission.leave_balance_read] }
  },
  {
    path: 'leave-management/leave-request-management',
    loadComponent: () => import('./features/leave-management/leave-request-management/leave-request-management.component').then(m => m.LeaveRequestManagementComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.leave_request_read, Permission.leave_request_create] }
  },
  {
    path: 'leave-management/leave-type-management',
    loadComponent: () => import('./features/leave-management/leave-type-management/leave-type-management.component').then(m => m.LeaveTypeManagementComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.leave_type_read, Permission.leave_type_create] }
  },
  {
    path: 'leave-management/leave-balance',
    loadComponent: () => import('./features/leave-management/leave-balance/leave-balance.component').then(m => m.LeaveBalanceComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.leave_balance_read] }
  },
  {
    path: 'leave-management/leave-employee',
    loadComponent: () => import('./features/leave-management/leave-employee/leave-employee.component').then(m => m.LeaveEmployeeComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.leave_balance_read] }
  },
  {
    path: 'report-generation',
    loadComponent: () => import('./features/report-generation/index.component').then(m => m.ReportGenerationComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.report_read, Permission.report_generate] }
  },
  {
    path: 'recruitment',
    loadComponent: () => import('./features/recruitment/index.component').then(m => m.RecruitmentComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.applicant_read, Permission.job_posting_read] }
  },
  {
    path: 'online-job-application-portal',
    loadComponent: () => import('./features/online-job-application-portal/index.component').then(m => m.OnlineJobApplicationPortalComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [] } // Public access
  },
  {
    path: 'performance-management',
    loadComponent: () => import('./features/performance-management/index.component').then(m => m.PerformanceManagementComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.performance_review_read] }
  },
  {
    path: 'learning-development',
    loadComponent: () => import('./features/learning-development/index.component').then(m => m.LearningDevelopmentComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.training_program_read, Permission.training_enrollment_read] }
  },
  {
    path: 'health-wellness',
    loadComponent: () => import('./features/health-wellness/index.component').then(m => m.HealthWellnessComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [] } // Accessible to all employees
  },
  {
    path: 'health-wellness/join-program',
    loadComponent: () => import('./features/health-wellness/join-program/join-program.component').then(m => m.JoinProgramComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [] }
  },
  {
    path: 'health-wellness/wellness-events',
    loadComponent: () => import('./features/health-wellness/wellness-events/wellness-events.component').then(m => m.WellnessEventsComponent),
    canActivate: [PermissionGuard],
    data: { permissions: [] }
  },
  {
    path: 'job-portal-management',
    loadComponent: () => import('./features/job-portal-management/index.component').then(m => m.JobPortalManagementComponent),
    canActivate: [PermissionGuard],
    data: { permissions: ['job_posting_create'] }
  },
  { path: '**', redirectTo: '/login' }
]; 