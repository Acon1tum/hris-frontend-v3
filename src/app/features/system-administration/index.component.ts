import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-system-administration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class SystemAdministrationComponent {
  title = 'System Administration';
  
  adminFeatures = [
    { name: 'User Management', description: 'Manage system users and permissions', icon: '👥' },
    { name: 'Role Management', description: 'Configure user roles and access levels', icon: '🔐' },
    { name: 'System Settings', description: 'Configure system-wide settings', icon: '⚙️' },
    { name: 'Audit Logs', description: 'View system activity and audit trails', icon: '📋' },
    { name: 'Backup & Recovery', description: 'Manage system backups and data recovery', icon: '💾' },
    { name: 'System Health', description: 'Monitor system performance and health', icon: '🏥' }
  ];
} 