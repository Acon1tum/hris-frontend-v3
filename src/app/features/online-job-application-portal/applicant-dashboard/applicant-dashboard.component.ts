import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/header/header.component';
import { InterviewService, InterviewInfo } from './interview.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

// Enhanced interfaces with better type safety
export interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  department: string;
  applicationDate: Date;
  status: ApplicationStatus;
  lastUpdated: Date;
  applicationDeadline: Date;
  salaryRange: string;
  employmentType: EmploymentType;
  time?: string;
  location?: string;
  description?: string;
  requirements?: string[];
}

export type ApplicationStatus = 
  | 'pending' 
  | 'reviewing' 
  | 'shortlisted' 
  | 'interviewed' 
  | 'rejected' 
  | 'accepted';

export type EmploymentType = 'Full_Time' | 'Part_Time' | 'Contractual' | 'Internship';

export interface DashboardStats {
  totalApplications: number;
  pendingReview: number;
  shortlisted: number;
  interviews: number;
  rejected: number;
  accepted: number;
  successRate: number;
}

export interface RecentActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  status?: ApplicationStatus;
  applicationId?: string;
}

export type ActivityType = 'application' | 'status_update' | 'interview' | 'document' | 'reminder';

export type DashboardView = 'overview' | 'applications' | 'profile' | 'settings';

