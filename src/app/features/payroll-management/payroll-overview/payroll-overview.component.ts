import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PayrollKPI {
  title: string;
  value: string;
}

interface PayrollAlert {
  type: 'error' | 'warning' | 'info';
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  iconBgColor: string;
  textColor: string;
}

@Component({
  selector: 'app-payroll-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payroll-overview.component.html',
  styleUrls: ['./payroll-overview.component.scss']
})
export class PayrollOverviewComponent {
  title = 'Payroll Overview';
  subtitle = 'Real-time insights into your payroll operations';

  // Main KPI cards
  mainKPIs: PayrollKPI[] = [
    { title: 'Total Gross Pay', value: '₱62,500,000' },
    { title: 'Total Net Pay', value: '₱47,500,000' },
    { title: 'Total Deductions', value: '₱15,000,000' }
  ];

  // Secondary KPI cards
  secondaryKPIs = [
    { title: 'Total Employees Paid', value: '250' },
    { 
      title: 'Payroll Run Status', 
      value: 'Last Run: June 28th',
      status: 'Completed',
      statusClass: 'bg-green-100 text-green-800'
    }
  ];

  // Chart data
  chartData = {
    currentValue: '₱5,000,000',
    period: 'This Month',
    growth: '+5%',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  };

  // Active tab for chart
  activeTab = 'monthly';

  // KPI alerts
  alerts: PayrollAlert[] = [
    {
      type: 'error',
      icon: 'error_outline',
      title: 'Overdue Payroll',
      description: '3 days overdue - Action Required',
      buttonText: 'View Details',
      iconBgColor: 'bg-red-100',
      textColor: 'text-red-600'
    },
    {
      type: 'warning',
      icon: 'warning_amber',
      title: 'Expiring Loan Terms',
      description: '2 employees with loans expiring soon',
      buttonText: 'Review',
      iconBgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700'
    },
    {
      type: 'info',
      icon: 'description',
      title: 'Tax Discrepancies',
      description: '1 discrepancy found in Q2 filings',
      buttonText: 'Investigate',
      iconBgColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    }
  ];



  // Chart tabs
  chartTabs = [
    { name: 'Weekly', key: 'weekly', active: false },
    { name: 'Monthly', key: 'monthly', active: true },
    { name: 'Annual', key: 'annual', active: false }
  ];

  constructor() {}

  // Methods for interactions
  onTabClick(tab: any): void {
    this.chartTabs.forEach(t => t.active = false);
    tab.active = true;
    this.activeTab = tab.key;
    console.log('Tab changed to:', tab.key);
  }

  onAlertAction(alert: PayrollAlert): void {
    console.log('Alert action clicked:', alert.title);
  }

  getIconColor(type: string): string {
    switch (type) {
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  }
} 