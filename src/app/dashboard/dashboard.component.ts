import { Component, HostBinding, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @HostBinding('class.sidebar-collapsed') isSidebarCollapsed = false;
  @HostBinding('class.sidebar-open') isSidebarOpen = false;
  
  title = 'HRIS Dashboard';
  
  dashboardStats = [
    { label: 'Total Employees', value: '1,247', icon: '👥', change: '+12', trend: 'up' },
    { label: 'Active Projects', value: '23', icon: '📋', change: '+3', trend: 'up' },
    { label: 'Leave Requests', value: '8', icon: '📅', change: '-2', trend: 'down' },
    { label: 'Payroll Due', value: '$45,230', icon: '💰', change: '+$2,450', trend: 'up' }
  ];

  recentActivities = [
    { action: 'New employee onboarded', user: 'John Smith', time: '2 hours ago', type: 'success' },
    { action: 'Leave request approved', user: 'Sarah Johnson', time: '4 hours ago', type: 'info' },
    { action: 'Payroll processed', user: 'System', time: '6 hours ago', type: 'success' },
    { action: 'Performance review due', user: 'Mike Wilson', time: '1 day ago', type: 'warning' }
  ];

  quickActions = [
    { name: 'Add Employee', icon: '👤', route: '/personnel-information-management' },
    { name: 'Process Payroll', icon: '💰', route: '/payroll-management' },
    { name: 'Generate Report', icon: '📊', route: '/report-generation' },
    { name: 'View Attendance', icon: '⏰', route: '/timekeeping-attendance' }
  ];

  ngOnInit() {
    console.log('Dashboard Component loaded!');
  }

  onSidebarStateChange(state: {isOpen: boolean; isCollapsed: boolean}) {
    this.isSidebarCollapsed = state.isCollapsed;
    this.isSidebarOpen = state.isOpen;
  }
} 