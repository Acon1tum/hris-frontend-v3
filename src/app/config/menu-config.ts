import { MenuItem } from '../interfaces/auth.interface';
import { PermissionGroups } from '../interfaces/permission-groups';
import { Subscription } from 'rxjs';
import { Permission } from '../interfaces/auth.interface';

export const MENU_CONFIG: MenuItem[] = [
  {
    name: 'Dashboard',
    icon: 'dashboard',
    path: '/dashboard',
    permissions: PermissionGroups.PUBLIC_ACCESS // Dashboard accessible to all authenticated users
  },
  {
    name: 'System Administration',
    icon: 'admin_panel_settings',
    path: '/system-administration',
    permissions: PermissionGroups.SYSTEM_ADMIN,
    children: [
      {
        name: 'User Management',
        icon: 'manage_accounts',
        path: '/system-administration/user-management',
        permissions: PermissionGroups.USER_MANAGEMENT
      },
      {
        name: 'Role Management',
        icon: 'security',
        path: '/system-administration/role-management',
        permissions: PermissionGroups.ROLE_MANAGEMENT
      },
      {
        name: 'Audit Trail',
        icon: 'history',
        path: '/system-administration/audit-trail',
        permissions: PermissionGroups.AUDIT_ACCESS
      },
      {
        name: 'System Parameters',
        icon: 'settings',
        path: '/system-administration/system-parameters',
        permissions: PermissionGroups.SYSTEM_CONFIG
      }
    ]
  },
  {
    name: 'Personnel Information',
    icon: 'people',
    path: '/personnel-information-management',
    permissions: PermissionGroups.PERSONNEL_BASIC,
    children: [
      {
        name: 'Admin Dashboard',
        icon: 'analytics',
        path: '/personnel-information-management/admin-dashboard',
        permissions: PermissionGroups.PERSONNEL_BASIC
      },
      {
        name: 'Admin Custom',
        icon: 'build',
        path: '/personnel-information-management/admin-custom',
        permissions: PermissionGroups.CUSTOM_FIELDS
      },
      {
        name: 'Admin Request',
        icon: 'build',
        path: '/personnel-information-management/admin-request',
        permissions: PermissionGroups.REQUEST_MANAGEMENT
      },
      {
        name: 'Personnel 201 File',
        icon: 'build',
        path: '/personnel-information-management/personnel-201-file',
        permissions: PermissionGroups.PERSONNEL_ADMIN
      },
      {
        name: 'Personnel Movement',
        icon: 'build',
        path: '/personnel-information-management/personnel-movement',
        permissions: PermissionGroups.PERSONNEL_ADMIN
      }
    ]
  },
  {
    name: 'Employee Self-Service',
    icon: 'person',
    path: '/employee-self-service',
    badge: '3',
    permissions: PermissionGroups.EMPLOYEE_SELF_SERVICE,
    children: [
      {
        name: 'My Profile',
        icon: 'person',
        path: '/employee-self-service/my-profile',
        permissions: PermissionGroups.EMPLOYEE_PROFILE
      },
      {
        name: 'My Requests',
        icon: 'request_page',
        path: '/employee-self-service/my-requests',
        permissions: PermissionGroups.EMPLOYEE_REQUESTS
      },
      {
        name: 'My Reports',
        icon: 'report',
        path: '/employee-self-service/my-reports',
        permissions: PermissionGroups.EMPLOYEE_REPORTS
      }
    ]
  },
  {
    name: 'Timekeeping & Attendance',
    icon: 'schedule',
    path: '/timekeeping-attendance',
    permissions: PermissionGroups.ATTENDANCE_BASIC,
    children: [
      {
        name: 'Attendance Overview',
        icon: 'analytics',
        path: '/timekeeping-attendance/attendance-overview',
        permissions: PermissionGroups.ATTENDANCE_BASIC
      },
      {
        name: 'Attendance Logs',
        icon: 'history',
        path: '/timekeeping-attendance/attendance-logs',
        permissions: PermissionGroups.ATTENDANCE_BASIC
      },
      {
        name: 'Time Schedules',
        icon: 'schedule',
        path: '/timekeeping-attendance/time-schedules',
        permissions: PermissionGroups.SCHEDULE_MANAGEMENT
      },
      {
        name: 'DTR Adjustment',
        icon: 'adjust',
        path: '/timekeeping-attendance/dtr-adjustment',
        permissions: PermissionGroups.DTR_ADJUSTMENT
      },
      {
        name: 'Employee Attendance',
        icon: 'person',
        path: '/timekeeping-attendance/employee-attendance',
        permissions: PermissionGroups.ATTENDANCE_BASIC
      }
    ]
  },
  {
    name: 'Payroll Management',
    icon: 'payments',
    path: '/payroll-management',
    badge: '1',
    permissions: PermissionGroups.PAYROLL_BASIC,
    children: [
      {
        name: 'Payroll Overview',
        icon: 'analytics',
        path: '/payroll-management/payroll-overview',
        permissions: PermissionGroups.PAYROLL_BASIC
      },
      {
        name: 'Master Payroll',
        icon: 'payments',
        path: '/payroll-management/master-payroll',
        permissions: PermissionGroups.PAYROLL_FULL
      },
      {
        name: 'Deductions',
        icon: 'payments',
        path: '/payroll-management/deductions',
        permissions: PermissionGroups.SALARY_ADJUSTMENTS
      },
      {
        name: 'Loan Management',
        icon: 'payments',
        path: '/payroll-management/loan-management',
        permissions: PermissionGroups.LOAN_BASIC
      },
      {
        name: 'Payroll Adjustment',
        icon: 'payments',
        path: '/payroll-management/payroll-adjustment',
        permissions: PermissionGroups.SALARY_ADJUSTMENTS
      },
      {
        name: 'Payroll Run',
        icon: 'payments',
        path: '/payroll-management/payroll-run',
        permissions: PermissionGroups.PAYROLL_OPERATIONS
      },
      {
        name: 'Employee Payroll',
        icon: 'payments',
        path: '/payroll-management/employee-payroll',
        permissions: PermissionGroups.PAYROLL_OPERATIONS
      }
    ]
  },
  {
    name: 'Leave Management',
    icon: 'event',
    path: '/leave-management',
    badge: '5',
    permissions: PermissionGroups.LEAVE_BASIC,
    children: [
      {
        name: 'Leave Request Management',
        icon: 'event',
        path: '/leave-management/leave-request-management',
        permissions: PermissionGroups.LEAVE_REQUEST_FULL
      },
      {
        name: 'Leave Type Management',
        icon: 'event',
        path: '/leave-management/leave-type-management',
        permissions: PermissionGroups.LEAVE_TYPE_MANAGEMENT
      },
      {
        name: 'Leave Balance',
        icon: 'event',
        path: '/leave-management/leave-balance',
        permissions: PermissionGroups.LEAVE_BALANCE_BASIC
      },
      {
        name: 'Leave Employee',
        icon: 'event',
        path: '/leave-management/leave-employee',
        permissions: PermissionGroups.LEAVE_BALANCE_BASIC
      }
    ]
  },
  {
    name: 'Report Generation',
    icon: 'assessment',
    path: '/report-generation',
    permissions: PermissionGroups.REPORT_BASIC
  },
  {
    name: 'Recruitment',
    icon: 'work',
    path: '/recruitment',
    badge: '2',
    permissions: PermissionGroups.RECRUITMENT_BASIC
  },
  // Job Portal Management: Only for admins to manage job cards for the public job portal
  {
    name: 'Job Portal Management',
    icon: 'admin_panel_settings',
    path: '/job-portal-management',
    permissions: [Permission.job_posting_create]
  },
  {
    name: 'Performance Management',
    icon: 'trending_up',
    path: '/performance-management',
    permissions: PermissionGroups.PERFORMANCE_BASIC
  },
  {
    name: 'Learning & Development',
    icon: 'school',
    path: '/learning-development',
    badge: '4',
    permissions: PermissionGroups.LEARNING_BASIC
  },
  {
    name: 'Health & Wellness',
    icon: 'health_and_safety',
    path: '/health-wellness',
    permissions: PermissionGroups.PUBLIC_ACCESS
  }
]; 