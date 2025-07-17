import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  title = 'Dashboard';
  
  dashboardStats = [
    { label: 'Total Employees', value: '1,234', icon: '👥', change: '+12%', trend: 'up' },
    { label: 'Active Projects', value: '45', icon: '📊', change: '+8%', trend: 'up' },
    { label: 'Leave Requests', value: '23', icon: '📅', change: '-5%', trend: 'down' },
    { label: 'Payroll Due', value: '$125K', icon: '💰', change: '+15%', trend: 'up' }
  ];

  recentActivities = [
    { action: 'New employee registered', user: 'John Doe', time: '2 minutes ago', type: 'user' },
    { action: 'Leave request approved', user: 'Jane Smith', time: '15 minutes ago', type: 'approval' },
    { action: 'Payroll processed', user: 'System', time: '1 hour ago', type: 'system' },
    { action: 'Performance review completed', user: 'Mike Johnson', time: '2 hours ago', type: 'review' }
  ];

  quickActions = [
    { name: 'Add Employee', icon: '➕', action: 'add-employee' },
    { name: 'Process Payroll', icon: '💰', action: 'process-payroll' },
    { name: 'Generate Report', icon: '📊', action: 'generate-report' },
    { name: 'Schedule Meeting', icon: '📅', action: 'schedule-meeting' }
  ];

  onQuickAction(action: string) {
    console.log('Quick action:', action);
  }
} 