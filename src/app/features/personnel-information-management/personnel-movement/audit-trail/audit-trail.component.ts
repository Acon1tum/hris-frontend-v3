import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface AuditTrail {
  id: number;
  user: string;
  userRole: string;
  action: string;
  details: string;
  module: string;
  timestamp: Date;
  ipAddress: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

@Component({
  selector: 'app-audit-trail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.scss']
})
export class AuditTrailComponent implements OnInit {
  // Data properties
  auditTrails: AuditTrail[] = [];
  filteredAuditTrails: AuditTrail[] = [];
  paginatedAuditTrails: AuditTrail[] = [];

  // Filter properties
  searchTerm: string = '';
  selectedUser: string = '';
  selectedAction: string = '';
  selectedDateRange: string = '';

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  // Computed properties
  get uniqueUsers(): string[] {
    return [...new Set(this.auditTrails.map(audit => audit.user))];
  }

  get uniqueActions(): string[] {
    return [...new Set(this.auditTrails.map(audit => audit.action))];
  }

  // Math utility for template
  Math = Math;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadMockData();
    this.applyFilters();
  }

  // Navigation methods
  goBack(): void {
    this.router.navigate(['/personnel-information-management/personnel-movement']);
  }

  // Data loading
  loadMockData(): void {
    this.auditTrails = [
      {
        id: 1,
        user: 'John Smith',
        userRole: 'HR Manager',
        action: 'Created',
        details: 'Created new employee record for Sarah Johnson',
        module: 'Personnel Management',
        timestamp: new Date('2024-01-15T09:30:00'),
        ipAddress: '192.168.1.100',
        status: 'success'
      },
      {
        id: 2,
        user: 'Maria Garcia',
        userRole: 'System Admin',
        action: 'Updated',
        details: 'Updated employee salary information for ID #EMP001',
        module: 'Payroll Management',
        timestamp: new Date('2024-01-15T10:15:00'),
        ipAddress: '192.168.1.101',
        status: 'success'
      },
      {
        id: 3,
        user: 'David Chen',
        userRole: 'Department Head',
        action: 'Approved',
        details: 'Approved leave request for Michael Brown',
        module: 'Leave Management',
        timestamp: new Date('2024-01-15T11:00:00'),
        ipAddress: '192.168.1.102',
        status: 'success'
      },
      {
        id: 4,
        user: 'Lisa Wong',
        userRole: 'HR Assistant',
        action: 'Deleted',
        details: 'Deleted duplicate employee record',
        module: 'Personnel Management',
        timestamp: new Date('2024-01-15T12:30:00'),
        ipAddress: '192.168.1.103',
        status: 'warning'
      },
      {
        id: 5,
        user: 'Robert Johnson',
        userRole: 'IT Admin',
        action: 'Login',
        details: 'User logged in from new device',
        module: 'Authentication',
        timestamp: new Date('2024-01-15T13:45:00'),
        ipAddress: '192.168.1.104',
        status: 'info'
      },
      {
        id: 6,
        user: 'Sarah Wilson',
        userRole: 'Manager',
        action: 'Rejected',
        details: 'Rejected overtime request due to budget constraints',
        module: 'Time Management',
        timestamp: new Date('2024-01-15T14:20:00'),
        ipAddress: '192.168.1.105',
        status: 'error'
      },
      {
        id: 7,
        user: 'Michael Brown',
        userRole: 'Employee',
        action: 'Submitted',
        details: 'Submitted expense report for business trip',
        module: 'Expense Management',
        timestamp: new Date('2024-01-15T15:10:00'),
        ipAddress: '192.168.1.106',
        status: 'success'
      },
      {
        id: 8,
        user: 'Jennifer Davis',
        userRole: 'HR Director',
        action: 'Configured',
        details: 'Updated system parameters for new fiscal year',
        module: 'System Administration',
        timestamp: new Date('2024-01-15T16:00:00'),
        ipAddress: '192.168.1.107',
        status: 'success'
      },
      {
        id: 9,
        user: 'Thomas Lee',
        userRole: 'Supervisor',
        action: 'Reviewed',
        details: 'Reviewed performance evaluation for team member',
        module: 'Performance Management',
        timestamp: new Date('2024-01-15T16:45:00'),
        ipAddress: '192.168.1.108',
        status: 'success'
      },
      {
        id: 10,
        user: 'Amanda Taylor',
        userRole: 'Recruiter',
        action: 'Scheduled',
        details: 'Scheduled interview for candidate position',
        module: 'Recruitment',
        timestamp: new Date('2024-01-15T17:30:00'),
        ipAddress: '192.168.1.109',
        status: 'success'
      },
      {
        id: 11,
        user: 'Kevin Martinez',
        userRole: 'Employee',
        action: 'Requested',
        details: 'Requested password reset',
        module: 'Authentication',
        timestamp: new Date('2024-01-15T18:15:00'),
        ipAddress: '192.168.1.110',
        status: 'info'
      },
      {
        id: 12,
        user: 'Rachel Green',
        userRole: 'HR Manager',
        action: 'Exported',
        details: 'Exported employee data for reporting',
        module: 'Report Generation',
        timestamp: new Date('2024-01-15T19:00:00'),
        ipAddress: '192.168.1.111',
        status: 'success'
      }
    ];
  }

  // Filter methods
  onSearch(): void {
    this.applyFilters();
  }

  onFilter(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.auditTrails];

    // Search filter
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(audit =>
        audit.user.toLowerCase().includes(search) ||
        audit.action.toLowerCase().includes(search) ||
        audit.details.toLowerCase().includes(search) ||
        audit.module.toLowerCase().includes(search)
      );
    }

    // User filter
    if (this.selectedUser) {
      filtered = filtered.filter(audit => audit.user === this.selectedUser);
    }

    // Action filter
    if (this.selectedAction) {
      filtered = filtered.filter(audit => audit.action === this.selectedAction);
    }

    // Date range filter
    if (this.selectedDateRange) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (this.selectedDateRange) {
        case 'today':
          filtered = filtered.filter(audit => 
            audit.timestamp >= today
          );
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(audit => 
            audit.timestamp >= weekAgo
          );
          break;
        case 'month':
          const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
          filtered = filtered.filter(audit => 
            audit.timestamp >= monthAgo
          );
          break;
        case 'quarter':
          const quarterAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
          filtered = filtered.filter(audit => 
            audit.timestamp >= quarterAgo
          );
          break;
        case 'year':
          const yearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
          filtered = filtered.filter(audit => 
            audit.timestamp >= yearAgo
          );
          break;
      }
    }

    this.filteredAuditTrails = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedUser = '';
    this.selectedAction = '';
    this.selectedDateRange = '';
    this.applyFilters();
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredAuditTrails.length / this.pageSize);
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedAuditTrails = this.filteredAuditTrails.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  getVisiblePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = this.totalPages - 3; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      }
    }
    
    return pages;
  }

  // Utility methods
  trackByAuditId(index: number, audit: AuditTrail): number {
    return audit.id;
  }

  getCurrentTime(): string {
    return new Date().toLocaleString();
  }

  // Action icon methods
  getActionIcon(action: string): string {
    const iconMap: { [key: string]: string } = {
      'Created': 'add_circle',
      'Updated': 'edit',
      'Deleted': 'delete',
      'Approved': 'check_circle',
      'Rejected': 'cancel',
      'Login': 'login',
      'Logout': 'logout',
      'Submitted': 'send',
      'Configured': 'settings',
      'Reviewed': 'visibility',
      'Scheduled': 'schedule',
      'Requested': 'help',
      'Exported': 'download'
    };
    return iconMap[action] || 'event';
  }

  getActionIconClass(action: string): string {
    const classMap: { [key: string]: string } = {
      'Created': 'text-green-600',
      'Updated': 'text-blue-600',
      'Deleted': 'text-red-600',
      'Approved': 'text-green-600',
      'Rejected': 'text-red-600',
      'Login': 'text-blue-600',
      'Logout': 'text-gray-600',
      'Submitted': 'text-blue-600',
      'Configured': 'text-purple-600',
      'Reviewed': 'text-orange-600',
      'Scheduled': 'text-indigo-600',
      'Requested': 'text-yellow-600',
      'Exported': 'text-green-600'
    };
    return classMap[action] || 'text-gray-600';
  }

  // Status methods
  getStatusClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'success': 'bg-green-100 text-green-800',
      'warning': 'bg-yellow-100 text-yellow-800',
      'error': 'bg-red-100 text-red-800',
      'info': 'bg-blue-100 text-blue-800'
    };
    return classMap[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusDotClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'success': 'bg-green-500',
      'warning': 'bg-yellow-500',
      'error': 'bg-red-500',
      'info': 'bg-blue-500'
    };
    return classMap[status] || 'bg-gray-500';
  }

  // Export functionality
  exportData(): void {
    // Placeholder for export functionality
    console.log('Exporting audit trail data...');
    
    // Create CSV content
    const headers = ['User', 'Role', 'Action', 'Details', 'Module', 'Timestamp', 'IP Address', 'Status'];
    const csvContent = [
      headers.join(','),
      ...this.filteredAuditTrails.map(audit => [
        audit.user,
        audit.userRole,
        audit.action,
        `"${audit.details}"`,
        audit.module,
        audit.timestamp.toISOString(),
        audit.ipAddress,
        audit.status
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-trail-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
