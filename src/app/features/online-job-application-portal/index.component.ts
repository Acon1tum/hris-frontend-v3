import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { JobPortalService, JobPosting, SalaryRange, JobFilters } from './job-portal.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-online-job-application-portal',
  standalone: true,
  imports: [CommonModule, HeaderComponent, HttpClientModule, FormsModule],
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

  activeFilters: { key: string, label: string }[] = [];

  @ViewChild('modalCloseBtn') modalCloseBtn!: ElementRef<HTMLButtonElement>;

  constructor(private jobPortalService: JobPortalService, private router: Router) {}

  ngOnInit() {
    this.publicMode = localStorage.getItem('jobPortalPublicMode') === 'true';
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

  fetchJobs() {
    this.loading = true;
    this.jobPortalService.getJobPostings().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.filteredJobs = jobs;
        this.loading = false;
        if (jobs.length > 0) {
          this.selectedJob = jobs[0]; // Optionally select the first job by default
        }
      },
      error: (err) => {
        this.error = 'Failed to load jobs';
        this.loading = false;
      }
    });
  }

  fetchSalaryRanges() {
    this.jobPortalService.getSalaryRanges().subscribe({
      next: (ranges) => {
        this.salaryRanges = ranges;
      },
      error: (err) => {
        console.error('Failed to load salary ranges:', err);
      }
    });
  }

  fetchDepartments() {
    this.jobPortalService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: (err) => {
        console.error('Failed to load departments:', err);
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
      const rangeLabel = this.salaryRanges.find(r => r.value === this.selectedSalaryRange)?.label || this.selectedSalaryRange;
      this.activeFilters.push({ key: 'salary_range', label: `Salary: ${rangeLabel}` });
    }

    this.jobPortalService.getJobPostings(filters).subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.filteredJobs = jobs;
        this.loading = false;
        if (this.selectedJob && !this.filteredJobs.find(job => job.id === this.selectedJob?.id)) {
          this.selectedJob = this.filteredJobs.length > 0 ? this.filteredJobs[0] : null;
        } else if (this.filteredJobs.length > 0 && !this.selectedJob) {
          this.selectedJob = this.filteredJobs[0];
        }
      },
      error: (err) => {
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
    this.router.navigate(['/online-job-login']);
  }

  get isMobile(): boolean {
    return window.innerWidth < 900;
  }
}
 