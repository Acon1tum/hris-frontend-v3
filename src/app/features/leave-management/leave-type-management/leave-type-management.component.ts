import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { 
  LeaveTypesService, 
  LeaveType, 
  CreateLeaveTypeRequest, 
  UpdateLeaveTypeRequest 
} from './leave-types.service';

@Component({
  selector: 'app-leave-type-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-type-management.component.html',
  styleUrls: ['./leave-type-management.component.scss']
})
export class LeaveTypeManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  searchTerm = '';
  leaveTypes: LeaveType[] = [];
  
  // Loading and error states
  isLoading = false;
  isSubmitting = false;
  error: string | null = null;

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10;

  // Add modal state
  showAddModal = false;
  addForm: CreateLeaveTypeRequest = { 
    leave_type_name: '', 
    description: '',
    requires_document: false,
    max_days: undefined
  };
  addValidation: any = {};

  // Edit modal state
  showEditModal = false;
  editForm: UpdateLeaveTypeRequest & { id: string } = { 
    id: '',
    leave_type_name: '', 
    description: '',
    requires_document: false,
    max_days: undefined,
    is_active: true
  };
  editValidation: any = {};

  // Delete confirmation modal state
  showDeleteModal = false;
  leaveTypeToDelete: LeaveType | null = null;

  // Toast notification state
  toast = { show: false, message: '', type: '' };
  toastTimeout: any = null;

  constructor(private leaveTypesService: LeaveTypesService) {}

  ngOnInit() {
    this.loadLeaveTypes();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }

  /**
   * Load leave types from the API
   */
  loadLeaveTypes() {
    this.isLoading = true;
    this.error = null;

    this.leaveTypesService.getLeaveTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (leaveTypes) => {
          this.leaveTypes = leaveTypes;
          this.isLoading = false;
        },
        error: (error) => {
          this.error = error.message;
          this.isLoading = false;
          this.showToast('Failed to load leave types: ' + error.message, 'error');
        }
      });
  }

  /**
   * Search functionality
   */
  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.currentPage = 1; // Reset to first page when searching
  }

  /**
   * Open add modal
   */
  onAddLeaveType() {
    this.addForm = { 
      leave_type_name: '', 
      description: '',
      requires_document: false,
      max_days: undefined
    };
    this.addValidation = {};
    this.showAddModal = true;
  }

  /**
   * Open edit modal
   */
  onEditLeaveType(leaveType: LeaveType) {
    this.editForm = { 
      id: leaveType.id,
      leave_type_name: leaveType.leave_type_name, 
      description: leaveType.description || '',
      requires_document: leaveType.requires_document || false,
      max_days: leaveType.max_days,
      is_active: leaveType.is_active
    };
    this.editValidation = {};
    this.showEditModal = true;
  }

  /**
   * Open delete confirmation modal
   */
  onDeleteLeaveType(leaveType: LeaveType) {
    this.leaveTypeToDelete = leaveType;
    this.showDeleteModal = true;
  }

  /**
   * Validate add form
   */
  validateAddForm(): boolean {
    this.addValidation = {};
    let valid = true;

    if (!this.addForm.leave_type_name?.trim()) {
      this.addValidation.leave_type_name = 'Leave type name is required.';
      valid = false;
    }

    if (!this.addForm.description?.trim()) {
      this.addValidation.description = 'Description is required.';
      valid = false;
    }

    if (this.addForm.max_days !== undefined && this.addForm.max_days < 0) {
      this.addValidation.max_days = 'Max days must be a positive number.';
      valid = false;
    }

    return valid;
  }

  /**
   * Submit add form
   */
  submitAddLeaveType() {
    if (!this.validateAddForm()) return;

    this.isSubmitting = true;
    
    const leaveTypeData: CreateLeaveTypeRequest = {
      leave_type_name: this.addForm.leave_type_name!.trim(),
      description: this.addForm.description?.trim(),
      requires_document: this.addForm.requires_document || false,
      max_days: this.addForm.max_days
    };

    this.leaveTypesService.createLeaveType(leaveTypeData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newLeaveType) => {
          // Reload data from server to ensure consistency
          this.loadLeaveTypes();
          this.showAddModal = false;
          this.isSubmitting = false;
          this.showToast('Leave type created successfully!', 'success');
        },
        error: (error) => {
          this.isSubmitting = false;
          this.showToast('Failed to create leave type: ' + error.message, 'error');
        }
      });
  }

  /**
   * Validate edit form
   */
  validateEditForm(): boolean {
    this.editValidation = {};
    let valid = true;

    if (!this.editForm.leave_type_name?.trim()) {
      this.editValidation.leave_type_name = 'Leave type name is required.';
      valid = false;
    }

    if (!this.editForm.description?.trim()) {
      this.editValidation.description = 'Description is required.';
      valid = false;
    }

    if (this.editForm.max_days !== undefined && this.editForm.max_days < 0) {
      this.editValidation.max_days = 'Max days must be a positive number.';
      valid = false;
    }

    return valid;
  }

  /**
   * Submit edit form
   */
  submitEditLeaveType() {
    if (!this.validateEditForm()) return;

    this.isSubmitting = true;

    const updateData: UpdateLeaveTypeRequest = {
      leave_type_name: this.editForm.leave_type_name?.trim(),
      description: this.editForm.description?.trim(),
      requires_document: this.editForm.requires_document,
      max_days: this.editForm.max_days,
      is_active: this.editForm.is_active
    };

    this.leaveTypesService.updateLeaveType(this.editForm.id, updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedLeaveType) => {
          // Reload data from server to ensure consistency
          this.loadLeaveTypes();
          this.showEditModal = false;
          this.isSubmitting = false;
          this.showToast('Leave type updated successfully!', 'success');
        },
        error: (error) => {
          this.isSubmitting = false;
          this.showToast('Failed to update leave type: ' + error.message, 'error');
        }
      });
  }

  /**
   * Confirm delete leave type
   */
  confirmDeleteLeaveType() {
    if (!this.leaveTypeToDelete) return;

    this.isSubmitting = true;

    this.leaveTypesService.deleteLeaveType(this.leaveTypeToDelete.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Reload data from server to ensure consistency
          this.loadLeaveTypes();
          this.showDeleteModal = false;
          this.leaveTypeToDelete = null;
          this.isSubmitting = false;
          this.showToast('Leave type deleted successfully!', 'success');
        },
        error: (error) => {
          this.isSubmitting = false;
          this.showToast('Failed to delete leave type: ' + error.message, 'error');
        }
      });
  }

  /**
   * Cancel delete operation
   */
  cancelDeleteLeaveType() {
    this.showDeleteModal = false;
    this.leaveTypeToDelete = null;
  }

  /**
   * Show toast notification
   */
  showToast(message: string, type: string = 'info', duration: number = 3000) {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    
    this.toastTimeout = setTimeout(() => {
      this.toast.show = false;
    }, duration);
  }

  /**
   * Retry loading leave types
   */
  retryLoad() {
    this.loadLeaveTypes();
  }

  // Computed properties for filtered and paginated data
  get filteredLeaveTypes() {
    if (!this.searchTerm) {
      return this.leaveTypes;
    }
    return this.leaveTypes.filter(leaveType => 
      leaveType.leave_type_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (leaveType.description && leaveType.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  get paginatedLeaveTypes() {
    const filtered = this.filteredLeaveTypes;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }

  get totalPages() {
    return Math.ceil(this.filteredLeaveTypes.length / this.itemsPerPage);
  }

  get displayStart() {
    if (this.filteredLeaveTypes.length === 0) return 0;
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get displayEnd() {
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, this.filteredLeaveTypes.length);
  }

  get displayTotal() {
    return this.filteredLeaveTypes.length;
  }

  // Pagination methods
  onPageChange(page: number): void {
    this.currentPage = page;
  }

  getPaginationPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
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

  get canGoToPrevious() {
    return this.currentPage > 1;
  }

  get canGoToNext() {
    return this.currentPage < this.totalPages;
  }

  trackByLeaveTypeId(index: number, leaveType: LeaveType): string {
    return leaveType.id;
  }
} 