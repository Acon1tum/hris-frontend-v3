import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AuditLog {
  id: number;
  username: string;
  dateTime: string;
  module: string;
  action: string;
  actionType: 'created' | 'updated' | 'deleted' | 'assigned' | 'revoked' | 'login';
  historicalValue: string;
  ipAddress: string;
}

@Component({
  selector: 'app-audit-trail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.scss']
})
export class AuditTrailComponent {
  searchTerm = '';
  
  auditLogs: AuditLog[] = [
    {
      id: 1,
      username: 'Alex Turner',
      dateTime: '2024-03-15 10:30 AM',
      module: 'User Management',
      action: 'User Created',
      actionType: 'created',
      historicalValue: 'N/A → Alex Turner',
      ipAddress: '192.168.1.100'
    },
    {
      id: 2,
      username: 'Olivia Bennett',
      dateTime: '2024-03-15 11:45 AM',
      module: 'Role Management',
      action: 'Role Assigned',
      actionType: 'assigned',
      historicalValue: 'Editor → Admin',
      ipAddress: '192.168.1.101'
    },
    {
      id: 3,
      username: 'Ethan Carter',
      dateTime: '2024-03-15 12:00 PM',
      module: 'Parameter Management',
      action: 'Parameter Updated',
      actionType: 'updated',
      historicalValue: 'Value A → Value B',
      ipAddress: '192.168.1.102'
    },
    {
      id: 4,
      username: 'Sophia Davis',
      dateTime: '2024-03-15 01:15 PM',
      module: 'User Management',
      action: 'User Deleted',
      actionType: 'deleted',
      historicalValue: 'Sophia Davis → N/A',
      ipAddress: '192.168.1.103'
    },
    {
      id: 5,
      username: 'Liam Foster',
      dateTime: '2024-03-15 02:30 PM',
      module: 'Role Management',
      action: 'Role Revoked',
      actionType: 'revoked',
      historicalValue: 'Admin → Editor',
      ipAddress: '192.168.1.104'
    },
    {
      id: 6,
      username: 'Ava Green',
      dateTime: '2024-03-15 03:45 PM',
      module: 'Parameter Management',
      action: 'Parameter Created',
      actionType: 'created',
      historicalValue: 'N/A → Value C',
      ipAddress: '192.168.1.105'
    },
    {
      id: 7,
      username: 'Noah Harris',
      dateTime: '2024-03-15 04:00 PM',
      module: 'User Management',
      action: 'User Updated',
      actionType: 'updated',
      historicalValue: 'Details A → Details B',
      ipAddress: '192.168.1.106'
    },
    {
      id: 8,
      username: 'Mia Jackson',
      dateTime: '2024-03-15 05:15 PM',
      module: 'Role Management',
      action: 'Role Updated',
      actionType: 'updated',
      historicalValue: 'Permissions A → Permissions B',
      ipAddress: '192.168.1.107'
    },
    {
      id: 9,
      username: 'Caleb King',
      dateTime: '2024-03-15 06:30 PM',
      module: 'Parameter Management',
      action: 'Parameter Deleted',
      actionType: 'deleted',
      historicalValue: 'Value C → N/A',
      ipAddress: '192.168.1.108'
    },
    {
      id: 10,
      username: 'Isabella Lewis',
      dateTime: '2024-03-15 07:45 PM',
      module: 'User Management',
      action: 'User Login',
      actionType: 'login',
      historicalValue: 'N/A → Success',
      ipAddress: '192.168.1.109'
    }
  ];

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 97;

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.currentPage = 1; // Reset to first page when searching
  }

  onFilter() {
    console.log('Filter button clicked');
    // Implementation for opening filter modal/dropdown
  }

  get filteredLogs() {
    if (!this.searchTerm) {
      return this.auditLogs;
    }
    return this.auditLogs.filter(log => 
      log.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get paginatedLogs() {
    const filtered = this.filteredLogs;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }

  get totalPages() {
    return Math.ceil(this.filteredLogs.length / this.itemsPerPage);
  }

  get displayStart() {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get displayEnd() {
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, this.filteredLogs.length);
  }

  onPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  onNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  getActionBadgeClass(actionType: string): string {
    const classes = {
      'created': 'action-created',
      'updated': 'action-updated', 
      'deleted': 'action-deleted',
      'assigned': 'action-assigned',
      'revoked': 'action-revoked',
      'login': 'action-login'
    };
    return classes[actionType as keyof typeof classes] || 'action-default';
  }

  trackByLogId(index: number, log: AuditLog): number {
    return log.id;
  }
} 