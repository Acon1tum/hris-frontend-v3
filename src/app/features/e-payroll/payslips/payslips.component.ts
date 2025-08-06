import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PayslipHistory {
  month: string;
  year: number;
  netPay: number;
  grossPay: number;
  deductions: number;
  status: 'paid' | 'pending' | 'processing';
  payDate: string;
}

interface PayslipDetails {
  month: string;
  year: number;
  grossPay: number;
  netPay: number;
  deductions: {
    tax: number;
    insurance: number;
    retirement: number;
    other: number;
  };
  earnings: {
    basicSalary: number;
    overtime: number;
    bonus: number;
    allowance: number;
  };
}

interface FilterOptions {
  year: number | null;
  month: string | null;
  status: string | null;
  minAmount: number | null;
  maxAmount: number | null;
  dateRange: {
    start: string | null;
    end: string | null;
  };
}

@Component({
  selector: 'app-payslips',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payslips.component.html',
  styleUrls: ['./payslips.component.scss']
})
export class PayslipsComponent {
  // User data
  userName: string = 'Olivia';
  
  // Payslip data
  currentYearSalary: number = 62000;
  previousYearSalary: number = 58000;
  salaryGrowth: number = 5;
  
  // Monthly breakdown
  grossPay: number = 5200;
  deductions: number = 1200;
  netPay: number = 4000;
  
  // Chart data
  selectedChartType: string = 'Line Chart';
  selectedTimeRange: string = 'Last 6 Months';
  
  // Tab navigation
  activeTab: string = 'Salary Breakdown';
  
  // View details modal
  showDetailsModal: boolean = false;
  selectedPayslip: PayslipDetails | null = null;
  
  // Filter functionality
  showFilters: boolean = false;
  filterOptions: FilterOptions = {
    year: null,
    month: null,
    status: null,
    minAmount: null,
    maxAmount: null,
    dateRange: {
      start: null,
      end: null
    }
  };
  
  // Available filter options
  availableYears: number[] = [2024, 2023, 2022];
  availableMonths: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  availableStatuses: string[] = ['paid', 'pending', 'processing'];
  
  // Payslip history data with more realistic values
  payslipHistory: PayslipHistory[] = [
    { month: 'December', year: 2024, netPay: 4200, grossPay: 5400, deductions: 1200, status: 'paid', payDate: '2024-12-31' },
    { month: 'November', year: 2024, netPay: 4100, grossPay: 5300, deductions: 1200, status: 'paid', payDate: '2024-11-30' },
    { month: 'October', year: 2024, netPay: 4000, grossPay: 5200, deductions: 1200, status: 'paid', payDate: '2024-10-31' },
    { month: 'September', year: 2024, netPay: 3900, grossPay: 5100, deductions: 1200, status: 'paid', payDate: '2024-09-30' },
    { month: 'August', year: 2024, netPay: 3800, grossPay: 5000, deductions: 1200, status: 'paid', payDate: '2024-08-31' },
    { month: 'July', year: 2024, netPay: 3700, grossPay: 4900, deductions: 1200, status: 'paid', payDate: '2024-07-31' },
    { month: 'June', year: 2024, netPay: 3600, grossPay: 4800, deductions: 1200, status: 'paid', payDate: '2024-06-30' },
    { month: 'May', year: 2024, netPay: 3500, grossPay: 4700, deductions: 1200, status: 'paid', payDate: '2024-05-31' },
    { month: 'April', year: 2024, netPay: 3400, grossPay: 4600, deductions: 1200, status: 'paid', payDate: '2024-04-30' },
    { month: 'March', year: 2024, netPay: 3300, grossPay: 4500, deductions: 1200, status: 'paid', payDate: '2024-03-31' },
    { month: 'February', year: 2024, netPay: 3200, grossPay: 4400, deductions: 1200, status: 'paid', payDate: '2024-02-29' },
    { month: 'January', year: 2024, netPay: 3100, grossPay: 4300, deductions: 1200, status: 'paid', payDate: '2024-01-31' },
    { month: 'December', year: 2023, netPay: 3000, grossPay: 4200, deductions: 1200, status: 'paid', payDate: '2023-12-31' },
    { month: 'November', year: 2023, netPay: 2900, grossPay: 4100, deductions: 1200, status: 'paid', payDate: '2023-11-30' },
    { month: 'October', year: 2023, netPay: 2800, grossPay: 4000, deductions: 1200, status: 'paid', payDate: '2023-10-31' }
  ];
  
  // Get filtered payslips
  get filteredPayslips(): PayslipHistory[] {
    return this.payslipHistory.filter(payslip => {
      // Year filter
      if (this.filterOptions.year && payslip.year !== this.filterOptions.year) {
        return false;
      }
      
      // Month filter
      if (this.filterOptions.month && payslip.month !== this.filterOptions.month) {
        return false;
      }
      
      // Status filter
      if (this.filterOptions.status && payslip.status !== this.filterOptions.status) {
        return false;
      }
      
      // Amount range filter
      if (this.filterOptions.minAmount && payslip.netPay < this.filterOptions.minAmount) {
        return false;
      }
      
      if (this.filterOptions.maxAmount && payslip.netPay > this.filterOptions.maxAmount) {
        return false;
      }
      
      // Date range filter
      if (this.filterOptions.dateRange.start && payslip.payDate < this.filterOptions.dateRange.start) {
        return false;
      }
      
      if (this.filterOptions.dateRange.end && payslip.payDate > this.filterOptions.dateRange.end) {
        return false;
      }
      
      return true;
    });
  }
  
