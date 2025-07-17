import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { 
  LeaveRequestManagementService, 
  LeaveApplication, 
  LeaveApplicationFilter, 
  Department, 
  Personnel 
} from './leave-request-management.service';

@Component({
  selector: 'app-leave-request-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './leave-request-management.component.html',
  styleUrls: ['./leave-request-management.component.scss']
})
export class LeaveRequestManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data properties
  leaveApplications: LeaveApplication[] = [];
  departments: Department[] = [];
  personnel: Personnel[] = [];
  
  // Loading and error states
  isLoading = false;
  error: string | null = null;

  // Filtering and pagination
  filters: LeaveApplicationFilter = {};
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  // Search
  searchTerm = '';

  // Modal states
  showApprovalModal = false;
  selectedApplication: LeaveApplication | null = null;
  approvalType: 'approve' | 'reject' = 'approve';
  approvalForm: FormGroup;
  isSubmitting = false;

  // Toast notification
  toast = {
    show: false,
    message: '',
    type: 'info'
  };

  // Filter options
  statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' }
  ];

  constructor(
    private leaveRequestService: LeaveRequestManagementService,
    private fb: FormBuilder
  ) {
    this.approvalForm = this.fb.group({
      comments: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize component data
   */
  private async initializeData(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      // Load filter options
      await Promise.all([
        this.loadDepartments(),
        this.loadPersonnel()
      ]);

      // Load leave applications
      await this.loadLeaveApplications();
    } catch (error: any) {
      this.error = error.message || 'Failed to load data';
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Load departments for filtering
   */
  private loadDepartments(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.leaveRequestService.getDepartments()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (departments) => {
            this.departments = departments;
            resolve();
          },
          error: (error) => {
            console.error('Error loading departments:', error);
            resolve(); // Don't fail the whole initialization
          }
        });
    });
  }

  /**
   * Load personnel for filtering
   */
  private loadPersonnel(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.leaveRequestService.getPersonnel()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (personnel) => {
            this.personnel = personnel;
            resolve();
          },
          error: (error) => {
            console.error('Error loading personnel:', error);
            resolve(); // Don't fail the whole initialization
          }
        });
    });
  }

  /**
   * Load leave applications with current filters
   */
  loadLeaveApplications(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.isLoading = true;
      
      const filterParams: LeaveApplicationFilter = {
        ...this.filters,
        page: this.currentPage,
        limit: this.itemsPerPage
      };

      this.leaveRequestService.getLeaveApplications(filterParams)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result) => {
            // Ensure applications is always an array
            this.leaveApplications = Array.isArray(result.applications) ? result.applications : [];
            this.totalItems = result.pagination?.total || 0;
            this.totalPages = result.pagination?.totalPages || 0;
            this.isLoading = false;
            resolve();
          },
          error: (error) => {
            this.error = error.message;
            this.leaveApplications = []; // Reset to empty array on error
            this.isLoading = false;
            reject(error);
          }
        });
    });
  }

  /**
   * Apply filters and reload data
   */
  onApplyFilters(): void {
    this.currentPage = 1;
    this.loadLeaveApplications();
  }

  /**
   * Clear all filters
   */
  onClearFilters(): void {
    this.filters = {};
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadLeaveApplications();
  }

  /**
   * Handle search input
   */
  onSearch(): void {
    // Implement search logic if needed
    this.onApplyFilters();
  }

  /**
   * Handle pagination change
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadLeaveApplications();
  }

  /**
   * Open approval modal
   */
  openApprovalModal(application: LeaveApplication, type: 'approve' | 'reject'): void {
    this.selectedApplication = application;
    this.approvalType = type;
    this.showApprovalModal = true;
    this.approvalForm.reset();
  }

  /**
   * Close approval modal
   */
  closeApprovalModal(): void {
    this.showApprovalModal = false;
    this.selectedApplication = null;
    this.approvalForm.reset();
  }

  /**
   * Submit approval/rejection
   */
  onSubmitApproval(): void {
    if (!this.selectedApplication || this.isSubmitting) return;

    this.isSubmitting = true;
    const comments = this.approvalForm.get('comments')?.value || '';

    const request = this.approvalType === 'approve' 
      ? this.leaveRequestService.approveApplication(this.selectedApplication.id, comments)
      : this.leaveRequestService.rejectApplication(this.selectedApplication.id, comments);

    request.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedApplication) => {
          this.showToast(
            `Leave application ${this.approvalType === 'approve' ? 'approved' : 'rejected'} successfully!`,
            'success'
          );
          this.closeApprovalModal();
          this.loadLeaveApplications();
          this.isSubmitting = false;
        },
        error: (error) => {
          this.showToast(
            `Failed to ${this.approvalType} application: ${error.message}`,
            'error'
          );
          this.isSubmitting = false;
      }
    });
  }

  /**
   * Get supporting document URL
   */
  getSupportingDocumentUrl(documentPath: string): string {
    return this.leaveRequestService.getSupportingDocumentUrl(documentPath);
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Get status badge class
   */
  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-default';
    }
  }

  /**
   * Get full employee name
   */
  getEmployeeName(application: LeaveApplication): string {
    return `${application.personnel.first_name} ${application.personnel.last_name}`;
  }

  /**
   * Get department name
   */
  getDepartmentName(application: LeaveApplication): string {
    return application.personnel.department?.department_name || 'No Department';
  }

  /**
   * Show toast notification
   */
  showToast(message: string, type: string = 'info'): void {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    
    setTimeout(() => {
      this.toast.show = false;
    }, 5000);
  }

  /**
   * Track by function for ngFor
   */
  trackByApplicationId(index: number, application: LeaveApplication): string {
    return application.id;
  }

  /**
   * Check if document is an image
   */
  isImageFile(filename: string | undefined): boolean {
    if (!filename) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }

  /**
   * Check if document is a PDF
   */
  isPdfFile(filename: string | undefined): boolean {
    if (!filename) return false;
    return filename.toLowerCase().endsWith('.pdf');
  }

  /**
   * Retry loading data
   */
  retryLoad(): void {
    this.initializeData();
  }

  /**
   * Handle image loading errors
   */
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.style.display = 'none';
  }

  /**
   * Get pagination pages array
   */
  getPaginationPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
} 