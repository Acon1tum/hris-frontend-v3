import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Alert {
  id: number;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  category: 'system' | 'security' | 'data';
}

interface AlertRule {
  id: number;
  name: string;
  description: string;
  condition: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
  notifications: string[];
}

interface Report {
  id: number;
  name: string;
  description: string;
  type: 'chart' | 'table' | 'dashboard';
  metrics: string[];
  lastGenerated: Date;
  isCustom: boolean;
}

@Component({
  selector: 'app-admin-custom',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-custom.component.html',
  styleUrls: ['./admin-custom.component.scss']
})
export class AdminCustomComponent implements OnInit {
  title = 'Super Admin Custom Management';
  
  // Active tab
  activeTab: 'alerts' | 'rules' | 'reports' = 'alerts';
  
  // Real-time alerts
  alerts: Alert[] = [
    {
      id: 1,
      type: 'critical',
      title: 'Database Connection Failed',
      message: 'Primary database connection has been lost. Attempting to reconnect...',
      timestamp: new Date(),
      isRead: false,
      category: 'system'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Unusual Login Activity',
      message: 'Multiple failed login attempts detected from IP 192.168.1.100',
      timestamp: new Date(Date.now() - 300000),
      isRead: false,
      category: 'security'
    },
    {
      id: 3,
      type: 'info',
      title: 'Data Sync Completed',
      message: 'Employee data synchronization completed successfully',
      timestamp: new Date(Date.now() - 600000),
      isRead: true,
      category: 'data'
    }
  ];

  // Alert rules
  alertRules: AlertRule[] = [
    {
      id: 1,
      name: 'Database Connection Monitor',
      description: 'Monitor database connection status and alert on failures',
      condition: 'db_connection_status == "failed"',
      severity: 'critical',
      isActive: true,
      notifications: ['email', 'sms', 'dashboard']
    },
    {
      id: 2,
      name: 'Failed Login Attempts',
      description: 'Alert on multiple failed login attempts from same IP',
      condition: 'failed_logins > 5 within 10 minutes',
      severity: 'high',
      isActive: true,
      notifications: ['email', 'dashboard']
    },
    {
      id: 3,
      name: 'Data Inconsistency Check',
      description: 'Check for data inconsistencies in employee records',
      condition: 'employee_data_integrity < 95%',
      severity: 'medium',
      isActive: false,
      notifications: ['email']
    }
  ];

  // Reports
  reports: Report[] = [
    {
      id: 1,
      name: 'Employee Distribution by Department',
      description: 'Shows employee count and distribution across departments',
      type: 'chart',
      metrics: ['department_count', 'employee_distribution', 'growth_rate'],
      lastGenerated: new Date(),
      isCustom: false
    },
    {
      id: 2,
      name: 'System Performance Metrics',
      description: 'Real-time system performance and resource utilization',
      type: 'dashboard',
      metrics: ['cpu_usage', 'memory_usage', 'response_time', 'error_rate'],
      lastGenerated: new Date(Date.now() - 3600000),
      isCustom: true
    },
    {
      id: 3,
      name: 'Security Audit Report',
      description: 'Comprehensive security audit and access logs',
      type: 'table',
      metrics: ['login_attempts', 'failed_logins', 'suspicious_activity', 'access_patterns'],
      lastGenerated: new Date(Date.now() - 86400000),
      isCustom: true
    }
  ];

  // Form states
  showNewRuleForm = false;
  showNewReportForm = false;
  editingRule: AlertRule | null = null;
  editingReport: Report | null = null;
  showReportModal = false;
  selectedReport: Report | null = null;

  // New rule form
  newRule = {
    name: '',
    description: '',
    condition: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    notifications: [] as string[]
  };

  // New report form
  newReport = {
    name: '',
    description: '',
    type: 'chart' as 'chart' | 'table' | 'dashboard',
    metrics: [] as string[]
  };

  // Computed properties for form binding
  get ruleName(): string {
    return this.editingRule ? this.editingRule.name : this.newRule.name;
  }

  set ruleName(value: string) {
    if (this.editingRule) {
      this.editingRule.name = value;
    } else {
      this.newRule.name = value;
    }
  }

  get ruleDescription(): string {
    return this.editingRule ? this.editingRule.description : this.newRule.description;
  }

  set ruleDescription(value: string) {
    if (this.editingRule) {
      this.editingRule.description = value;
    } else {
      this.newRule.description = value;
    }
  }

  get ruleCondition(): string {
    return this.editingRule ? this.editingRule.condition : this.newRule.condition;
  }

  set ruleCondition(value: string) {
    if (this.editingRule) {
      this.editingRule.condition = value;
    } else {
      this.newRule.condition = value;
    }
  }

  get ruleSeverity(): 'low' | 'medium' | 'high' | 'critical' {
    return this.editingRule ? this.editingRule.severity : this.newRule.severity;
  }

  set ruleSeverity(value: 'low' | 'medium' | 'high' | 'critical') {
    if (this.editingRule) {
      this.editingRule.severity = value;
    } else {
      this.newRule.severity = value;
    }
  }

  get reportName(): string {
    return this.editingReport ? this.editingReport.name : this.newReport.name;
  }

  set reportName(value: string) {
    if (this.editingReport) {
      this.editingReport.name = value;
    } else {
      this.newReport.name = value;
    }
  }

  get reportDescription(): string {
    return this.editingReport ? this.editingReport.description : this.newReport.description;
  }

  set reportDescription(value: string) {
    if (this.editingReport) {
      this.editingReport.description = value;
    } else {
      this.newReport.description = value;
    }
  }

