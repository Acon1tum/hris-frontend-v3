import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timekeeping-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class TimekeepingAttendanceComponent {
  title = 'Timekeeping & Attendance';
  
  timekeepingFeatures = [
    { name: 'Time Clock', description: 'Clock in/out and track work hours', icon: '⏰' },
    { name: 'Attendance Reports', description: 'View attendance history and reports', icon: '📊' },
    { name: 'Overtime Tracking', description: 'Monitor overtime hours and approvals', icon: '🕐' },
    { name: 'Schedule Management', description: 'Manage work schedules and shifts', icon: '📅' },
    { name: 'Leave Integration', description: 'Track leave and time-off requests', icon: '🏖️' },
    { name: 'Geolocation Tracking', description: 'Location-based attendance verification', icon: '📍' }
  ];
} 
 