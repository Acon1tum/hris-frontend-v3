import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FinalPay {
  id: string;
  employeeId: string;
  employeeName: string;
  resignationDate: string;
  lastWorkingDay: string;
  clearanceDate: string;
  status: 'Pending' | 'Processing' | 'Cleared' | 'Paid';
  totalAmount: number;
  breakdown: FinalPayBreakdown;
  clearanceItems: ClearanceItem[];
  remarks?: string;
}

interface FinalPayBreakdown {
  basicSalary: number;
  proratedSalary: number;
  unusedLeaves: number;
  leaveMonetization: number;
  overtime: number;
  allowances: number;
  bonuses: number;
  deductions: number;
  taxWithholding: number;
  otherDeductions: number;
  netFinalPay: number;
}

interface ClearanceItem {
  id: string;
  department: string;
  item: string;
  status: 'Pending' | 'Cleared' | 'Not Applicable';
  clearedBy?: string;
  clearedDate?: string;
  remarks?: string;
}

interface LeaveBalance {
  leaveType: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  monetizationRate: number;
  monetizationAmount: number;
}

@Component({
  selector: 'app-final-pay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './final-pay.component.html',
  styleUrls: ['./final-pay.component.scss']
})
export class FinalPayComponent {
  currentFinalPay: FinalPay = {
    id: 'FP001',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    resignationDate: '2024-11-15',
    lastWorkingDay: '2024-12-15',
    clearanceDate: '2024-12-20',
    status: 'Processing',
    totalAmount: 125000,
    breakdown: {
      basicSalary: 50000,
      proratedSalary: 25000,
      unusedLeaves: 15,
      leaveMonetization: 18750,
      overtime: 5000,
      allowances: 10000,
      bonuses: 15000,
      deductions: 5000,
      taxWithholding: 6250,
      otherDeductions: 2500,
      netFinalPay: 100000
    },
    clearanceItems: [
      {
        id: '1',
        department: 'IT Department',
        item: 'Laptop Return',
        status: 'Cleared',
        clearedBy: 'IT Manager',
        clearedDate: '2024-12-18',
        remarks: 'Laptop returned in good condition'
      },
      {
        id: '2',
        department: 'HR Department',
        item: 'ID Card Return',
        status: 'Cleared',
        clearedBy: 'HR Manager',
        clearedDate: '2024-12-19',
        remarks: 'ID card returned'
      },
      {
        id: '3',
        department: 'Finance Department',
        item: 'Outstanding Advances',
        status: 'Cleared',
        clearedBy: 'Finance Manager',
        clearedDate: '2024-12-20',
        remarks: 'No outstanding advances'
      },
      {
        id: '4',
        department: 'Admin Department',
        item: 'Office Keys Return',
        status: 'Pending',
        remarks: 'Awaiting key return'
      },
      {
        id: '5',
        department: 'Department Head',
        item: 'Project Handover',
        status: 'Cleared',
        clearedBy: 'Department Manager',
        clearedDate: '2024-12-17',
        remarks: 'Project successfully handed over'
      }
    ],
    remarks: 'Final pay processing in progress. All clearance items must be completed before payment release.'
  };

  leaveBalances: LeaveBalance[] = [
    {
      leaveType: 'Vacation Leave',
      totalDays: 15,
      usedDays: 5,
      remainingDays: 10,
      monetizationRate: 1250,
      monetizationAmount: 12500
    },
    {
      leaveType: 'Sick Leave',
      totalDays: 15,
      usedDays: 8,
      remainingDays: 7,
      monetizationRate: 1250,
      monetizationAmount: 8750
    },
    {
      leaveType: 'Personal Leave',
      totalDays: 3,
      usedDays: 2,
      remainingDays: 1,
      monetizationRate: 1250,
      monetizationAmount: 1250
    }
  ];

  showClearanceModal = false;
  selectedClearanceItem: ClearanceItem | null = null;

  getStatusColor(status: string): string {
    switch (status) {
      case 'Paid':
        return '#10b981';
      case 'Cleared':
        return '#10b981';
      case 'Processing':
        return '#f59e0b';
      case 'Pending':
        return '#6b7280';
      case 'Not Applicable':
        return '#9ca3af';
      default:
        return '#6b7280';
    }
  }

  getStatusBgColor(status: string): string {
    switch (status) {
      case 'Paid':
        return '#d1fae5';
      case 'Cleared':
        return '#d1fae5';
      case 'Processing':
        return '#fef3c7';
      case 'Pending':
        return '#f3f4f6';
      case 'Not Applicable':
        return '#f9fafb';
      default:
        return '#f3f4f6';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getClearanceProgress(): number {
    const totalItems = this.currentFinalPay.clearanceItems.length;
    const clearedItems = this.currentFinalPay.clearanceItems.filter(item => item.status === 'Cleared').length;
    return totalItems > 0 ? (clearedItems / totalItems) * 100 : 0;
  }

  getTotalLeaveMonetization(): number {
    return this.leaveBalances.reduce((total, leave) => total + leave.monetizationAmount, 0);
  }

  viewClearanceDetails(item: ClearanceItem) {
    this.selectedClearanceItem = item;
    this.showClearanceModal = true;
  }

  closeClearanceModal() {
    this.showClearanceModal = false;
    this.selectedClearanceItem = null;
  }

  downloadFinalPayslip() {
    console.log('Downloading final payslip PDF...');
    // Implementation for PDF generation and download
  }

  downloadClearanceReport() {
    console.log('Downloading clearance report...');
    // Implementation for clearance report download
  }

  getTotalClearanceItems(): number {
    return this.currentFinalPay.clearanceItems.length;
  }

  getClearedItems(): number {
    return this.currentFinalPay.clearanceItems.filter(item => item.status === 'Cleared').length;
  }

  getPendingItems(): number {
    return this.currentFinalPay.clearanceItems.filter(item => item.status === 'Pending').length;
  }
}
