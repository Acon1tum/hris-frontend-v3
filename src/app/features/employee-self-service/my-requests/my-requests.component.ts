import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Request {
  id: number;
  type: string;
  dateFiled: Date;
  status: 'approved' | 'pending' | 'rejected' | 'cancelled';
  remarks: string;
  attachment?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface RequestTab {
  id: string;
  label: string;
  count?: number;
}

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.scss']
})
export class MyRequestsComponent implements OnInit {
  title = 'My Requests';
  
  // Make Math available in template
  Math = Math;
  
  // Active tab
  activeTab: string = 'all';
  
  // Tab configuration
  tabs: RequestTab[] = [
    { id: 'all', label: 'All Requests' },
    { id: 'pending', label: 'Pending Requests' },
    { id: 'approved', label: 'Approved Requests' },
    { id: 'rejected', label: 'Rejected/Cancelled' }
  ];

  // Search functionality
  searchTerm: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  
  // Modal states
  showNewRequestModal: boolean = false;
  showRequestDetailModal: boolean = false;
  selectedRequest: Request | null = null;
  
  // New request form
  newRequest = {
    type: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    attachment: ''
  };

  // Sample requests data
  requests: Request[] = [
    {
      id: 1,
      type: 'Leave',
      dateFiled: new Date('2023-08-15'),
      status: 'approved',
      remarks: 'Vacation',
      attachment: 'leave-form.pdf',
      description: 'Annual leave for family vacation',
      priority: 'medium'
    },
    {
      id: 2,
      type: 'DTR Adjustment',
      dateFiled: new Date('2023-08-10'),
      status: 'pending',
      remarks: 'Clock-in issue',
      attachment: 'timesheet.pdf',
      description: 'Clock-in system malfunction on August 8th',
      priority: 'high'
    },
    {
      id: 3,
      type: 'Overtime',
      dateFiled: new Date('2023-08-05'),
      status: 'approved',
      remarks: 'Project deadline',
      attachment: 'overtime-form.pdf',
      description: 'Additional hours for project completion',
      priority: 'medium'
    },
    {
      id: 4,
      type: 'Certification',
      dateFiled: new Date('2023-07-20'),
      status: 'rejected',
      remarks: 'Incomplete requirements',
      attachment: 'cert-request.pdf',
      description: 'Employment certification for loan application',
      priority: 'low'
    },
    {
      id: 5,
      type: 'Membership Form',
      dateFiled: new Date('2023-07-10'),
      status: 'approved',
      remarks: 'Gym membership',
      attachment: 'membership-form.pdf',
      description: 'Fitness center membership application',
      priority: 'low'
    },
    {
      id: 6,
      type: 'Work From Home',
      dateFiled: new Date('2023-08-20'),
      status: 'pending',
      remarks: 'Medical reasons',
      attachment: 'medical-cert.pdf',
      description: 'Remote work arrangement due to medical condition',
      priority: 'high'
    },
    {
      id: 7,
      type: 'Training Request',
      dateFiled: new Date('2023-08-18'),
      status: 'approved',
      remarks: 'Professional development',
      attachment: 'training-proposal.pdf',
      description: 'Angular certification course enrollment',
      priority: 'medium'
    },
    {
      id: 8,
      type: 'Equipment Request',
      dateFiled: new Date('2023-08-12'),
      status: 'cancelled',
      remarks: 'Budget constraints',
      attachment: 'equipment-specs.pdf',
      description: 'Additional monitor for workstation',
      priority: 'low'
    }
  ];

  ngOnInit() {
    this.updateTabCounts();
  }

  // Tab management
  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.currentPage = 1;
  }

  updateTabCounts() {
    this.tabs.forEach(tab => {
      switch (tab.id) {
        case 'all':
          tab.count = this.requests.length;
          break;
        case 'pending':
          tab.count = this.requests.filter(r => r.status === 'pending').length;
          break;
        case 'approved':
          tab.count = this.requests.filter(r => r.status === 'approved').length;
          break;
        case 'rejected':
          tab.count = this.requests.filter(r => r.status === 'rejected' || r.status === 'cancelled').length;
          break;
      }
    });
  }

  // Filtering and pagination
  get filteredRequests(): Request[] {
    let filtered = this.requests;

    // Filter by tab
    if (this.activeTab !== 'all') {
      if (this.activeTab === 'rejected') {
        filtered = filtered.filter(r => r.status === 'rejected' || r.status === 'cancelled');
      } else {
        filtered = filtered.filter(r => r.status === this.activeTab);
      }
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.type.toLowerCase().includes(term) ||
        r.remarks.toLowerCase().includes(term) ||
        r.description?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  get paginatedRequests(): Request[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredRequests.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredRequests.length / this.itemsPerPage);
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  // Pagination methods
  nextPage() {
    if (this.hasNextPage) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.hasPreviousPage) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Request management
  openNewRequestModal() {
    this.showNewRequestModal = true;
  }

  closeNewRequestModal() {
    this.showNewRequestModal = false;
    this.resetNewRequestForm();
  }

  resetNewRequestForm() {
    this.newRequest = {
      type: '',
      description: '',
      priority: 'medium',
      attachment: ''
    };
  }

  createNewRequest() {
    if (!this.newRequest.type || !this.newRequest.description) {
      return;
    }

    const request: Request = {
      id: Date.now(),
      type: this.newRequest.type,
      dateFiled: new Date(),
      status: 'pending',
      remarks: 'Newly submitted',
      description: this.newRequest.description,
      priority: this.newRequest.priority,
      attachment: this.newRequest.attachment || undefined
    };

    this.requests.unshift(request);
    this.updateTabCounts();
    this.closeNewRequestModal();
  }

  viewRequest(request: Request) {
    this.selectedRequest = request;
    this.showRequestDetailModal = true;
  }

  closeRequestDetailModal() {
    this.showRequestDetailModal = false;
    this.selectedRequest = null;
  }

  cancelRequest(requestId: number) {
    const request = this.requests.find(r => r.id === requestId);
    if (request && request.status === 'pending') {
      request.status = 'cancelled';
      request.remarks = 'Cancelled by user';
      this.updateTabCounts();
    }
  }

  downloadAttachment(attachment: string) {
    // Simulate file download
    console.log(`Downloading attachment: ${attachment}`);
  }

  // Utility methods
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-default';
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'approved':
        return '✓';
      case 'pending':
        return '⏳';
      case 'rejected':
        return '✗';
      case 'cancelled':
        return '⊘';
      default:
        return '?';
    }
  }

  canCancelRequest(request: Request): boolean {
    return request.status === 'pending';
  }
} 