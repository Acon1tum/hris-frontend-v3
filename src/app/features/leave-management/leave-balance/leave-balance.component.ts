import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { LeaveBalanceService, EmployeeLeaveBalance, Department, LeaveBalanceFilter, LeaveAdjustmentRequest, LeaveAdjustment, LeaveType } from './leave-balance.service';
import { PersonnelService, Employee } from '../../personnel-information-management/personnel.service';

@Component({
  selector: 'app-leave-balance',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './leave-balance.component.html',
  styleUrls: ['./leave-balance.component.scss']
})
export class LeaveBalanceComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Component state
  title = 'Leave Balances';
  subtitle = 'Manage and view leave balances for all employees.';
  
  // Data properties
  employees: EmployeeLeaveBalance[] = [];
  filteredEmployees: EmployeeLeaveBalance[] = [];
  departments: Department[] = [];
  allPersonnel: Employee[] = []; // For employee dropdown in adjust modal
  leaveTypes: LeaveType[] = []; // For leave type dropdown in adjust modal
  
  // UI state
  isLoading = false;
  isExporting = false;
  isBulkInitializing = false;
  error = '';
  
  // Filters
  searchTerm = '';
  selectedDepartment = '';
  selectedYear = new Date().getFullYear().toString();
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalResults = 0;
  totalPages = 0;

  // Modal states
  showEmployeeModal = false;
  showEmployeeAdjustModal = false;
  showBulkInitializeModal = false;
  showBulkInitializeSuccessModal = false;
  selectedEmployee: EmployeeLeaveBalance | null = null;
  selectedEmployeeForAdjust: EmployeeLeaveBalance | null = null;
  
  // Adjustment form
  adjustmentForm: FormGroup;
  isSubmittingAdjustment = false;
  adjustmentError = '';
  
  // Adjustment history
  adjustmentHistory: LeaveAdjustment[] = [];
  showAdjustmentHistory = false;
  isLoadingHistory = false;
  
  // Bulk initialization result
  bulkInitializeResult: any = null;
  personnelToReceiveCredits: any[] = [];
  personnelWithExistingCredits: any[] = [];

  constructor(
    private leaveBalanceService: LeaveBalanceService,
    private personnelService: PersonnelService,
    private formBuilder: FormBuilder
  ) {
    this.adjustmentForm = this.formBuilder.group({
      personnel_id: ['', Validators.required],
      leave_type_id: ['', Validators.required],
      year: [new Date().getFullYear().toString(), Validators.required],
      adjustment_type: ['increase', Validators.required],
      adjustment_amount: [0, [Validators.required, Validators.min(0.01)]],
      reason: ['', [Validators.required, Validators.minLength(10)]]
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
    try {
      await Promise.all([
        this.loadDepartments(),
        this.loadLeaveBalances(),
        this.loadAllPersonnel(),
        this.loadLeaveTypes() // Load leave types here
      ]);
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  }

  /**
   * Load departments for filtering
   */
  private loadDepartments(): Promise<void> {
    return new Promise((resolve) => {
      this.leaveBalanceService.getDepartments()
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
   * Load leave balances from backend
   */
  loadLeaveBalances(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.isLoading = true;
      this.error = '';
      
      const filters: LeaveBalanceFilter = {};
      
      if (this.selectedDepartment) {
        filters.department_id = this.selectedDepartment;
      }
      
      if (this.selectedYear) {
        filters.year = this.selectedYear;
      }

      this.leaveBalanceService.getLeaveBalanceReport(filters)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (employees) => {
            this.employees = employees;
            this.applyFilters();
            this.isLoading = false;
            resolve();
          },
          error: (error) => {
            this.error = error.message;
            this.employees = [];
            this.filteredEmployees = [];
            this.isLoading = false;
            reject(error);
          }
        });
    });
  }

  /**
   * Load all personnel for employee dropdown
   */
  private loadAllPersonnel(): Promise<void> {
    return new Promise((resolve) => {
      this.personnelService.getPersonnel(1, 1000, '') // Get all personnel (1000 limit should be enough)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.allPersonnel = response.data;
            resolve();
          },
          error: (error) => {
            console.error('Error loading personnel:', error);
            resolve();
          }
        });
    });
  }

  /**
   * Load leave types for the adjustment modal
   */
  private loadLeaveTypes(): Promise<void> {
    return new Promise((resolve) => {
      this.leaveBalanceService.getLeaveTypes()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (leaveTypes) => {
            this.leaveTypes = leaveTypes;
            resolve();
          },
          error: (error) => {
            console.error('Error loading leave types:', error);
            resolve(); // Don't fail the whole initialization
          }
        });
    });
  }

  /**
   * Apply search and pagination filters
   */
  applyFilters(): void {
    let filtered = [...this.employees];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(employee =>
        employee.name.toLowerCase().includes(searchLower) ||
        employee.id.toLowerCase().includes(searchLower) ||
        employee.department.toLowerCase().includes(searchLower)
      );
    }

    this.totalResults = filtered.length;
    this.totalPages = Math.ceil(this.totalResults / this.itemsPerPage);

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredEmployees = filtered.slice(startIndex, endIndex);
  }

  /**
   * Handle search input changes
   */
  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  /**
   * Handle department filter changes
   */
  onDepartmentChange(): void {
    this.currentPage = 1;
    this.loadLeaveBalances();
  }

  /**
   * Handle year filter changes
   */
  onYearChange(): void {
    this.currentPage = 1;
    this.loadLeaveBalances();
  }

  /**
   * Handle pagination changes
   */
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  /**
   * Get pagination pages array
   */
  getPaginationPages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, this.currentPage - halfVisible);
      let end = Math.min(this.totalPages, start + maxVisiblePages - 1);
      
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  /**
   * Refresh data
   */
  refreshData(): void {
    this.loadLeaveBalances();
  }

  /**
   * View employee details
   */
  viewDetails(employee: EmployeeLeaveBalance): void {
    this.selectedEmployee = employee;
      this.showEmployeeModal = true;
  }

  /**
   * Close employee details modal
   */
  closeEmployeeModal(): void {
    this.showEmployeeModal = false;
    this.selectedEmployee = null;
  }

  /**
   * Open adjust credits modal
   */
  adjustCredits(employee?: EmployeeLeaveBalance): void {
    this.selectedEmployeeForAdjust = employee || null;
    this.adjustmentError = '';
    
    if (employee) {
      this.adjustmentForm.patchValue({
        personnel_id: employee.id,
        year: this.selectedYear
      });
    } else {
      this.adjustmentForm.patchValue({
        personnel_id: '',
        year: this.selectedYear
      });
    }
    
    this.showEmployeeAdjustModal = true;
  }

  /**
   * Close adjust credits modal
   */
  closeEmployeeAdjustModal(): void {
    this.showEmployeeAdjustModal = false;
    this.selectedEmployeeForAdjust = null;
    this.adjustmentForm.reset({
      personnel_id: '',
      leave_type_id: '',
      year: new Date().getFullYear().toString(),
      adjustment_type: 'increase',
      adjustment_amount: 0,
      reason: ''
    });
    this.adjustmentError = '';
  }

  /**
   * Export to CSV
   */
  exportToCSV(): void {
    if (this.employees.length === 0) {
      alert('No data to export');
      return;
    }

    this.isExporting = true;
    try {
      this.leaveBalanceService.exportToCSV(this.employees);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      alert('Error exporting to CSV');
    } finally {
      this.isExporting = false;
    }
  }

  /**
   * Export to PDF
   */
  exportToPDF(): void {
    if (this.employees.length === 0) {
      alert('No data to export');
      return;
    }

    this.isExporting = true;
    try {
      this.leaveBalanceService.exportToPDF(this.employees);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Error exporting to PDF');
    } finally {
      this.isExporting = false;
    }
  }

  /**
   * Initialize leave balance for specific employee
   */
  initializeBalance(employee: EmployeeLeaveBalance): void {
    this.leaveBalanceService.initializeLeaveBalance(employee.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.refreshData();
        },
        error: (error) => {
          console.error('Error initializing balance:', error);
          alert('Error initializing leave balance');
        }
      });
  }

  /**
   * Bulk initialize leave credits for all personnel without credits
   */
  bulkInitializeCredits(): void {
    this.isBulkInitializing = true;
    this.error = '';

    // First, get the preview data to show what will be created
    this.leaveBalanceService.previewBulkInitializeLeaveBalances(this.selectedYear)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.isBulkInitializing = false;
          this.personnelToReceiveCredits = result.personnelToReceiveCredits || [];
          this.personnelWithExistingCredits = result.personnelWithExistingCredits || [];
          this.showBulkInitializeModal = true;
        },
        error: (error) => {
          this.isBulkInitializing = false;
          this.error = error.message || 'An error occurred while loading personnel data';
          console.error('Error loading personnel data:', error);
          alert('Error: ' + this.error);
        }
      });
  }

  /**
   * Close bulk initialize modal
   */
  closeBulkInitializeModal(): void {
    this.showBulkInitializeModal = false;
  }

  /**
   * Confirm bulk initialize leave credits
   */
  confirmBulkInitialize(): void {
    this.isBulkInitializing = true;
    this.error = '';

    this.leaveBalanceService.bulkInitializeLeaveBalances(this.selectedYear)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.isBulkInitializing = false;
          this.refreshData();
          this.closeBulkInitializeModal();
          this.showBulkInitializeSuccessModal = true;
          this.bulkInitializeResult = result; // Store result for display
          this.personnelToReceiveCredits = result.personnel_to_receive_credits || [];
          this.personnelWithExistingCredits = result.personnel_with_existing_credits || [];
        },
        error: (error) => {
          this.isBulkInitializing = false;
          this.error = error.message || 'An error occurred while bulk initializing leave credits';
          console.error('Error bulk initializing leave credits:', error);
          alert('Error: ' + this.error);
        }
      });
  }

  /**
   * Close bulk initialize success modal
   */
  closeBulkInitializeSuccessModal(): void {
    this.showBulkInitializeSuccessModal = false;
    this.bulkInitializeResult = null;
    this.personnelToReceiveCredits = [];
    this.personnelWithExistingCredits = [];
  }

  /**
   * Get leave balance by type name
   */
  getLeaveBalanceByType(employee: EmployeeLeaveBalance, leaveTypeName: string): number {
    const balance = employee.leave_balances.find(
      balance => balance.leave_type.leave_type_name === leaveTypeName
    );
    return balance ? (balance.total_credits - balance.used_credits) : 0;
  }

  /**
   * Get total accrued credits for display
   */
  getTotalAccrued(employee: EmployeeLeaveBalance): number {
    return employee.total_accrued;
  }

  /**
   * Get total used credits for display
   */
  getTotalUsed(employee: EmployeeLeaveBalance): number {
    return employee.total_used;
  }

  /**
   * Get total remaining credits for display
   */
  getTotalRemaining(employee: EmployeeLeaveBalance): number {
    return employee.total_remaining;
  }

  /**
   * Get progress percentage for remaining credits
   */
  getProgressPercentage(employee: EmployeeLeaveBalance): number {
    if (employee.total_accrued === 0) return 0;
    return Math.round((employee.total_remaining / employee.total_accrued) * 100);
  }

  /**
   * Get progress bar color based on remaining percentage
   */
  getProgressColor(percentage: number): string {
    if (percentage <= 25) return 'danger';
    if (percentage <= 50) return 'warning';
    return 'success';
  }

  /**
   * Get year options for filter
   */
  getYearOptions(): number[] {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let i = currentYear - 2; i <= currentYear + 1; i++) {
      years.push(i);
    }
    return years;
  }

  /**
   * Submit leave credit adjustment
   */
  submitAdjustment(): void {
    if (this.adjustmentForm.invalid) {
      this.adjustmentError = 'Please fill in all required fields correctly.';
      // Mark all fields as touched to show validation errors
      Object.keys(this.adjustmentForm.controls).forEach(key => {
        this.adjustmentForm.get(key)?.markAsTouched();
      });
      return;
    }

    // Additional validation for adjustment amount vs current balance
    if (this.adjustmentForm.get('adjustment_type')?.value === 'decrease') {
      const currentBalance = this.getCurrentBalance();
      const adjustmentAmount = this.adjustmentForm.get('adjustment_amount')?.value;
      
      if (adjustmentAmount > currentBalance) {
        this.adjustmentError = `Adjustment amount (${adjustmentAmount}) cannot exceed current balance (${currentBalance})`;
        return;
      }
    }

    this.isSubmittingAdjustment = true;
    this.adjustmentError = '';

    const adjustmentRequest: LeaveAdjustmentRequest = this.adjustmentForm.value;

    this.leaveBalanceService.createLeaveAdjustment(adjustmentRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (adjustment) => {
          this.isSubmittingAdjustment = false;
          this.closeEmployeeAdjustModal();
          this.refreshData();
          alert('Leave credit adjustment created successfully!');
        },
        error: (error) => {
          this.isSubmittingAdjustment = false;
          this.adjustmentError = error.message || 'An error occurred while creating the adjustment';
          console.error('Error creating adjustment:', error);
        }
      });
  }

  /**
   * Load adjustment history for employee
   */
  loadAdjustmentHistory(employee: EmployeeLeaveBalance): void {
    this.isLoadingHistory = true;
    this.selectedEmployeeForAdjust = employee;
    
    this.leaveBalanceService.getPersonnelAdjustments(employee.id, this.selectedYear)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.adjustmentHistory = result.adjustments;
          this.isLoadingHistory = false;
          this.showAdjustmentHistory = true;
        },
        error: (error) => {
          this.isLoadingHistory = false;
          console.error('Error loading adjustment history:', error);
          alert('Error loading adjustment history');
        }
      });
  }

  /**
   * Close adjustment history modal
   */
  closeAdjustmentHistory(): void {
    this.showAdjustmentHistory = false;
    this.adjustmentHistory = [];
    this.selectedEmployeeForAdjust = null;
  }

  /**
   * Get available leave types for selected employee
   */
  getAvailableLeaveTypes(): LeaveType[] {
    return this.leaveTypes;
  }

  /**
   * Get current balance for selected leave type
   */
  getCurrentBalance(): number {
    const personnelId = this.adjustmentForm.get('personnel_id')?.value;
    const leaveTypeId = this.adjustmentForm.get('leave_type_id')?.value;
    
    if (!personnelId || !leaveTypeId) return 0;
    
    const employee = this.employees.find(emp => emp.id === personnelId);
    if (!employee) {
      // If employee not found in leave balance data, return 0 (no balance yet)
      return 0;
    }
    
    const balance = employee.leave_balances.find(bal => bal.leave_type.id === leaveTypeId);
    return balance ? balance.total_credits : 0;
  }

  /**
   * Format adjustment type for display
   */
  formatAdjustmentType(type: string): string {
    return type === 'increase' ? 'Credit' : 'Debit';
  }

  /**
   * Get adjustment type class for styling
   */
  getAdjustmentTypeClass(type: string): string {
    return type === 'increase' ? 'text-green-600' : 'text-red-600';
  }

  /**
   * Handle employee selection change
   */
  onEmployeeSelectionChange(): void {
    // Reset leave type when employee changes
    this.adjustmentForm.patchValue({
      leave_type_id: ''
    });
  }
} 