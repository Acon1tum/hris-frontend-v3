import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { JobPortalService, JobPosting, SalaryRange, JobFilters } from './job-portal.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { JobApplicationModalComponent } from './job-application-modal/job-application-modal.component';
import { AuthService } from '../../services/auth.service';
import { JobApplicationForm } from './job-application-modal/job-application-modal.component';

@Component({
  selector: 'app-online-job-application-portal',
  standalone: true,
  imports: [CommonModule, HeaderComponent, HttpClientModule, FormsModule, JobApplicationModalComponent],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class OnlineJobApplicationPortalComponent implements OnInit, AfterViewInit {
  publicMode = false;
  jobs: JobPosting[] = [];
  filteredJobs: JobPosting[] = [];
  salaryRanges: SalaryRange[] = [];
  departments: string[] = [];
  loading = false;
  error: string | null = null;
  selectedJob: JobPosting | null = null;
  searchKeywords = '';
  selectedDepartment = '';
  selectedSalaryRange = '';
  showJobModal = false;
  modalJob: JobPosting | null = null;
  showFavourites = false;
  favourites: string[] = [];
  
  // Job application modal properties
  showApplicationModal = false;
  applicationJob: JobPosting | null = null;
  
  // Login prompt modal properties
  showLoginPromptModal = false;
  loginPromptJob: JobPosting | null = null;

  // Header scroll animation properties
  isHeaderVisible = true;
  lastScrollTop = 0;
  scrollThreshold = 50; // Reduced threshold for more responsive behavior
  headerHeight = 80; // Approximate header height
  scrollDirection = 'up'; // Track scroll direction

  activeFilters: { key: string, label: string }[] = [];

  @ViewChild('modalCloseBtn') modalCloseBtn!: ElementRef<HTMLButtonElement>;

  constructor(
    private jobPortalService: JobPortalService, 
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Clear favourites on page refresh
    if (performance && performance.getEntriesByType) {
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navEntries.length > 0 && navEntries[0].type === 'reload') {
        localStorage.removeItem('jobFavourites');
        // No redirect, just clear favourites and continue loading the page
      }
    }
    this.publicMode = localStorage.getItem('jobPortalPublicMode') === 'true';
    this.favourites = JSON.parse(localStorage.getItem('jobFavourites') || '[]');
    this.fetchJobs();
    this.fetchSalaryRanges();
    this.fetchDepartments();
  }

  ngAfterViewInit() {
    if (this.showJobModal && this.modalCloseBtn) {
      setTimeout(() => this.modalCloseBtn.nativeElement.focus(), 0);
    }
  }

  ngOnChanges() {
    if (this.showJobModal && this.modalCloseBtn) {
      setTimeout(() => this.modalCloseBtn.nativeElement.focus(), 0);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.handleScroll();
  }

  @HostListener('document:keydown', ['$event'])
  handleModalKeydown(event: KeyboardEvent) {
    if (!this.showJobModal) return;
    if (event.key === 'Escape') {
      this.closeViewModal();
    }
    if (event.key === 'Tab') {
      const focusableEls = Array.from(document.querySelectorAll('.job-modal button, .job-modal [tabindex]:not([tabindex="-1"])')) as HTMLElement[];
      if (focusableEls.length === 0) return;
      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];
      if (event.shiftKey) {
        if (document.activeElement === firstEl) {
          lastEl.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastEl) {
          firstEl.focus();
          event.preventDefault();
        }
      }
    }
  }

  private handleScroll() {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Determine scroll direction
    const isScrollingDown = currentScrollTop > this.lastScrollTop;
    const isScrollingUp = currentScrollTop < this.lastScrollTop;
    const scrollDistance = Math.abs(currentScrollTop - this.lastScrollTop);
    
    // Only trigger animation if we've scrolled past the threshold
    if (scrollDistance < this.scrollThreshold) {
      return;
    }

    // Update scroll direction
    this.scrollDirection = isScrollingDown ? 'down' : 'up';

    // Hide header when scrolling down, show when scrolling up
    if (isScrollingDown && currentScrollTop > this.headerHeight) {
      // Scrolling down - hide header
      this.isHeaderVisible = false;
    } else if (isScrollingUp) {
      // Scrolling up - show header
      this.isHeaderVisible = true;
    }

    // Always show header at the top of the page
    if (currentScrollTop <= this.headerHeight) {
      this.isHeaderVisible = true;
    }

    this.lastScrollTop = currentScrollTop;
  }

  fetchJobs() {
    this.loading = true;
    this.error = null;
    
    this.jobPortalService.getJobs().subscribe({
      next: (jobs: JobPosting[]) => {
        this.jobs = jobs;
        this.filteredJobs = jobs;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load jobs. Please try again.';
        this.loading = false;
        console.error('Error fetching jobs:', err);
      }
    });
  }

  fetchSalaryRanges() {
    this.jobPortalService.getSalaryRanges().subscribe({
      next: (ranges: string[]) => {
        this.salaryRanges = ranges.map(range => ({ 
          range, 
          count: 0,
          value: range, // For template compatibility
          label: range  // For template compatibility
        }));
      },
      error: (err: any) => {
        console.error('Error fetching salary ranges:', err);
      }
    });
  }

  fetchDepartments() {
    this.jobPortalService.getDepartments().subscribe({
      next: (departments: string[]) => {
        this.departments = departments;
      },
      error: (err: any) => {
        console.error('Error fetching departments:', err);
      }
    });
  }

  searchJobs() {
    this.loading = true;
    this.error = null;

    const filters: JobFilters = {};
    this.activeFilters = [];
    if (this.searchKeywords && this.searchKeywords.trim()) {
      filters.keywords = this.searchKeywords.trim();
      this.activeFilters.push({ key: 'keywords', label: `What: ${this.searchKeywords.trim()}` });
    }
    if (this.selectedDepartment && this.selectedDepartment !== '') {
      filters.department = this.selectedDepartment;
      this.activeFilters.push({ key: 'department', label: `Classification: ${this.selectedDepartment}` });
    }
    if (this.selectedSalaryRange && this.selectedSalaryRange !== '') {
      filters.salary_range = this.selectedSalaryRange;
      const rangeLabel = this.salaryRanges.find(r => (r.value || r.range) === this.selectedSalaryRange)?.label || this.selectedSalaryRange;
      this.activeFilters.push({ key: 'salary_range', label: `Salary: ${rangeLabel}` });
    }

    this.jobPortalService.getJobs(filters).subscribe({
      next: (jobs: JobPosting[]) => {
        this.jobs = jobs;
        this.filteredJobs = jobs;
        this.loading = false;
        if (this.selectedJob && !this.filteredJobs.find(job => job.id === this.selectedJob?.id)) {
          this.selectedJob = this.filteredJobs.length > 0 ? this.filteredJobs[0] : null;
        } else if (this.filteredJobs.length > 0 && !this.selectedJob) {
          this.selectedJob = this.filteredJobs[0];
        }
      },
      error: (err: any) => {
        this.error = 'Failed to search jobs';
        this.loading = false;
        console.error('Search error:', err);
      }
    });
  }

  removeFilter(key: string) {
    if (key === 'keywords') this.searchKeywords = '';
    if (key === 'department') this.selectedDepartment = '';
    if (key === 'salary_range') this.selectedSalaryRange = '';
    this.searchJobs();
  }

  clearFilters() {
    this.searchKeywords = '';
    this.selectedDepartment = '';
    this.selectedSalaryRange = '';
    this.activeFilters = [];
    this.searchJobs();
  }

  selectJob(job: JobPosting) {
    this.selectedJob = job;
  }

  openViewModal(job: JobPosting) {
    this.modalJob = job;
    this.showJobModal = true;
    setTimeout(() => {
      if (this.modalCloseBtn) {
        this.modalCloseBtn.nativeElement.focus();
      }
    }, 0);
  }

  closeViewModal() {
    this.showJobModal = false;
    this.modalJob = null;
  }

  applyToJob(job: JobPosting) {
    // Check if user is authenticated and has Applicant role
    if (this.authService.isAuthenticated() && this.authService.hasRole('Applicant')) {
      // User is logged in as Applicant - show application modal
      this.applicationJob = job;
      this.showApplicationModal = true;
    } else {
      // User is not authenticated or not an Applicant - show login prompt
      this.loginPromptJob = job;
      this.showLoginPromptModal = true;
    }
  }

  closeApplicationModal() {
    this.showApplicationModal = false;
    this.applicationJob = null;
  }

  closeLoginPromptModal() {
    this.showLoginPromptModal = false;
    this.loginPromptJob = null;
  }

  onLoginPromptContinue() {
    this.closeLoginPromptModal();
    // The login prompt modal will handle navigation to login page
  }

  onApplicationSubmitted(applicationData: JobApplicationForm) {
    console.log('Application submitted:', applicationData);
    // Here you would typically send the data to your backend API
    // For now, just close the modal
    this.closeApplicationModal();
  }

  shareJob(job: JobPosting) {
    // Implement share functionality
    console.log('Sharing job:', job);
    // You can implement actual sharing logic here
    if (navigator.share) {
      navigator.share({
        title: job.position_title,
        text: `Check out this job opportunity: ${job.position_title}`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        alert('Job link copied to clipboard!');
      });
    }
  }

  get isMobile(): boolean {
    return window.innerWidth < 900;
  }

  getDepartmentThemeClass(department: string | undefined): string {
    switch ((department || '').toLowerCase()) {
      case 'information technology':
        return 'theme-it';
      case 'human resources':
        return 'theme-hr';
      case 'finance':
        return 'theme-finance';
      case 'marketing':
        return 'theme-marketing';
      // Add more as needed
      default:
        return 'theme-default';
    }
  }

  get displayedJobs(): JobPosting[] {
    return this.showFavourites
      ? this.jobs.filter(job => this.favourites.includes(job.id))
      : this.filteredJobs;
  }

  toggleFavourite(job: JobPosting) {
    const idx = this.favourites.indexOf(job.id);
    if (idx > -1) {
      this.favourites.splice(idx, 1);
    } else {
      this.favourites.push(job.id);
    }
    localStorage.setItem('jobFavourites', JSON.stringify(this.favourites));
  }

  isFavourite(job: JobPosting): boolean {
    return this.favourites.includes(job.id);
  }
}
 