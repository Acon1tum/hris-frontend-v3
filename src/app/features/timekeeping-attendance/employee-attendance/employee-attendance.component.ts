import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface AttendanceLog {
  id: number;
  date: string;
  timeInOut: string;
  location: string;
  type: string;
  status: 'in-progress' | 'complete' | 'missing';
  statusText: string;
}

export interface ClockMethod {
  id: string;
  name: string;
  icon: string;
  action: string;
}

export interface AttendanceLog {
  id: number;
  date: string;
  timeInOut: string;
  location: string;
  type: string;
  status: 'in-progress' | 'complete' | 'missing';
  statusText: string;
}

export interface ClockMethod {
  id: string;
  name: string;
  icon: string;
  action: string;
}

@Component({
  selector: 'app-employee-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.scss']
})
export class EmployeeAttendanceComponent implements OnInit {
  title = 'Employee Attendance';
  currentUser = 'Sarah';
  lastClockIn = 'Today at 8:03 AM';
  isCurrentlyWorking = true;

  // Clock-in methods
  clockMethods: ClockMethod[] = [
    {
      id: 'qr-code',
      name: 'Scan QR Code',
      icon: 'qr_code_scanner',
      action: 'qr-scan'
    },
    {
      id: 'barcode',
      name: 'Scan Barcode',
      icon: 'barcode_reader',
      action: 'barcode-scan'
    },
    {
      id: 'face-scan',
      name: 'Face Scan',
      icon: 'camera_alt',
      action: 'face-scan'
    }
  ];

  // Attendance log data
  attendanceLogs: AttendanceLog[] = [
    {
      id: 1,
      date: 'Today',
      timeInOut: '8:03 AM - In Progress',
      location: 'Main Office',
      type: 'On-site',
      status: 'in-progress',
      statusText: 'In Progress'
    },
    {
      id: 2,
      date: 'Yesterday',
      timeInOut: '8:00 AM - 5:05 PM (9h 5m)',
      location: 'Main Office',
      type: 'On-site',
      status: 'complete',
      statusText: 'Complete'
    },
    {
      id: 3,
      date: '07/10/2024',
      timeInOut: 'MISSING LOG',
      location: '-',
      type: '-',
      status: 'missing',
      statusText: 'Missing'
    },
    {
      id: 4,
      date: '07/09/2024',
      timeInOut: '8:15 AM - 4:50 PM (8h 35m)',
      location: 'Main Office',
      type: 'On-site',
      status: 'complete',
      statusText: 'Complete'
    },
    {
      id: 5,
      date: '07/08/2024',
      timeInOut: '9:00 AM - 5:30 PM (8h 30m)',
      location: 'Home',
      type: 'WFH',
      status: 'complete',
      statusText: 'Complete'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Component initialization
  }

  // Main clock in/out action
  onClockInOut(): void {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    if (this.isCurrentlyWorking) {
      // Clock out
      console.log('Clocking out at:', timeString);
      this.isCurrentlyWorking = false;
      // Update the current log entry
      const todayLog = this.attendanceLogs.find(log => log.date === 'Today');
      if (todayLog) {
        const startTime = todayLog.timeInOut.split(' - ')[0];
        const duration = this.calculateDuration(startTime, timeString);
        todayLog.timeInOut = `${startTime} - ${timeString} (${duration})`;
        todayLog.status = 'complete';
        todayLog.statusText = 'Complete';
      }
    } else {
      // Clock in
      console.log('Clocking in at:', timeString);
      this.isCurrentlyWorking = true;
      this.lastClockIn = `Today at ${timeString}`;
      // Add or update today's log
      const todayLog = this.attendanceLogs.find(log => log.date === 'Today');
      if (todayLog) {
        todayLog.timeInOut = `${timeString} - In Progress`;
        todayLog.status = 'in-progress';
        todayLog.statusText = 'In Progress';
      }
    }
  }

  // Alternative clock methods
  onAlternativeMethod(method: ClockMethod): void {
    console.log(`Using ${method.name} for attendance`);
    // Implement specific method logic here
    switch (method.action) {
      case 'qr-scan':
        console.log('Opening QR code scanner...');
        break;
      case 'barcode-scan':
        console.log('Opening barcode scanner...');
        break;
      case 'face-scan':
        console.log('Opening face recognition...');
        break;
    }
  }

  // Quick actions
  onViewSchedule(): void {
    console.log('Viewing schedule...');
    // Navigate to schedule view
  }

  onSubmitMissingLog(): void {
    console.log('Opening missing log submission...');
    // Navigate to DTR adjustment or missing log form
  }

  onViewDTR(): void {
    console.log('Viewing DTR...');
    // Navigate to DTR view
  }

  onViewAllLogs(): void {
    console.log('Viewing all attendance logs...');
    // Navigate to full attendance history
  }

  // Utility methods
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'in-progress':
        return 'status-in-progress';
      case 'complete':
        return 'status-complete';
      case 'missing':
        return 'status-missing';
      default:
        return 'status-default';
    }
  }

  private calculateDuration(startTime: string, endTime: string): string {
    // Simple duration calculation for demo
    // In real implementation, you'd use proper date/time calculation
    return '8h 30m'; // Placeholder
  }

  get clockButtonText(): string {
    return this.isCurrentlyWorking ? 'Clock Out' : 'Clock In';
  }

  get clockButtonIcon(): string {
    return this.isCurrentlyWorking ? 'access_time_filled' : 'timer';
  }

  trackByLogId(index: number, log: AttendanceLog): number {
    return log.id;
  }
} 