import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-self-service',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class EmployeeSelfServiceComponent {
  title = 'Employee Self-Service';
  
  selfServiceFeatures = [
    { name: 'Profile Management', description: 'Update personal information and preferences', icon: '👤' },
    { name: 'Leave Requests', description: 'Submit and track leave applications', icon: '📝' },
    { name: 'Payroll Information', description: 'View salary and payment details', icon: '💰' },
    { name: 'Time Records', description: 'Check attendance and time logs', icon: '⏰' },
    { name: 'Document Access', description: 'Download payslips and certificates', icon: '📄' },
    { name: 'Benefits Portal', description: 'Manage benefits and insurance', icon: '🎁' }
  ];
} 