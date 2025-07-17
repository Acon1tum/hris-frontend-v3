import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Employee {
  id: number;
  name: string;
  status: 'on-time' | 'late' | 'absent';
  timeIn: string | null;
  timeOut: string | null;
  department: string;
}

export interface AttendanceSummary {
  totalPresent: number;
  totalAbsent: number;
  totalOnLeave: number;
}

@Component({
  selector: 'app-attendance-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance-overview.component.html',
  styleUrls: ['./attendance-overview.component.scss']
})
export class AttendanceOverviewComponent implements OnInit {
  title = 'Attendance Overview';

  employees: Employee[] = [
    {
      id: 1,
      name: 'Ethan Carter',
      status: 'on-time',
      timeIn: '09:00 AM',
      timeOut: null,
      department: 'Marketing'
    },
    {
      id: 2,
      name: 'Olivia Bennett',
      status: 'late',
      timeIn: '09:15 AM',
      timeOut: null,
      department: 'Sales'
    },
    {
      id: 3,
      name: 'Noah Thompson',
      status: 'absent',
      timeIn: null,
      timeOut: null,
      department: 'Engineering'
    },
    {
      id: 4,
      name: 'Ava Harper',
      status: 'on-time',
      timeIn: '08:55 AM',
      timeOut: null,
      department: 'Product'
    },
    {
      id: 5,
      name: 'Liam Foster',
      status: 'on-time',
      timeIn: '08:45 AM',
      timeOut: null,
      department: 'Design'
    },
    {
      id: 6,
      name: 'Sophia Rodriguez',
      status: 'on-time',
      timeIn: '08:50 AM',
      timeOut: null,
      department: 'Technology'
    },
    {
      id: 7,
      name: 'Emma Wilson',
      status: 'late',
      timeIn: '09:30 AM',
      timeOut: null,
      department: 'HR'
    },
    {
      id: 8,
      name: 'Alex Turner',
      status: 'on-time',
      timeIn: '08:55 AM',
      timeOut: '05:00 PM',
      department: 'Finance'
    }
  ];

  attendanceSummary: AttendanceSummary = {
    totalPresent: 120,
    totalAbsent: 5,
    totalOnLeave: 10
  };

  constructor() { }

  ngOnInit(): void {
    // Component initialization
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'on-time':
        return 'status-on-time';
      case 'late':
        return 'status-late';
      case 'absent':
        return 'status-absent';
      default:
        return 'status-default';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'on-time':
        return 'On-time';
      case 'late':
        return 'Late';
      case 'absent':
        return 'Absent';
      default:
        return 'Unknown';
    }
  }

  onViewAll(): void {
    console.log('View all attendance clicked');
  }

  trackByEmployeeId(index: number, employee: Employee): number {
    return employee.id;
  }
} 