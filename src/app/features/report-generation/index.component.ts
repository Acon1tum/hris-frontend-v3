import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TemplateManagementComponent } from './template-management/template-management.component';
import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import { ScheduledReportsComponent } from './scheduled-reports/scheduled-reports.component';
import { SensitiveReportsComponent } from './sensitive-reports/sensitive-reports.component';
import { AuditTrailService, AuditTrail } from './audit-trail.service';

// Export libraries
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportFeature {
  name: string;
  description: string;
  icon: string;
  type: ReportType;
}

interface DashboardMetric {
  label: string;
  value: number;
  trend: number;
  icon: string;
  isUpdated?: boolean;
}

interface ModuleActivity {
  module: string;
  activeUsers: number;
  lastActivity: Date;
  status: 'active' | 'inactive' | 'maintenance';
}

interface DepartmentMetric {
  name: string;
  employeeCount: number;
  activeRequests: number;
  completionRate: number;
}

interface RoleDistribution {
  role: string;
  count: number;
  percentage: number;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  department: string;
  lastModified: Date;
  status: 'active' | 'draft' | 'archived';
  type: ReportType;
  layout: {
    sections: string[];
    fields: string[];
    styling: {
      headerColor: string;
      fontFamily: string;
      fontSize: string;
    };
  };
}

interface GlobalLayout {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  lastModified: Date;
  config: {
    headerStyle: string;
    footerStyle: string;
    pageSize: string;
    margins: string;
    fontFamily: string;
    colorScheme: string[];
  };
}

interface ScheduledReport {
  id: string;
  name: string;
  description: string;
  reportType: ReportType;
  department: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  schedule: {
    dayOfWeek?: number; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
    hour: number; // 0-23
    minute: number; // 0-59
    timezone: string;
    customCron?: string;
  };
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv' | 'html';
  template?: string;
  filters?: string[];
  status: 'active' | 'paused' | 'draft';
  lastRun?: Date;
  nextRun: Date;
  createdBy: string;
  createdAt: Date;
  autoDelete: boolean;
  retentionDays: number;
}

interface AlertTrigger {
  id: string;
  name: string;
  description: string;
  type: 'data_missing' | 'threshold_exceeded' | 'anomaly_detected' | 'compliance_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  conditions: {
    field: string;
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'missing' | 'empty';
    value?: any;
    threshold?: number;
  }[];
  scope: 'global' | 'department' | 'role' | 'individual';
  targetDepartment?: string;
  targetRole?: string;
  targetUser?: string;
  notificationChannels: ('email' | 'sms' | 'in_app' | 'webhook')[];
  recipients: string[];
  status: 'active' | 'inactive' | 'draft';
  lastTriggered?: Date;
  triggerCount: number;
  createdBy: string;
  createdAt: Date;
  cooldownMinutes: number;
  autoResolve: boolean;
  resolveConditions?: string[];
}

interface SensitiveReport {
  id: string;
  name: string;
  description: string;
  reportType: ReportType;
  sensitivityLevel: 'low' | 'medium' | 'high' | 'critical';
  category: 'payroll' | 'performance' | 'personal' | 'financial' | 'compliance' | 'audit';
  dataFields: string[];
  retentionPolicy: string;
  encryptionRequired: boolean;
  watermarkEnabled: boolean;
  accessLogging: boolean;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  status: 'active' | 'archived' | 'draft';
}

interface RoleAccess {
  id: string;
  roleName: string;
  roleDescription: string;
  permissions: {
    view: boolean;
    generate: boolean;
    export: boolean;
    print: boolean;
    schedule: boolean;
    share: boolean;
    delete: boolean;
  };
  restrictions: {
    timeRestrictions?: string;
    ipRestrictions?: string[];
    deviceRestrictions?: string[];
    dataMasking?: string[];
  };
  assignedReports: string[];
  assignedBy: string;
  assignedAt: Date;
  expiresAt?: Date;
  status: 'active' | 'expired' | 'revoked';
}

interface AccessRequest {
  id: string;
  requester: string;
  requesterRole: string;
  requesterDepartment: string;
  reportId: string;
  reportName: string;
  requestedPermissions: string[];
  reason: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  requestedAt: Date;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  expiresAt?: Date;
}

interface SavedFilter {
  id: string;
  name: string;
  description: string;
  reportType: string;
  dateStart: string;
  dateEnd: string;
  department: string;
  incomplete: boolean;
  createdBy: string;
  createdAt: Date;
  lastUsed?: Date;
  useCount: number;
  isDefault?: boolean;
}

enum ReportType {
  EMPLOYEE = 'employee',
  PAYROLL = 'payroll',
  ATTENDANCE = 'attendance',
  LEAVE = 'leave',
  PERFORMANCE = 'performance',
  CUSTOM = 'custom'
}

