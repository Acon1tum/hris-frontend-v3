import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Loan {
  id: string;
  loanType: string;
  amount: string;
  balance: string;
  term: string;
  status: string;
  repaymentProgress: number;
  // Detailed information
  originalAmount: number;
  interestRate: number;
  totalAmountRepaid: number;
  remainingBalance: number;
  startDate: string;
  endDate: string;
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
}

interface RepaymentHistory {
  cutoff: string;
  installmentAmount: string;
  paymentDate: string;
  status: string;
}

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss']
})
export class LoansComponent {
  loans: Loan[] = [
    {
      id: '1',
      loanType: 'Personal Loan',
      amount: '$5,000',
      balance: '$2,500',
      term: '24 months',
      status: 'Active',
      repaymentProgress: 50,
      originalAmount: 5000,
      interestRate: 8.5,
      totalAmountRepaid: 2500,
      remainingBalance: 2500,
      startDate: '2023-01-15',
      endDate: '2025-01-15',
      monthlyPayment: 208.33,
      totalInterest: 850,
      totalAmount: 5850
    },
    {
      id: '2',
      loanType: 'Car Loan',
      amount: '$15,000',
      balance: '$10,000',
      term: '60 months',
      status: 'Active',
      repaymentProgress: 33,
      originalAmount: 15000,
      interestRate: 6.2,
      totalAmountRepaid: 5000,
      remainingBalance: 10000,
      startDate: '2022-06-01',
      endDate: '2027-06-01',
      monthlyPayment: 291.67,
      totalInterest: 2500,
      totalAmount: 17500
    },
    {
      id: '3',
      loanType: 'Home Loan',
      amount: '$100,000',
      balance: '$95,000',
      term: '360 months',
      status: 'Active',
      repaymentProgress: 5,
      originalAmount: 100000,
      interestRate: 4.8,
      totalAmountRepaid: 5000,
      remainingBalance: 95000,
      startDate: '2023-03-01',
      endDate: '2053-03-01',
      monthlyPayment: 524.67,
      totalInterest: 88900,
      totalAmount: 188900
    }
  ];

  repaymentHistory: RepaymentHistory[] = [
    {
      cutoff: '2024-07-15',
      installmentAmount: '$208.33',
      paymentDate: '2024-07-15',
      status: 'Paid'
    },
    {
      cutoff: '2024-07-31',
      installmentAmount: '$208.33',
      paymentDate: '2024-07-31',
      status: 'Paid'
    },
    {
      cutoff: '2024-08-15',
      installmentAmount: '$208.33',
      paymentDate: '2024-08-15',
      status: 'Paid'
    },
    {
      cutoff: '2024-08-31',
      installmentAmount: '$208.33',
      paymentDate: '2024-08-31',
      status: 'Paid'
    },
    {
      cutoff: '2024-09-15',
      installmentAmount: '$208.33',
      paymentDate: '2024-09-15',
      status: 'Paid'
    }
  ];

  selectedLoan: Loan | null = null;
  showLoanDetails = false;

  downloadSummary() {
    // Implement download functionality
    console.log('Downloading summary...');
  }

  viewLoanDetails(loan: Loan) {
    this.selectedLoan = loan;
    this.showLoanDetails = true;
  }

  closeLoanDetails() {
    this.showLoanDetails = false;
    this.selectedLoan = null;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatPercentage(rate: number): string {
    return `${rate.toFixed(1)}%`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
