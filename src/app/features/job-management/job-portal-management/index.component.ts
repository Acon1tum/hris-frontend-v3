import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobPortalManagementService, JobPosting, Department, SalaryRange, ApiResponse } from './job-portal-management.service';

@Component({
  selector: 'app-job-portal-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class JobPortalManagementComponent implements OnInit {
  showForm = false;
  isEdit = false;
  editJobId: string | null = null;
  jobs: JobPosting[] = [];
  filteredJobs: JobPosting[] = [];
  jobPosting: JobPosting = this.getEmptyJobPosting();
  searchTerm: string = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  departments: Department[] = [];
  salaryRanges: SalaryRange[] = [];
  
  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalJobs = 0;
  itemsPerPage = 10;

  constructor(private jobService: JobPortalManagementService) {}

  ngOnInit(): void {
    this.fetchJobs();
    this.fetchDepartments();
    this.fetchSalaryRanges();
  }

  getEmptyJobPosting(): JobPosting {
    return {
      position_title: '',
      department_id: '',
      job_description: '',
      qualifications: '',
      technical_competencies: '',
      salary_range: '',
      employment_type: '',
      num_vacancies: 1,
      application_deadline: '',
      posting_status: 'Draft'
    };
  }

  fetchJobs(page: number = 1) {
    this.loading = true;
    this.errorMessage = '';
    
    const filters: any = {};
    if (this.searchTerm) {
      filters.search = this.searchTerm;
    }

    this.jobService.getAllJobPostings(page, this.itemsPerPage, filters).subscribe({
      next: (response: ApiResponse<JobPosting[]>) => {
        this.jobs = response.data;
        this.filteredJobs = response.data;
        this.currentPage = response.pagination?.page || 1;
        this.totalPages = response.pagination?.pages || 1;
        this.totalJobs = response.pagination?.total || 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching jobs:', error);
        this.errorMessage = 'Failed to load job postings. Please try again.';
        this.loading = false;
      }
    });
  }

  fetchDepartments() {
    console.log('Fetching departments...');
    this.jobService.getDepartments().subscribe({
      next: (response: ApiResponse<Department[]>) => {
        console.log('Departments loaded:', response.data);
        this.departments = response.data;
      },
      error: (error) => {
        console.error('Error fetching departments:', error);
        this.errorMessage = 'Failed to load departments. Please check if the backend is running.';
        // Add fallback departments for testing
        this.departments = [
          { id: '1', department_name: 'Information Technology' },
          { id: '2', department_name: 'Human Resources' },
          { id: '3', department_name: 'Finance' },
          { id: '4', department_name: 'Marketing' },
          { id: '5', department_name: 'Operations' }
        ];
      }
    });
  }

  fetchSalaryRanges() {
    console.log('Fetching salary ranges...');
    this.jobService.getSalaryRanges().subscribe({
      next: (response: ApiResponse<SalaryRange[]>) => {
        console.log('Salary ranges loaded:', response.data);
        this.salaryRanges = response.data;
      },
      error: (error) => {
        console.error('Error fetching salary ranges:', error);
        this.errorMessage = 'Failed to load salary ranges. Please check if the backend is running.';
        // Add fallback salary ranges for testing
        this.salaryRanges = [
          { id: '1', range: '₱15,000 - ₱25,000', min: 15000, max: 25000 },
          { id: '2', range: '₱25,000 - ₱35,000', min: 25000, max: 35000 },
          { id: '3', range: '₱35,000 - ₱45,000', min: 35000, max: 45000 },
          { id: '4', range: '₱45,000 - ₱55,000', min: 45000, max: 55000 },
          { id: '5', range: '₱55,000 - ₱65,000', min: 55000, max: 65000 },
          { id: '6', range: '₱65,000 - ₱75,000', min: 65000, max: 75000 },
          { id: '7', range: '₱75,000 - ₱85,000', min: 75000, max: 85000 },
          { id: '8', range: '₱85,000 - ₱95,000', min: 85000, max: 95000 },
          { id: '9', range: '₱95,000 - ₱105,000', min: 95000, max: 105000 },
          { id: '10', range: '₱105,000+', min: 105000, max: null }
        ];
      }
    });
  }

  onSearch() {
    console.log('Searching for:', this.searchTerm);
    this.currentPage = 1; // Reset to first page when searching
    this.refreshJobList();
  }

  onPageChange(page: number) {
    console.log('Changing to page:', page);
    this.currentPage = page;
    this.refreshJobList();
  }

  get postingStatusCounts() {
    const counts: { [key: string]: number } = {};
    for (const job of this.jobs) {
      counts[job.posting_status] = (counts[job.posting_status] || 0) + 1;
    }
    return counts;
  }

  onAddNewJob() {
    console.log('Opening add new job form...');
    console.log('Current departments:', this.departments);
    console.log('Current salary ranges:', this.salaryRanges);
    
    this.showForm = true;
    this.isEdit = false;
    this.editJobId = null;
    this.jobPosting = this.getEmptyJobPosting();
    this.clearMessages();
    
    // If departments or salary ranges are empty, try to fetch them again
    if (this.departments.length === 0) {
      console.log('Departments empty, fetching again...');
      this.fetchDepartments();
    }
    if (this.salaryRanges.length === 0) {
      console.log('Salary ranges empty, fetching again...');
      this.fetchSalaryRanges();
    }
  }

  onSubmitJob() {
    this.loading = true;
    this.clearMessages();

    // Validate required fields
    if (!this.jobPosting.position_title || !this.jobPosting.department_id || 
        !this.jobPosting.job_description || !this.jobPosting.qualifications) {
      this.errorMessage = 'Please fill in all required fields.';
      this.loading = false;
      return;
    }

    if (this.isEdit && this.editJobId) {
      // Update existing job
      console.log('Updating job with ID:', this.editJobId);
      console.log('Update data:', this.jobPosting);
      
      this.jobService.updateJobPosting(this.editJobId, this.jobPosting).subscribe({
        next: (response: ApiResponse<JobPosting>) => {
          console.log('Job updated successfully:', response);
          this.showSuccessMessage('Job posting updated successfully!');
          
          // Automatically refresh the job list after update
          this.refreshJobList();
          this.closeForm();
        },
        error: (error) => {
          console.error('Error updating job:', error);
          if (error.status === 404) {
            this.errorMessage = 'Job posting not found. It may have been deleted.';
          } else if (error.status === 400) {
            this.errorMessage = error.error?.message || 'Invalid data provided. Please check your input.';
          } else {
            this.errorMessage = 'Failed to update job posting. Please try again.';
          }
          this.loading = false;
        }
      });
    } else {
      // Create new job
      console.log('Creating new job:', this.jobPosting);
      
      this.jobService.createJobPosting(this.jobPosting).subscribe({
        next: (response: ApiResponse<JobPosting>) => {
          console.log('Job created successfully:', response);
          this.showSuccessMessage('Job posting created successfully!');
          
          // Automatically refresh the job list after creation
          this.refreshJobList();
          this.closeForm();
        },
        error: (error) => {
          console.error('Error creating job:', error);
          if (error.status === 400) {
            this.errorMessage = error.error?.message || 'Invalid data provided. Please check your input.';
          } else {
            this.errorMessage = 'Failed to create job posting. Please try again.';
          }
          this.loading = false;
        }
      });
    }
  }

  onEditJob(job: JobPosting) {
    console.log('Editing job:', job);
    
    // Create a copy of the job for editing
    const jobToEdit = { ...job };
    
    // Convert salary range value back to ID for the dropdown
    if (jobToEdit.salary_range) {
      jobToEdit.salary_range = this.convertSalaryRangeValueToId(jobToEdit.salary_range);
    }
    
    // Format application_deadline for HTML date input (YYYY-MM-DD)
    if (jobToEdit.application_deadline) {
      console.log('Original application_deadline:', jobToEdit.application_deadline);
      jobToEdit.application_deadline = this.formatDateForInput(jobToEdit.application_deadline);
      console.log('Formatted application_deadline:', jobToEdit.application_deadline);
    }
    
    console.log('Job to edit after conversion:', jobToEdit);
    
    this.jobPosting = jobToEdit;
    this.showForm = true;
    this.isEdit = true;
    this.editJobId = job.id || null;
    this.clearMessages();
  }

  onDeleteJob(job: JobPosting) {
    if (confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      this.loading = true;
      this.clearMessages();

      console.log('Deleting job with ID:', job.id);

      this.jobService.deleteJobPosting(job.id!).subscribe({
        next: (response: ApiResponse<any>) => {
          console.log('Job deleted successfully:', response);
          this.showSuccessMessage('Job posting deleted successfully!');
          
          // Automatically refresh the job list after deletion
          this.refreshJobList();
        },
        error: (error) => {
          console.error('Error deleting job:', error);
          if (error.status === 404) {
            this.errorMessage = 'Job posting not found. It may have been deleted.';
          } else if (error.status === 400) {
            this.errorMessage = error.error?.message || 'Cannot delete job posting with existing applications.';
          } else {
            this.errorMessage = 'Failed to delete job posting. Please try again.';
          }
          this.loading = false;
        }
      });
    }
  }

  onStatusChange(job: JobPosting, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value;
    
    console.log('Status changed for job:', job.id, 'to:', newStatus);
    
    this.onUpdateStatus(job, newStatus);
  }

  onUpdateStatus(job: JobPosting, newStatus: string) {
    this.loading = true;
    this.clearMessages();

    this.jobService.updateJobPostingStatus(job.id!, newStatus).subscribe({
      next: (response: ApiResponse<JobPosting>) => {
        console.log('Status updated successfully:', response);
        this.showSuccessMessage(`Job posting status updated to ${newStatus}!`);
        
        // Automatically refresh the job list after status update
        this.refreshJobList();
      },
      error: (error) => {
        console.error('Error updating status:', error);
        if (error.status === 404) {
          this.errorMessage = 'Job posting not found. It may have been deleted.';
        } else if (error.status === 400) {
          this.errorMessage = error.error?.message || 'Invalid status provided.';
        } else {
          this.errorMessage = 'Failed to update job posting status. Please try again.';
        }
        this.loading = false;
      }
    });
  }

  // Helper method to refresh job list
  refreshJobList() {
    console.log('Refreshing job list...');
    this.fetchJobs(this.currentPage);
  }

  // Helper method to clear search and refresh
  clearSearch() {
    console.log('Clearing search...');
    this.searchTerm = '';
    this.currentPage = 1;
    this.refreshJobList();
  }

  // Helper method to show success message with auto-clear
  showSuccessMessage(message: string) {
    this.successMessage = message;
    this.errorMessage = '';
    
    // Auto-clear success message after 3 seconds
    setTimeout(() => {
      if (this.successMessage === message) {
        this.successMessage = '';
      }
    }, 3000);
  }

  onCancel() {
    this.closeForm();
  }

  closeForm() {
    this.showForm = false;
    this.isEdit = false;
    this.editJobId = null;
    this.jobPosting = this.getEmptyJobPosting();
    this.loading = false;
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Helper method to get department name
  getDepartmentName(departmentId: string): string {
    const department = this.departments.find(dept => dept.id === departmentId);
    return department ? department.department_name : 'Unknown Department';
  }

  // Helper method to get salary range display
  getSalaryRangeDisplay(salaryRange: string): string {
    const range = this.salaryRanges.find(r => r.id === salaryRange);
    return range ? range.range : salaryRange;
  }

  // Helper method to convert salary range value to ID
  convertSalaryRangeValueToId(salaryRangeValue: string): string {
    const salaryRanges = [
      { id: '1', range: '₱15,000 - ₱25,000', min: 15000, max: 25000 },
      { id: '2', range: '₱25,000 - ₱35,000', min: 25000, max: 35000 },
      { id: '3', range: '₱35,000 - ₱45,000', min: 35000, max: 45000 },
      { id: '4', range: '₱45,000 - ₱55,000', min: 45000, max: 55000 },
      { id: '5', range: '₱55,000 - ₱65,000', min: 55000, max: 65000 },
      { id: '6', range: '₱65,000 - ₱75,000', min: 65000, max: 75000 },
      { id: '7', range: '₱75,000 - ₱85,000', min: 75000, max: 85000 },
      { id: '8', range: '₱85,000 - ₱95,000', min: 85000, max: 95000 },
      { id: '9', range: '₱95,000 - ₱105,000', min: 95000, max: 105000 },
      { id: '10', range: '₱105,000+', min: 105000, max: null }
    ];
    
    const matchingRange = salaryRanges.find(range => range.range === salaryRangeValue);
    return matchingRange ? matchingRange.id : salaryRangeValue;
  }

  // Helper method to format date for HTML date input
  formatDateForInput(dateString: string): string {
    if (!dateString) {
      console.log('formatDateForInput: Empty date string');
      return '';
    }
    
    console.log('formatDateForInput: Processing date string:', dateString);
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.log('formatDateForInput: Invalid date:', dateString);
      return '';
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;
    console.log('formatDateForInput: Formatted date:', formattedDate);
    
    return formattedDate;
  }

  // Generate page numbers for pagination
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = Math.min(5, this.totalPages);
    const startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    
    for (let i = 0; i < maxPages; i++) {
      const page = startPage + i;
      if (page <= this.totalPages) {
        pages.push(page);
      }
    }
    
    return pages;
  }
} 