@Component({
  selector: 'app-applicant-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, RouterModule],
  templateUrl: './applicant-dashboard.component.html',
  styleUrls: ['./applicant-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicantDashboardComponent implements OnInit, OnDestroy {
  // Dashboard data
  isHeaderVisible = true;
  publicMode = false;
  applications: JobApplication[] = [];
  stats: DashboardStats = {
    totalApplications: 0,
    pendingReview: 0,
    shortlisted: 0,
    interviews: 0,
    rejected: 0,
    accepted: 0,
    successRate: 0
  };
  recentActivities: RecentActivity[] = [];
  
  // UI state
  loading = false;
  selectedFilter: ApplicationStatus | 'all' = 'all';
  searchTerm = '';
  currentView: DashboardView = 'overview';
  
  // Modal state
  showApplicationModal = false;
  selectedApplication: JobApplication | null = null;
  
  // Reactive search
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Enhanced mock data with more realistic information
  private readonly mockApplications: JobApplication[] = [
    {
      id: '1',
      jobTitle: 'Senior Software Engineer',
      company: 'Quanby HRIS',
      department: 'IT Department',
      applicationDate: new Date('2024-01-15'),
      status: 'shortlisted',
      lastUpdated: new Date('2024-01-20'),
      applicationDeadline: new Date('2024-02-15'),
      salaryRange: '₱45,000 - ₱65,000',
      employmentType: 'Full_Time',
      location: 'Makati City, Metro Manila',
      description: 'Develop and maintain web applications using modern technologies',
      requirements: ['Angular', 'TypeScript', 'Node.js', '5+ years experience']
    },
    {
      id: '2',
      jobTitle: 'HR Specialist',
      company: 'Quanby HRIS',
      department: 'Human Resources',
      applicationDate: new Date('2024-01-10'),
      status: 'reviewing',
      lastUpdated: new Date('2024-01-18'),
      applicationDeadline: new Date('2024-02-10'),
      salaryRange: '₱25,000 - ₱35,000',
      employmentType: 'Full_Time',
      location: 'Quezon City, Metro Manila',
      description: 'Manage recruitment processes and employee relations',
      requirements: ['HR Management', 'Recruitment', 'Employee Relations', '3+ years experience']
    },
    {
      id: '3',
      jobTitle: 'Marketing Assistant',
      company: 'Quanby HRIS',
      department: 'Marketing',
      applicationDate: new Date('2024-01-05'),
      status: 'pending',
      lastUpdated: new Date('2024-01-05'),
      applicationDeadline: new Date('2024-02-05'),
      salaryRange: '₱18,000 - ₱25,000',
      employmentType: 'Contractual',
      location: 'Taguig City, Metro Manila',
      description: 'Support marketing campaigns and social media management',
      requirements: ['Digital Marketing', 'Social Media', 'Content Creation', '1+ year experience']
    },
    {
      id: '4',
      jobTitle: 'Senior Accountant',
      company: 'Quanby HRIS',
      department: 'Finance',
      applicationDate: new Date('2023-12-20'),
      status: 'rejected',
      lastUpdated: new Date('2024-01-10'),
      applicationDeadline: new Date('2024-01-20'),
      salaryRange: '₱35,000 - ₱45,000',
      employmentType: 'Full_Time',
      location: 'Manila City, Metro Manila',
      description: 'Manage financial records and prepare reports',
      requirements: ['CPA License', 'Financial Reporting', 'Tax Compliance', '5+ years experience']
    },
    {
      id: '5',
      jobTitle: 'UI/UX Designer',
      company: 'Quanby HRIS',
      department: 'Design',
      applicationDate: new Date('2024-01-12'),
      status: 'interviewed',
      lastUpdated: new Date('2024-01-22'),
      applicationDeadline: new Date('2024-02-12'),
      salaryRange: '₱30,000 - ₱45,000',
      employmentType: 'Full_Time',
      location: 'Makati City, Metro Manila',
      description: 'Create user-centered design solutions',
      requirements: ['Figma', 'Adobe Creative Suite', 'User Research', '3+ years experience'],
      time: '10:00 AM - 11:00 AM'
    },
    {
      id: '6',
      jobTitle: 'Data Analyst',
      company: 'Quanby HRIS',
      department: 'Analytics',
      applicationDate: new Date('2024-01-08'),
      status: 'accepted',
      lastUpdated: new Date('2024-01-25'),
      applicationDeadline: new Date('2024-02-08'),
      salaryRange: '₱28,000 - ₱40,000',
      employmentType: 'Full_Time',
      location: 'BGC, Taguig City',
      description: 'Analyze data and create insights for business decisions',
      requirements: ['SQL', 'Python', 'Data Visualization', '2+ years experience']
    }
  ];

  private readonly mockActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'status_update',
      title: 'Application Status Updated',
      description: 'Your Senior Software Engineer application has been shortlisted',
      timestamp: new Date('2024-01-20T10:30:00'),
      status: 'shortlisted',
      applicationId: '1'
    },
    {
      id: '2',
      type: 'interview',
      title: 'Interview Scheduled',
      description: 'Interview scheduled for UI/UX Designer position on Jan 25, 2024',
      timestamp: new Date('2024-01-18T14:15:00'),
      status: 'interviewed',
      applicationId: '5'
    },
    {
      id: '3',
      type: 'application',
      title: 'New Application Submitted',
      description: 'Marketing Assistant application submitted successfully',
      timestamp: new Date('2024-01-05T09:45:00'),
      status: 'pending',
      applicationId: '3'
    },
    {
      id: '4',
      type: 'document',
      title: 'Document Uploaded',
      description: 'Portfolio updated for UI/UX Designer position',
      timestamp: new Date('2024-01-15T16:20:00'),
      applicationId: '5'
    },
    {
      id: '5',
      type: 'status_update',
      title: 'Application Accepted',
      description: 'Congratulations! Your Data Analyst application has been accepted',
      timestamp: new Date('2024-01-25T11:00:00'),
      status: 'accepted',
      applicationId: '6'
    },
    {
      id: '6',
      type: 'reminder',
      title: 'Application Deadline Reminder',
      description: 'Senior Software Engineer application deadline is approaching',
      timestamp: new Date('2024-01-22T08:00:00'),
      applicationId: '1'
    }
  ];

  constructor(
    private router: Router, 
    private interviewService: InterviewService,
    private cdr: ChangeDetectorRef
  ) {
    this.setupSearchSubscription();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchSubscription(): void {
    this.searchSubject
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  private loadDashboardData(): void {
    this.loading = true;
    this.cdr.markForCheck();
    
    // Simulate API call with better error handling
    setTimeout(() => {
      try {
        this.applications = [...this.mockApplications];
        this.recentActivities = [...this.mockActivities];
        this.calculateStats();
        this.updateInterviewService();
        this.loading = false;
        this.cdr.markForCheck();
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        this.loading = false;
        this.cdr.markForCheck();
      }
    }, 1000);
  }

  private calculateStats(): void {
    const total = this.applications.length;
    const accepted = this.applications.filter(app => app.status === 'accepted').length;
    const successRate = total > 0 ? Math.round((accepted / total) * 100) : 0;

    this.stats = {
      totalApplications: total,
      pendingReview: this.applications.filter(app => app.status === 'pending').length,
      shortlisted: this.applications.filter(app => app.status === 'shortlisted').length,
      interviews: this.applications.filter(app => app.status === 'interviewed').length,
      rejected: this.applications.filter(app => app.status === 'rejected').length,
      accepted,
      successRate
    };
  }

  private updateInterviewService(): void {
    const interviews: InterviewInfo[] = this.applications
      .filter(app => app.status === 'interviewed')
      .map(app => ({
        id: app.id,
        jobTitle: app.jobTitle,
        company: app.company,
        date: app.applicationDate,
        time: app.time,
        status: app.status,
        department: app.department
      }));
    this.interviewService.setInterviews(interviews);
  }

  get filteredApplications(): JobApplication[] {
    let filtered = this.applications;

    // Apply status filter
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(app => app.status === this.selectedFilter);
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.jobTitle.toLowerCase().includes(search) ||
        app.company.toLowerCase().includes(search) ||
        app.department.toLowerCase().includes(search) ||
        app.location?.toLowerCase().includes(search) ||
        app.description?.toLowerCase().includes(search)
      );
    }

    return filtered;
  }

  getStatusColor(status: ApplicationStatus): string {
    const colors: Record<ApplicationStatus, string> = {
      pending: '#f59e0b',
      reviewing: '#3b82f6',
      shortlisted: '#10b981',
      interviewed: '#8b5cf6',
      rejected: '#ef4444',
      accepted: '#059669'
    };
    return colors[status] || '#6b7280';
  }

  getStatusLabel(status: ApplicationStatus): string {
    const labels: Record<ApplicationStatus, string> = {
      pending: 'Pending Review',
      reviewing: 'Under Review',
      shortlisted: 'Shortlisted',
      interviewed: 'Interviewed',
      rejected: 'Rejected',
      accepted: 'Accepted'
    };
    return labels[status] || status;
  }

  getActivityIcon(type: ActivityType): string {
    const icons: Record<ActivityType, string> = {
      application: 'work',
      status_update: 'update',
      interview: 'event',
      document: 'description',
      reminder: 'notifications'
    };
    return icons[type] || 'info';
  }

  getActivityColor(type: ActivityType): string {
    const colors: Record<ActivityType, string> = {
      application: '#3b82f6',
      status_update: '#10b981',
      interview: '#8b5cf6',
      document: '#f59e0b',
      reminder: '#ef4444'
    };
    return colors[type] || '#6b7280';
  }

  onFilterChange(filter: ApplicationStatus | 'all'): void {
    this.selectedFilter = filter;
    this.cdr.markForCheck();
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onViewChange(view: DashboardView): void {
    this.currentView = view;
    this.cdr.markForCheck();
  }

  viewApplication(application: JobApplication): void {
    this.selectedApplication = application;
    this.showApplicationModal = true;
    this.cdr.markForCheck();
  }

  closeApplicationModal(): void {
    this.showApplicationModal = false;
    this.selectedApplication = null;
    this.cdr.markForCheck();
  }

  withdrawApplication(application: JobApplication): void {
    if (confirm(`Are you sure you want to withdraw your application for ${application.jobTitle}?`)) {
      this.applications = this.applications.filter(app => app.id !== application.id);
      this.calculateStats();
      this.updateInterviewService();
      this.cdr.markForCheck();
    }
  }

  updateProfile(): void {
    this.currentView = 'profile';
    this.cdr.markForCheck();
  }

  openSettings(): void {
    this.currentView = 'settings';
    this.cdr.markForCheck();
  }

  browseJobs(): void {
    this.router.navigate(['/online-job-application-portal']);
  }

  goToInterviews(): void {
    this.router.navigate(['/applicant-interviews']);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatDateTime(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  }

  getEmploymentTypeLabel(type: EmploymentType): string {
    const labels: Record<EmploymentType, string> = {
      Full_Time: 'Full Time',
      Part_Time: 'Part Time',
      Contractual: 'Contractual',
      Internship: 'Internship'
    };
    return labels[type] || type;
  }

  isApplicationExpired(application: JobApplication): boolean {
    return new Date() > application.applicationDeadline;
  }

  getApplicationProgress(application: JobApplication): number {
    const statusOrder: ApplicationStatus[] = ['pending', 'reviewing', 'shortlisted', 'interviewed', 'accepted'];
    const currentIndex = statusOrder.indexOf(application.status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  }
}