  // Get filtered payslips for display (first 6)
  get displayedPayslips(): PayslipHistory[] {
    return this.filteredPayslips.slice(0, 6);
  }
  
  // Get filtered payslips for previous section (remaining)
  get previousPayslips(): PayslipHistory[] {
    return this.filteredPayslips.slice(6);
  }
  
  // Check if any filters are active
  get hasActiveFilters(): boolean {
    return !!(
      this.filterOptions.year ||
      this.filterOptions.month ||
      this.filterOptions.status ||
      this.filterOptions.minAmount ||
      this.filterOptions.maxAmount ||
      this.filterOptions.dateRange.start ||
      this.filterOptions.dateRange.end
    );
  }
  
  // Methods
  onTabChange(tabName: string): void {
    this.activeTab = tabName;
  }
  
  onChartTypeChange(chartType: string): void {
    this.selectedChartType = chartType;
  }
  
  onTimeRangeChange(timeRange: string): void {
    this.selectedTimeRange = timeRange;
  }
  
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
  
  applyFilters(): void {
    // Filters are applied automatically through the getter
    console.log('Filters applied:', this.filterOptions);
  }
  
  clearFilters(): void {
    this.filterOptions = {
      year: null,
      month: null,
      status: null,
      minAmount: null,
      maxAmount: null,
      dateRange: {
        start: null,
        end: null
      }
    };
    console.log('Filters cleared');
  }
  
  getStatusColor(status: string): string {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }
  
  getStatusIcon(status: string): string {
    switch (status) {
      case 'paid':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'pending':
        return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'processing':
        return 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }
  
  viewPayslip(payslip: PayslipHistory): void {
    // Create detailed payslip data
    this.selectedPayslip = {
      month: payslip.month,
      year: payslip.year,
      grossPay: payslip.grossPay,
      netPay: payslip.netPay,
      deductions: {
        tax: 800,
        insurance: 200,
        retirement: 200,
        other: 0
      },
      earnings: {
        basicSalary: payslip.grossPay,
        overtime: 0,
        bonus: 0,
        allowance: 0
      }
    };
    this.showDetailsModal = true;
  }
  
  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedPayslip = null;
  }
  
  downloadPayslip(): void {
    console.log('Downloading current month payslip...');
    alert('Payslip download started!');
  }
  
  downloadHistoricalPayslip(payslip: PayslipHistory): void {
    console.log('Downloading payslip for:', payslip.month, payslip.year);
    alert(`Downloading ${payslip.month} ${payslip.year} payslip`);
  }
  
  downloadAsPDF(payslip: PayslipHistory | null): void {
    if (payslip) {
      console.log('Downloading as PDF:', payslip);
      alert(`Downloading ${payslip.month} ${payslip.year} payslip as PDF`);
    } else {
      console.log('Downloading current month as PDF');
      alert('Downloading current month payslip as PDF');
    }
  }
  
  viewInBrowser(payslip: PayslipHistory | null): void {
    if (payslip) {
      console.log('Opening in browser for printing:', payslip);
      alert(`Opening ${payslip.month} ${payslip.year} payslip in browser for printing`);
    } else {
      console.log('Opening current month in browser');
      alert('Opening current month payslip in browser for printing');
    }
  }
  
  printPayslip(payslip: PayslipHistory | null): void {
    if (payslip) {
      console.log('Printing payslip:', payslip);
      alert(`Printing ${payslip.month} ${payslip.year} payslip`);
    } else {
      console.log('Printing current month payslip');
      alert('Printing current month payslip');
    }
  }
  
  // Helper method to create PayslipHistory from selectedPayslip
  getSelectedPayslipHistory(): PayslipHistory | null {
    if (this.selectedPayslip) {
      return {
        month: this.selectedPayslip.month,
        year: this.selectedPayslip.year,
        grossPay: this.selectedPayslip.grossPay,
        netPay: this.selectedPayslip.netPay,
        deductions: this.selectedPayslip.deductions.tax + 
                   this.selectedPayslip.deductions.insurance + 
                   this.selectedPayslip.deductions.retirement + 
                   this.selectedPayslip.deductions.other,
        status: 'paid',
        payDate: `${this.selectedPayslip.year}-${this.getMonthNumber(this.selectedPayslip.month)}-01`
      };
    }
    return null;
  }
  
  private getMonthNumber(month: string): string {
    const months: { [key: string]: string } = {
      'January': '01', 'February': '02', 'March': '03', 'April': '04',
      'May': '05', 'June': '06', 'July': '07', 'August': '08',
      'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };
    return months[month] || '01';
  }
}
