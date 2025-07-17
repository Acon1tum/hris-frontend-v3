import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LeaveEmployeeService, LeaveType, LeaveBalance, LeaveApplication, CreateLeaveApplicationRequest } from './leave-employee.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-leave-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './leave-employee.component.html',
  styleUrls: ['./leave-employee.component.scss']
})
export class LeaveEmployeeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  leaveTypes: LeaveType[] = [];
  leaveBalances: LeaveBalance[] = [];
  leaveApplications: LeaveApplication[] = [];

  leaveForm: FormGroup;
  selectedLeaveType: LeaveType | null = null;
  selectedLeaveBalance: LeaveBalance | null = null;

  isLoading = false;
  isSubmitting = false;
  error: string | null = null;

  showApplyForm = false;
  showViewModal = false;
  showSuccessModal = false;
  selectedApplication: LeaveApplication | null = null;

  selectedFile: File | null = null;
  uploadedFileName: string | null = null;

  validationErrors: string[] = [];
  formSubmitted = false;

  today = new Date();

  totalLeaves = 0;
  pendingLeaves = 0;
  approvedLeaves = 0;
  rejectedLeaves = 0;
  totalDaysTaken = 0;
  mostUsedType = '';

  toast: { show: boolean; title: string; message: string; type: string } | null = null;
  toastTimeout: any = null;

  constructor(
    private leaveService: LeaveEmployeeService,
    private fb: FormBuilder
  ) {
    this.leaveForm = this.fb.group({
      leave_type_id: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      reason: [''],
      supporting_document: [''],
      total_days: [0]
    });
  }

  ngOnInit() {
    this.loadInitialData();
    this.leaveForm.get('leave_type_id')?.valueChanges.subscribe((leaveTypeId: string) => {
      this.onLeaveTypeChange(leaveTypeId);
    });
    this.leaveForm.get('start_date')?.valueChanges.subscribe(() => this.calculateTotalDays());
    this.leaveForm.get('end_date')?.valueChanges.subscribe(() => this.calculateTotalDays());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialData() {
    this.isLoading = true;
    this.error = null;
    forkJoin({
      leaveTypes: this.leaveService.getLeaveTypes(),
      leaveBalances: this.leaveService.getMyLeaveBalance(),
      leaveApplications: this.leaveService.getMyLeaveApplications()
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: { leaveTypes: LeaveType[]; leaveBalances: LeaveBalance[]; leaveApplications: LeaveApplication[] }) => {
        this.leaveTypes = data.leaveTypes.filter((type: LeaveType) => type.is_active);
        this.leaveBalances = data.leaveBalances;
        this.leaveApplications = data.leaveApplications;
        this.updateMetrics();
        this.isLoading = false;
      },
      error: (error: any) => {
        this.error = error.message;
        this.isLoading = false;
        this.showToast('Error', 'Failed to load data', 'error');
      }
    });
  }

  onApplyLeave() {
    this.resetForm();
    this.showApplyForm = true;
  }

  onViewLeave(leave: LeaveApplication): void {
    this.selectedApplication = leave;
    this.showViewModal = true;
  }

  onCancelLeave(leave: LeaveApplication) {
    if (leave.status === 'Pending') {
      if (confirm('Are you sure you want to cancel this leave application?')) {
        this.leaveService.cancelLeaveApplication(leave.id).pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            this.leaveApplications = this.leaveApplications.filter(app => app.id !== leave.id);
            this.updateMetrics();
            this.showToast('Success', 'Leave cancellation completed.', 'success');
          },
          error: (error: any) => {
            this.showToast('Error', error.message, 'error');
          }
        });
      }
    }
  }

  updateTotalDays(): void {
    if (this.leaveForm.value.start_date && this.leaveForm.value.end_date) {
      const start = new Date(this.leaveForm.value.start_date);
      const end = new Date(this.leaveForm.value.end_date);
      const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;
      this.leaveForm.get('total_days')?.setValue(diff > 0 ? diff : 0);
    } else {
      this.leaveForm.get('total_days')?.setValue(0);
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadedFileName = file.name;
    } else {
      this.selectedFile = null;
      this.uploadedFileName = '';
    }
  }

  validateForm(): boolean {
    this.validationErrors = [];
    let valid = true;
    if (!this.leaveForm.value.leave_type_id) {
      this.validationErrors.push('Leave type is required.');
      valid = false;
    }
    if (!this.leaveForm.value.start_date) {
      this.validationErrors.push('Start date is required.');
      valid = false;
    }
    if (!this.leaveForm.value.end_date) {
      this.validationErrors.push('End date is required.');
      valid = false;
    }
    if (!this.leaveForm.value.reason || !this.leaveForm.value.reason.trim()) {
      this.validationErrors.push('Reason is required.');
      valid = false;
    }
    // Additional: End date must not be before start date
    if (this.leaveForm.value.start_date && this.leaveForm.value.end_date) {
      if (new Date(this.leaveForm.value.end_date) < new Date(this.leaveForm.value.start_date)) {
        this.validationErrors.push('End date cannot be before start date.');
        valid = false;
      }
    }
    return valid;
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (!this.validateForm()) {
      return;
    }
    this.isSubmitting = true;
    // Simulate loading/progress (e.g. 1.5s)
    setTimeout(() => {
      this.isSubmitting = false;
      this.showSuccessModal = true;
      const newLeave: CreateLeaveApplicationRequest = {
        leave_type_id: this.leaveForm.value.leave_type_id,
        start_date: this.leaveForm.value.start_date,
        end_date: this.leaveForm.value.end_date,
        total_days: this.leaveForm.value.total_days,
        reason: this.leaveForm.value.reason,
        supporting_document: this.selectedFile
      };
      this.leaveService.createLeaveApplication(newLeave).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response: LeaveApplication) => {
          this.leaveApplications.unshift(response);
          this.showApplyForm = false;
          this.resetForm();
          this.updateMetrics();
          this.formSubmitted = false;
          this.showToast('Success', 'Leave application submitted successfully.', 'success');
          // Auto-close success modal after 1.5s
          setTimeout(() => {
            this.showSuccessModal = false;
          }, 1500);
        },
        error: (error: any) => {
          this.showToast('Error', error.message, 'error');
          this.isSubmitting = false;
        }
      });
    }, 1500);
  }

  resetForm() {
    this.leaveForm.reset();
    this.leaveForm.get('total_days')?.setValue(0);
    this.selectedFile = null;
    this.uploadedFileName = '';
    this.formSubmitted = false;
  }

  getFileType(filename: string | undefined): string {
    if (!filename) return 'other';
    const ext = filename.split('.').pop()?.toLowerCase();
    if (!ext) return 'other';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext)) return 'image';
    if (['pdf'].includes(ext)) return 'pdf';
    if (['doc', 'docx', 'odt', 'rtf'].includes(ext)) return 'doc';
    return 'other';
  }

  getFileUrl(filename: string | undefined): string {
    if (!filename) return '';
    if (filename.startsWith('data:')) return filename;
    return '/assets/uploads/' + filename;
  }

  showToast(title: string, message: string, type: string = 'info', duration: number = 2000) {
    this.toast = { show: true, title, message, type };
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => {
      if (this.toast) this.toast.show = false;
      this.toast = null;
    }, duration);
  }

  closeToast() {
    if (this.toast) this.toast.show = false;
    this.toast = null;
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }

  onLeaveTypeChange(leaveTypeId: string): void {
    this.selectedLeaveType = this.leaveTypes.find((type: LeaveType) => type.id === leaveTypeId) || null;
    this.selectedLeaveBalance = this.leaveBalances.find((balance: LeaveBalance) => balance.leave_type_id === leaveTypeId) || null;
    this.leaveForm.get('total_days')?.setValue(0); // Reset total days when leave type changes
  }

  calculateTotalDays(): void {
    if (this.leaveForm.value.start_date && this.leaveForm.value.end_date) {
      const start = new Date(this.leaveForm.value.start_date);
      const end = new Date(this.leaveForm.value.end_date);
      const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;
      this.leaveForm.get('total_days')?.setValue(diff > 0 ? diff : 0);
    } else {
      this.leaveForm.get('total_days')?.setValue(0);
    }
  }

  updateMetrics(): void {
    this.totalLeaves = this.leaveApplications.length;
    this.pendingLeaves = this.leaveApplications.filter((l: LeaveApplication) => l.status === 'Pending').length;
    this.approvedLeaves = this.leaveApplications.filter((l: LeaveApplication) => l.status === 'Approved').length;
    this.rejectedLeaves = this.leaveApplications.filter((l: LeaveApplication) => l.status === 'Rejected').length;
    this.totalDaysTaken = this.leaveApplications
      .filter((l: LeaveApplication) => l.status === 'Approved')
      .reduce((sum, l) => sum + (l.total_days || 0), 0);
    // Compute most used leave type (by name)
    const typeCount: Record<string, number> = {};
    for (const leave of this.leaveApplications) {
      const typeId = leave.leave_type_id;
      if (!typeCount[typeId]) typeCount[typeId] = 0;
      typeCount[typeId]++;
    }
    let max = 0;
    let mostUsedTypeId = '';
    for (const typeId in typeCount) {
      if (typeCount[typeId] > max) {
        max = typeCount[typeId];
        mostUsedTypeId = typeId;
      }
    }
    // Find the name from leaveTypes or from the first matching leaveApplication
    let mostUsedTypeName = 'N/A';
    if (mostUsedTypeId) {
      // Try to get from leaveTypes first
      const foundType = this.leaveTypes.find(t => t.id === mostUsedTypeId);
      if (foundType) {
        mostUsedTypeName = foundType.leave_type_name;
      } else {
        // Fallback: get from leaveApplications
        const foundApp = this.leaveApplications.find(l => l.leave_type_id === mostUsedTypeId);
        if (foundApp && foundApp.leave_type && foundApp.leave_type.leave_type_name) {
          mostUsedTypeName = foundApp.leave_type.leave_type_name;
        }
      }
    }
    this.mostUsedType = mostUsedTypeName;
  }
}
