import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PayslipData {
  grossSalary: number;
  mandatoryDeductions: {
    total: number;
    items: Array<{ name: string; amount: number }>;
  };
  loanDeductions: {
    total: number;
    items: Array<{ name: string; amount: number }>;
  };
  netAmount: number;
}

interface EmployeeInfo {
  name: string;
  id: string;
  monthlySalary: number;
  salaryAdjustments: string | null;
}

interface LoanSummary {
  type: string;
  originalAmount: number;
  paidAmount: number;
  remainingBalance: number;
  monthlyDeduction: number;
}

interface ContributionTracker {
  name: string;
  amount: number;
  growth: number;
  chartData: number[];
}

@Component({
  selector: 'app-employee-payroll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-payroll.component.html',
  styleUrls: ['./employee-payroll.component.scss']
})
export class EmployeePayrollComponent implements OnInit {
  
  // Employee Data
  employeeName = 'Sarah Miller';
  currentMonth = 'July 2024';
  
  // Dashboard Stats
  netPay = 125000.00;
  totalDeductions = 25000.00;
  nextPayDate = 'July 25';
  activeLoansTotal = 60000.00;
  
  // Month Selection
  selectedMonth = 'July 2024';
  availableMonths = [
    { value: 'July 2024', label: 'July 2024' },
    { value: 'June 2024', label: 'June 2024' },
    { value: 'May 2024', label: 'May 2024' },
    { value: 'April 2024', label: 'April 2024' },
    { value: 'March 2024', label: 'March 2024' }
  ];
  
  // Payslip Data
  payslipData: PayslipData = {
    grossSalary: 150000.00,
    mandatoryDeductions: {
      total: 15000.00,
      items: [
        { name: 'BIR', amount: 7500.00 },
        { name: 'Pag-Ibig', amount: 2500.00 },
        { name: 'PhilHealth', amount: 2500.00 },
        { name: 'Others', amount: 2500.00 }
      ]
    },
    loanDeductions: {
      total: 10000.00,
      items: [
        { name: 'Consolidated', amount: 5000.00 },
        { name: 'Policy', amount: 2500.00 },
        { name: 'Multi-Purpose', amount: 1250.00 },
        { name: 'Others', amount: 1250.00 }
      ]
    },
    netAmount: 125000.00
  };
  
  // Employee Information
  employeeInfo: EmployeeInfo = {
    name: 'Sarah Miller',
    id: 'EMP12345',
    monthlySalary: 150000.00,
    salaryAdjustments: null
  };
  
  // Loan Summary
  loanSummary: LoanSummary[] = [
    {
      type: 'Consolidated Loan',
      originalAmount: 250000.00,
      paidAmount: 100000.00,
      remainingBalance: 150000.00,
      monthlyDeduction: 10000.00
    },
    {
      type: 'Policy Loan',
      originalAmount: 100000.00,
      paidAmount: 50000.00,
      remainingBalance: 50000.00,
      monthlyDeduction: 2500.00
    },
    {
      type: 'Multi-Purpose Loan',
      originalAmount: 50000.00,
      paidAmount: 25000.00,
      remainingBalance: 25000.00,
      monthlyDeduction: 1250.00
    }
  ];
  
  // Contribution Tracker
  contributionTracker: ContributionTracker[] = [
    {
      name: 'Pag-Ibig Contributions',
      amount: 25000,
      growth: 10,
      chartData: [70, 100, 40, 60, 20, 20]
    },
    {
      name: 'PhilHealth Contributions',
      amount: 25000,
      growth: 5,
      chartData: [70, 100, 100, 90, 90, 80]
    },
    {
      name: 'BIR Contributions',
      amount: 75000,
      growth: 15,
      chartData: [60, 40, 10, 60, 100, 60]
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.calculateTotals();
  }

  onMonthChange(): void {
    // Handle month change logic here
    // In a real application, this would fetch new data for the selected month
    console.log('Month changed to:', this.selectedMonth);
    this.loadPayslipForMonth(this.selectedMonth);
  }

  downloadPayslip(): void {
    // Handle payslip download logic here
    console.log('Downloading payslip for:', this.selectedMonth);
    // In a real application, this would generate and download a PDF
  }

  private loadPayslipForMonth(month: string): void {
    // Simulate loading different data for different months
    // In a real application, this would make an API call
    console.log('Loading payslip data for month:', month);
  }

  private calculateTotals(): void {
    // Calculate totals based on current data
    this.totalDeductions = this.payslipData.mandatoryDeductions.total + this.payslipData.loanDeductions.total;
    this.netPay = this.payslipData.grossSalary - this.totalDeductions;
    this.activeLoansTotal = this.loanSummary.reduce((total, loan) => total + loan.remainingBalance, 0);
  }
} 