import { Permission } from './auth.interface';

// Define permission groups for common access patterns
export const PermissionGroups = {
  // System Administration permissions
  SYSTEM_ADMIN: [Permission.user_read, Permission.role_read, Permission.permission_read],
  USER_MANAGEMENT: [Permission.user_read, Permission.user_create, Permission.user_update, Permission.user_delete],
  ROLE_MANAGEMENT: [Permission.role_read, Permission.role_create, Permission.role_update, Permission.role_delete],
  PERMISSION_MANAGEMENT: [Permission.permission_read, Permission.permission_create, Permission.permission_update, Permission.permission_delete],
  AUDIT_ACCESS: [Permission.audit_log_read, Permission.audit_trail_read],
  SYSTEM_CONFIG: [Permission.parameter_read, Permission.parameter_create, Permission.parameter_update, Permission.parameter_delete],
  CONFIG_MANAGEMENT: [Permission.config_read, Permission.config_create, Permission.config_update, Permission.config_delete],
  DELEGATION_ACCESS: [Permission.delegation_read, Permission.system_login_read],

  // Personnel Information permissions
  PERSONNEL_BASIC: [Permission.employee_read],
  PERSONNEL_FULL: [Permission.employee_read, Permission.employee_create, Permission.employee_update, Permission.employee_delete],
  EMPLOYMENT_RECORDS: [Permission.employment_record_read, Permission.employment_record_create, Permission.employment_record_update, Permission.employment_record_delete],
  MEMBERSHIP_DATA: [Permission.membership_data_read, Permission.membership_data_create, Permission.membership_data_update, Permission.membership_data_delete],
  DESIGNATION_MANAGEMENT: [Permission.designation_read, Permission.designation_create, Permission.designation_update, Permission.designation_delete],
  EMPLOYMENT_HISTORY: [Permission.employment_history_read, Permission.employment_history_create, Permission.employment_history_update, Permission.employment_history_delete],
  PERSONNEL_ADMIN: [Permission.employee_read, Permission.employment_record_read, Permission.membership_data_read],
  CUSTOM_FIELDS: [Permission.custom_field_read, Permission.custom_field_create, Permission.custom_field_update, Permission.custom_field_delete],
  
  // Merit and Violations
  MERIT_MANAGEMENT: [Permission.merit_read, Permission.merit_create, Permission.merit_update, Permission.merit_delete],
  VIOLATION_MANAGEMENT: [Permission.violation_read, Permission.violation_create, Permission.violation_update, Permission.violation_delete],
  ADMIN_CASE_MANAGEMENT: [Permission.admin_case_read, Permission.admin_case_create, Permission.admin_case_update, Permission.admin_case_delete],

  // Request Management permissions
  REQUEST_BASIC: [Permission.request_read],
  REQUEST_MANAGEMENT: [Permission.request_read, Permission.request_create, Permission.request_update, Permission.request_delete],
  LEAVE_REQUEST_FULL: [Permission.leave_request_read, Permission.leave_request_create, Permission.leave_request_update, Permission.leave_request_delete],
  DTR_ADJUSTMENT_FULL: [Permission.dtr_adjustment_read, Permission.dtr_adjustment_create, Permission.dtr_adjustment_update, Permission.dtr_adjustment_delete],
  CERTIFICATION_REQUEST: [Permission.certification_request_read, Permission.certification_request_create, Permission.certification_request_update, Permission.certification_request_delete],

  // Employee Self-Service permissions
  EMPLOYEE_SELF_SERVICE: [], // Accessible to all employees
  EMPLOYEE_PROFILE: [Permission.employee_read],
  EMPLOYEE_REQUESTS: [Permission.request_read, Permission.leave_request_read],
  EMPLOYEE_REPORTS: [Permission.report_read],

  // Timekeeping & Attendance permissions
  ATTENDANCE_BASIC: [Permission.attendance_log_read],
  ATTENDANCE_FULL: [Permission.attendance_log_read, Permission.attendance_log_create, Permission.attendance_log_update, Permission.attendance_log_delete],
  SCHEDULE_BASIC: [Permission.schedule_read],
  SCHEDULE_MANAGEMENT: [Permission.schedule_read, Permission.schedule_create, Permission.schedule_update, Permission.schedule_delete],
  DTR_ADJUSTMENT: [Permission.dtr_adjustment_read, Permission.dtr_adjustment_create, Permission.dtr_adjustment_update, Permission.dtr_adjustment_delete],
  DTR_REPORTS: [Permission.dtr_report_read, Permission.dtr_report_generate],

  // Payroll Management permissions
  PAYROLL_BASIC: [Permission.payroll_record_read],
  PAYROLL_FULL: [Permission.payroll_record_read, Permission.payroll_record_create, Permission.payroll_record_update, Permission.payroll_record_delete],
  SALARY_ADJUSTMENTS: [Permission.salary_adjustment_read, Permission.salary_adjustment_create, Permission.salary_adjustment_update, Permission.salary_adjustment_delete],
  LOAN_BASIC: [Permission.loan_balance_read],
  LOAN_MANAGEMENT: [Permission.loan_balance_read, Permission.loan_balance_create, Permission.loan_balance_update, Permission.loan_balance_delete],
  PAYROLL_OPERATIONS: [Permission.payroll_record_create, Permission.payroll_record_update],

  // Leave Management permissions
  LEAVE_BASIC: [Permission.leave_request_read, Permission.leave_balance_read],
  LEAVE_TYPE_BASIC: [Permission.leave_type_read],
  LEAVE_TYPE_MANAGEMENT: [Permission.leave_type_read, Permission.leave_type_create, Permission.leave_type_update, Permission.leave_type_delete],
  LEAVE_BALANCE_BASIC: [Permission.leave_balance_read],
  LEAVE_BALANCE_FULL: [Permission.leave_balance_read, Permission.leave_balance_create, Permission.leave_balance_update, Permission.leave_balance_delete],
  LEAVE_REPORTS: [Permission.leave_report_read, Permission.leave_report_generate],

  // Recruitment permissions
  RECRUITMENT_BASIC: [Permission.applicant_read, Permission.job_posting_read],
  APPLICANT_FULL: [Permission.applicant_read, Permission.applicant_create, Permission.applicant_update, Permission.applicant_delete],
  JOB_POSTING_FULL: [Permission.job_posting_read, Permission.job_posting_create, Permission.job_posting_update, Permission.job_posting_delete],
  APPLICATION_FULL: [Permission.application_read, Permission.application_create, Permission.application_update, Permission.application_delete],
  INTERVIEW_SCHEDULE: [Permission.interview_schedule_read, Permission.interview_schedule_create, Permission.interview_schedule_update, Permission.interview_schedule_delete],

  // Performance Management permissions
  PERFORMANCE_BASIC: [Permission.performance_review_read],
  PERFORMANCE_FULL: [Permission.performance_review_read, Permission.performance_review_create, Permission.performance_review_update, Permission.performance_review_delete],
  KPI_MANAGEMENT: [Permission.kpi_read, Permission.kpi_create, Permission.kpi_update, Permission.kpi_delete],
  PERFORMANCE_REPORTS: [Permission.performance_report_read, Permission.performance_report_generate],

  // Report Generation permissions
  REPORT_BASIC: [Permission.report_read],
  REPORT_FULL: [Permission.report_read, Permission.report_generate],
  REPORT_EXPORT: [Permission.report_export_read],
  REPORT_TEMPLATE: [Permission.report_template_read, Permission.report_template_generate],

  // Learning & Development permissions
  LEARNING_BASIC: [Permission.training_program_read, Permission.training_enrollment_read],
  TRAINING_PROGRAM_FULL: [Permission.training_program_read, Permission.training_program_create, Permission.training_program_update, Permission.training_program_delete],
  TRAINING_MATERIAL: [Permission.training_material_read, Permission.training_material_create, Permission.training_material_update, Permission.training_material_delete],
  TRAINING_ENROLLMENT: [Permission.training_enrollment_read, Permission.training_enrollment_create, Permission.training_enrollment_update, Permission.training_enrollment_delete],
  TRAINING_REPORTS: [Permission.training_report_read, Permission.training_report_generate],

  // Health & Wellness permissions (no specific permissions in schema, so accessible to all)
  HEALTH_WELLNESS: [],

  // Public Access (no permissions required)
  PUBLIC_ACCESS: []
};

// Helper function to combine multiple permission groups
export function combinePermissions(...groups: Permission[][]): Permission[] {
  const uniquePermissions = new Set<Permission>();
  groups.forEach(group => {
    group.forEach(permission => uniquePermissions.add(permission));
  });
  return Array.from(uniquePermissions);
}

// Helper function to check if user has any of the specified permission groups
export function hasAnyPermissionGroup(userPermissions: Permission[], ...groups: Permission[][]): boolean {
  return groups.some(group => 
    group.every(permission => userPermissions.includes(permission))
  );
} 