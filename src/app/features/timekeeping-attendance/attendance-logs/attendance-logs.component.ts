import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface AttendanceLog {
  id: number;
  employeeName: string;
  department: string;
  timeIn: string;
  timeOut: string;
  totalHours: string;
  late: string;
  undertime: string;
  overtime: string;
  status: 'on-time' | 'late';
  remarks: string;
  date: Date;
  logMethod?: string;
}

export interface FilterOptions {
  dateRange: string;
  employee: string;
  department: string;
  logMethod: string;
  searchTerm: string;
}

@Component({
  selector: 'app-attendance-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance-logs.component.html',
  styleUrls: ['./attendance-logs.component.scss']
})
export class AttendanceLogsComponent implements OnInit {
  title = 'Attendance Logs';

  // Sample attendance log data
  attendanceLogs: AttendanceLog[] = [
    {
      id: 1,
      employeeName: 'Ethan Harper',
      department: 'Marketing',
      timeIn: '09:00 AM',
      timeOut: '06:00 PM',
      totalHours: '09:00',
      late: '00:00',
      undertime: '00:00',
      overtime: '01:00',
      status: 'on-time',
      remarks: 'On Time',
      date: new Date('2024-01-15'),
      logMethod: 'biometrics'
    },
    {
      id: 2,
      employeeName: 'Olivia Bennett',
      department: 'Sales',
      timeIn: '08:30 AM',
      timeOut: '05:30 PM',
      totalHours: '09:00',
      late: '00:00',
      undertime: '00:00',
      overtime: '00:30',
      status: 'on-time',
      remarks: 'On Time',
      date: new Date('2024-01-15'),
      logMethod: 'qr_code'
    },
    {
      id: 3,
      employeeName: 'Noah Carter',
      department: 'Engineering',
      timeIn: '09:15 AM',
      timeOut: '06:15 PM',
      totalHours: '09:00',
      late: '00:15',
      undertime: '00:00',
      overtime: '01:15',
      status: 'late',
      remarks: 'Late',
      date: new Date('2024-01-15'),
      logMethod: 'rfid'
    },
    {
      id: 4,
      employeeName: 'Ava Thompson',
      department: 'HR',
      timeIn: '08:45 AM',
      timeOut: '05:45 PM',
      totalHours: '09:00',
      late: '00:00',
      undertime: '00:00',
      overtime: '00:45',
      status: 'on-time',
      remarks: 'On Time',
      date: new Date('2024-01-15'),
      logMethod: 'biometrics'
    },
    {
      id: 5,
      employeeName: 'Liam Foster',
      department: 'Finance',
      timeIn: '09:05 AM',
      timeOut: '06:05 PM',
      totalHours: '09:00',
      late: '00:05',
      undertime: '00:00',
      overtime: '01:05',
      status: 'late',
      remarks: 'Late',
      date: new Date('2024-01-15'),
      logMethod: 'qr_code'
    },
    {
      id: 6,
      employeeName: 'Sophia Rodriguez',
      department: 'Technology',
      timeIn: '08:50 AM',
      timeOut: '05:50 PM',
      totalHours: '09:00',
      late: '00:00',
      undertime: '00:00',
      overtime: '00:50',
      status: 'on-time',
      remarks: 'On Time',
      date: new Date('2024-01-15'),
      logMethod: 'biometrics'
    },
    {
      id: 7,
      employeeName: 'Emma Wilson',
      department: 'HR',
      timeIn: '09:20 AM',
      timeOut: '06:20 PM',
      totalHours: '09:00',
      late: '00:20',
      undertime: '00:00',
      overtime: '01:20',
      status: 'late',
      remarks: 'Late',
      date: new Date('2024-01-14'),
      logMethod: 'rfid'
    },
    {
      id: 8,
      employeeName: 'Alex Turner',
      department: 'Finance',
      timeIn: '08:55 AM',
      timeOut: '05:55 PM',
      totalHours: '09:00',
      late: '00:00',
      undertime: '00:00',
      overtime: '00:55',
      status: 'on-time',
      remarks: 'On Time',
      date: new Date('2024-01-14'),
      logMethod: 'biometrics'
    }
  ];

  // Filter options
  filters: FilterOptions = {
    dateRange: '',
    employee: '',
    department: '',
    logMethod: '',
    searchTerm: ''
  };

  // Dropdown options
  employees = [
    { value: '', label: 'All Employees' },
    { value: 'ethan_harper', label: 'Ethan Harper' },
    { value: 'olivia_bennett', label: 'Olivia Bennett' },
    { value: 'noah_carter', label: 'Noah Carter' },
    { value: 'ava_thompson', label: 'Ava Thompson' },
    { value: 'liam_foster', label: 'Liam Foster' }
  ];

  departments = [
    { value: '', label: 'All Departments' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'hr', label: 'HR' },
    { value: 'finance', label: 'Finance' },
    { value: 'technology', label: 'Technology' }
  ];

  logMethods = [
    { value: '', label: 'All Methods' },
    { value: 'biometrics', label: 'Biometrics' },
    { value: 'qr_code', label: 'QR Code' },
    { value: 'rfid', label: 'RFID' }
  ];

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  constructor() { }

  ngOnInit(): void {
    // Component initialization
  }

  // Computed properties
  get filteredLogs(): AttendanceLog[] {
    let filtered = [...this.attendanceLogs];

    // Apply filters
    if (this.filters.employee) {
      filtered = filtered.filter(log => 
        log.employeeName.toLowerCase().replace(' ', '_').includes(this.filters.employee)
      );
    }

    if (this.filters.department) {
      filtered = filtered.filter(log => 
        log.department.toLowerCase() === this.filters.department
      );
    }

    if (this.filters.logMethod) {
      filtered = filtered.filter(log => 
        log.logMethod === this.filters.logMethod
      );
    }

    // Apply search
    if (this.filters.searchTerm) {
      const searchTerm = this.filters.searchTerm.toLowerCase();
      filtered = filtered.filter(log =>
        log.employeeName.toLowerCase().includes(searchTerm) ||
        log.department.toLowerCase().includes(searchTerm) ||
        log.remarks.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }

  get paginatedLogs(): AttendanceLog[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredLogs.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredLogs.length / this.itemsPerPage);
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  // Methods
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'on-time':
        return 'status-on-time';
      case 'late':
        return 'status-late';
      default:
        return 'status-default';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'on-time':
        return 'On Time';
      case 'late':
        return 'Late';
      default:
        return 'Unknown';
    }
  }

  isLateTime(time: string): boolean {
    return time !== '00:00';
  }

  onExportLogs(): void {
    console.log('Exporting attendance logs...');
    // Implement export functionality
  }

  onApplyFilters(): void {
    this.currentPage = 1; // Reset to first page when applying filters
    console.log('Filters applied:', this.filters);
  }

  onClearFilters(): void {
    this.filters = {
      dateRange: '',
      employee: '',
      department: '',
      logMethod: '',
      searchTerm: ''
    };
    this.currentPage = 1;
    console.log('Filters cleared');
  }

  onSearch(): void {
    this.currentPage = 1; // Reset to first page when searching
  }

  // Pagination methods
  nextPage(): void {
    if (this.hasNextPage) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.hasPreviousPage) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  trackByLogId(index: number, log: AttendanceLog): number {
    return log.id;
  }
} 