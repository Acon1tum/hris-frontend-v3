import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PermissionGuard } from './guards/permission.guard'; // Rename PermissionGuard to RoleGuard
import { OnlineJobApplicationPortalComponent } from './features/online-job-application-portal/index.component';
import { OnlineJobLoginComponent } from './features/online-job-application-portal/online-job-login/online-job-login.component';
import { OnlineJobRegisterComponent } from './features/online-job-application-portal/online-job-register/online-job-register.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Employee', 'Manager', 'Applicant'] }
  },
  {
    path: 'system-administration',
    loadComponent: () => import('./features/system-administration/index.component').then(m => m.SystemAdministrationComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR'] }
  },
  {
    path: 'system-administration/user-management',
    loadComponent: () => import('./features/system-administration/user-management/user-management.component').then(m => m.UserManagementComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR'] }
  },
  
  {
    path: 'system-administration/audit-trail',
    loadComponent: () => import('./features/system-administration/audit-trail/audit-trail.component').then(m => m.AuditTrailComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR'] }
  },
  {
    path: 'system-administration/system-parameters',
    loadComponent: () => import('./features/system-administration/system-parameters/system-parameters.component').then(m => m.SystemParametersComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR'] }
  },
  {
    path: 'personnel-information-management',
    loadComponent: () => import('./features/personnel-information-management/index.component').then(m => m.PersonnelInformationManagementComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Employee', 'Manager'] }
  },
  {
    path: 'personnel-information-management/admin-dashboard',
    loadComponent: () => import('./features/personnel-information-management/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR'] }
  },
  {
    path: 'personnel-information-management/admin-custom',
    loadComponent: () => import('./features/personnel-information-management/admin-custom/admin-custom.component').then(m => m.AdminCustomComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR'] }
  },
  {
    path: 'personnel-information-management/admin-request',
    loadComponent: () => import('./features/personnel-information-management/admin-request/admin-request.component').then(m => m.AdminRequestComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR'] }
  },
  {
    path: 'personnel-information-management/personnel-201-file',
    loadComponent: () => import('./features/personnel-information-management/personnel-201-file/personnel-201-file.component').then(m => m.Personnel201FileComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR'] }
  },
  {
    path: 'personnel-information-management/personnel-movement',
    loadComponent: () => import('./features/personnel-information-management/personnel-movement/personnel-movement.component').then(m => m.PersonnelMovementComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR'] }
  },
  {
    path: 'personnel-information-management/workflows',
    loadComponent: () => import('./features/personnel-information-management/personnel-movement/workflows/workflows.component').then(m => m.WorkflowsComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR'] }
  },
  {
    path: 'personnel-information-management/audit-trail',
    loadComponent: () => import('./features/personnel-information-management/personnel-movement/audit-trail/audit-trail.component').then(m => m.AuditTrailComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR'] }
  },
  {
    path: 'employee-self-service',
    loadComponent: () => import('./features/employee-self-service/index.component').then(m => m.EmployeeSelfServiceComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Employee', 'Manager'] }
  },
  {
    path: 'employee-self-service/my-profile',
    loadComponent: () => import('./features/employee-self-service/my-profile/my-profile.component').then(m => m.MyProfileComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Employee', 'Manager'] }
  },
  {
    path: 'employee-self-service/my-requests',
    loadComponent: () => import('./features/employee-self-service/my-requests/my-requests.component').then(m => m.MyRequestsComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Employee', 'Manager'] }
  },
  {
    path: 'employee-self-service/my-reports',
    loadComponent: () => import('./features/employee-self-service/my-reports/my-reports.component').then(m => m.MyReportsComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Employee', 'Manager'] }
  },
  {
    path: 'timekeeping-attendance',
    loadComponent: () => import('./features/timekeeping-attendance/index.component').then(m => m.TimekeepingAttendanceComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Employee', 'Manager'] }
  },
  {
    path: 'timekeeping-attendance/attendance-overview',
    loadComponent: () => import('./features/timekeeping-attendance/attendance-overview/attendance-overview.component').then(m => m.AttendanceOverviewComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Manager'] }
  },
  {
    path: 'timekeeping-attendance/attendance-logs',
    loadComponent: () => import('./features/timekeeping-attendance/attendance-logs/attendance-logs.component').then(m => m.AttendanceLogsComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Manager'] }
  },
  {
    path: 'timekeeping-attendance/time-schedules',
    loadComponent: () => import('./features/timekeeping-attendance/time-schedules/time-schedules.component').then(m => m.TimeSchedulesComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Manager'] }
  },
  {
    path: 'timekeeping-attendance/dtr-adjustment',
    loadComponent: () => import('./features/timekeeping-attendance/dtr-adjustment/dtr-adjustment.component').then(m => m.DtrAdjustmentComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Manager'] }
  },
  {
    path: 'timekeeping-attendance/employee-attendance',
    loadComponent: () => import('./features/timekeeping-attendance/employee-attendance/employee-attendance.component').then(m => m.EmployeeAttendanceComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Employee', 'Manager'] }
  },
  {
    path: 'payroll-management',
    loadComponent: () => import('./features/payroll-management/index.component').then(m => m.PayrollManagementComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Manager'] }
  },
  {
    path: 'payroll-management/payroll-overview',
    loadComponent: () => import('./features/payroll-management/payroll-overview/payroll-overview.component').then(m => m.PayrollOverviewComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Manager'] }
  },
  {
    path: 'payroll-management/master-payroll',
    loadComponent: () => import('./features/payroll-management/master-payroll/master-payroll.component').then(m => m.MasterPayrollComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Manager'] }
  },
  {
    path: 'payroll-management/deductions',
    loadComponent: () => import('./features/payroll-management/deductions/deductions.component').then(m => m.DeductionsComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Manager'] }
  },
  {
    path: 'payroll-management/loan-management',
    loadComponent: () => import('./features/payroll-management/loan-management/loan-management.component').then(m => m.LoanManagementComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Manager'] }
  },
  {
    path: 'payroll-management/payroll-adjustment',
    loadComponent: () => import('./features/payroll-management/payroll-adjustment/payroll-adjustment.component').then(m => m.PayrollAdjustmentComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Manager'] }
  },
  {
    path: 'payroll-management/run-payroll',
    loadComponent: () => import('./features/payroll-management/run-payroll/run-payroll.component').then(m => m.RunPayrollComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Manager'] }
  },
  {
    path: 'payroll-management/employee-payroll',
    loadComponent: () => import('./features/payroll-management/employee-payroll/employee-payroll.component').then(m => m.EmployeePayrollComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Employee', 'Manager'] }
  },
  {
    path: 'leave-management',
    loadComponent: () => import('./features/leave-management/index.component').then(m => m.LeaveManagementComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Employee', 'Manager'] }
  },
  {
    path: 'leave-management/leave-request-management',
    loadComponent: () => import('./features/leave-management/leave-request-management/leave-request-management.component').then(m => m.LeaveRequestManagementComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Employee', 'Manager'] }
  },
  {
    path: 'leave-management/leave-type-management',
    loadComponent: () => import('./features/leave-management/leave-type-management/leave-type-management.component').then(m => m.LeaveTypeManagementComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Employee', 'Manager'] }
  },
  {
    path: 'leave-management/leave-balance',
    loadComponent: () => import('./features/leave-management/leave-balance/leave-balance.component').then(m => m.LeaveBalanceComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Manager'] }
  },
  {
    path: 'leave-management/leave-employee',
    loadComponent: () => import('./features/leave-management/leave-employee/leave-employee.component').then(m => m.LeaveEmployeeComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Employee', 'Manager'] }
  },
  {
    path: 'report-generation',
    loadComponent: () => import('./features/report-generation/index.component').then(m => m.ReportGenerationComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Employee', 'Manager'] }
  },
  {
    path: 'recruitment',
    loadComponent: () => import('./features/job-management/recruitment/index.component').then(m => m.RecruitmentComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Employee', 'Manager'] }
  },
  {
    path: 'online-job-application-portal',
    loadComponent: () => import('./features/online-job-application-portal/index.component').then(m => m.OnlineJobApplicationPortalComponent)
  },
  {
    path: 'applicant-dashboard',
    loadComponent: () => import('./features/online-job-application-portal/applicant-dashboard/applicant-dashboard.component').then(m => m.ApplicantDashboardComponent),
  },
  {
    path: 'online-job-login',
    component: OnlineJobLoginComponent
  },
  {
    path: 'online-job-register',
    component: OnlineJobRegisterComponent
  },
  {
    path: 'performance-management',
    loadComponent: () => import('./features/performance-management/index.component').then(m => m.PerformanceManagementComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Employee', 'Manager'] }
  },
  {
    path: 'health-wellness',
    loadComponent: () => import('./features/health-wellness/index.component').then(m => m.HealthWellnessComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Employee', 'Manager', 'Applicant'] }
  },
  {
    path: 'health-wellness/join-program',
    loadComponent: () => import('./features/health-wellness/join-program/join-program.component').then(m => m.JoinProgramComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Employee', 'Manager', 'Applicant'] }
  },
  {
    path: 'health-wellness/wellness-events',
    loadComponent: () => import('./features/health-wellness/wellness-events/wellness-events.component').then(m => m.WellnessEventsComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin', 'HR', 'Employee', 'Manager', 'Applicant'] }
  },
  {
    path: 'job-portal-management',
    loadComponent: () => import('./features/job-management/job-portal-management/index.component').then(m => m.JobPortalManagementComponent),
    canActivate: [PermissionGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'applicant-interviews',
    loadComponent: () => import('./features/online-job-application-portal/applicant-dashboard/interviews/interviews.component').then(m => m.InterviewsComponent),
  },
  {
    path: 'calendar',
    loadComponent: () => import('./features/online-job-application-portal/applicant-dashboard/calendar/calendar.component').then(m => m.CalendarComponent),
  },
  { path: '**', redirectTo: '/login' }
]; 