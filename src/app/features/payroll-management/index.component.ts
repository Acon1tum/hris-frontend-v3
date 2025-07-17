import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payroll-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class PayrollManagementComponent {
  title = 'Payroll Management';
  
  constructor(private router: Router) {}
  
  payrollFeatures = [
    { name: 'Salary Processing', description: 'Calculate and process employee salaries', icon: '💰', route: '/payroll-management/payroll-overview' },
    { name: 'Master Payroll', description: 'Manage employee master payroll records', icon: '👥', route: '/payroll-management/master-payroll' },
    { name: 'Deduction Formulas', description: 'Configure tax tables and deduction formulas', icon: '🧮', route: '/payroll-management/deductions' },
    { name: 'Benefits Deductions', description: 'Manage benefits and insurance deductions', icon: '🏥', route: null },
    { name: 'Payslip Generation', description: 'Generate and distribute payslips', icon: '📄', route: null },
    { name: 'Payroll Reports', description: 'Comprehensive payroll reporting and analytics', icon: '📊', route: null }
  ];

  navigateToFeature(feature: any) {
    if (feature.route) {
      this.router.navigate([feature.route]);
    } else {
      console.log(`Feature ${feature.name} not yet implemented`);
    }
  }

  navigateToMasterPayroll() {
    this.router.navigate(['/payroll-management/master-payroll']);
  }

  navigateToPayrollOverview() {
    this.router.navigate(['/payroll-management/payroll-overview']);
  }

  navigateToDeductions() {
    this.router.navigate(['/payroll-management/deductions']);
  }
} 