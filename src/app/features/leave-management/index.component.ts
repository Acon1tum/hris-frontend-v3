import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leave-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class LeaveManagementComponent {
  title = 'Leave Management';
  
  leaveFeatures = [
    { name: 'Leave Requests', description: 'Submit and approve leave applications', icon: '📝' },
    { name: 'Leave Balance', description: 'Track available leave days and balances', icon: '📊' },
    { name: 'Leave Calendar', description: 'Visual calendar for leave planning', icon: '📅' },
    { name: 'Leave Policies', description: 'Configure leave types and policies', icon: '📋' },
    { name: 'Approval Workflow', description: 'Multi-level approval process', icon: '✅' },
    { name: 'Leave Reports', description: 'Generate leave analytics and reports', icon: '📈' }
  ];
} 