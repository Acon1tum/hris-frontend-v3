import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Employee {
  id: string;
  name: string;
  monthlySalary: number;
  bankAccountInfo: string;
  salaryAdjustments: number;
  loanBalances: number;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-master-payroll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './master-payroll.component.html',
  styleUrls: ['./master-payroll.component.scss']
})
export class MasterPayrollComponent {
  searchTerm = '';
  
  employees: Employee[] = [
    {
      id: 'EMP001',
      name: 'Ethan Carter',
      monthlySalary: 250000.00,
      bankAccountInfo: 'BDO ...1234',
      salaryAdjustments: 10000.00,
      loanBalances: 50000.00,
      status: 'Active'
    },
    {
      id: 'EMP002',
      name: 'Olivia Bennett',
      monthlySalary: 300000.00,
      bankAccountInfo: 'BPI ...5678',
      salaryAdjustments: 7500.00,
      loanBalances: 25000.00,
      status: 'Active'
    },
    {
      id: 'EMP003',
      name: 'Noah Thompson',
      monthlySalary: 225000.00,
      bankAccountInfo: 'Metrobank ...9012',
      salaryAdjustments: 5000.00,
      loanBalances: 10000.00,
      status: 'Inactive'
    },
    {
      id: 'EMP004',
      name: 'Ava Martinez',
      monthlySalary: 275000.00,
      bankAccountInfo: 'UnionBank ...3456',
      salaryAdjustments: 12500.00,
      loanBalances: 37500.00,
      status: 'Active'
    },
    {
      id: 'EMP005',
      name: 'Liam Harris',
      monthlySalary: 350000.00,
      bankAccountInfo: 'Security Bank ...7890',
      salaryAdjustments: 15000.00,
      loanBalances: 60000.00,
      status: 'Active'
    },
    {
      id: 'EMP006',
      name: 'Isabella Clark',
      monthlySalary: 240000.00,
      bankAccountInfo: 'PNB ...2468',
      salaryAdjustments: 9000.00,
      loanBalances: 15000.00,
      status: 'Inactive'
    }
  ];

  onAddEmployee() {
    console.log('Add new employee clicked');
  }

  onEditEmployee(employee: Employee) {
    console.log('Edit employee:', employee.name);
  }

  onDeleteEmployee(employee: Employee) {
    console.log('Delete employee:', employee.name);
  }

  onExport() {
    console.log('Export data clicked');
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
  }

  get filteredEmployees() {
    if (!this.searchTerm) {
      return this.employees;
    }
    return this.employees.filter(employee => 
      employee.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      employee.id.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  trackByEmployeeId(index: number, employee: Employee): string {
    return employee.id;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  }
} 