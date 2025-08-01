import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApplicantDashboardComponent } from './applicant-dashboard.component';
import { InterviewService } from './interview.service';
import { HeaderComponent } from '../../../shared/header/header.component';

describe('ApplicantDashboardComponent', () => {
  let component: ApplicantDashboardComponent;
  let fixture: ComponentFixture<ApplicantDashboardComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockInterviewService: jasmine.SpyObj<InterviewService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const interviewServiceSpy = jasmine.createSpyObj('InterviewService', ['setInterviews']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ApplicantDashboardComponent,
        HeaderComponent
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: InterviewService, useValue: interviewServiceSpy }
      ]
    }).compileComponents();

    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockInterviewService = TestBed.inject(InterviewService) as jasmine.SpyObj<InterviewService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.loading).toBe(false);
    expect(component.currentView).toBe('overview');
    expect(component.selectedFilter).toBe('all');
    expect(component.searchTerm).toBe('');
    expect(component.showApplicationModal).toBe(false);
    expect(component.selectedApplication).toBeNull();
  });

  it('should load dashboard data on init', () => {
    spyOn(component, 'loadDashboardData');
    component.ngOnInit();
    expect(component.loadDashboardData).toHaveBeenCalled();
  });

  it('should calculate stats correctly', () => {
    component.applications = [
      { id: '1', jobTitle: 'Test', company: 'Test', department: 'Test', applicationDate: new Date(), status: 'pending', lastUpdated: new Date(), applicationDeadline: new Date(), salaryRange: 'Test', employmentType: 'Full_Time' },
      { id: '2', jobTitle: 'Test', company: 'Test', department: 'Test', applicationDate: new Date(), status: 'accepted', lastUpdated: new Date(), applicationDeadline: new Date(), salaryRange: 'Test', employmentType: 'Full_Time' }
    ];

    component.calculateStats();

    expect(component.stats.totalApplications).toBe(2);
    expect(component.stats.pendingReview).toBe(1);
    expect(component.stats.accepted).toBe(1);
    expect(component.stats.successRate).toBe(50);
  });

  it('should filter applications correctly', () => {
    component.applications = [
      { id: '1', jobTitle: 'Software Engineer', company: 'Test', department: 'IT', applicationDate: new Date(), status: 'pending', lastUpdated: new Date(), applicationDeadline: new Date(), salaryRange: 'Test', employmentType: 'Full_Time' },
      { id: '2', jobTitle: 'HR Manager', company: 'Test', department: 'HR', applicationDate: new Date(), status: 'accepted', lastUpdated: new Date(), applicationDeadline: new Date(), salaryRange: 'Test', employmentType: 'Full_Time' }
    ];

    component.selectedFilter = 'pending';
    const filtered = component.filteredApplications;
    expect(filtered.length).toBe(1);
    expect(filtered[0].status).toBe('pending');
  });

  it('should search applications correctly', () => {
    component.applications = [
      { id: '1', jobTitle: 'Software Engineer', company: 'Test', department: 'IT', applicationDate: new Date(), status: 'pending', lastUpdated: new Date(), applicationDeadline: new Date(), salaryRange: 'Test', employmentType: 'Full_Time' },
      { id: '2', jobTitle: 'HR Manager', company: 'Test', department: 'HR', applicationDate: new Date(), status: 'accepted', lastUpdated: new Date(), applicationDeadline: new Date(), salaryRange: 'Test', employmentType: 'Full_Time' }
    ];

    component.searchTerm = 'Software';
    const filtered = component.filteredApplications;
    expect(filtered.length).toBe(1);
    expect(filtered[0].jobTitle).toBe('Software Engineer');
  });

  it('should get status color correctly', () => {
    expect(component.getStatusColor('pending')).toBe('#f59e0b');
    expect(component.getStatusColor('accepted')).toBe('#059669');
    expect(component.getStatusColor('rejected')).toBe('#ef4444');
  });

  it('should get status label correctly', () => {
    expect(component.getStatusLabel('pending')).toBe('Pending Review');
    expect(component.getStatusLabel('accepted')).toBe('Accepted');
    expect(component.getStatusLabel('rejected')).toBe('Rejected');
  });

  it('should get activity icon correctly', () => {
    expect(component.getActivityIcon('application')).toBe('work');
    expect(component.getActivityIcon('interview')).toBe('event');
    expect(component.getActivityIcon('document')).toBe('description');
  });

  it('should get activity color correctly', () => {
    expect(component.getActivityColor('application')).toBe('#3b82f6');
    expect(component.getActivityColor('interview')).toBe('#8b5cf6');
    expect(component.getActivityColor('document')).toBe('#f59e0b');
  });

  it('should change view correctly', () => {
    component.onViewChange('applications');
    expect(component.currentView).toBe('applications');
  });

  it('should open application modal', () => {
    const mockApplication = { id: '1', jobTitle: 'Test', company: 'Test', department: 'Test', applicationDate: new Date(), status: 'pending', lastUpdated: new Date(), applicationDeadline: new Date(), salaryRange: 'Test', employmentType: 'Full_Time' };
    
    component.viewApplication(mockApplication);
    
    expect(component.selectedApplication).toBe(mockApplication);
    expect(component.showApplicationModal).toBe(true);
  });

  it('should close application modal', () => {
    component.showApplicationModal = true;
    component.selectedApplication = { id: '1', jobTitle: 'Test', company: 'Test', department: 'Test', applicationDate: new Date(), status: 'pending', lastUpdated: new Date(), applicationDeadline: new Date(), salaryRange: 'Test', employmentType: 'Full_Time' };
    
    component.closeApplicationModal();
    
    expect(component.showApplicationModal).toBe(false);
    expect(component.selectedApplication).toBeNull();
  });

  it('should withdraw application', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const mockApplication = { id: '1', jobTitle: 'Test', company: 'Test', department: 'Test', applicationDate: new Date(), status: 'pending', lastUpdated: new Date(), applicationDeadline: new Date(), salaryRange: 'Test', employmentType: 'Full_Time' };
    component.applications = [mockApplication];
    
    component.withdrawApplication(mockApplication);
    
    expect(component.applications.length).toBe(0);
  });

  it('should not withdraw application when user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const mockApplication = { id: '1', jobTitle: 'Test', company: 'Test', department: 'Test', applicationDate: new Date(), status: 'pending', lastUpdated: new Date(), applicationDeadline: new Date(), salaryRange: 'Test', employmentType: 'Full_Time' };
    component.applications = [mockApplication];
    
    component.withdrawApplication(mockApplication);
    
    expect(component.applications.length).toBe(1);
  });

  it('should navigate to browse jobs', () => {
    component.browseJobs();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/online-job-application-portal']);
  });

  it('should navigate to interviews', () => {
    component.goToInterviews();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/applicant-interviews']);
  });

  it('should format date correctly', () => {
    const testDate = new Date('2024-01-15');
    const formatted = component.formatDate(testDate);
    expect(formatted).toContain('Jan 15, 2024');
  });

  it('should format date time correctly', () => {
    const testDate = new Date('2024-01-15T10:30:00');
    const formatted = component.formatDateTime(testDate);
    expect(formatted).toContain('Jan 15, 2024');
  });

  it('should get time ago correctly', () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    expect(component.getTimeAgo(oneHourAgo)).toContain('hour');
    expect(component.getTimeAgo(oneDayAgo)).toContain('day');
  });

  it('should get employment type label correctly', () => {
    expect(component.getEmploymentTypeLabel('Full_Time')).toBe('Full Time');
    expect(component.getEmploymentTypeLabel('Part_Time')).toBe('Part Time');
    expect(component.getEmploymentTypeLabel('Contractual')).toBe('Contractual');
  });

  it('should check if application is expired', () => {
    const expiredApp = { id: '1', jobTitle: 'Test', company: 'Test', department: 'Test', applicationDate: new Date(), status: 'pending', lastUpdated: new Date(), applicationDeadline: new Date('2020-01-01'), salaryRange: 'Test', employmentType: 'Full_Time' };
    const validApp = { id: '2', jobTitle: 'Test', company: 'Test', department: 'Test', applicationDate: new Date(), status: 'pending', lastUpdated: new Date(), applicationDeadline: new Date('2030-01-01'), salaryRange: 'Test', employmentType: 'Full_Time' };
    
    expect(component.isApplicationExpired(expiredApp)).toBe(true);
    expect(component.isApplicationExpired(validApp)).toBe(false);
  });

  it('should calculate application progress correctly', () => {
    const pendingApp = { id: '1', jobTitle: 'Test', company: 'Test', department: 'Test', applicationDate: new Date(), status: 'pending', lastUpdated: new Date(), applicationDeadline: new Date(), salaryRange: 'Test', employmentType: 'Full_Time' };
    const acceptedApp = { id: '2', jobTitle: 'Test', company: 'Test', department: 'Test', applicationDate: new Date(), status: 'accepted', lastUpdated: new Date(), applicationDeadline: new Date(), salaryRange: 'Test', employmentType: 'Full_Time' };
    
    expect(component.getApplicationProgress(pendingApp)).toBe(20); // 1/5 * 100
    expect(component.getApplicationProgress(acceptedApp)).toBe(100); // 5/5 * 100
  });

  it('should handle search input', () => {
    spyOn(component['searchSubject'], 'next');
    component.searchTerm = 'test';
    component.onSearch();
    expect(component['searchSubject'].next).toHaveBeenCalledWith('test');
  });

  it('should handle filter change', () => {
    spyOn(component['cdr'], 'markForCheck');
    component.onFilterChange('pending');
    expect(component.selectedFilter).toBe('pending');
    expect(component['cdr'].markForCheck).toHaveBeenCalled();
  });

  it('should handle view change', () => {
    spyOn(component['cdr'], 'markForCheck');
    component.onViewChange('profile');
    expect(component.currentView).toBe('profile');
    expect(component['cdr'].markForCheck).toHaveBeenCalled();
  });

  it('should update interview service when applications change', () => {
    component.applications = [
      { id: '1', jobTitle: 'Test', company: 'Test', department: 'Test', applicationDate: new Date(), status: 'interviewed', lastUpdated: new Date(), applicationDeadline: new Date(), salaryRange: 'Test', employmentType: 'Full_Time', time: '10:00 AM' }
    ];
    
    component.updateInterviewService();
    
    expect(mockInterviewService.setInterviews).toHaveBeenCalled();
  });

  it('should clean up on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

  describe('Template Integration', () => {
    it('should display loading state', () => {
      component.loading = true;
      fixture.detectChanges();
      
      const loadingElement = fixture.nativeElement.querySelector('.loading-overlay');
      expect(loadingElement).toBeTruthy();
    });

    it('should display navigation tabs', () => {
      const navTabs = fixture.nativeElement.querySelectorAll('.nav-tab');
      expect(navTabs.length).toBe(4); // overview, applications, profile, settings
    });

    it('should display overview view by default', () => {
      const overviewView = fixture.nativeElement.querySelector('.overview-view');
      expect(overviewView).toBeTruthy();
    });

    it('should switch to applications view', () => {
      component.currentView = 'applications';
      fixture.detectChanges();
      
      const applicationsView = fixture.nativeElement.querySelector('.applications-view');
      expect(applicationsView).toBeTruthy();
    });

    it('should display stats cards', () => {
      const statCards = fixture.nativeElement.querySelectorAll('.stat-card');
      expect(statCards.length).toBeGreaterThan(0);
    });

    it('should display applications list', () => {
      component.applications = [
        { id: '1', jobTitle: 'Test', company: 'Test', department: 'Test', applicationDate: new Date(), status: 'pending', lastUpdated: new Date(), applicationDeadline: new Date(), salaryRange: 'Test', employmentType: 'Full_Time' }
      ];
      fixture.detectChanges();
      
      const applicationItems = fixture.nativeElement.querySelectorAll('.application-item');
      expect(applicationItems.length).toBe(1);
    });

    it('should display empty state when no applications', () => {
      component.applications = [];
      fixture.detectChanges();
      
      const emptyState = fixture.nativeElement.querySelector('.empty-state');
      expect(emptyState).toBeTruthy();
    });
  });
});