@Component({
  selector: 'app-report-generation',
  standalone: true,
  imports: [CommonModule, FormsModule, TemplateManagementComponent, AuditTrailComponent, ScheduledReportsComponent, SensitiveReportsComponent],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class ReportGenerationComponent implements OnInit, OnDestroy {
  title = 'Report Generation';
  currentView: 'main' | 'templates' | 'audit-trail' | 'scheduled-reports' | 'sensitive-reports' | ReportType = 'main';
  
  // Dashboard Metrics - Refactored to be report-specific
  keyMetrics: DashboardMetric[] = [
    { label: 'Total Reports Generated', value: 0, trend: 0, icon: 'fas fa-chart-bar' },
    { label: 'Active Scheduled Reports', value: 0, trend: 0, icon: 'fas fa-clock' },
    { label: 'Templates Available', value: 0, trend: 0, icon: 'fas fa-file-alt' },
    { label: 'Export Success Rate', value: 0, trend: 0, icon: 'fas fa-download' }
  ];

  // Report-specific module activities
  moduleActivities: (ModuleActivity & { icon: string })[] = [
    { module: 'Employee Reports', activeUsers: 0, lastActivity: new Date(), status: 'active', icon: 'fas fa-users' },
    { module: 'Payroll Reports', activeUsers: 0, lastActivity: new Date(), status: 'active', icon: 'fas fa-money-check-alt' },
    { module: 'Attendance Reports', activeUsers: 0, lastActivity: new Date(), status: 'active', icon: 'fas fa-calendar-check' },
    { module: 'Leave Reports', activeUsers: 0, lastActivity: new Date(), status: 'active', icon: 'fas fa-calendar-alt' },
    { module: 'Performance Reports', activeUsers: 0, lastActivity: new Date(), status: 'active', icon: 'fas fa-chart-line' },
    { module: 'Custom Reports', activeUsers: 0, lastActivity: new Date(), status: 'active', icon: 'fas fa-cogs' }
  ];

  // Report generation statistics by department
  departmentMetrics: (DepartmentMetric & { icon: string })[] = [
    { name: 'Human Resources', employeeCount: 0, activeRequests: 0, completionRate: 0, icon: 'fas fa-user-friends' },
    { name: 'IT Department', employeeCount: 0, activeRequests: 0, completionRate: 0, icon: 'fas fa-laptop-code' },
    { name: 'Finance', employeeCount: 0, activeRequests: 0, completionRate: 0, icon: 'fas fa-coins' },
    { name: 'Operations', employeeCount: 0, activeRequests: 0, completionRate: 0, icon: 'fas fa-cogs' }
  ];

  // Report type distribution
  roleDistribution: (RoleDistribution & { icon: string })[] = [
    { role: 'Employee Reports', count: 0, percentage: 0, icon: 'fas fa-users' },
    { role: 'Payroll Reports', count: 0, percentage: 0, icon: 'fas fa-money-check-alt' },
    { role: 'Attendance Reports', count: 0, percentage: 0, icon: 'fas fa-clock' },
    { role: 'Leave Reports', count: 0, percentage: 0, icon: 'fas fa-calendar-alt' },
    { role: 'Performance Reports', count: 0, percentage: 0, icon: 'fas fa-chart-line' },
    { role: 'Custom Reports', count: 0, percentage: 0, icon: 'fas fa-cogs' }
  ];

  // New properties for tracking report generation statistics
  reportStats = {
    totalGenerated: 0,
    thisMonth: 0,
    lastMonth: 0,
    exportSuccess: 0,
    exportTotal: 0,
    scheduledActive: 0,
    scheduledTotal: 0,
    byReportType: {
      employee: 0,
      payroll: 0,
      attendance: 0,
      leave: 0,
      performance: 0,
      custom: 0
    },
    byDepartment: {
      'Human Resources': 0,
      'IT Department': 0,
      'Finance': 0,
      'Operations': 0
    },
    byRole: {
      'Report Viewer': 0,
      'Report Generator': 0,
      'Report Admin': 0,
      'Sensitive Data Access': 0
    }
  };

  // Report Templates
  reportTemplates: ReportTemplate[] = [
    {
      id: '1',
      name: 'Monthly Employee Summary',
      description: 'Comprehensive monthly employee status report',
      department: 'Human Resources',
      lastModified: new Date(),
      status: 'active',
      type: ReportType.EMPLOYEE,
      layout: {
        sections: ['Personal Info', 'Attendance', 'Performance'],
        fields: ['Employee ID', 'Name', 'Department', 'Position'],
        styling: {
          headerColor: '#0066ff',
          fontFamily: 'Arial',
          fontSize: '12pt'
        }
      }
    },
    {
      id: '2',
      name: 'Payroll Analysis Template',
      description: 'Detailed payroll analysis with trends',
      department: 'Finance',
      lastModified: new Date(),
      status: 'active',
      type: ReportType.PAYROLL,
      layout: {
        sections: ['Salary', 'Deductions', 'Net Pay'],
        fields: ['Employee ID', 'Basic Pay', 'Allowances', 'Deductions'],
        styling: {
          headerColor: '#00875A',
          fontFamily: 'Calibri',
          fontSize: '11pt'
        }
      }
    },
    {
      id: '3',
      name: 'Department Performance Review',
      description: 'Quarterly department performance template',
      department: 'All',
      lastModified: new Date(),
      status: 'draft',
      type: ReportType.PERFORMANCE,
      layout: {
        sections: ['Goals', 'Achievements', 'Areas for Improvement'],
        fields: ['Department', 'KPIs', 'Achievement Rate', 'Comments'],
        styling: {
          headerColor: '#6554C0',
          fontFamily: 'Roboto',
          fontSize: '12pt'
        }
      }
    }
  ];

  // Global Layouts
  globalLayouts: GlobalLayout[] = [
    {
      id: '1',
      name: 'Corporate Standard',
      description: 'Official corporate report layout',
      isDefault: true,
      lastModified: new Date(),
      config: {
        headerStyle: 'Logo + Department Name',
        footerStyle: 'Page Number + Date',
        pageSize: 'A4',
        margins: '2.5cm',
        fontFamily: 'Arial',
        colorScheme: ['#0066ff', '#00875A', '#6554C0']
      }
    },
    {
      id: '2',
      name: 'Executive Summary',
      description: 'Condensed layout for executive reports',
      isDefault: false,
      lastModified: new Date(),
      config: {
        headerStyle: 'Minimal Header',
        footerStyle: 'Company Info',
        pageSize: 'Letter',
        margins: '2cm',
        fontFamily: 'Calibri',
        colorScheme: ['#1F2937', '#4B5563', '#9CA3AF']
      }
    }
  ];

  reportFeatures: ReportFeature[] = [
    { name: 'Employee Reports', description: 'Generate comprehensive employee reports', icon: '👥', type: ReportType.EMPLOYEE },
    { name: 'Payroll Reports', description: 'Salary and compensation analytics', icon: '💰', type: ReportType.PAYROLL },
    { name: 'Attendance Reports', description: 'Time and attendance analytics', icon: '⏰', type: ReportType.ATTENDANCE },
    { name: 'Leave Reports', description: 'Leave utilization and trends', icon: '📅', type: ReportType.LEAVE },
    { name: 'Performance Reports', description: 'Employee performance analytics', icon: '📈', type: ReportType.PERFORMANCE },
    { name: 'Custom Reports', description: 'Create custom reports and dashboards', icon: '🔧', type: ReportType.CUSTOM }
  ];

  selectedFeature: ReportFeature | null = null;
  cardStates: { [key: string]: 'normal' | 'hovered' } = {};
  showTemplateModal = false;
  showLayoutModal = false;
  selectedTemplate: ReportTemplate | null = null;
  selectedLayout: GlobalLayout | null = null;

  // Audit Trail Data - Now empty, will be populated from actual actions
  auditTrails: AuditTrail[] = [];

  // Audit Trail Filters
  auditFilters = {
    dateRange: '',
    department: '',
    action: '',
    status: '',
    reportType: ''
  };

  // Scheduled Reports Data
  scheduledReports: ScheduledReport[] = [
    {
      id: '1',
      name: 'Daily Employee Attendance Summary',
      description: 'Daily summary of employee attendance and late arrivals',
      reportType: ReportType.ATTENDANCE,
      department: 'Human Resources',
      frequency: 'daily',
      schedule: {
        hour: 8,
        minute: 0,
        timezone: 'Asia/Manila'
      },
      recipients: ['hr@company.com', 'managers@company.com'],
      format: 'pdf',
      template: 'Daily Attendance Template',
      filters: ['Status: Active', 'Department: All'],
      status: 'active',
      lastRun: new Date(Date.now() - 86400000),
      nextRun: new Date(Date.now() + 86400000),
      createdBy: 'admin@company.com',
      createdAt: new Date(),
      autoDelete: true,
      retentionDays: 30
    },
    {
      id: '2',
      name: 'Weekly Payroll Summary',
      description: 'Weekly payroll summary for finance review',
      reportType: ReportType.PAYROLL,
      department: 'Finance',
      frequency: 'weekly',
      schedule: {
        dayOfWeek: 5, // Friday
        hour: 17,
        minute: 0,
        timezone: 'Asia/Manila'
      },
      recipients: ['finance@company.com', 'payroll@company.com'],
      format: 'excel',
      template: 'Weekly Payroll Template',
      filters: ['Pay Period: Current Week'],
      status: 'active',
      lastRun: new Date(Date.now() - 604800000),
      nextRun: new Date(Date.now() + 604800000),
      createdBy: 'admin@company.com',
      createdAt: new Date(),
      autoDelete: true,
      retentionDays: 90
    },
    {
      id: '3',
      name: 'Monthly Performance Review',
      description: 'Monthly performance metrics and KPIs',
      reportType: ReportType.PERFORMANCE,
      department: 'All',
      frequency: 'monthly',
      schedule: {
        dayOfMonth: 1,
        hour: 9,
        minute: 0,
        timezone: 'Asia/Manila'
      },
      recipients: ['executives@company.com', 'hr@company.com'],
      format: 'pdf',
      template: 'Monthly Performance Template',
      filters: ['Review Period: Last Month'],
      status: 'paused',
      lastRun: new Date(Date.now() - 2592000000),
      nextRun: new Date(Date.now() + 2592000000),
      createdBy: 'admin@company.com',
      createdAt: new Date(),
      autoDelete: false,
      retentionDays: 365
    }
  ];

  // Alert Triggers Data
  alertTriggers: AlertTrigger[] = [
    {
      id: '1',
      name: 'Missing Employee Data Alert',
      description: 'Alert when employee records are missing required fields',
      type: 'data_missing',
      severity: 'high',
      conditions: [
        {
          field: 'employee_data_completeness',
          operator: 'less_than',
          threshold: 95
        },
        {
          field: 'required_fields',
          operator: 'missing',
          value: ['emergency_contact', 'bank_details', 'tax_info']
        }
      ],
      scope: 'global',
      notificationChannels: ['email', 'in_app'],
      recipients: ['hr@company.com', 'admin@company.com'],
      status: 'active',
      lastTriggered: new Date(Date.now() - 3600000),
      triggerCount: 12,
      createdBy: 'admin@company.com',
      createdAt: new Date(),
      cooldownMinutes: 60,
      autoResolve: true,
      resolveConditions: ['data_completeness >= 95']
    },
    {
      id: '2',
      name: 'Attendance Anomaly Detection',
      description: 'Detect unusual attendance patterns',
      type: 'anomaly_detected',
      severity: 'medium',
      conditions: [
        {
          field: 'late_arrivals',
          operator: 'greater_than',
          threshold: 20
        },
        {
          field: 'absent_days',
          operator: 'greater_than',
          threshold: 3
        }
      ],
      scope: 'department',
      targetDepartment: 'Operations',
      notificationChannels: ['email', 'sms'],
      recipients: ['operations@company.com', 'hr@company.com'],
      status: 'active',
      lastTriggered: new Date(Date.now() - 7200000),
      triggerCount: 5,
      createdBy: 'admin@company.com',
      createdAt: new Date(),
      cooldownMinutes: 120,
      autoResolve: false
    },
    {
      id: '3',
      name: 'Payroll Compliance Alert',
      description: 'Monitor payroll compliance and tax deadlines',
      type: 'compliance_breach',
      severity: 'critical',
      conditions: [
        {
          field: 'tax_filing_deadline',
          operator: 'less_than',
          threshold: 7
        },
        {
          field: 'payroll_accuracy',
          operator: 'less_than',
          threshold: 99.5
        }
      ],
      scope: 'department',
      targetDepartment: 'Finance',
      notificationChannels: ['email', 'sms', 'webhook'],
      recipients: ['finance@company.com', 'compliance@company.com'],
      status: 'active',
      lastTriggered: new Date(Date.now() - 86400000),
      triggerCount: 2,
      createdBy: 'admin@company.com',
      createdAt: new Date(),
      cooldownMinutes: 30,
      autoResolve: false
    }
  ];

  // Modal States
  showScheduledReportModal = false;
  showAlertTriggerModal = false;
  selectedScheduledReport: ScheduledReport | null = null;
  selectedAlertTrigger: AlertTrigger | null = null;

  // RBAC Data
  sensitiveReports: SensitiveReport[] = [
    {
      id: '1',
      name: 'Executive Compensation Report',
      description: 'Detailed compensation analysis for C-level executives',
      reportType: ReportType.PAYROLL,
      sensitivityLevel: 'critical',
      category: 'payroll',
      dataFields: ['salary', 'bonus', 'stock_options', 'benefits', 'tax_info'],
      retentionPolicy: '7 years',
      encryptionRequired: true,
      watermarkEnabled: true,
      accessLogging: true,
      createdBy: 'admin@company.com',
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'active'
    },
    {
      id: '2',
      name: 'Employee Performance Evaluations',
      description: 'Comprehensive performance reviews and ratings',
      reportType: ReportType.PERFORMANCE,
      sensitivityLevel: 'high',
      category: 'performance',
      dataFields: ['performance_rating', 'goals', 'feedback', 'improvement_areas'],
      retentionPolicy: '3 years',
      encryptionRequired: true,
      watermarkEnabled: true,
      accessLogging: true,
      createdBy: 'admin@company.com',
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'active'
    },
    {
      id: '3',
      name: 'Financial Compliance Audit',
      description: 'Internal audit reports for financial compliance',
      reportType: ReportType.CUSTOM,
      sensitivityLevel: 'high',
      category: 'compliance',
      dataFields: ['audit_findings', 'compliance_status', 'risk_assessment', 'recommendations'],
      retentionPolicy: '10 years',
      encryptionRequired: true,
      watermarkEnabled: true,
      accessLogging: true,
      createdBy: 'admin@company.com',
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'active'
    },
    {
      id: '4',
      name: 'Employee Personal Data Export',
      description: 'Complete employee personal information export',
      reportType: ReportType.EMPLOYEE,
      sensitivityLevel: 'critical',
      category: 'personal',
      dataFields: ['ssn', 'address', 'phone', 'emergency_contact', 'medical_info'],
      retentionPolicy: '1 year',
      encryptionRequired: true,
      watermarkEnabled: true,
      accessLogging: true,
      createdBy: 'admin@company.com',
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'active'
    }
  ];

  roleAccess: RoleAccess[] = [
    {
      id: '1',
      roleName: 'HR Manager',
      roleDescription: 'Human Resources department managers',
      permissions: {
        view: true,
        generate: true,
        export: true,
        print: true,
        schedule: true,
        share: false,
        delete: false
      },
      restrictions: {
        timeRestrictions: 'Business hours only',
        ipRestrictions: ['192.168.1.0/24'],
        dataMasking: ['ssn', 'salary']
      },
      assignedReports: ['2', '4'],
      assignedBy: 'admin@company.com',
      assignedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: 'active'
    },
    {
      id: '2',
      roleName: 'Finance Director',
      roleDescription: 'Finance department directors',
      permissions: {
        view: true,
        generate: true,
        export: true,
        print: true,
        schedule: true,
        share: false,
        delete: false
      },
      restrictions: {
        timeRestrictions: 'Business hours only',
        ipRestrictions: ['192.168.2.0/24'],
        dataMasking: ['ssn']
      },
      assignedReports: ['1', '3'],
      assignedBy: 'admin@company.com',
      assignedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: 'active'
    },
    {
      id: '3',
      roleName: 'Department Head',
      roleDescription: 'Department heads and supervisors',
      permissions: {
        view: true,
        generate: false,
        export: false,
        print: true,
        schedule: false,
        share: false,
        delete: false
      },
      restrictions: {
        timeRestrictions: 'Business hours only',
        dataMasking: ['ssn', 'salary', 'bonus']
      },
      assignedReports: ['2'],
      assignedBy: 'admin@company.com',
      assignedAt: new Date(),
      expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      status: 'active'
    }
  ];

  accessRequests: AccessRequest[] = [
    {
      id: '1',
      requester: 'john.manager@company.com',
      requesterRole: 'Department Head',
      requesterDepartment: 'Operations',
      reportId: '2',
      reportName: 'Employee Performance Evaluations',
      requestedPermissions: ['view', 'export'],
      reason: 'Need to review team performance for quarterly planning',
      urgency: 'medium',
      requestedAt: new Date(Date.now() - 86400000),
      status: 'pending'
    },
    {
      id: '2',
      requester: 'sarah.finance@company.com',
      requesterRole: 'Finance Analyst',
      requesterDepartment: 'Finance',
      reportId: '1',
      reportName: 'Executive Compensation Report',
      requestedPermissions: ['view', 'generate'],
      reason: 'Required for annual budget planning and analysis',
      urgency: 'high',
      requestedAt: new Date(Date.now() - 172800000),
      status: 'approved',
      reviewedBy: 'admin@company.com',
      reviewedAt: new Date(Date.now() - 86400000),
      reviewNotes: 'Approved for budget planning purposes',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      requester: 'mike.hr@company.com',
      requesterRole: 'HR Specialist',
      requesterDepartment: 'Human Resources',
      reportId: '4',
      reportName: 'Employee Personal Data Export',
      requestedPermissions: ['view', 'export'],
      reason: 'Required for compliance audit and data verification',
      urgency: 'urgent',
      requestedAt: new Date(Date.now() - 3600000),
      status: 'pending'
    }
  ];

  // RBAC Modal States
  showSensitiveReportModal = false;
  showRoleAccessModal = false;
  showAccessRequestModal = false;
  selectedSensitiveReport: SensitiveReport | null = null;
  selectedRoleAccess: RoleAccess | null = null;
  selectedAccessRequest: AccessRequest | null = null;

  showModulesOverview = false;

  // List of report types
  reportTypes = [
    { value: 'employee', label: 'Employee' },
    { value: 'payroll', label: 'Payroll' },
    { value: 'attendance', label: 'Attendance' },
    { value: 'leave', label: 'Leave' },
    { value: 'performance', label: 'Performance' },
    { value: 'custom', label: 'Custom' }
  ];

  // Modern Apply Filters & Date Range state
  filters = {
    reportType: 'employee',
    dateStart: '',
    dateEnd: '',
    department: '',
    incomplete: false
  };
  filterErrors: string[] = [];
  loadingExport = false;
  showSuccessMessage = false;
  successMessage = '';
  showReportReadyNotification = false;
  reportReadyMessage = '';
  loadingReport = false;

  // Comprehensive dummy data for each report type
  employeeData = [
    { id: 1, name: 'John Doe', department: 'HR', date: '2024-06-01', value: 100, reportType: 'employee', position: 'HR Manager', status: 'Active', salary: 75000 },
    { id: 2, name: 'Jane Smith', department: 'IT', date: '2024-06-02', value: 200, reportType: 'employee', position: 'Senior Developer', status: 'Active', salary: 85000 },
    { id: 3, name: 'Alice Brown', department: 'Finance', date: '2024-06-03', value: 150, reportType: 'employee', position: 'Financial Analyst', status: 'Active', salary: 65000 },
    { id: 4, name: 'Bob Lee', department: 'Operations', date: '2024-06-04', value: 180, reportType: 'employee', position: 'Operations Manager', status: 'Active', salary: 70000 },
    { id: 5, name: 'Carol White', department: 'HR', date: '2024-06-05', value: 120, reportType: 'employee', position: 'HR Specialist', status: 'Active', salary: 55000 },
    { id: 6, name: 'David Black', department: 'IT', date: '2024-06-06', value: 90, reportType: 'employee', position: 'Junior Developer', status: 'Active', salary: 60000 },
  ];

  payrollData = [
    { id: 7, name: 'Eve Green', department: 'Finance', date: '2024-06-07', value: 60, reportType: 'payroll', basicPay: 5000, allowances: 1000, deductions: 500, netPay: 5500 },
    { id: 8, name: 'Frank Blue', department: 'Operations', date: '2024-06-08', value: 70, reportType: 'payroll', basicPay: 6000, allowances: 1200, deductions: 600, netPay: 6600 },
    { id: 9, name: 'Grace Red', department: 'HR', date: '2024-06-09', value: 95, reportType: 'payroll', basicPay: 5500, allowances: 1100, deductions: 550, netPay: 6050 },
    { id: 10, name: 'Hank Yellow', department: 'IT', date: '2024-06-10', value: 88, reportType: 'payroll', basicPay: 7000, allowances: 1400, deductions: 700, netPay: 7700 },
    { id: 11, name: 'Ivy Orange', department: 'Finance', date: '2024-06-11', value: 77, reportType: 'payroll', basicPay: 6500, allowances: 1300, deductions: 650, netPay: 7150 },
    { id: 12, name: 'Jack Purple', department: 'Operations', date: '2024-06-12', value: 66, reportType: 'payroll', basicPay: 5800, allowances: 1160, deductions: 580, netPay: 6380 },
  ];

  attendanceData = [
    { id: 13, name: 'Kate Wilson', department: 'HR', date: '2024-06-13', value: 120, reportType: 'attendance', timeIn: '08:00', timeOut: '17:00', hoursWorked: 8, status: 'Present' },
    { id: 14, name: 'Liam Davis', department: 'IT', date: '2024-06-14', value: 90, reportType: 'attendance', timeIn: '08:15', timeOut: '17:15', hoursWorked: 8, status: 'Present' },
    { id: 15, name: 'Mia Johnson', department: 'Finance', date: '2024-06-15', value: 150, reportType: 'attendance', timeIn: '08:30', timeOut: '17:30', hoursWorked: 8, status: 'Present' },
    { id: 16, name: 'Noah Brown', department: 'Operations', date: '2024-06-16', value: 180, reportType: 'attendance', timeIn: '08:45', timeOut: '17:45', hoursWorked: 8, status: 'Present' },
    { id: 17, name: 'Olivia Garcia', department: 'HR', date: '2024-06-17', value: 110, reportType: 'attendance', timeIn: '09:00', timeOut: '18:00', hoursWorked: 8, status: 'Late' },
    { id: 18, name: 'Paul Martinez', department: 'IT', date: '2024-06-18', value: 85, reportType: 'attendance', timeIn: '08:00', timeOut: '16:00', hoursWorked: 7, status: 'Early Out' },
  ];

  leaveData = [
    { id: 19, name: 'Quinn Rodriguez', department: 'Finance', date: '2024-06-19', value: 60, reportType: 'leave', leaveType: 'Vacation', startDate: '2024-06-19', endDate: '2024-06-21', days: 3, status: 'Approved' },
    { id: 20, name: 'Ruby Taylor', department: 'Operations', date: '2024-06-20', value: 70, reportType: 'leave', leaveType: 'Sick Leave', startDate: '2024-06-20', endDate: '2024-06-20', days: 1, status: 'Approved' },
    { id: 21, name: 'Sam Anderson', department: 'HR', date: '2024-06-21', value: 95, reportType: 'leave', leaveType: 'Personal Leave', startDate: '2024-06-21', endDate: '2024-06-21', days: 1, status: 'Pending' },
    { id: 22, name: 'Tina Thomas', department: 'IT', date: '2024-06-22', value: 88, reportType: 'leave', leaveType: 'Maternity Leave', startDate: '2024-06-22', endDate: '2024-09-22', days: 90, status: 'Approved' },
    { id: 23, name: 'Uma Jackson', department: 'Finance', date: '2024-06-23', value: 77, reportType: 'leave', leaveType: 'Vacation', startDate: '2024-06-23', endDate: '2024-06-25', days: 3, status: 'Approved' },
    { id: 24, name: 'Victor White', department: 'Operations', date: '2024-06-24', value: 66, reportType: 'leave', leaveType: 'Sick Leave', startDate: '2024-06-24', endDate: '2024-06-24', days: 1, status: 'Approved' },
  ];

  performanceData = [
    { id: 25, name: 'Wendy Harris', department: 'HR', date: '2024-06-25', value: 95, reportType: 'performance', rating: 4.5, goals: 8, achievements: 7, status: 'Excellent' },
    { id: 26, name: 'Xander Clark', department: 'IT', date: '2024-06-26', value: 88, reportType: 'performance', rating: 4.2, goals: 7, achievements: 6, status: 'Good' },
    { id: 27, name: 'Yara Lewis', department: 'Finance', date: '2024-06-27', value: 92, reportType: 'performance', rating: 4.8, goals: 9, achievements: 8, status: 'Excellent' },
    { id: 28, name: 'Zoe Walker', department: 'Operations', date: '2024-06-28', value: 85, reportType: 'performance', rating: 4.0, goals: 6, achievements: 5, status: 'Good' },
    { id: 29, name: 'Adam Hall', department: 'HR', date: '2024-06-29', value: 78, reportType: 'performance', rating: 3.8, goals: 5, achievements: 4, status: 'Satisfactory' },
    { id: 30, name: 'Bella Young', department: 'IT', date: '2024-06-30', value: 82, reportType: 'performance', rating: 4.1, goals: 7, achievements: 6, status: 'Good' },
  ];

  customData = [
    { id: 31, name: 'Charlie King', department: 'Finance', date: '2024-07-01', value: 77, reportType: 'custom', category: 'Training', subcategory: 'Technical Skills', metric: 'Completion Rate' },
    { id: 32, name: 'Diana Wright', department: 'Operations', date: '2024-07-02', value: 66, reportType: 'custom', category: 'Projects', subcategory: 'Implementation', metric: 'Success Rate' },
    { id: 33, name: 'Ethan Lopez', department: 'HR', date: '2024-07-03', value: 89, reportType: 'custom', category: 'Compliance', subcategory: 'Audit', metric: 'Compliance Score' },
    { id: 34, name: 'Fiona Hill', department: 'IT', date: '2024-07-04', value: 94, reportType: 'custom', category: 'Innovation', subcategory: 'R&D', metric: 'Innovation Index' },
    { id: 35, name: 'George Scott', department: 'Finance', date: '2024-07-05', value: 71, reportType: 'custom', category: 'Efficiency', subcategory: 'Process', metric: 'Efficiency Rate' },
    { id: 36, name: 'Hannah Green', department: 'Operations', date: '2024-07-06', value: 83, reportType: 'custom', category: 'Quality', subcategory: 'Standards', metric: 'Quality Score' },
  ];

  // Combined all results
  allResults = [
    ...this.employeeData,
    ...this.payrollData,
    ...this.attendanceData,
    ...this.leaveData,
    ...this.performanceData,
    ...this.customData
  ];

  filteredResults: any[] = [];

  // Saved Filters functionality
  savedFilters: SavedFilter[] = [
    {
      id: '1',
      name: 'Monthly Employee Report',
      description: 'Standard monthly employee report for HR',
      reportType: 'employee',
      dateStart: '2024-06-01',
      dateEnd: '2024-06-30',
      department: 'HR',
      incomplete: false,
      createdBy: 'admin@company.com',
      createdAt: new Date(Date.now() - 86400000),
      lastUsed: new Date(Date.now() - 3600000),
      useCount: 5,
      isDefault: true
    },
    {
      id: '2',
      name: 'Weekly Payroll Summary',
      description: 'Weekly payroll report for finance team',
      reportType: 'payroll',
      dateStart: '2024-06-24',
      dateEnd: '2024-06-30',
      department: 'Finance',
      incomplete: false,
      createdBy: 'admin@company.com',
      createdAt: new Date(Date.now() - 172800000),
      lastUsed: new Date(Date.now() - 7200000),
      useCount: 3
    },
    {
      id: '3',
      name: 'Daily Attendance Report',
      description: 'Daily attendance monitoring',
      reportType: 'attendance',
      dateStart: '2024-06-30',
      dateEnd: '2024-06-30',
      department: '',
      incomplete: false,
      createdBy: 'admin@company.com',
      createdAt: new Date(Date.now() - 3600000),
      lastUsed: new Date(Date.now() - 1800000),
      useCount: 1
    }
  ];

  showSaveFilterModal = false;
  showLoadFilterModal = false;
  selectedSavedFilter: SavedFilter | null = null;
  newFilterName = '';
  newFilterDescription = '';

  // Enhanced properties for real-time dashboard tracking
  dashboardUpdateHistory: {
    totalReports: number[];
    exportSuccess: number[];
    scheduledReports: number[];
    templates: number[];
    lastUpdate: Date;
  } = {
    totalReports: [],
    exportSuccess: [],
    scheduledReports: [],
    templates: [],
    lastUpdate: new Date()
  };

  // Real-time action tracking
  actionTracker = {
    reportsGenerated: 0,
    exportsAttempted: 0,
    exportsSuccessful: 0,
    printsAttempted: 0,
    printsSuccessful: 0,
    templatesCreated: 0,
    templatesModified: 0,
    scheduledReportsCreated: 0,
    scheduledReportsActivated: 0,
    lastAction: null as string | null,
    lastActionTime: null as Date | null
  };

  // Control visibility of real-time indicator
  showRealtimeIndicator = false;
  private indicatorTimeout: any = null;

  // Performance tracking for trends
  performanceMetrics = {
    dailyReports: 0,
    weeklyReports: 0,
    monthlyReports: 0,
    exportSuccessRate: 98.5,
    averageReportSize: 0,
    mostUsedReportType: 'employee',
    peakUsageTime: '09:00',
    departmentUsage: {} as { [key: string]: number }
  };

  // Performance insights auto-hide properties
  showPerformanceInsights = true;
  private performanceInsightsTimeout: any = null;

  constructor(private auditTrailService: AuditTrailService) {
    // Initialize card states
    this.reportFeatures.forEach(feature => {
      this.cardStates[feature.type] = 'normal';
    });
  }

  ngOnInit(): void {
    // Initialize audit trails
    this.auditTrails = this.auditTrailService.getAuditTrails();
    
    // Calculate initial dashboard metrics
    this.calculateDashboardMetrics();
    
    // Subscribe to audit trail updates
    this.auditTrailService.auditTrails$.subscribe(trails => {
      this.auditTrails = trails;
      this.calculateDashboardMetrics();
    });
  }

  ngOnDestroy(): void {
    // Clean up timeout to prevent memory leaks
    if (this.indicatorTimeout) {
      clearTimeout(this.indicatorTimeout);
    }
    if (this.performanceInsightsTimeout) {
      clearTimeout(this.performanceInsightsTimeout);
    }
  }

  // Method to manually hide the real-time indicator
  hideRealtimeIndicator() {
    // Clear the timeout if it exists
    if (this.indicatorTimeout) {
      clearTimeout(this.indicatorTimeout);
      this.indicatorTimeout = null;
    }
    
    // Hide the indicator immediately
    this.showRealtimeIndicator = false;
  }

  // Method to calculate dashboard metrics based on actual data
  calculateDashboardMetrics() {
    // Calculate total reports generated from audit trails
    const totalReports = this.auditTrails.length;
    
    // Calculate active scheduled reports
    const activeScheduledReports = this.scheduledReports.filter(report => report.status === 'active').length;
    
    // Calculate templates available
    const templatesAvailable = this.reportTemplates.filter(template => template.status === 'active').length;
    
    // Calculate export success rate from audit trails
    const exportAttempts = this.auditTrails.filter(audit => 
      audit.action === 'exported' || audit.action === 'printed'
    ).length;
    const successfulExports = this.auditTrails.filter(audit => 
      (audit.action === 'exported' || audit.action === 'printed') && audit.status === 'success'
    ).length;
    const exportSuccessRate = exportAttempts > 0 ? Math.round((successfulExports / exportAttempts) * 100) : 98.5;
    
    // Calculate trends based on historical data or simulate realistic trends
    const totalReportsTrend = totalReports > 0 ? Math.round((Math.random() * 20) + 5) : 0; // 5-25% growth
    const scheduledReportsTrend = activeScheduledReports > 0 ? Math.round((Math.random() * 15) - 5) : 0; // -5 to 10%
    const templatesTrend = templatesAvailable > 0 ? Math.round((Math.random() * 10) - 2) : 0; // -2 to 8%
    const exportRateTrend = exportSuccessRate > 95 ? Math.round((Math.random() * 3) + 1) : Math.round((Math.random() * 5) - 2); // 1-4% or -2 to 3%
    
    // Update key metrics with more realistic data
    this.keyMetrics = [
      { 
        label: 'Total Reports Generated', 
        value: totalReports, 
        trend: totalReportsTrend,
        icon: 'fas fa-chart-bar' 
      },
      { 
        label: 'Active Scheduled Reports', 
        value: activeScheduledReports, 
        trend: scheduledReportsTrend,
        icon: 'fas fa-clock' 
      },
      { 
        label: 'Templates Available', 
        value: templatesAvailable, 
        trend: templatesTrend,
        icon: 'fas fa-file-alt' 
      },
      { 
        label: 'Export Success Rate', 
        value: exportSuccessRate, 
        trend: exportRateTrend,
        icon: 'fas fa-download' 
      }
    ];

    // Calculate report type distribution
    this.calculateReportTypeDistribution();
    
    // Calculate department metrics
    this.calculateDepartmentMetrics();
    
    // Calculate module activities
    this.calculateModuleActivities();
    
    // Show visual update animation
    setTimeout(() => {
      this.showMetricsUpdated();
    }, 100);
  }

  // Calculate report type distribution
  calculateReportTypeDistribution() {
    const reportTypeCounts = {
      employee: 0,
      payroll: 0,
      attendance: 0,
      leave: 0,
      performance: 0,
      custom: 0
    };

    // Count reports by type from audit trails
    this.auditTrails.forEach(audit => {
      switch (audit.reportType) {
        case ReportType.EMPLOYEE:
          reportTypeCounts.employee++;
          break;
        case ReportType.PAYROLL:
          reportTypeCounts.payroll++;
          break;
        case ReportType.ATTENDANCE:
          reportTypeCounts.attendance++;
          break;
        case ReportType.LEAVE:
          reportTypeCounts.leave++;
          break;
        case ReportType.PERFORMANCE:
          reportTypeCounts.performance++;
          break;
        case ReportType.CUSTOM:
          reportTypeCounts.custom++;
          break;
      }
    });

    const totalReports = Object.values(reportTypeCounts).reduce((sum, count) => sum + count, 0);

    this.roleDistribution = [
      { 
        role: 'Employee Reports', 
        count: reportTypeCounts.employee, 
        percentage: totalReports > 0 ? Math.round((reportTypeCounts.employee / totalReports) * 100) : 0, 
        icon: 'fas fa-users' 
      },
      { 
        role: 'Payroll Reports', 
        count: reportTypeCounts.payroll, 
        percentage: totalReports > 0 ? Math.round((reportTypeCounts.payroll / totalReports) * 100) : 0, 
        icon: 'fas fa-money-check-alt' 
      },
      { 
        role: 'Attendance Reports', 
        count: reportTypeCounts.attendance, 
        percentage: totalReports > 0 ? Math.round((reportTypeCounts.attendance / totalReports) * 100) : 0, 
        icon: 'fas fa-clock' 
      },
      { 
        role: 'Leave Reports', 
        count: reportTypeCounts.leave, 
        percentage: totalReports > 0 ? Math.round((reportTypeCounts.leave / totalReports) * 100) : 0, 
        icon: 'fas fa-calendar-alt' 
      },
      { 
        role: 'Performance Reports', 
        count: reportTypeCounts.performance, 
        percentage: totalReports > 0 ? Math.round((reportTypeCounts.performance / totalReports) * 100) : 0, 
        icon: 'fas fa-chart-line' 
      },
      { 
        role: 'Custom Reports', 
        count: reportTypeCounts.custom, 
        percentage: totalReports > 0 ? Math.round((reportTypeCounts.custom / totalReports) * 100) : 0, 
        icon: 'fas fa-cogs' 
      }
    ];
  }

  // Calculate department metrics based on report generation
  calculateDepartmentMetrics() {
    const departmentStats: { [key: string]: { reports: number; employees: number; requests: number } } = {
      'Human Resources': { reports: 0, employees: 25, requests: 0 },
      'IT Department': { reports: 0, employees: 45, requests: 0 },
      'Finance': { reports: 0, employees: 30, requests: 0 },
      'Operations': { reports: 0, employees: 150, requests: 0 }
    };

    // Count reports by department from audit trails
    this.auditTrails.forEach(audit => {
      if (departmentStats[audit.department]) {
        departmentStats[audit.department].reports++;
      }
    });

    // Calculate completion rates (simulated based on report generation)
    this.departmentMetrics = [
      { 
        name: 'Human Resources', 
        employeeCount: departmentStats['Human Resources'].employees, 
        activeRequests: departmentStats['Human Resources'].requests, 
        completionRate: Math.min(95, 70 + (departmentStats['Human Resources'].reports * 5)), 
        icon: 'fas fa-user-friends' 
      },
      { 
        name: 'IT Department', 
        employeeCount: departmentStats['IT Department'].employees, 
        activeRequests: departmentStats['IT Department'].requests, 
        completionRate: Math.min(95, 75 + (departmentStats['IT Department'].reports * 4)), 
        icon: 'fas fa-laptop-code' 
      },
      { 
        name: 'Finance', 
        employeeCount: departmentStats['Finance'].employees, 
        activeRequests: departmentStats['Finance'].requests, 
        completionRate: Math.min(95, 80 + (departmentStats['Finance'].reports * 3)), 
        icon: 'fas fa-coins' 
      },
      { 
        name: 'Operations', 
        employeeCount: departmentStats['Operations'].employees, 
        activeRequests: departmentStats['Operations'].requests, 
        completionRate: Math.min(95, 65 + (departmentStats['Operations'].reports * 6)), 
        icon: 'fas fa-cogs' 
      }
    ];
  }

  // Calculate module activities based on report generation
  calculateModuleActivities() {
    const moduleStats: { [key: string]: { reports: number; lastActivity: Date } } = {
      'Employee Reports': { reports: 0, lastActivity: new Date() },
      'Payroll Reports': { reports: 0, lastActivity: new Date() },
      'Attendance Reports': { reports: 0, lastActivity: new Date() },
      'Leave Reports': { reports: 0, lastActivity: new Date() },
      'Performance Reports': { reports: 0, lastActivity: new Date() },
      'Custom Reports': { reports: 0, lastActivity: new Date() }
    };

    // Count reports by type and get latest activity
    this.auditTrails.forEach(audit => {
      let moduleName = '';
      switch (audit.reportType) {
        case ReportType.EMPLOYEE:
          moduleName = 'Employee Reports';
          break;
        case ReportType.PAYROLL:
          moduleName = 'Payroll Reports';
          break;
        case ReportType.ATTENDANCE:
          moduleName = 'Attendance Reports';
          break;
        case ReportType.LEAVE:
          moduleName = 'Leave Reports';
          break;
        case ReportType.PERFORMANCE:
          moduleName = 'Performance Reports';
          break;
        case ReportType.CUSTOM:
          moduleName = 'Custom Reports';
          break;
      }
      
      if (moduleStats[moduleName]) {
        moduleStats[moduleName].reports++;
        if (audit.generatedAt > moduleStats[moduleName].lastActivity) {
          moduleStats[moduleName].lastActivity = audit.generatedAt;
        }
      }
    });

    this.moduleActivities = [
      { 
        module: 'Employee Reports', 
        activeUsers: Math.min(45, 10 + moduleStats['Employee Reports'].reports), 
        lastActivity: moduleStats['Employee Reports'].lastActivity, 
        status: moduleStats['Employee Reports'].reports > 0 ? 'active' : 'inactive', 
        icon: 'fas fa-users' 
      },
      { 
        module: 'Payroll Reports', 
        activeUsers: Math.min(12, 5 + moduleStats['Payroll Reports'].reports), 
        lastActivity: moduleStats['Payroll Reports'].lastActivity, 
        status: moduleStats['Payroll Reports'].reports > 0 ? 'active' : 'inactive', 
        icon: 'fas fa-money-check-alt' 
      },
      { 
        module: 'Attendance Reports', 
        activeUsers: Math.min(89, 20 + moduleStats['Attendance Reports'].reports), 
        lastActivity: moduleStats['Attendance Reports'].lastActivity, 
        status: moduleStats['Attendance Reports'].reports > 0 ? 'active' : 'inactive', 
        icon: 'fas fa-calendar-check' 
      },
      { 
        module: 'Leave Reports', 
        activeUsers: Math.min(34, 8 + moduleStats['Leave Reports'].reports), 
        lastActivity: moduleStats['Leave Reports'].lastActivity, 
        status: moduleStats['Leave Reports'].reports > 0 ? 'active' : 'inactive', 
        icon: 'fas fa-calendar-alt' 
      },
      { 
        module: 'Performance Reports', 
        activeUsers: Math.min(23, 6 + moduleStats['Performance Reports'].reports), 
        lastActivity: moduleStats['Performance Reports'].lastActivity, 
        status: moduleStats['Performance Reports'].reports > 0 ? 'active' : 'maintenance', 
        icon: 'fas fa-chart-line' 
      },
      { 
        module: 'Custom Reports', 
        activeUsers: Math.min(15, 3 + moduleStats['Custom Reports'].reports), 
        lastActivity: moduleStats['Custom Reports'].lastActivity, 
        status: moduleStats['Custom Reports'].reports > 0 ? 'active' : 'inactive', 
        icon: 'fas fa-cogs' 
      }
    ];
  }

  // Method to update metrics when a report is generated
  updateMetricsOnReportGeneration(reportType: ReportType, department: string) {
    // Update audit trails (this will be called from createAuditTrailEntry)
    this.calculateDashboardMetrics();
  }

  // Method to demonstrate real-time dashboard updates
  demonstrateDashboardUpdate() {
    // Add a sample audit trail entry to show real-time updates
    const sampleAuditEntry: AuditTrail = {
      id: Date.now().toString(),
      reportName: 'Demo Report - ' + new Date().toLocaleTimeString(),
      reportType: ReportType.CUSTOM,
      generatedBy: 'demo.user@company.com',
      generatedAt: new Date(),
      department: 'Demo Department',
      action: 'generated',
      fileSize: '1.2 KB',
      downloadCount: 0,
      status: 'success',
      ipAddress: '192.168.1.105',
      userAgent: navigator.userAgent,
      filters: ['Report Type: Custom', 'Date Range: Demo', 'Department: Demo Department'],
      templateUsed: 'Demo Report Template',
      exportFormat: 'pdf',
      reportData: { headers: [], rows: [], totalRecords: 10, totalValue: 500 },
      reportMetadata: { dateRange: 'Demo', department: 'Demo Department', reportType: 'Custom', appliedFilters: [] }
    };

    // Add to audit trails
    this.auditTrails.unshift(sampleAuditEntry);
    
    // Update dashboard metrics
    this.calculateDashboardMetrics();
    
    // Show success message
    this.showSuccess('Dashboard updated with demo data!');
  }

  // Method to show when metrics are updated
  showMetricsUpdated() {
    // Add a visual indicator that metrics have been updated
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach((card, index) => {
      card.classList.add('metrics-updated');
      setTimeout(() => {
        card.classList.remove('metrics-updated');
      }, 1000 + (index * 200));
    });
  }

  onCardHover(type: ReportType, isHovered: boolean) {
    this.cardStates[type] = isHovered ? 'hovered' : 'normal';
  }

  navigateToReport(feature: ReportFeature) {
    this.selectedFeature = feature;
    this.currentView = feature.type;
  }

  goBack() {
    this.currentView = 'main';
    this.selectedFeature = null;
  }

  // Template Management Methods
  createTemplate() {
    this.showTemplateModal = true;
    this.selectedTemplate = null;
  }

  editTemplate(template: ReportTemplate) {
    this.showTemplateModal = true;
    this.selectedTemplate = template;
  }

  deleteTemplate(templateId: string) {
    // Add confirmation dialog and deletion logic
    this.reportTemplates = this.reportTemplates.filter(t => t.id !== templateId);
  }

  // Layout Management Methods
  createLayout() {
    this.showLayoutModal = true;
    this.selectedLayout = null;
  }

  editLayout(layout: GlobalLayout) {
    this.showLayoutModal = true;
    this.selectedLayout = layout;
  }

  deleteLayout(layoutId: string) {
    // Add confirmation dialog and deletion logic
    this.globalLayouts = this.globalLayouts.filter(l => l.id !== layoutId);
  }

  setDefaultLayout(layoutId: string) {
    this.globalLayouts = this.globalLayouts.map(l => ({
      ...l,
      isDefault: l.id === layoutId
    }));
  }

  // Audit Trail Methods
  deleteAuditTrail(auditId: string) {
    // Add confirmation dialog and deletion logic
    this.auditTrails = this.auditTrails.filter(a => a.id !== auditId);
  }

  exportAuditTrail() {
    // Implementation for exporting audit trail data
    console.log('Exporting audit trail...');
  }

  clearAuditTrail() {
    // Add confirmation dialog and clear all audit trails
    if (confirm('Are you sure you want to clear all audit trails? This action cannot be undone.')) {
      this.auditTrails = [];
    }
  }

  filterAuditTrails() {
    // Implementation for filtering audit trails based on auditFilters
    console.log('Filtering audit trails...', this.auditFilters);
  }

  getActionIcon(action: string): string {
    switch (action) {
      case 'generated': return 'fas fa-file-plus';
      case 'exported': return 'fas fa-download';
      case 'printed': return 'fas fa-print';
      case 'deleted': return 'fas fa-trash';
      case 'modified': return 'fas fa-edit';
      default: return 'fas fa-file';
    }
  }

  getActionColor(action: string): string {
    switch (action) {
      case 'generated': return 'var(--success-color)';
      case 'exported': return 'var(--primary-color)';
      case 'printed': return 'var(--warning-color)';
      case 'deleted': return 'var(--danger-color)';
      case 'modified': return 'var(--secondary-color)';
      default: return 'var(--text-secondary)';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'success': return 'fas fa-check-circle';
      case 'failed': return 'fas fa-times-circle';
      case 'pending': return 'fas fa-clock';
      default: return 'fas fa-question-circle';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'var(--success-color)';
      case 'inactive': return 'var(--warning-color)';
      case 'maintenance': return 'var(--danger-color)';
      case 'pending': return 'var(--warning-color)';
      case 'approved': return 'var(--success-color)';
      case 'denied': return 'var(--danger-color)';
      case 'expired': return 'var(--text-secondary)';
      case 'revoked': return 'var(--danger-color)';
      default: return 'var(--text-secondary)';
    }
  }

  formatFileSize(bytes: string): string {
    return bytes; // Already formatted in the data
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }

  getReportContent(): any {
    if (!this.selectedFeature) return null;

    switch (this.selectedFeature.type) {
      case ReportType.EMPLOYEE:
        return {
          fields: ['Employee ID', 'Name', 'Department', 'Position', 'Status'],
          filters: ['Department', 'Status', 'Date Range']
        };
      case ReportType.PAYROLL:
        return {
          fields: ['Employee ID', 'Name', 'Basic Pay', 'Allowances', 'Deductions', 'Net Pay'],
          filters: ['Pay Period', 'Department']
        };
      case ReportType.ATTENDANCE:
        return {
          fields: ['Employee ID', 'Name', 'Date', 'Time In', 'Time Out', 'Status'],
          filters: ['Date Range', 'Department', 'Status']
        };
      case ReportType.LEAVE:
        return {
          fields: ['Employee ID', 'Name', 'Leave Type', 'Start Date', 'End Date', 'Status'],
          filters: ['Leave Type', 'Status', 'Date Range']
        };
      case ReportType.PERFORMANCE:
        return {
          fields: ['Employee ID', 'Name', 'Review Period', 'Rating', 'Comments'],
          filters: ['Review Period', 'Department', 'Rating']
        };
      case ReportType.CUSTOM:
        return {
          fields: ['Select Fields...'],
          filters: ['Add Filters...']
        };
      default:
        return null;
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleString();
  }

  getTrendIcon(trend: number): string {
    if (trend > 0) return 'fas fa-arrow-up text-success';
    if (trend < 0) return 'fas fa-arrow-down text-danger';
    return 'fas fa-minus text-secondary';
  }

  getTemplateStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'var(--success-color)';
      case 'draft': return 'var(--warning-color)';
      case 'archived': return 'var(--text-secondary)';
      default: return 'var(--text-secondary)';
    }
  }

  // Scheduled Report Methods
  createScheduledReport() {
    this.showScheduledReportModal = true;
    this.selectedScheduledReport = null;
  }

  editScheduledReport(report: ScheduledReport) {
    this.showScheduledReportModal = true;
    this.selectedScheduledReport = report;
  }

  deleteScheduledReport(reportId: string) {
    if (confirm('Are you sure you want to delete this scheduled report?')) {
      this.scheduledReports = this.scheduledReports.filter(r => r.id !== reportId);
    }
  }

  toggleScheduledReportStatus(report: ScheduledReport) {
    report.status = report.status === 'active' ? 'paused' : 'active';
  }

  runScheduledReportNow(report: ScheduledReport) {
    // Implementation for running report immediately
    console.log('Running scheduled report now:', report.name);
  }

  // Alert Trigger Methods
  createAlertTrigger() {
    this.showAlertTriggerModal = true;
    this.selectedAlertTrigger = null;
  }

  editAlertTrigger(trigger: AlertTrigger) {
    this.showAlertTriggerModal = true;
    this.selectedAlertTrigger = trigger;
  }

  deleteAlertTrigger(triggerId: string) {
    if (confirm('Are you sure you want to delete this alert trigger?')) {
      this.alertTriggers = this.alertTriggers.filter(t => t.id !== triggerId);
    }
  }

  toggleAlertTriggerStatus(trigger: AlertTrigger) {
    trigger.status = trigger.status === 'active' ? 'inactive' : 'active';
  }

  testAlertTrigger(trigger: AlertTrigger) {
    // Implementation for testing alert trigger
    console.log('Testing alert trigger:', trigger.name);
  }

  // Utility Methods
  getFrequencyLabel(frequency: string): string {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      case 'yearly': return 'Yearly';
      case 'custom': return 'Custom';
      default: return frequency;
    }
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'low': return 'var(--success-color)';
      case 'medium': return 'var(--warning-color)';
      case 'high': return 'var(--danger-color)';
      case 'critical': return '#dc2626';
      default: return 'var(--text-secondary)';
    }
  }

  getAlertTypeIcon(type: string): string {
    switch (type) {
      case 'data_missing': return 'fas fa-exclamation-triangle';
      case 'threshold_exceeded': return 'fas fa-chart-line';
      case 'anomaly_detected': return 'fas fa-radar';
      case 'compliance_breach': return 'fas fa-shield-alt';
      default: return 'fas fa-bell';
    }
  }

  getFormatIcon(format: string): string {
    switch (format) {
      case 'pdf': return 'fas fa-file-pdf';
      case 'excel': return 'fas fa-file-excel';
      case 'csv': return 'fas fa-file-csv';
      case 'html': return 'fas fa-file-code';
      default: return 'fas fa-file';
    }
  }

  getNotificationChannelsText(channels: string[]): string {
    return channels.map(channel => {
      switch (channel) {
        case 'email': return 'Email';
        case 'sms': return 'SMS';
        case 'in_app': return 'In-App';
        case 'webhook': return 'Webhook';
        default: return channel;
      }
    }).join(', ');
  }

  // RBAC Methods
  createSensitiveReport() {
    this.showSensitiveReportModal = true;
    this.selectedSensitiveReport = null;
  }

  editSensitiveReport(report: SensitiveReport) {
    this.showSensitiveReportModal = true;
    this.selectedSensitiveReport = report;
  }

  deleteSensitiveReport(reportId: string) {
    if (confirm('Are you sure you want to delete this sensitive report? This action cannot be undone.')) {
      this.sensitiveReports = this.sensitiveReports.filter(r => r.id !== reportId);
    }
  }

  createRoleAccess() {
    this.showRoleAccessModal = true;
    this.selectedRoleAccess = null;
  }

  editRoleAccess(role: RoleAccess) {
    this.showRoleAccessModal = true;
    this.selectedRoleAccess = role;
  }

  deleteRoleAccess(roleId: string) {
    if (confirm('Are you sure you want to delete this role access configuration?')) {
      this.roleAccess = this.roleAccess.filter(r => r.id !== roleId);
    }
  }

  revokeRoleAccess(role: RoleAccess) {
    role.status = 'revoked';
  }

  approveAccessRequest(request: AccessRequest) {
    request.status = 'approved';
    request.reviewedBy = 'admin@company.com';
    request.reviewedAt = new Date();
    request.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  }

  denyAccessRequest(request: AccessRequest) {
    request.status = 'denied';
    request.reviewedBy = 'admin@company.com';
    request.reviewedAt = new Date();
  }

  viewAccessRequest(request: AccessRequest) {
    this.showAccessRequestModal = true;
    this.selectedAccessRequest = request;
  }

  // Utility Methods for RBAC
  getSensitivityColor(level: string): string {
    switch (level) {
      case 'low': return 'var(--success-color)';
      case 'medium': return 'var(--warning-color)';
      case 'high': return 'var(--danger-color)';
      case 'critical': return '#dc2626';
      default: return 'var(--text-secondary)';
    }
  }

  getSensitivityIcon(level: string): string {
    switch (level) {
      case 'low': return 'fas fa-shield-alt';
      case 'medium': return 'fas fa-shield';
      case 'high': return 'fas fa-lock';
      case 'critical': return 'fas fa-lock';
      default: return 'fas fa-file';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'payroll': return 'fas fa-dollar-sign';
      case 'performance': return 'fas fa-chart-line';
      case 'personal': return 'fas fa-user-shield';
      case 'financial': return 'fas fa-chart-pie';
      case 'compliance': return 'fas fa-clipboard-check';
      case 'audit': return 'fas fa-search';
      default: return 'fas fa-file';
    }
  }

  getUrgencyColor(urgency: string): string {
    switch (urgency) {
      case 'low': return 'var(--success-color)';
      case 'medium': return 'var(--warning-color)';
      case 'high': return 'var(--danger-color)';
      case 'urgent': return '#dc2626';
      default: return 'var(--text-secondary)';
    }
  }

  getPermissionsText(permissions: any): string {
    const activePermissions = Object.keys(permissions).filter(key => permissions[key]);
    return activePermissions.map(perm => perm.charAt(0).toUpperCase() + perm.slice(1)).join(', ');
  }

  getRestrictionsText(restrictions: any): string {
    const restrictionsList = [];
    if (restrictions.timeRestrictions) restrictionsList.push('Time: ' + restrictions.timeRestrictions);
    if (restrictions.ipRestrictions) restrictionsList.push('IP: ' + restrictions.ipRestrictions.length + ' ranges');
    if (restrictions.dataMasking) restrictionsList.push('Masking: ' + restrictions.dataMasking.length + ' fields');
    return restrictionsList.join(' | ');
  }

  // Navigation Methods
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  }

  openModulesOverview() {
    this.showModulesOverview = true;
  }

  closeModulesOverview() {
    this.showModulesOverview = false;
  }

  // Add method to toggle views
  toggleView(view: 'main' | 'templates' | 'audit-trail' | 'scheduled-reports' | 'sensitive-reports' | ReportType) {
    this.currentView = view;
  }

  onApplyFilters() {
    this.filterErrors = [];
    if (!this.filters.dateStart) this.filterErrors.push('Start date is required.');
    if (!this.filters.dateEnd) this.filterErrors.push('End date is required.');
    if (
      this.filters.dateStart &&
      this.filters.dateEnd &&
      this.filters.dateEnd < this.filters.dateStart
    ) {
      this.filterErrors.push('End date cannot be before start date.');
    }
    if (this.filterErrors.length) {
      this.filteredResults = [];
      return;
    }

    // Show loading state
    this.loadingReport = true;
    this.filteredResults = [];

    // Simulate processing time and filter data
    setTimeout(() => {
      // Filter the simulated data set
      this.filteredResults = this.allResults.filter(item => {
        const inType = item.reportType === this.filters.reportType;
        const inDateRange = item.date >= this.filters.dateStart && item.date <= this.filters.dateEnd;
        const inDepartment = !this.filters.department || item.department === this.filters.department;
        return inType && inDateRange && inDepartment;
      });

      // Hide loading and show notification when report is ready
      this.loadingReport = false;
      
      if (this.filteredResults.length > 0) {
        this.showReportReady();
        
        // Track report generation with enhanced details
        this.trackUserAction('report_generated', {
          reportType: this.filters.reportType,
          department: this.filters.department,
          recordCount: this.filteredResults.length,
          dateRange: `${this.filters.dateStart} to ${this.filters.dateEnd}`,
          filters: this.filters
        });
        
        // Add to audit trail when report is generated
        this.createAuditTrailEntry('generated');
      }
    }, 800); // Simulate 800ms processing time
  }

  onResetFilters() {
    this.filters = {
      reportType: 'employee',
      dateStart: '',
      dateEnd: '',
      department: '',
      incomplete: false
    };
    this.filterErrors = [];
    this.filteredResults = [];
  }

  get totalValue() {
    return this.filteredResults.reduce((sum, item) => sum + (item.value || 0), 0);
  }

  // Helper method to get table headers based on report type
  getTableHeaders(): string[] {
    const baseHeaders = ['ID', 'Name', 'Department', 'Date'];
    
    switch (this.filters.reportType) {
      case 'employee':
        return [...baseHeaders, 'Position', 'Status', 'Salary', 'Value'];
      case 'payroll':
        return [...baseHeaders, 'Basic Pay', 'Allowances', 'Deductions', 'Net Pay', 'Value'];
      case 'attendance':
        return [...baseHeaders, 'Time In', 'Time Out', 'Hours Worked', 'Status', 'Value'];
      case 'leave':
        return [...baseHeaders, 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Value'];
      case 'performance':
        return [...baseHeaders, 'Rating', 'Goals', 'Achievements', 'Status', 'Value'];
      case 'custom':
        return [...baseHeaders, 'Category', 'Subcategory', 'Metric', 'Value'];
      default:
        return [...baseHeaders, 'Value'];
    }
  }

  // Helper method to get table data based on report type
  getTableData(): any[][] {
    return this.filteredResults.map(item => {
      const baseData = [item.id, item.name, item.department, item.date];
      
      switch (this.filters.reportType) {
        case 'employee':
          return [...baseData, item.position, item.status, `$${item.salary?.toLocaleString()}`, item.value];
        case 'payroll':
          return [...baseData, `$${item.basicPay?.toLocaleString()}`, `$${item.allowances?.toLocaleString()}`, `$${item.deductions?.toLocaleString()}`, `$${item.netPay?.toLocaleString()}`, item.value];
        case 'attendance':
          return [...baseData, item.timeIn, item.timeOut, `${item.hoursWorked}h`, item.status, item.value];
        case 'leave':
          return [...baseData, item.leaveType, item.startDate, item.endDate, item.days, item.status, item.value];
        case 'performance':
          return [...baseData, `${item.rating}/5`, item.goals, item.achievements, item.status, item.value];
        case 'custom':
          return [...baseData, item.category, item.subcategory, item.metric, item.value];
        default:
          return [...baseData, item.value];
      }
    });
  }

  // Helper method to get report title
  getReportTitle(): string {
    const reportType = this.filters.reportType.charAt(0).toUpperCase() + this.filters.reportType.slice(1);
    const startDate = this.filters.dateStart;
    const endDate = this.filters.dateEnd;
    const department = this.filters.department ? ` - ${this.filters.department}` : '';
    
    return `${reportType} Report (${startDate} to ${endDate})${department}`;
  }

  // Helper method to show success notification
  showSuccess(message: string) {
    this.successMessage = message;
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
      this.successMessage = '';
    }, 3000);
  }

  // Helper method to create audit trail entry
  createAuditTrailEntry(action: string, format?: string) {
    console.log('Creating audit trail entry for action:', action, 'format:', format);
    console.log('Current filters:', this.filters);
    console.log('Filtered results count:', this.filteredResults.length);
    
    const reportType = this.filters.reportType.charAt(0).toUpperCase() + this.filters.reportType.slice(1);
    const department = this.filters.department || 'All';
    const dateRange = `${this.filters.dateStart} to ${this.filters.dateEnd}`;
    
    // Convert string to ReportType enum using the correct mapping
    const reportTypeMap: { [key: string]: ReportType } = {
      'employee': ReportType.EMPLOYEE,
      'payroll': ReportType.PAYROLL,
      'attendance': ReportType.ATTENDANCE,
      'leave': ReportType.LEAVE,
      'performance': ReportType.PERFORMANCE,
      'custom': ReportType.CUSTOM
    };
    
    // Prepare report data
    const headers = this.getTableHeaders();
    const data = this.getTableData();
    
    const auditEntry: AuditTrail = {
      id: Date.now().toString(),
      reportName: `${reportType} Report (${dateRange})`,
      reportType: reportTypeMap[this.filters.reportType] || ReportType.CUSTOM,
      generatedBy: 'current.user@company.com', // In real app, get from auth service
      generatedAt: new Date(),
      department: department,
      action: action,
      fileSize: this.getFileSize(format),
      downloadCount: 0,
      status: 'success',
      ipAddress: '192.168.1.100', // In real app, get actual IP
      userAgent: navigator.userAgent,
      filters: [
        `Report Type: ${reportType}`,
        `Date Range: ${dateRange}`,
        `Department: ${department}`,
        `Records: ${this.filteredResults.length}`
      ],
      templateUsed: `${reportType} Report Template`,
      // Add export format and report data
      exportFormat: format as 'csv' | 'excel' | 'pdf' | 'print',
      reportData: {
        headers: headers,
        rows: data,
        totalRecords: this.filteredResults.length,
        totalValue: this.totalValue
      },
      reportMetadata: {
        dateRange: dateRange,
        department: department,
        reportType: reportType,
        appliedFilters: [
          `Report Type: ${reportType}`,
          `Date Range: ${dateRange}`,
          `Department: ${department}`,
          `Incomplete Data: ${this.filters.incomplete ? 'Yes' : 'No'}`
        ]
      }
    };

    console.log('Audit entry created:', auditEntry);

    // Use service to add audit trail entry
    this.auditTrailService.addAuditTrailEntry(auditEntry);
    
    // Update dashboard metrics after creating audit trail
    this.calculateDashboardMetrics();
    
    console.log('Audit trail entry sent to service');
  }

  // Helper method to get file size based on format
  getFileSize(format?: string): string {
    const baseSize = this.filteredResults.length * 0.5; // Simulate file size based on records
    
    switch (format) {
      case 'csv':
        return `${(baseSize * 0.8).toFixed(1)} KB`;
      case 'excel':
        return `${(baseSize * 1.2).toFixed(1)} MB`;
      case 'pdf':
        return `${(baseSize * 1.5).toFixed(1)} MB`;
      default:
        return `${baseSize.toFixed(1)} KB`;
    }
  }

  exportCSV() {
    this.loadingExport = true;
    
    // Track export attempt
    this.trackUserAction('export_attempted', {
      format: 'csv',
      reportType: this.filters.reportType,
      recordCount: this.filteredResults.length
    });
    
    try {
      const headers = this.getTableHeaders();
      const data = this.getTableData();
      
      // Add headers to data
      const csvData = [headers, ...data];
      
      // Convert to CSV string
      const csvContent = csvData.map(row => 
        row.map(cell => `"${cell}"`).join(',')
      ).join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const fileName = `${this.getReportTitle().replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`;
      saveAs(blob, fileName);
      
      // Track successful export
      this.trackUserAction('export_successful', {
        format: 'csv',
        reportType: this.filters.reportType,
        recordCount: this.filteredResults.length,
        fileSize: this.getFileSize('csv')
      });
      
      // Add to audit trail
      this.createAuditTrailEntry('exported', 'csv');
      
      this.showSuccess('CSV file exported successfully!');
      console.log('CSV exported successfully!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting CSV. Please try again.');
    } finally {
      this.loadingExport = false;
    }
  }

  exportExcel() {
    this.loadingExport = true;
    
    // Track export attempt
    this.trackUserAction('export_attempted', {
      format: 'excel',
      reportType: this.filters.reportType,
      recordCount: this.filteredResults.length
    });
    
    try {
      const headers = this.getTableHeaders();
      const data = this.getTableData();
      
      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
      
      // Set column widths
      const columnWidths = headers.map(() => ({ wch: 15 }));
      worksheet['!cols'] = columnWidths;
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Report Data');
      
      // Generate and download file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileName = `${this.getReportTitle().replace(/[^a-z0-9]/gi, '_').toLowerCase()}.xlsx`;
      saveAs(blob, fileName);
      
      // Track successful export
      this.trackUserAction('export_successful', {
        format: 'excel',
        reportType: this.filters.reportType,
        recordCount: this.filteredResults.length,
        fileSize: this.getFileSize('excel')
      });
      
      // Add to audit trail
      this.createAuditTrailEntry('exported', 'excel');
      
      this.showSuccess('Excel file exported successfully!');
      console.log('Excel exported successfully!');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      alert('Error exporting Excel. Please try again.');
    } finally {
      this.loadingExport = false;
    }
  }

  exportPDF() {
    this.loadingExport = true;
    
    // Track export attempt
    this.trackUserAction('export_attempted', {
      format: 'pdf',
      reportType: this.filters.reportType,
      recordCount: this.filteredResults.length
    });
    
    try {
      const headers = this.getTableHeaders();
      const data = this.getTableData();
      const reportTitle = this.getReportTitle();
      
      // Create PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(reportTitle, 14, 20);
      
      // Add generation info
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      doc.text(`Total Records: ${this.filteredResults.length}`, 14, 35);
      doc.text(`Total Value: ${this.totalValue}`, 14, 40);
      
      // Add table
      autoTable(doc, {
        head: [headers],
        body: data,
        startY: 50,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        margin: { top: 50 },
      });
      
      // Save PDF
      const fileName = `${this.getReportTitle().replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      doc.save(fileName);
      
      // Track successful export
      this.trackUserAction('export_successful', {
        format: 'pdf',
        reportType: this.filters.reportType,
        recordCount: this.filteredResults.length,
        fileSize: this.getFileSize('pdf')
      });
      
      // Add to audit trail
      this.createAuditTrailEntry('exported', 'pdf');
      
      this.showSuccess('PDF file exported successfully!');
      console.log('PDF exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF. Please try again.');
    } finally {
      this.loadingExport = false;
    }
  }

  printTable() {
    this.loadingExport = true;
    
    // Track print attempt
    this.trackUserAction('print_attempted', {
      format: 'print',
      reportType: this.filters.reportType,
      recordCount: this.filteredResults.length
    });
    
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to print the report.');
        this.loadingExport = false;
        return;
      }
      
      const headers = this.getTableHeaders();
      const data = this.getTableData();
      const reportTitle = this.getReportTitle();
      
      // Create HTML content
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1f2937; margin-bottom: 10px; }
            .info { color: #6b7280; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .total { font-weight: bold; background-color: #f3f4f6; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>${reportTitle}</h1>
          <div class="info">
            <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Total Records:</strong> ${this.filteredResults.length}</p>
            <p><strong>Total Value:</strong> ${this.totalValue}</p>
          </div>
          <table>
            <thead>
              <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
            </tbody>
            <tfoot>
              <tr class="total">
                <td colspan="${headers.length - 1}">Total Value:</td>
                <td>${this.totalValue}</td>
              </tr>
            </tfoot>
          </table>
          <div class="no-print" style="margin-top: 20px;">
            <button onclick="window.print()">Print Report</button>
            <button onclick="window.close()">Close</button>
          </div>
        </body>
        </html>
      `;
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.print();
        
        // Track successful print
        this.trackUserAction('print_successful', {
          format: 'print',
          reportType: this.filters.reportType,
          recordCount: this.filteredResults.length
        });
      };
      
      // Add to audit trail
      this.createAuditTrailEntry('printed');
      
      this.showSuccess('Print window opened successfully!');
      console.log('Print window opened successfully!');
    } catch (error) {
      console.error('Error printing:', error);
      alert('Error printing. Please try again.');
    } finally {
      this.loadingExport = false;
    }
  }

  // Helper method to show report ready notification
  showReportReady() {
    const reportType = this.filters.reportType.charAt(0).toUpperCase() + this.filters.reportType.slice(1);
    const recordCount = this.filteredResults.length;
    const department = this.filters.department ? ` for ${this.filters.department}` : '';
    
    this.reportReadyMessage = `${reportType} Report Ready! Found ${recordCount} records${department}`;
    this.showReportReadyNotification = true;
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      this.showReportReadyNotification = false;
      this.reportReadyMessage = '';
    }, 5000);
  }

  // Saved Filters Methods
  openSaveFilterModal() {
    this.newFilterName = '';
    this.newFilterDescription = '';
    this.showSaveFilterModal = true;
  }

  closeSaveFilterModal() {
    this.showSaveFilterModal = false;
    this.newFilterName = '';
    this.newFilterDescription = '';
  }

  saveCurrentFilter() {
    if (!this.newFilterName.trim()) {
      alert('Please enter a name for the filter');
      return;
    }

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: this.newFilterName.trim(),
      description: this.newFilterDescription.trim(),
      reportType: this.filters.reportType,
      dateStart: this.filters.dateStart,
      dateEnd: this.filters.dateEnd,
      department: this.filters.department,
      incomplete: this.filters.incomplete,
      createdBy: 'current.user@company.com', // In real app, get from auth service
      createdAt: new Date(),
      useCount: 0
    };

    this.savedFilters.unshift(newFilter);
    this.closeSaveFilterModal();
    this.showSuccess('Filter saved successfully!');
  }

  openLoadFilterModal() {
    this.showLoadFilterModal = true;
  }

  closeLoadFilterModal() {
    this.showLoadFilterModal = false;
    this.selectedSavedFilter = null;
  }

  loadSavedFilter(filter: SavedFilter) {
    this.filters = {
      reportType: filter.reportType,
      dateStart: filter.dateStart,
      dateEnd: filter.dateEnd,
      department: filter.department,
      incomplete: filter.incomplete
    };

    // Update use count and last used
    filter.useCount++;
    filter.lastUsed = new Date();

    this.closeLoadFilterModal();
    this.onApplyFilters(); // Automatically apply the loaded filter
    this.showSuccess(`Filter "${filter.name}" loaded successfully!`);
  }

  deleteSavedFilter(filterId: string) {
    if (confirm('Are you sure you want to delete this saved filter?')) {
      this.savedFilters = this.savedFilters.filter(f => f.id !== filterId);
      this.showSuccess('Filter deleted successfully!');
    }
  }

  setDefaultFilter(filterId: string) {
    this.savedFilters = this.savedFilters.map(f => ({
      ...f,
      isDefault: f.id === filterId
    }));
    this.showSuccess('Default filter updated!');
  }

  getFilterIcon(reportType: string): string {
    switch (reportType) {
      case 'employee': return 'fas fa-users';
      case 'payroll': return 'fas fa-money-check-alt';
      case 'attendance': return 'fas fa-clock';
      case 'leave': return 'fas fa-calendar-alt';
      case 'performance': return 'fas fa-chart-line';
      case 'custom': return 'fas fa-cogs';
      default: return 'fas fa-filter';
    }
  }

  getFilterColor(reportType: string): string {
    switch (reportType) {
      case 'employee': return '#3b82f6';
      case 'payroll': return '#10b981';
      case 'attendance': return '#f59e0b';
      case 'leave': return '#8b5cf6';
      case 'performance': return '#ef4444';
      case 'custom': return '#6b7280';
      default: return '#6b7280';
    }
  }

  formatFilterDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Update dashboard data after report generation
  updateDashboardData() {
    this.calculateDashboardMetrics();
  }

  // Returns a class for metric number size based on its value
  getMetricNumberClass(value: number): string {
    if (value >= 1000) return 'metric-sm';
    if (value >= 100) return 'metric-xs';
    if (value >= 10) return 'metric-xxs';
    return '';
  }

  getTrendClass(trend: number): string {
    if (trend > 0) return 'positive';
    if (trend < 0) return 'negative';
    return 'neutral';
  }

  getMetricSubtitle(label: string): string {
    switch (label) {
      case 'Total Reports Generated':
        return 'Reports created this month';
      case 'Active Scheduled Reports':
        return 'Currently running schedules';
      case 'Templates Available':
        return 'Ready-to-use templates';
      case 'Export Success Rate':
        return 'Successful exports vs attempts';
      default:
        return 'Monthly performance';
    }
  }

  getMetricProgress(metric: DashboardMetric): number {
    // Calculate progress based on metric type and value
    switch (metric.label) {
      case 'Total Reports Generated':
        return Math.min((metric.value / 100) * 100, 100); // Cap at 100%
      case 'Active Scheduled Reports':
        return Math.min((metric.value / 10) * 100, 100); // Cap at 10 reports
      case 'Templates Available':
        return Math.min((metric.value / 20) * 100, 100); // Cap at 20 templates
      case 'Export Success Rate':
        return metric.value; // Already a percentage
      default:
        return Math.min((metric.value / 50) * 100, 100);
    }
  }

  onMetricCardClick(metric: DashboardMetric) {
    // Add visual feedback
    metric.isUpdated = true;
    
    // Show metric details or navigate to relevant section
    switch (metric.label) {
      case 'Total Reports Generated':
        this.scrollToSection('report-generation-section');
        break;
      case 'Active Scheduled Reports':
        this.toggleView('scheduled-reports');
        break;
      case 'Templates Available':
        this.toggleView('templates');
        break;
      case 'Export Success Rate':
        this.scrollToSection('export-section');
        break;
    }
    
    // Remove the updated flag after animation
    setTimeout(() => {
      metric.isUpdated = false;
    }, 600);
  }

  // Enhanced method to track user actions and update dashboard
  trackUserAction(action: string, details?: any) {
    const now = new Date();
    this.actionTracker.lastAction = action;
    this.actionTracker.lastActionTime = now;

    // Show real-time indicator
    this.showRealtimeIndicator = true;
    
    // Clear any existing timeout
    if (this.indicatorTimeout) {
      clearTimeout(this.indicatorTimeout);
    }
    
    // Auto-hide indicator after 5 seconds
    this.indicatorTimeout = setTimeout(() => {
      this.hideRealtimeIndicator();
    }, 5000);

    // Show performance insights with auto-hide after 30 seconds
    this.showPerformanceInsightsWithTimeout();

    // Update action counters
    switch (action) {
      case 'report_generated':
        this.actionTracker.reportsGenerated++;
        this.performanceMetrics.dailyReports++;
        this.updateReportGenerationMetrics();
        break;
      case 'export_attempted':
        this.actionTracker.exportsAttempted++;
        this.updateExportMetrics();
        break;
      case 'export_successful':
        this.actionTracker.exportsSuccessful++;
        this.updateExportMetrics();
        break;
      case 'print_attempted':
        this.actionTracker.printsAttempted++;
        this.updatePrintMetrics();
        break;
      case 'print_successful':
        this.actionTracker.printsSuccessful++;
        this.updatePrintMetrics();
        break;
      case 'template_created':
        this.actionTracker.templatesCreated++;
        this.updateTemplateMetrics();
        break;
      case 'template_modified':
        this.actionTracker.templatesModified++;
        this.updateTemplateMetrics();
        break;
      case 'scheduled_report_created':
        this.actionTracker.scheduledReportsCreated++;
        this.updateScheduledReportMetrics();
        break;
      case 'scheduled_report_activated':
        this.actionTracker.scheduledReportsActivated++;
        this.updateScheduledReportMetrics();
        break;
    }

    // Update department usage if provided
    if (details?.department) {
      this.performanceMetrics.departmentUsage[details.department] = 
        (this.performanceMetrics.departmentUsage[details.department] || 0) + 1;
    }

    // Update report type usage
    if (details?.reportType) {
      this.performanceMetrics.mostUsedReportType = details.reportType;
    }

    // Trigger dashboard update with animation
    this.updateDashboardWithAnimation();
  }

  // Update report generation metrics
  updateReportGenerationMetrics() {
    const totalReportsMetric = this.keyMetrics.find(m => m.label === 'Total Reports Generated');
    if (totalReportsMetric) {
      const oldValue = totalReportsMetric.value;
      totalReportsMetric.value = this.auditTrails.length;
      
      // Calculate trend based on recent activity
      const recentReports = this.auditTrails.filter(audit => 
        new Date(audit.generatedAt).getTime() > Date.now() - (24 * 60 * 60 * 1000) // Last 24 hours
      ).length;
      
      totalReportsMetric.trend = recentReports > 0 ? Math.round((recentReports / Math.max(oldValue, 1)) * 100) : 0;
      totalReportsMetric.isUpdated = true;
      
      // Store in history
      this.dashboardUpdateHistory.totalReports.push(totalReportsMetric.value);
      if (this.dashboardUpdateHistory.totalReports.length > 30) {
        this.dashboardUpdateHistory.totalReports.shift(); // Keep last 30 entries
      }
    }
  }

  // Update export metrics
  updateExportMetrics() {
    const exportRateMetric = this.keyMetrics.find(m => m.label === 'Export Success Rate');
    if (exportRateMetric) {
      const totalAttempts = this.actionTracker.exportsAttempted + this.actionTracker.printsAttempted;
      const totalSuccess = this.actionTracker.exportsSuccessful + this.actionTracker.printsSuccessful;
      
      if (totalAttempts > 0) {
        const newRate = Math.round((totalSuccess / totalAttempts) * 100);
        const oldRate = exportRateMetric.value;
        exportRateMetric.value = newRate;
        exportRateMetric.trend = newRate - oldRate;
        exportRateMetric.isUpdated = true;
        
        this.performanceMetrics.exportSuccessRate = newRate;
        this.dashboardUpdateHistory.exportSuccess.push(newRate);
        if (this.dashboardUpdateHistory.exportSuccess.length > 30) {
          this.dashboardUpdateHistory.exportSuccess.shift();
        }
      }
    }
  }

  // Update print metrics
  updatePrintMetrics() {
    // Similar to export metrics but for printing
    this.updateExportMetrics(); // Reuse the same logic
  }

  // Update template metrics
  updateTemplateMetrics() {
    const templatesMetric = this.keyMetrics.find(m => m.label === 'Templates Available');
    if (templatesMetric) {
      const oldValue = templatesMetric.value;
      templatesMetric.value = this.reportTemplates.filter(t => t.status === 'active').length;
      templatesMetric.trend = templatesMetric.value > oldValue ? 5 : templatesMetric.value < oldValue ? -2 : 0;
      templatesMetric.isUpdated = true;
      
      this.dashboardUpdateHistory.templates.push(templatesMetric.value);
      if (this.dashboardUpdateHistory.templates.length > 30) {
        this.dashboardUpdateHistory.templates.shift();
      }
    }
  }

  // Update scheduled report metrics
  updateScheduledReportMetrics() {
    const scheduledMetric = this.keyMetrics.find(m => m.label === 'Active Scheduled Reports');
    if (scheduledMetric) {
      const oldValue = scheduledMetric.value;
      scheduledMetric.value = this.scheduledReports.filter(r => r.status === 'active').length;
      scheduledMetric.trend = scheduledMetric.value > oldValue ? 10 : scheduledMetric.value < oldValue ? -5 : 0;
      scheduledMetric.isUpdated = true;
      
      this.dashboardUpdateHistory.scheduledReports.push(scheduledMetric.value);
      if (this.dashboardUpdateHistory.scheduledReports.length > 30) {
        this.dashboardUpdateHistory.scheduledReports.shift();
      }
    }
  }

  // Update dashboard with smooth animation
  updateDashboardWithAnimation() {
    // Trigger visual update animation
    this.showMetricsUpdated();
    
    // Update all related metrics
    this.calculateDashboardMetrics();
    
    // Update module activities
    this.updateModuleActivities();
    
    // Update department metrics
    this.updateDepartmentMetrics();
    
    // Update report type distribution
    this.updateReportTypeDistribution();
    
    // Store update timestamp
    this.dashboardUpdateHistory.lastUpdate = new Date();
  }

  // Enhanced module activities update
  updateModuleActivities() {
    const reportType = this.filters.reportType;
    const moduleActivity = this.moduleActivities.find(m => 
      m.module.toLowerCase().includes(reportType)
    );
    
    if (moduleActivity) {
      moduleActivity.activeUsers++;
      moduleActivity.lastActivity = new Date();
      
      // Update status based on recent activity
      const recentActivity = this.auditTrails.filter(audit => 
        new Date(audit.generatedAt).getTime() > Date.now() - (60 * 60 * 1000) // Last hour
      ).length;
      
      if (recentActivity > 5) {
        moduleActivity.status = 'active';
      } else if (recentActivity > 0) {
        moduleActivity.status = 'inactive';
      }
    }
  }

  // Enhanced department metrics update
  updateDepartmentMetrics() {
    const department = this.filters.department;
    if (department) {
      const deptMetric = this.departmentMetrics.find(d => d.name === department);
      if (deptMetric) {
        deptMetric.activeRequests++;
        deptMetric.completionRate = Math.min(100, (deptMetric.activeRequests / Math.max(deptMetric.employeeCount, 1)) * 100);
      }
    }
  }

  // Enhanced report type distribution update
  updateReportTypeDistribution() {
    const reportType = this.filters.reportType;
    const roleDist = this.roleDistribution.find(r => 
      r.role.toLowerCase().includes(reportType)
    );
    
    if (roleDist) {
      roleDist.count++;
      
      // Recalculate percentages
      const totalCount = this.roleDistribution.reduce((sum, r) => sum + r.count, 0);
      this.roleDistribution.forEach(r => {
        r.percentage = Math.round((r.count / totalCount) * 100);
      });
    }
  }

  // Get real-time performance insights
  getPerformanceInsights() {
    const insights = {
      averageReportSize: this.calculateAverageReportSize(),
      mostUsedFormat: this.getMostUsedExportFormat(),
      peakActivityTime: this.getPeakActivityTime(),
      efficiencyScore: this.calculateEfficiencyScore(),
      totalActions: this.actionTracker.reportsGenerated + this.actionTracker.exportsAttempted,
      successRate: this.performanceMetrics.exportSuccessRate,
      mostActiveDepartment: Object.keys(this.performanceMetrics.departmentUsage)
        .reduce((a, b) => this.performanceMetrics.departmentUsage[a] > this.performanceMetrics.departmentUsage[b] ? a : b, ''),
      averageDailyReports: this.performanceMetrics.dailyReports,
      trend: this.calculateOverallTrend()
    };
    
    return insights;
  }

  // Calculate average report size in KB
  calculateAverageReportSize(): number {
    const reportSizes = this.auditTrails
      .filter(audit => audit.fileSize)
      .map(audit => {
        const sizeStr = audit.fileSize;
        if (sizeStr.includes('KB')) {
          return parseFloat(sizeStr.replace('KB', ''));
        } else if (sizeStr.includes('MB')) {
          return parseFloat(sizeStr.replace('MB', '')) * 1024;
        } else if (sizeStr.includes('B')) {
          return parseFloat(sizeStr.replace('B', '')) / 1024;
        }
        return 0;
      });
    
    if (reportSizes.length === 0) return 0;
    return Math.round(reportSizes.reduce((sum, size) => sum + size, 0) / reportSizes.length);
  }

  // Get most used export format
  getMostUsedExportFormat(): string {
    const formatCounts: { [key: string]: number } = {};
    
    this.auditTrails.forEach(audit => {
      if (audit.exportFormat) {
        formatCounts[audit.exportFormat] = (formatCounts[audit.exportFormat] || 0) + 1;
      }
    });
    
    if (Object.keys(formatCounts).length === 0) return 'N/A';
    
    return Object.keys(formatCounts).reduce((a, b) => 
      formatCounts[a] > formatCounts[b] ? a : b
    ).toUpperCase();
  }

  // Get peak activity time
  getPeakActivityTime(): string {
    const hourCounts: { [key: number]: number } = {};
    
    this.auditTrails.forEach(audit => {
      const hour = new Date(audit.generatedAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    if (Object.keys(hourCounts).length === 0) return 'N/A';
    
    const peakHour = Object.keys(hourCounts).reduce((a, b) => 
      hourCounts[parseInt(a)] > hourCounts[parseInt(b)] ? a : b
    );
    
    return `${peakHour}:00`;
  }

  // Calculate efficiency score based on success rate and speed
  calculateEfficiencyScore(): number {
    const totalActions = this.actionTracker.reportsGenerated + this.actionTracker.exportsAttempted;
    const successfulActions = this.actionTracker.exportsSuccessful + this.actionTracker.printsSuccessful;
    
    if (totalActions === 0) return 0;
    
    const successRate = (successfulActions / totalActions) * 100;
    const speedBonus = Math.min(this.performanceMetrics.dailyReports * 10, 20); // Bonus for high activity
    
    return Math.min(Math.round(successRate + speedBonus), 100);
  }

  // Calculate overall trend based on recent activity
  calculateOverallTrend(): number {
    const recentActions = this.auditTrails.filter(audit => 
      new Date(audit.generatedAt).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000) // Last week
    ).length;
    
    const previousWeekActions = this.auditTrails.filter(audit => {
      const auditTime = new Date(audit.generatedAt).getTime();
      const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
      return auditTime > twoWeeksAgo && auditTime <= weekAgo;
    }).length;
    
    if (previousWeekActions === 0) return recentActions > 0 ? 100 : 0;
    return Math.round(((recentActions - previousWeekActions) / previousWeekActions) * 100);
  }

  // Get user-friendly action display name
  getActionDisplayName(action: string): string {
    const actionMap: { [key: string]: string } = {
      'report_generated': 'Report Generated',
      'export_attempted': 'Export Attempted',
      'export_successful': 'Export Completed',
      'print_attempted': 'Print Attempted',
      'print_successful': 'Print Completed',
      'template_created': 'Template Created',
      'template_modified': 'Template Modified',
      'scheduled_report_created': 'Scheduled Report Created',
      'scheduled_report_activated': 'Scheduled Report Activated'
    };
    
    return actionMap[action] || action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // Get efficiency class for styling
  getEfficiencyClass(score: number): string {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'satisfactory';
    return 'needs-improvement';
  }

  // Hide performance insights
  hidePerformanceInsights() {
    this.showPerformanceInsights = false;
    if (this.performanceInsightsTimeout) {
      clearTimeout(this.performanceInsightsTimeout);
      this.performanceInsightsTimeout = null;
    }
  }

  // Show performance insights with auto-hide
  showPerformanceInsightsWithTimeout() {
    this.showPerformanceInsights = true;
    if (this.performanceInsightsTimeout) {
      clearTimeout(this.performanceInsightsTimeout);
    }
    this.performanceInsightsTimeout = setTimeout(() => {
      this.hidePerformanceInsights();
    }, 30000); // 30 seconds
  }
}