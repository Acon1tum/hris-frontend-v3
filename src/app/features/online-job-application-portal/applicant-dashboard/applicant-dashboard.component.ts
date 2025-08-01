import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/header/header.component';
import { InterviewService, InterviewInfo } from './interview.service';

interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  department: string;
  applicationDate: Date;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interviewed' | 'rejected' | 'accepted';
  lastUpdated: Date;
  applicationDeadline: Date;
  salaryRange: string;
  employmentType: string;
  time?: string; // Optional interview time
}

interface DashboardStats {
  totalApplications: number;
  pendingReview: number;
  shortlisted: number;
  interviews: number;
  rejected: number;
  accepted: number;
}

interface RecentActivity {
  id: string;
  type: 'application' | 'status_update' | 'interview' | 'document';
  title: string;
  description: string;
  timestamp: Date;
  status?: string;
}

@Component({
  selector: 'app-applicant-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, RouterModule],
  templateUrl: './applicant-dashboard.component.html',
  styleUrls: ['./applicant-dashboard.component.scss']
})
export class ApplicantDashboardComponent implements OnInit, OnDestroy {
  // Dashboard data
  applications: JobApplication[] = [];
  stats: DashboardStats = {
    totalApplications: 0,
    pendingReview: 0,
    shortlisted: 0,
    interviews: 0,
    rejected: 0,
    accepted: 0
  };
  recentActivities: RecentActivity[] = [];
  
  // UI state
  loading = false;
  selectedFilter = 'all';
  searchTerm = '';
  currentView = 'overview'; // 'overview' | 'applications' | 'profile' | 'settings'
  
  // Modal state
  showApplicationModal = false;
  selectedApplication: JobApplication | null = null;
  
  // Mock data for demonstration
  private mockApplications: JobApplication[] = [
    {
      id: '1',
      jobTitle: 'Software Engineer',
      company: 'Quanby HRIS',
      department: 'IT Department',
      applicationDate: new Date('2024-01-15'),
      status: 'shortlisted',
      lastUpdated: new Date('2024-01-20'),
      applicationDeadline: new Date('2024-02-15'),
      salaryRange: '₱25,000 - ₱35,000',
      employmentType: 'Full_Time'
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
      salaryRange: '₱20,000 - ₱30,000',
      employmentType: 'Full_Time'
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
      employmentType: 'Contractual'
    },
    {
      id: '4',
      jobTitle: 'Accountant',
      company: 'Quanby HRIS',
      department: 'Finance',
      applicationDate: new Date('2023-12-20'),
      status: 'rejected',
      lastUpdated: new Date('2024-01-10'),
      applicationDeadline: new Date('2024-01-20'),
      salaryRange: '₱22,000 - ₱32,000',
      employmentType: 'Full_Time'
    },
    // Dummy interview data
    {
      id: '5',
      jobTitle: 'HR Specialist',
      company: 'Quanby HRIS',
      department: 'Human Resources',
      applicationDate: new Date(),
      status: 'interviewed',
      lastUpdated: new Date(),
      applicationDeadline: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 10),
      salaryRange: '₱20,000 - ₱30,000',
      employmentType: 'Full_Time',
      time: '10:00 AM - 11:00 AM'
    }
  ];

  private mockActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'status_update',
      title: 'Application Status Updated',
      description: 'Your Software Engineer application has been shortlisted',
      timestamp: new Date('2024-01-20T10:30:00'),
      status: 'shortlisted'
    },
    {
      id: '2',
      type: 'interview',
      title: 'Interview Scheduled',
      description: 'Interview scheduled for HR Specialist position on Jan 25, 2024',
      timestamp: new Date('2024-01-18T14:15:00'),
      status: 'interviewed'
    },
    {
      id: '3',
      type: 'application',
      title: 'New Application Submitted',
      description: 'Marketing Assistant application submitted successfully',
      timestamp: new Date('2024-01-05T09:45:00'),
      status: 'pending'
    },
    {
      id: '4',
      type: 'document',
      title: 'Document Uploaded',
      description: 'Resume updated for Software Engineer position',
      timestamp: new Date('2024-01-15T16:20:00')
    }
  ];

  constructor(private router: Router, private interviewService: InterviewService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  loadDashboardData() {
    this.loading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.applications = [...this.mockApplications];
      this.recentActivities = [...this.mockActivities];
      this.calculateStats();
      // Set interviews in the shared service
      const interviews: InterviewInfo[] = this.applications
        .filter(app => app.status === 'interviewed')
        .map(app => ({
          id: app.id,
          jobTitle: app.jobTitle,
          company: app.company,
          date: app.applicationDate,
          time: app.time, // Pass time if available
          status: app.status, // Pass status for color coding
          department: app.department // Pass department for modal display
        }));
      this.interviewService.setInterviews(interviews);
      this.loading = false;
    }, 1000);
  }

  calculateStats() {
    this.stats = {
      totalApplications: this.applications.length,
      pendingReview: this.applications.filter(app => app.status === 'pending').length,
      shortlisted: this.applications.filter(app => app.status === 'shortlisted').length,
      interviews: this.applications.filter(app => app.status === 'interviewed').length,
      rejected: this.applications.filter(app => app.status === 'rejected').length,
      accepted: this.applications.filter(app => app.status === 'accepted').length
    };
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
        app.department.toLowerCase().includes(search)
      );
    }

    return filtered;
  }

  getStatusColor(status: string): string {
    const colors = {
      pending: '#f59e0b',
      reviewing: '#3b82f6',
      shortlisted: '#10b981',
      interviewed: '#8b5cf6',
      rejected: '#ef4444',
      accepted: '#059669'
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  }

  getStatusLabel(status: string): string {
    const labels = {
      pending: 'Pending Review',
      reviewing: 'Under Review',
      shortlisted: 'Shortlisted',
      interviewed: 'Interviewed',
      rejected: 'Rejected',
      accepted: 'Accepted'
    };
    return labels[status as keyof typeof labels] || status;
  }

  getActivityIcon(type: string): string {
    const icons = {
      application: 'work',
      status_update: 'update',
      interview: 'event',
      document: 'description'
    };
    return icons[type as keyof typeof icons] || 'info';
  }

  getActivityColor(type: string): string {
    const colors = {
      application: '#3b82f6',
      status_update: '#10b981',
      interview: '#8b5cf6',
      document: '#f59e0b'
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  }

  onFilterChange(filter: string) {
    this.selectedFilter = filter;
  }

  onSearch() {
    // Search functionality is handled by the getter
  }

  onViewChange(view: string) {
    this.currentView = view;
  }

  viewApplication(application: JobApplication) {
    this.selectedApplication = application;
    this.showApplicationModal = true;
  }

  closeApplicationModal() {
    this.showApplicationModal = false;
    this.selectedApplication = null;
  }

  withdrawApplication(application: JobApplication) {
    if (confirm('Are you sure you want to withdraw this application?')) {
      this.applications = this.applications.filter(app => app.id !== application.id);
      this.calculateStats();
    }
  }

  updateProfile() {
    this.currentView = 'profile';
  }

  openSettings() {
    this.currentView = 'settings';
  }

  browseJobs() {
    this.router.navigate(['/online-job-application-portal']);
  }

  goToInterviews() {
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
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  }
}
