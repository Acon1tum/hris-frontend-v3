import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';


// Enums
enum ReportType {
  ATTENDANCE = 'ATTENDANCE',
  PAYROLL = 'PAYROLL',
  PERFORMANCE = 'PERFORMANCE'
}

// Interfaces
interface Schedule {
  hour: number;
  minute: number;
  timezone: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
}

interface ScheduledReport {
  id: string;
  name: string;
  description: string;
  reportType: ReportType;
  department: string;
  frequency: string;
  schedule: Schedule;
  recipients: string[];
  format: string;
  template: string;
  filters: string[];
  status: string;
  lastRun: Date;
  nextRun: Date;
  createdBy: string;
  createdAt: Date;
  autoDelete: boolean;
  retentionDays: number;
}

interface Condition {
  field: string;
  operator: string;
  threshold?: number;
  value?: any;
}

interface AlertTrigger {
  id: string;
  name: string;
  description: string;
  type: string;
  severity: string;
  conditions: Condition[];
  scope: string;
  targetDepartment?: string;
  notificationChannels: string[];
  recipients: string[];
  status: string;
  lastTriggered: Date;
  triggerCount: number;
  createdBy: string;
  createdAt: Date;
  cooldownMinutes: number;
  autoResolve: boolean;
  resolveConditions?: string[];
}

@Component({
  selector: 'app-scheduled-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scheduled-reports.component.html',
  styleUrls: ['./scheduled-reports.component.scss']
})
export class ScheduledReportsComponent {
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
        dayOfWeek: 5,
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
  showViewScheduledReportModal = false;
  showViewAlertTriggerModal = false;
  selectedScheduledReport: ScheduledReport | null = null;
  selectedAlertTrigger: AlertTrigger | null = null;
  isEditScheduledReport = false;
  isEditAlertTrigger = false;
  showRecipientsDropdown = false;

  // Helper Methods
  getFrequencyLabel(frequency: string): string {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
  }

  getFormatIcon(format: string): string {
    const iconMap: { [key: string]: string } = {
      'pdf': 'fas fa-file-pdf',
      'excel': 'fas fa-file-excel',
      'csv': 'fas fa-file-csv',
      'word': 'fas fa-file-word'
    };
    return iconMap[format.toLowerCase()] || 'fas fa-file';
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = Math.abs(now.getTime() - date.getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  getAlertTypeIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'data_missing': 'fas fa-exclamation-triangle',
      'anomaly_detected': 'fas fa-chart-line',
      'compliance_breach': 'fas fa-shield-alt'
    };
    return iconMap[type] || 'fas fa-bell';
  }

  getSeverityColor(severity: string): string {
    const colorMap: { [key: string]: string } = {
      'low': '#4CAF50',
      'medium': '#FF9800',
      'high': '#f44336',
      'critical': '#D32F2F'
    };
    return colorMap[severity.toLowerCase()] || '#757575';
  }

  getNotificationChannelsText(channels: string[]): string {
    return channels.map(channel => 
      channel.replace('_', ' ').charAt(0).toUpperCase() + 
      channel.slice(1)
    ).join(', ');
  }

  getBlankScheduledReport(): ScheduledReport {
    return {
      id: '',
      name: '',
      description: '',
      reportType: ReportType.ATTENDANCE,
      department: '',
      frequency: 'daily',
      schedule: { hour: 0, minute: 0, timezone: '' },
      recipients: [],
      format: 'pdf',
      template: '',
      filters: [],
      status: 'active',
      lastRun: new Date(),
      nextRun: new Date(),
      createdBy: '',
      createdAt: new Date(),
      autoDelete: false,
      retentionDays: 0
    };
  }

  getBlankAlertTrigger(): AlertTrigger {
    return {
      id: '',
      name: '',
      description: '',
      type: 'data_missing',
      severity: 'low',
      conditions: [],
      scope: 'global',
      notificationChannels: [],
      recipients: [],
      status: 'active',
      lastTriggered: new Date(),
      triggerCount: 0,
      createdBy: '',
      createdAt: new Date(),
      cooldownMinutes: 0,
      autoResolve: false
    };
  }

