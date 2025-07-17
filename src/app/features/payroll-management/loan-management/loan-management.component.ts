import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LoanRecord {
  id: number;
  date: string;
  action: string;
  user: string;
  details: string;
}

@Component({
  selector: 'app-loan-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loan-management.component.html',
  styleUrls: ['./loan-management.component.scss']
})
export class LoanManagementComponent {
  title = 'Loan Management';
  
  // Form data
  loanBalance = '';
  deductionAmount = '';
  deductionPriority = 'Low';
  startDate = '';
  endDate = '';
  amountPerCutoff = '';

  // Active tab
  activeTab = 'consolidated';

  // Loan tabs
  loanTabs = [
    { id: 'consolidated', label: 'Consolidated Loan', active: true },
    { id: 'policy', label: 'Policy Loan', active: false },
    { id: 'multipurpose', label: 'Multi-Purpose Loan', active: false },
    { id: 'others', label: 'Others', active: false }
  ];

  // Priority options
  priorityOptions = ['Low', 'Medium', 'High'];

  // Audit trail data
  auditTrail: LoanRecord[] = [
    {
      id: 1,
      date: '01/01/2024 10:30 AM',
      action: 'Loan Added',
      user: 'Admin User',
      details: 'View'
    },
    {
      id: 2,
      date: '01/15/2024 02:15 PM',
      action: 'Deduction Applied',
      user: 'System',
      details: 'View'
    },
    {
      id: 3,
      date: '01/31/2024 09:00 AM',
      action: 'Deduction Applied',
      user: 'System',
      details: 'View'
    },
    {
      id: 4,
      date: '02/05/2024 11:45 AM',
      action: 'Loan Terms Updated',
      user: 'Payroll Manager',
      details: 'View'
    }
  ];

  onNewLoan() {
    console.log('Add new loan clicked');
  }

  onSaveChanges() {
    console.log('Save changes clicked');
    console.log('Form data:', {
      loanBalance: this.loanBalance,
      deductionAmount: this.deductionAmount,
      deductionPriority: this.deductionPriority,
      startDate: this.startDate,
      endDate: this.endDate,
      amountPerCutoff: this.amountPerCutoff
    });
  }

  onAddLoan() {
    console.log('Add loan clicked');
  }

  onCloseLoan() {
    console.log('Close loan clicked');
  }

  onTabClick(tabId: string) {
    this.activeTab = tabId;
    this.loanTabs.forEach(tab => {
      tab.active = tab.id === tabId;
    });
  }

  onViewDetails(record: LoanRecord) {
    console.log('View details for:', record);
  }

  trackByRecordId(index: number, record: LoanRecord): number {
    return record.id;
  }
} 