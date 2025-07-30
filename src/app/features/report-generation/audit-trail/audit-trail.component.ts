import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuditTrailService, AuditTrail } from '../audit-trail.service';
import { Subscription } from 'rxjs';

enum ReportType {
  EMPLOYEE = 'employee',
  PAYROLL = 'payroll',
  ATTENDANCE = 'attendance',
  LEAVE = 'leave',
  PERFORMANCE = 'performance',
  CUSTOM = 'custom'
}

@Component({
  selector: 'app-audit-trail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.scss'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class AuditTrailComponent implements OnInit, OnDestroy {
  auditTrails: AuditTrail[] = [];
  private subscription: Subscription = new Subscription();

  auditFilters = {
    dateRange: '',
    department: '',
    action: '',
    status: '',
    reportType: ''
  };

  showViewModal = false;
  selectedAudit: AuditTrail | null = null;
  showNotification = false;
  notificationMessage = '';

  constructor(private auditTrailService: AuditTrailService) { }

  ngOnInit(): void {
    console.log('AuditTrailComponent: ngOnInit called');
    // Subscribe to audit trail updates from service
    this.subscription.add(
      this.auditTrailService.auditTrails$.subscribe(trails => {
        console.log('AuditTrailComponent: Received trails update:', trails.length, 'entries');
        this.auditTrails = trails;
        console.log('Audit trails updated in component:', trails.length, 'entries');
      })
    );
    
    // Log initial state
    const initialTrails = this.auditTrailService.getAuditTrails();
    console.log('AuditTrailComponent: Initial trails from service:', initialTrails.length, 'entries');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Method to show notification
  showNotificationMessage(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      this.showNotification = false;
      this.notificationMessage = '';
    }, 3000);
  }

  exportAuditTrail(): void {
    // TODO: Implement export functionality
    console.log('Exporting audit trail...');
  }

  clearAuditTrail(): void {
    if (confirm('Are you sure you want to clear all audit trail records? This action cannot be undone.')) {
      this.auditTrailService.clearAuditTrails();
    }
  }

  filterAuditTrails(): void {
    // TODO: Implement filter functionality
    console.log('Applying filters:', this.auditFilters);
  }

  deleteAuditTrail(id: string): void {
    if (confirm('Are you sure you want to delete this audit trail record?')) {
      this.auditTrailService.deleteAuditTrail(id);
    }
  }

  viewAuditTrail(audit: AuditTrail): void {
    this.selectedAudit = audit;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedAudit = null;
  }

  getActionIcon(action: string): string {
    switch (action.toLowerCase()) {
      case 'generated': return 'fas fa-file-alt';
      case 'exported': return 'fas fa-file-export';
      case 'printed': return 'fas fa-print';
      case 'modified': return 'fas fa-edit';
      case 'deleted': return 'fas fa-trash';
      default: return 'fas fa-file';
    }
  }

  getActionColor(action: string): string {
    switch (action.toLowerCase()) {
      case 'generated': return '#2563eb';
      case 'exported': return '#16a34a';
      case 'printed': return '#9333ea';
      case 'modified': return '#eab308';
      case 'deleted': return '#dc2626';
      default: return '#6b7280';
    }
  }

  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'success': return 'fas fa-check-circle';
      case 'failed': return 'fas fa-times-circle';
      case 'pending': return 'fas fa-clock';
      default: return 'fas fa-question-circle';
    }
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'success': return '#16a34a';
      case 'failed': return '#dc2626';
      case 'pending': return '#eab308';
      default: return '#6b7280';
    }
  }

  getFormatIcon(format: string): string {
    switch (format.toLowerCase()) {
      case 'csv': return 'fas fa-file-csv';
      case 'excel': return 'fas fa-file-excel';
      case 'pdf': return 'fas fa-file-pdf';
      case 'print': return 'fas fa-print';
      default: return 'fas fa-file';
    }
  }

  getFormatColor(format: string): string {
    switch (format.toLowerCase()) {
      case 'csv': return '#16a34a';
      case 'excel': return '#059669';
      case 'pdf': return '#dc2626';
      case 'print': return '#9333ea';
      default: return '#6b7280';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  // Method to add new audit trail entry from parent component (kept for backward compatibility)
  addAuditTrailEntry(auditEntry: AuditTrail): void {
    // Convert string reportType to enum if needed
    if (typeof auditEntry.reportType === 'string') {
      const reportTypeString = auditEntry.reportType.toLowerCase();
      // Map string values to enum values
      const reportTypeMap: { [key: string]: ReportType } = {
        'employee': ReportType.EMPLOYEE,
        'payroll': ReportType.PAYROLL,
        'attendance': ReportType.ATTENDANCE,
        'leave': ReportType.LEAVE,
        'performance': ReportType.PERFORMANCE,
        'custom': ReportType.CUSTOM
      };
      
      if (reportTypeMap[reportTypeString]) {
        auditEntry.reportType = reportTypeMap[reportTypeString];
      }
    }
    
    // Use service to add the entry
    this.auditTrailService.addAuditTrailEntry(auditEntry);
    
    // Show notification
    const actionText = auditEntry.action.charAt(0).toUpperCase() + auditEntry.action.slice(1);
    this.showNotificationMessage(`${actionText} action logged to audit trail`);
  }

  // Accessibility: Copy audit details to clipboard
  copyAuditDetails(audit: AuditTrail): void {
    const details = `Action: ${audit.action}\nReport Name: ${audit.reportName}\nFormat: ${audit.exportFormat || '-'}\nGenerated By: ${audit.generatedBy}\nDepartment: ${audit.department}\nDate & Time: ${this.formatDate(audit.generatedAt)}\nStatus: ${audit.status}\nFile Size: ${audit.fileSize}\nDownloads: ${audit.downloadCount}`;
    navigator.clipboard.writeText(details).then(() => {
      this.showNotificationMessage('Audit details copied to clipboard');
    });
  }
}