  // Modal Methods
  openViewScheduledReport(report: ScheduledReport) {
    this.selectedScheduledReport = report;
    this.showViewScheduledReportModal = true;
    this.isEditScheduledReport = false;
  }
  openCreateScheduledReport() {
    this.selectedScheduledReport = this.getBlankScheduledReport();
    this.showScheduledReportModal = true;
    this.showViewScheduledReportModal = false;
    this.isEditScheduledReport = false;
  }
  openEditScheduledReport(report: ScheduledReport) {
    this.selectedScheduledReport = { ...report };
    this.showScheduledReportModal = true;
    this.showViewScheduledReportModal = false;
    this.isEditScheduledReport = true;
  }
  closeScheduledReportModal() {
    this.showScheduledReportModal = false;
    this.showViewScheduledReportModal = false;
    this.selectedScheduledReport = null;
    this.isEditScheduledReport = false;
  }
  saveScheduledReport(report: ScheduledReport) {
    if (this.isEditScheduledReport && report.id) {
      // Edit
      const idx = this.scheduledReports.findIndex(r => r.id === report.id);
      if (idx > -1) this.scheduledReports[idx] = { ...report };
    } else {
      // Create
      report.id = (Math.random() * 100000).toFixed(0);
      this.scheduledReports.push({ ...report });
    }
    this.closeScheduledReportModal();
  }
  deleteScheduledReport(id: string): void {
    if (confirm('Delete this scheduled report?')) {
      this.scheduledReports = this.scheduledReports.filter(r => r.id !== id);
      this.closeScheduledReportModal();
    }
  }

  // Alert Trigger Modal Methods
  openViewAlertTrigger(trigger: AlertTrigger) {
    this.selectedAlertTrigger = trigger;
    this.showViewAlertTriggerModal = true;
    this.isEditAlertTrigger = false;
  }
  openCreateAlertTrigger() {
    this.selectedAlertTrigger = this.getBlankAlertTrigger();
    this.showAlertTriggerModal = true;
    this.showViewAlertTriggerModal = false;
    this.isEditAlertTrigger = false;
  }
  openEditAlertTrigger(trigger: AlertTrigger) {
    this.selectedAlertTrigger = { ...trigger };
    this.showAlertTriggerModal = true;
    this.showViewAlertTriggerModal = false;
    this.isEditAlertTrigger = true;
  }
  closeAlertTriggerModal() {
    this.showAlertTriggerModal = false;
    this.showViewAlertTriggerModal = false;
    this.selectedAlertTrigger = null;
    this.isEditAlertTrigger = false;
  }
  saveAlertTrigger(trigger: AlertTrigger) {
    if (this.isEditAlertTrigger && trigger.id) {
      // Edit
      const idx = this.alertTriggers.findIndex(t => t.id === trigger.id);
      if (idx > -1) this.alertTriggers[idx] = { ...trigger };
    } else {
      // Create
      trigger.id = (Math.random() * 100000).toFixed(0);
      this.alertTriggers.push({ ...trigger });
    }
    this.closeAlertTriggerModal();
  }
  deleteAlertTrigger(id: string): void {
    if (confirm('Delete this alert trigger?')) {
      this.alertTriggers = this.alertTriggers.filter(t => t.id !== id);
      this.closeAlertTriggerModal();
    }
  }

  // Action Methods
  createScheduledReport(): void {
    this.openCreateScheduledReport();
  }
  editScheduledReport(report: ScheduledReport): void {
    this.openEditScheduledReport(report);
  }
  createAlertTrigger(): void {
    this.openCreateAlertTrigger();
  }
  editAlertTrigger(trigger: AlertTrigger): void {
    this.openEditAlertTrigger(trigger);
  }

  toggleScheduledReportStatus(report: ScheduledReport): void {
    report.status = report.status === 'active' ? 'paused' : 'active';
  }

  runScheduledReportNow(report: ScheduledReport): void {
    // Implement run now logic
  }

  toggleAlertTriggerStatus(trigger: AlertTrigger): void {
    trigger.status = trigger.status === 'active' ? 'inactive' : 'active';
  }

  testAlertTrigger(trigger: AlertTrigger): void {
    // Implement test logic
  }

  addRecipient(event: any) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (value && this.selectedScheduledReport) {
      if (!this.selectedScheduledReport.recipients.includes(value)) {
        this.selectedScheduledReport.recipients.push(value);
      }
      input.value = '';
    }
    event.preventDefault();
  }

  departmentOptions: string[] = [
    'Human Resources',
    'Finance',
    'Operations',
    'IT',
    'All',
    'Marketing',
    'Sales',
    'Legal',
    'Executive'
  ];

  recipientOptions: string[] = [
    'hr@company.com',
    'managers@company.com',
    'finance@company.com',
    'payroll@company.com',
    'executives@company.com',
    'operations@company.com',
    'admin@company.com',
    'compliance@company.com',
    'it@company.com',
    'marketing@company.com',
    'sales@company.com',
    'legal@company.com'
  ];

  toggleRecipient(recipient: string) {
    if (!this.selectedScheduledReport) return;
    const idx = this.selectedScheduledReport.recipients.indexOf(recipient);
    if (idx > -1) {
      this.selectedScheduledReport.recipients.splice(idx, 1);
    } else {
      this.selectedScheduledReport.recipients.push(recipient);
    }
  }

  isRecipientSelected(recipient: string): boolean {
    return !!this.selectedScheduledReport && this.selectedScheduledReport.recipients.includes(recipient);
  }

  // Optionally, close dropdown on blur
  closeRecipientsDropdown() {
    setTimeout(() => { this.showRecipientsDropdown = false; }, 150);
  }
}