  get reportType(): 'chart' | 'table' | 'dashboard' {
    return this.editingReport ? this.editingReport.type : this.newReport.type;
  }

  set reportType(value: 'chart' | 'table' | 'dashboard') {
    if (this.editingReport) {
      this.editingReport.type = value;
    } else {
      this.newReport.type = value;
    }
  }

  ngOnInit() {
    // Simulate real-time alerts
    this.simulateRealTimeAlerts();
  }

  // Tab navigation
  setActiveTab(tab: 'alerts' | 'rules' | 'reports') {
    this.activeTab = tab;
  }

  // Alert management
  markAlertAsRead(alertId: number) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.isRead = true;
    }
  }

  deleteAlert(alertId: number) {
    this.alerts = this.alerts.filter(a => a.id !== alertId);
  }

  getUnreadAlertsCount(): number {
    return this.alerts.filter(a => !a.isRead).length;
  }

  // Rule management
  createNewRule() {
    const rule: AlertRule = {
      id: Date.now(),
      name: this.newRule.name,
      description: this.newRule.description,
      condition: this.newRule.condition,
      severity: this.newRule.severity,
      isActive: true,
      notifications: [...this.newRule.notifications]
    };
    
    this.alertRules.push(rule);
    this.resetNewRuleForm();
  }

  editRule(rule: AlertRule) {
    this.editingRule = { ...rule };
    this.showNewRuleForm = true;
  }

  updateRule() {
    if (this.editingRule) {
      const index = this.alertRules.findIndex(r => r.id === this.editingRule!.id);
      if (index !== -1) {
        this.alertRules[index] = { ...this.editingRule };
      }
      this.cancelEditRule();
    }
  }

  deleteRule(ruleId: number) {
    this.alertRules = this.alertRules.filter(r => r.id !== ruleId);
  }

  toggleRuleStatus(ruleId: number) {
    const rule = this.alertRules.find(r => r.id === ruleId);
    if (rule) {
      rule.isActive = !rule.isActive;
    }
  }

  resetNewRuleForm() {
    this.newRule = {
      name: '',
      description: '',
      condition: '',
      severity: 'medium',
      notifications: []
    };
    this.showNewRuleForm = false;
    this.editingRule = null;
  }

  cancelEditRule() {
    this.editingRule = null;
    this.showNewRuleForm = false;
  }

  // Report management
  createNewReport() {
    const report: Report = {
      id: Date.now(),
      name: this.newReport.name,
      description: this.newReport.description,
      type: this.newReport.type,
      metrics: [...this.newReport.metrics],
      lastGenerated: new Date(),
      isCustom: true
    };
    
    this.reports.push(report);
    this.resetNewReportForm();
  }

  editReport(report: Report) {
    this.editingReport = { ...report };
    this.showNewReportForm = true;
  }

  updateReport() {
    if (this.editingReport) {
      const index = this.reports.findIndex(r => r.id === this.editingReport!.id);
      if (index !== -1) {
        this.reports[index] = { ...this.editingReport };
      }
      this.cancelEditReport();
    }
  }

  deleteReport(reportId: number) {
    this.reports = this.reports.filter(r => r.id !== reportId);
  }

  generateReport(reportId: number) {
    const report = this.reports.find(r => r.id === reportId);
    if (report) {
      report.lastGenerated = new Date();
      console.log(`Generating report: ${report.name}`);
    }
  }

  viewReport(report: Report) {
    this.selectedReport = report;
    this.showReportModal = true;
  }

  closeReportModal() {
    this.showReportModal = false;
    this.selectedReport = null;
  }

  exportReport(reportId: number) {
    const report = this.reports.find(r => r.id === reportId);
    if (report) {
      console.log(`Exporting report: ${report.name}`);
      // Here you can implement actual export functionality
      // For now, just log the action
    }
  }

  resetNewReportForm() {
    this.newReport = {
      name: '',
      description: '',
      type: 'chart',
      metrics: []
    };
    this.showNewReportForm = false;
    this.editingReport = null;
  }

  cancelEditReport() {
    this.editingReport = null;
    this.showNewReportForm = false;
  }

  // Utility methods
  getAlertIcon(type: string): string {
    switch (type) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  }

  // Form helper methods
  toggleNotification(type: string) {
    const notifications = this.editingRule ? this.editingRule.notifications : this.newRule.notifications;
    const index = notifications.indexOf(type);
    
    if (index > -1) {
      notifications.splice(index, 1);
    } else {
      notifications.push(type);
    }
  }

  toggleMetric(metric: string) {
    const metrics = this.editingReport ? this.editingReport.metrics : this.newReport.metrics;
    const index = metrics.indexOf(metric);
    
    if (index > -1) {
      metrics.splice(index, 1);
    } else {
      metrics.push(metric);
    }
  }

  // Simulate real-time alerts
  private simulateRealTimeAlerts() {
    setInterval(() => {
      // Simulate new alerts every 30 seconds
      const newAlert: Alert = {
        id: Date.now(),
        type: Math.random() > 0.7 ? 'critical' : Math.random() > 0.5 ? 'warning' : 'info',
        title: 'System Health Check',
        message: 'Routine system health check completed successfully',
        timestamp: new Date(),
        isRead: false,
        category: 'system'
      };
      
      if (Math.random() > 0.8) {
        this.alerts.unshift(newAlert);
      }
    }, 30000);
  }

  // FAB click handler
  onFabClick() {
    if (this.activeTab === 'rules') {
      this.showNewRuleForm = true;
    } else if (this.activeTab === 'reports') {
      this.showNewReportForm = true;
    }
  }
} 