export enum Permission {
  // Personnel Information
  employee_create = 'employee_create',
  employee_read = 'employee_read',
  employee_update = 'employee_update',
  employee_delete = 'employee_delete',
  employment_record_create = 'employment_record_create',
  employment_record_read = 'employment_record_read',
  employment_record_update = 'employment_record_update',
  employment_record_delete = 'employment_record_delete',
  membership_data_create = 'membership_data_create',
  membership_data_read = 'membership_data_read',
  membership_data_update = 'membership_data_update',
  membership_data_delete = 'membership_data_delete',
  designation_create = 'designation_create',
  designation_read = 'designation_read',
  designation_update = 'designation_update',
  designation_delete = 'designation_delete',
  employment_history_create = 'employment_history_create',
  employment_history_read = 'employment_history_read',
  employment_history_update = 'employment_history_update',
  employment_history_delete = 'employment_history_delete',
  merit_create = 'merit_create',
  merit_read = 'merit_read',
  merit_update = 'merit_update',
  merit_delete = 'merit_delete',
  violation_create = 'violation_create',
  violation_read = 'violation_read',
  violation_update = 'violation_update',
  violation_delete = 'violation_delete',
  admin_case_create = 'admin_case_create',
  admin_case_read = 'admin_case_read',
  admin_case_update = 'admin_case_update',
  admin_case_delete = 'admin_case_delete',
  custom_field_create = 'custom_field_create',
  custom_field_read = 'custom_field_read',
  custom_field_update = 'custom_field_update',
  custom_field_delete = 'custom_field_delete',

  // Requests
  request_create = 'request_create',
  request_read = 'request_read',
  request_update = 'request_update',
  request_delete = 'request_delete',
  leave_request_create = 'leave_request_create',
  leave_request_read = 'leave_request_read',
  leave_request_update = 'leave_request_update',
  leave_request_delete = 'leave_request_delete',
  dtr_adjustment_create = 'dtr_adjustment_create',
  dtr_adjustment_read = 'dtr_adjustment_read',
  dtr_adjustment_update = 'dtr_adjustment_update',
  dtr_adjustment_delete = 'dtr_adjustment_delete',
  certification_request_create = 'certification_request_create',
  certification_request_read = 'certification_request_read',
  certification_request_update = 'certification_request_update',
  certification_request_delete = 'certification_request_delete',

  // Timekeeping & Attendance
  attendance_log_create = 'attendance_log_create',
  attendance_log_read = 'attendance_log_read',
  attendance_log_update = 'attendance_log_update',
  attendance_log_delete = 'attendance_log_delete',
  schedule_create = 'schedule_create',
  schedule_read = 'schedule_read',
  schedule_update = 'schedule_update',
  schedule_delete = 'schedule_delete',
  dtr_report_read = 'dtr_report_read',
  dtr_report_generate = 'dtr_report_generate',

  // Payroll Management
  payroll_record_create = 'payroll_record_create',
  payroll_record_read = 'payroll_record_read',
  payroll_record_update = 'payroll_record_update',
  payroll_record_delete = 'payroll_record_delete',
  salary_adjustment_create = 'salary_adjustment_create',
  salary_adjustment_read = 'salary_adjustment_read',
  salary_adjustment_update = 'salary_adjustment_update',
  salary_adjustment_delete = 'salary_adjustment_delete',
  loan_balance_create = 'loan_balance_create',
  loan_balance_read = 'loan_balance_read',
  loan_balance_update = 'loan_balance_update',
  loan_balance_delete = 'loan_balance_delete',

  // Leave Management
  leave_type_create = 'leave_type_create',
  leave_type_read = 'leave_type_read',
  leave_type_update = 'leave_type_update',
  leave_type_delete = 'leave_type_delete',
  leave_balance_create = 'leave_balance_create',
  leave_balance_read = 'leave_balance_read',
  leave_balance_update = 'leave_balance_update',
  leave_balance_delete = 'leave_balance_delete',
  leave_report_read = 'leave_report_read',
  leave_report_generate = 'leave_report_generate',

  // Recruitment
  applicant_create = 'applicant_create',
  applicant_read = 'applicant_read',
  applicant_update = 'applicant_update',
  applicant_delete = 'applicant_delete',
  job_posting_create = 'job_posting_create',
  job_posting_read = 'job_posting_read',
  job_posting_update = 'job_posting_update',
  job_posting_delete = 'job_posting_delete',
  application_create = 'application_create',
  application_read = 'application_read',
  application_update = 'application_update',
  application_delete = 'application_delete',
  interview_schedule_create = 'interview_schedule_create',
  interview_schedule_read = 'interview_schedule_read',
  interview_schedule_update = 'interview_schedule_update',
  interview_schedule_delete = 'interview_schedule_delete',

  // Performance Module
  performance_review_create = 'performance_review_create',
  performance_review_read = 'performance_review_read',
  performance_review_update = 'performance_review_update',
  performance_review_delete = 'performance_review_delete',
  kpi_create = 'kpi_create',
  kpi_read = 'kpi_read',
  kpi_update = 'kpi_update',
  kpi_delete = 'kpi_delete',
  performance_report_read = 'performance_report_read',
  performance_report_generate = 'performance_report_generate',

  // Report Generation
  report_read = 'report_read',
  report_generate = 'report_generate',
  report_export_read = 'report_export_read',
  report_template_read = 'report_template_read',
  report_template_generate = 'report_template_generate',
  audit_trail_read = 'audit_trail_read',

  // Learning & Development
  training_program_create = 'training_program_create',
  training_program_read = 'training_program_read',
  training_program_update = 'training_program_update',
  training_program_delete = 'training_program_delete',
  training_material_create = 'training_material_create',
  training_material_read = 'training_material_read',
  training_material_update = 'training_material_update',
  training_material_delete = 'training_material_delete',
  training_enrollment_create = 'training_enrollment_create',
  training_enrollment_read = 'training_enrollment_read',
  training_enrollment_update = 'training_enrollment_update',
  training_enrollment_delete = 'training_enrollment_delete',
  training_report_read = 'training_report_read',
  training_report_generate = 'training_report_generate',

  // System Administration
  user_create = 'user_create',
  user_read = 'user_read',
  user_update = 'user_update',
  user_delete = 'user_delete',
  role_create = 'role_create',
  role_read = 'role_read',
  role_update = 'role_update',
  role_delete = 'role_delete',
  permission_create = 'permission_create',
  permission_read = 'permission_read',
  permission_update = 'permission_update',
  permission_delete = 'permission_delete',
  parameter_create = 'parameter_create',
  parameter_read = 'parameter_read',
  parameter_update = 'parameter_update',
  parameter_delete = 'parameter_delete',
  config_create = 'config_create',
  config_read = 'config_read',
  config_update = 'config_update',
  config_delete = 'config_delete',
  audit_log_read = 'audit_log_read',
  delegation_read = 'delegation_read',
  system_login_read = 'system_login_read'
}

export interface PersonnelInfo {
  id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  department?: {
    id: string;
    department_name: string;
  };
  designation?: string;
  employment_type: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  status: string;
  personnel?: PersonnelInfo[];
  roles: string[];
  permissions: Permission[];
  // Helper properties for UI compatibility
  avatar?: string;
  name?: string;
  role?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    refreshToken?: string;
    expiresIn?: string;
    tokenType?: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MenuItem {
  name: string;
  path: string;
  icon: string;
  badge?: string;
  permissions: Permission[];
  children?: MenuItem[];
} 