import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TaxBracket {
  id: number;
  bracket: string;
  minIncome: number;
  maxIncome: number | null;
  taxRate: number;
  fixedAmount: number;
}

interface ContributionTotal {
  title: string;
  value: string;
  description?: string;
}

interface DeductionTab {
  id: string;
  name: string;
  active: boolean;
}

@Component({
  selector: 'app-deductions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deductions.component.html',
  styleUrls: ['./deductions.component.scss']
})
export class DeductionsComponent {
  searchTerm = '';
  
  // Deduction tabs
  deductionTabs: DeductionTab[] = [
    { id: 'bir', name: 'BIR Tax Table', active: true },
    { id: 'pagibig', name: 'Pag-Ibig', active: false },
    { id: 'philhealth', name: 'PhilHealth', active: false },
    { id: 'sss', name: 'SSS', active: false }
  ];

  activeTab = 'bir';

  // BIR Tax brackets
  taxBrackets: TaxBracket[] = [
    {
      id: 1,
      bracket: 'Bracket 1',
      minIncome: 0.00,
      maxIncome: 20833.00,
      taxRate: 0,
      fixedAmount: 0.00
    },
    {
      id: 2,
      bracket: 'Bracket 2',
      minIncome: 20833.01,
      maxIncome: 33333.00,
      taxRate: 20,
      fixedAmount: 0.00
    },
    {
      id: 3,
      bracket: 'Bracket 3',
      minIncome: 33333.01,
      maxIncome: 66667.00,
      taxRate: 25,
      fixedAmount: 2500.00
    },
    {
      id: 4,
      bracket: 'Bracket 4',
      minIncome: 66667.01,
      maxIncome: 166667.00,
      taxRate: 30,
      fixedAmount: 10833.33
    },
    {
      id: 5,
      bracket: 'Bracket 5',
      minIncome: 166667.01,
      maxIncome: null,
      taxRate: 35,
      fixedAmount: 40833.33
    }
  ];

  // Contribution totals
  contributionTotals: ContributionTotal[] = [
    {
      title: 'Total Employee Contributions',
      value: '₱625,000.00',
      description: 'Sum of all employee deductions'
    },
    {
      title: 'Total Employer Share',
      value: '₱375,000.00',
      description: 'Employer contribution matching'
    },
    {
      title: 'Total Deductions',
      value: '₱1,000,000.00',
      description: 'Combined deductions for period'
    },
    {
      title: 'Net Pay (Example)',
      value: '₱4,000,000.00',
      description: 'Sample net pay calculation'
    }
  ];

  onTabClick(tab: DeductionTab) {
    this.deductionTabs.forEach(t => t.active = false);
    tab.active = true;
    this.activeTab = tab.id;
    console.log('Tab changed to:', tab.name);
  }

  onSaveChanges() {
    console.log('Save changes clicked');
  }

  onGenerateReport() {
    console.log('Generate report clicked');
  }

  onProofOfRemittance() {
    console.log('Proof of remittance clicked');
  }

  onEditBracket(bracket: TaxBracket) {
    console.log('Edit bracket:', bracket.bracket);
  }

  onDeleteBracket(bracket: TaxBracket) {
    console.log('Delete bracket:', bracket.bracket);
  }

  onAddBracket() {
    console.log('Add new bracket clicked');
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
  }

  get filteredBrackets() {
    if (!this.searchTerm) {
      return this.taxBrackets;
    }
    return this.taxBrackets.filter(bracket => 
      bracket.bracket.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  trackByBracketId(index: number, bracket: TaxBracket): number {
    return bracket.id;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  }

  formatPercentage(rate: number): string {
    return `${rate}%`;
  }

  formatMaxIncome(maxIncome: number | null): string {
    if (maxIncome === null) {
      return 'and above';
    }
    return this.formatCurrency(maxIncome);
  }

  getActiveTabName(): string {
    const activeTab = this.deductionTabs.find(tab => tab.id === this.activeTab);
    return activeTab?.name || 'Configuration';
  }
} 