import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PayrollSummaryItem {
  label: string;
  amount: number;
  isTotal?: boolean;
}

@Component({
  selector: 'app-payroll-run',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payroll-run.component.html',
  styleUrls: ['./payroll-run.component.scss']
})
export class PayrollRunComponent {
  title = 'Create Payroll Run';
  
  // Form data
  cutoffStartDate = '';
  cutoffEndDate = '';
  employeeFilter = 'all';
  oneTimePayDescription = '';
  oneTimePayAmount = '';
  firstPay = false;
  finalPay = false;

  // Employee filter options
  employeeFilterOptions = [
    { id: 'all', label: 'All Employees' },
    { id: 'department', label: 'By Departments' },
    { id: 'contract', label: 'By Contract Types' }
  ];

  // Payroll summary data
  payrollSummary: PayrollSummaryItem[] = [
    { label: 'Gross Salary', amount: 120000.00 },
    { label: 'Salary Adjustments', amount: 5000.00 },
    { label: 'Mandatory Deductions', amount: 15000.00 },
    { label: 'Loan Deductions', amount: 10000.00 },
    { label: 'Net Pay', amount: 100000.00, isTotal: true }
  ];

  onEmployeeFilterChange(filterId: string) {
    this.employeeFilter = filterId;
    console.log('Employee filter changed to:', filterId);
  }

  onPreview() {
    console.log('Preview payroll run');
    console.log('Form data:', this.getFormData());
  }

  onFinalizePayrollRun() {
    console.log('Finalize payroll run');
    console.log('Form data:', this.getFormData());
    // Here you would typically call a service to process the payroll run
    // this.payrollService.finalizePayrollRun(formData);
  }

  onFormSubmit(event: Event) {
    event.preventDefault();
    this.onFinalizePayrollRun();
  }

  private getFormData() {
    return {
      cutoffStartDate: this.cutoffStartDate,
      cutoffEndDate: this.cutoffEndDate,
      employeeFilter: this.employeeFilter,
      oneTimePayDescription: this.oneTimePayDescription,
      oneTimePayAmount: this.oneTimePayAmount,
      firstPay: this.firstPay,
      finalPay: this.finalPay,
      payrollSummary: this.payrollSummary
    };
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  trackBySummaryItem(index: number, item: PayrollSummaryItem): string {
    return item.label;
  }
} 