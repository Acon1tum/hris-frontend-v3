import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
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
export class JobPortalManagementComponent implements OnInit, OnDestroy {
  // ===== COMPONENT STATE =====
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
  itemsPerPage = 1000; // Increased to 1000 to show all jobs without pagination

  constructor(
    private jobService: JobPortalManagementService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('=== COMPONENT INITIALIZED ===');
    this.fetchAllJobsUnlimited();
    this.fetchDepartments();
    this.fetchSalaryRanges();
  }

  ngOnDestroy(): void {
    this.setModalActive(false);
  }

  // ===== INITIALIZATION METHODS =====

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

  // ===== DATA FETCHING METHODS =====

  fetchJobs(page: number = 1) {
    console.log('=== FETCHING JOBS ===');
    this.loading = true;
    this.errorMessage = '';
    
    const filters: any = {};
    if (this.searchTerm) {
      filters.search = this.searchTerm;
    }

    console.log('Fetching jobs with filters:', filters);
    console.log('Page:', page, 'Items per page:', this.itemsPerPage);

    this.jobService.getAllJobPostings(page, this.itemsPerPage, filters).subscribe({
      next: (response: ApiResponse<JobPosting[]>) => {
        console.log('Jobs fetched successfully:', response.data);
        console.log('Total jobs received:', response.data.length);
        
        // Clear existing data first
        this.jobs = [];
        this.filteredJobs = [];
        
        // Force change detection to clear UI
        this.cdr.detectChanges();
        
        // Set new data with new array references
        this.jobs = [...response.data];
        this.filteredJobs = [...response.data];
        this.currentPage = response.pagination?.page || 1;
        this.totalPages = response.pagination?.pages || 1;
        this.totalJobs = response.pagination?.total || 0;
        
        // Force multiple change detection cycles
        this.cdr.detectChanges();
        setTimeout(() => {
          this.cdr.detectChanges();
          console.log('Jobs loaded successfully. Count:', this.jobs.length);
          
          // Additional check to ensure data is displayed
          if (this.jobs.length > 0) {
            console.log('Data should be visible now. Jobs:', this.jobs);
            this.cdr.detectChanges();
          }
        }, 100);
        
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
    console.log('=== FETCHING DEPARTMENTS ===');
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
    console.log('=== FETCHING SALARY RANGES ===');
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

  // ===== USER INTERACTION METHODS =====

  onSearch() {
    console.log('=== SEARCHING JOBS ===');
    console.log('Search term:', this.searchTerm);
    this.currentPage = 1; // Reset to first page when searching
    this.refreshJobList();
  }

  onPageChange(page: number) {
    console.log('=== CHANGING PAGE ===');
    console.log('New page:', page);
    this.currentPage = page;
    this.refreshJobList();
  }

  onAddNewJob() {
    console.log('=== ADDING NEW JOB ===');
    this.showForm = true;
    this.isEdit = false;
    this.editJobId = null;
    this.jobPosting = this.getEmptyJobPosting();
    this.clearMessages();
    this.setModalActive(true);
    
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

  onEditJob(job: JobPosting) {
    console.log('=== EDITING JOB ===');
    console.log('Job to edit:', job);
    
    // Create a copy of the job for editing
    const jobToEdit = { ...job };
    
    // Convert salary range value back to ID for the dropdown
    if (jobToEdit.salary_range) {
      jobToEdit.salary_range = this.convertSalaryRangeValueToId(jobToEdit.salary_range);
    }
    
    // Format application_deadline for HTML date input (YYYY-MM-DD)
    if (jobToEdit.application_deadline) {
      jobToEdit.application_deadline = this.formatDateForInput(jobToEdit.application_deadline);
    }
    
    console.log('Job to edit after conversion:', jobToEdit);
    
    this.jobPosting = jobToEdit;
    this.showForm = true;
    this.isEdit = true;
    this.editJobId = job.id || null;
    this.clearMessages();
    this.setModalActive(true);
  }

  onDeleteJob(job: JobPosting) {
    console.log('=== DELETING JOB ===');
    console.log('Job to delete:', job);
    
    if (confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      this.loading = true;
      this.clearMessages();

      this.jobService.deleteJobPosting(job.id!).subscribe({
        next: (response: ApiResponse<any>) => {
          console.log('Job deleted successfully:', response);
          this.showSuccessMessage('Job posting deleted successfully!');
          
          // Force refresh the job list after deletion
          setTimeout(() => {
            this.freshStart();
          }, 500);
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
    console.log('=== CHANGING STATUS ===');
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value;
    
    console.log('Status changed for job:', job.id, 'to:', newStatus);
    
    this.onUpdateStatus(job, newStatus);
  }

  onUpdateStatus(job: JobPosting, newStatus: string) {
    console.log('=== UPDATING STATUS ===');
    this.loading = true;
    this.clearMessages();

    this.jobService.updateJobPostingStatus(job.id!, newStatus).subscribe({
      next: (response: ApiResponse<JobPosting>) => {
        console.log('Status updated successfully:', response);
        this.showSuccessMessage(`Job posting status updated to ${newStatus}!`);
        
        // Force refresh the job list after status update
        setTimeout(() => {
          this.freshStart();
        }, 500);
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

  // ===== FORM SUBMISSION =====

  onSubmitJob() {
    console.log('=== SUBMITTING JOB FORM ===');
    this.loading = true;
    this.clearMessages();

    // Validate required fields
    if (!this.jobPosting.position_title || !this.jobPosting.department_id || 
        !this.jobPosting.job_description || !this.jobPosting.qualifications || 
        !this.jobPosting.employment_type || !this.jobPosting.num_vacancies || 
        !this.jobPosting.application_deadline) {
      this.errorMessage = 'Please fill in all required fields.';
      this.loading = false;
      return;
    }

    // Validate department data
    if (this.jobPosting.department_id) {
      const departmentExists = this.departments.find(dept => dept.id === this.jobPosting.department_id);
      if (!departmentExists) {
        console.error('Department not found in local data:', this.jobPosting.department_id);
        this.errorMessage = 'Selected department is not valid. Please refresh the page and try again.';
        this.loading = false;
        return;
      }
      console.log('Department validated:', departmentExists.department_name);
    }

    // Prepare job data
    const jobData = { ...this.jobPosting };

    // Convert salary range ID to actual range string if selected
    if (jobData.salary_range && jobData.salary_range !== '') {
      const selectedRange = this.salaryRanges.find(range => range.id === jobData.salary_range);
      if (selectedRange) {
        jobData.salary_range = selectedRange.range;
        console.log('Converted salary range ID to string:', jobData.salary_range);
      }
    }

    // Ensure num_vacancies is a number
    if (typeof jobData.num_vacancies === 'string') {
      jobData.num_vacancies = parseInt(jobData.num_vacancies);
    }

    console.log('Final job data to submit:', jobData);

    if (this.isEdit && this.editJobId) {
      // Update existing job
      console.log('Updating job with ID:', this.editJobId);
      
      this.jobService.updateJobPosting(this.editJobId, jobData).subscribe({
        next: (response: ApiResponse<JobPosting>) => {
          console.log('Job updated successfully:', response);
          this.showSuccessMessage('Job posting updated successfully!');
          this.closeForm();
          
          // Force refresh the job list after update
          setTimeout(() => {
            this.freshStart();
          }, 500);
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
      console.log('Creating new job:', jobData);
      
      this.jobService.createJobPosting(jobData).subscribe({
        next: (response: ApiResponse<JobPosting>) => {
          console.log('Job created successfully:', response);
          this.showSuccessMessage('Job posting created successfully!');
          this.closeForm();
          
          // Force refresh the job list after creation
          setTimeout(() => {
            this.freshStart();
          }, 500);
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

  // ===== UTILITY METHODS =====

  refreshJobList() {
    console.log('=== REFRESHING JOB LIST ===');
    this.fetchJobs(this.currentPage);
  }

  // New method to manually trigger UI update
  triggerUIUpdate() {
    console.log('=== TRIGGERING UI UPDATE ===');
    
    // Force multiple change detection cycles
    this.cdr.detectChanges();
    
    // Use setTimeout to ensure change detection runs
    setTimeout(() => {
      this.cdr.detectChanges();
      console.log('UI update triggered');
    }, 0);
  }

  // Method to completely rebuild the job list with aggressive UI updates
  forceRefreshJobList() {
    console.log('=== FORCE REFRESHING JOB LIST ===');
    
    // Clear all data first
    this.jobs = [];
    this.filteredJobs = [];
    this.loading = true;
    
    // Force change detection to clear UI immediately
    this.cdr.detectChanges();
    
    // Small delay to ensure UI is cleared
    setTimeout(() => {
      // Fetch fresh data
      this.jobService.getAllJobPostings(this.currentPage, this.itemsPerPage, {}).subscribe({
        next: (response: ApiResponse<JobPosting[]>) => {
          console.log('Force refresh - Received data:', response.data);
          
          // Set new data with new array references
          this.jobs = [...response.data];
          this.filteredJobs = [...response.data];
          this.currentPage = response.pagination?.page || 1;
          this.totalPages = response.pagination?.pages || 1;
          this.totalJobs = response.pagination?.total || 0;
          this.loading = false;
          
          // Force multiple change detection cycles
          this.cdr.detectChanges();
          setTimeout(() => {
            this.cdr.detectChanges();
            console.log('Force refresh completed - Jobs count:', this.jobs.length);
            
            // Trigger additional UI update
            this.triggerUIUpdate();
            
            // Show success animation
            this.showSuccessAnimation();
          }, 50);
        },
        error: (error) => {
          console.error('Error force refreshing job list:', error);
          this.loading = false;
          this.errorMessage = 'Failed to refresh job list. Please try again.';
        }
      });
    }, 200);
  }

  // Alternative method to rebuild job list with different approach
  rebuildJobList() {
    console.log('=== REBUILDING JOB LIST ===');
    
    // Reset to first page to ensure we get the latest data
    this.currentPage = 1;
    
    // Clear existing data with new empty arrays
    this.jobs = [];
    this.filteredJobs = [];
    
    // Force change detection to clear UI
    this.cdr.detectChanges();
    
    // Small delay to ensure UI is cleared
    setTimeout(() => {
      // Fetch fresh data
      this.fetchJobs(1);
    }, 100);
  }

  // Most aggressive method to ensure UI updates
  aggressiveRefresh() {
    console.log('=== AGGRESSIVE REFRESH ===');
    
    // Clear all data
    this.jobs = [];
    this.filteredJobs = [];
    this.loading = true;
    
    // Force change detection to clear UI
    this.cdr.detectChanges();
    
    // Multiple delays to ensure UI is completely cleared
    setTimeout(() => {
      this.cdr.detectChanges();
      
      setTimeout(() => {
        // Fetch fresh data
        this.jobService.getAllJobPostings(1, this.itemsPerPage, {}).subscribe({
          next: (response: ApiResponse<JobPosting[]>) => {
            console.log('Aggressive refresh - Received data:', response.data);
            
            // Set new data
            this.jobs = [...response.data];
            this.filteredJobs = [...response.data];
            this.currentPage = 1;
            this.totalPages = response.pagination?.pages || 1;
            this.totalJobs = response.pagination?.total || 0;
            this.loading = false;
            
            // Multiple change detection cycles
            this.cdr.detectChanges();
            setTimeout(() => {
              this.cdr.detectChanges();
              setTimeout(() => {
                this.cdr.detectChanges();
                console.log('Aggressive refresh completed - Jobs count:', this.jobs.length);
                
                // Show success animation
                this.showSuccessAnimation();
              }, 50);
            }, 50);
          },
          error: (error) => {
            console.error('Error aggressive refreshing job list:', error);
            this.loading = false;
            this.errorMessage = 'Failed to refresh job list. Please try again.';
          }
        });
      }, 100);
    }, 100);
  }

  // Method to manually trigger a complete component refresh
  completeRefresh() {
    console.log('=== COMPLETE REFRESH ===');
    
    // Clear all data
    this.jobs = [];
    this.filteredJobs = [];
    this.loading = true;
    
    // Force change detection to clear UI
    this.cdr.detectChanges();
    
    // Multiple delays to ensure UI is completely cleared
    setTimeout(() => {
      this.cdr.detectChanges();
      
      setTimeout(() => {
        // Reinitialize the component
        this.ngOnInit();
      }, 100);
    }, 100);
  }

  // New robust method to ensure data displays after CRUD operations
  refreshDataAfterOperation() {
    console.log('=== REFRESHING DATA AFTER OPERATION ===');
    
    // Clear all data first
    this.jobs = [];
    this.filteredJobs = [];
    this.loading = true;
    
    // Force change detection to clear UI immediately
    this.cdr.detectChanges();
    
    // Multiple delays to ensure UI is completely cleared
    setTimeout(() => {
      this.cdr.detectChanges();
      
      setTimeout(() => {
        // Fetch fresh data from backend
        this.jobService.getAllJobPostings(this.currentPage, this.itemsPerPage, {}).subscribe({
          next: (response: ApiResponse<JobPosting[]>) => {
            console.log('Data refreshed after operation:', response.data);
            
            // Set new data with new array references
            this.jobs = [...response.data];
            this.filteredJobs = [...response.data];
            this.currentPage = response.pagination?.page || 1;
            this.totalPages = response.pagination?.pages || 1;
            this.totalJobs = response.pagination?.total || 0;
            this.loading = false;
            
            // Force multiple change detection cycles
            this.cdr.detectChanges();
            setTimeout(() => {
              this.cdr.detectChanges();
              setTimeout(() => {
                this.cdr.detectChanges();
                console.log('Data refresh completed - Jobs count:', this.jobs.length);
                
                // Show success animation
                this.showSuccessAnimation();
              }, 50);
            }, 50);
          },
          error: (error) => {
            console.error('Error refreshing data after operation:', error);
            this.loading = false;
            this.errorMessage = 'Failed to refresh data. Please try again.';
          }
        });
      }, 200);
    }, 200);
  }

  // Method to manually trigger UI update with data refresh
  forceUIUpdateWithData() {
    console.log('=== FORCING UI UPDATE WITH DATA ===');
    
    // Clear data
    this.jobs = [];
    this.filteredJobs = [];
    
    // Force change detection
    this.cdr.detectChanges();
    
    // Fetch fresh data
    setTimeout(() => {
      this.fetchJobs(this.currentPage);
    }, 100);
  }

  // Method to fetch all jobs without any limits
  fetchAllJobsUnlimited() {
    console.log('=== FETCHING ALL JOBS UNLIMITED ===');
    this.loading = true;
    this.errorMessage = '';
    
    this.jobService.getAllJobPostingsUnlimited().subscribe({
      next: (response: ApiResponse<JobPosting[]>) => {
        console.log('All jobs fetched successfully:', response.data);
        console.log('Total jobs received:', response.data.length);
        
        // Clear existing data first
        this.jobs = [];
        this.filteredJobs = [];
        
        // Force change detection to clear UI
        this.cdr.detectChanges();
        
        // Set new data with new array references
        this.jobs = [...response.data];
        this.filteredJobs = [...response.data];
        this.currentPage = 1;
        this.totalPages = 1;
        this.totalJobs = response.data.length;
        
        // Force multiple change detection cycles
        this.cdr.detectChanges();
        setTimeout(() => {
          this.cdr.detectChanges();
          console.log('All jobs loaded successfully. Count:', this.jobs.length);
          
          // Additional check to ensure data is displayed
          if (this.jobs.length > 0) {
            console.log('All jobs should be visible now. Jobs:', this.jobs);
            this.cdr.detectChanges();
          }
        }, 100);
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching all jobs:', error);
        this.errorMessage = 'Failed to load all job postings. Please try again.';
        this.loading = false;
      }
    });
  }

  // Method to manually trigger a complete component refresh
  reinitializeComponent() {
    console.log('=== REINITIALIZING COMPONENT ===');
    
    // Clear all data
    this.jobs = [];
    this.filteredJobs = [];
    this.loading = true;
    
    // Force change detection to clear UI
    this.cdr.detectChanges();
    
    // Multiple delays to ensure UI is completely cleared
    setTimeout(() => {
      this.cdr.detectChanges();
      
      setTimeout(() => {
        // Reinitialize all data
        this.fetchJobs();
        this.fetchDepartments();
        this.fetchSalaryRanges();
        
        console.log('Component reinitialized');
      }, 100);
    }, 100);
  }

  // Method to manually refresh the entire page data
  manualRefresh() {
    console.log('=== MANUAL REFRESH ===');
    
    // Clear all data
    this.jobs = [];
    this.filteredJobs = [];
    this.loading = true;
    
    // Force change detection
    this.cdr.detectChanges();
    
    // Fetch fresh data with multiple attempts
    setTimeout(() => {
      this.jobService.getAllJobPostings(1, this.itemsPerPage, {}).subscribe({
        next: (response: ApiResponse<JobPosting[]>) => {
          console.log('Manual refresh - Received data:', response.data);
          
          // Set new data
          this.jobs = [...response.data];
          this.filteredJobs = [...response.data];
          this.currentPage = 1;
          this.totalPages = response.pagination?.pages || 1;
          this.totalJobs = response.pagination?.total || 0;
          this.loading = false;
          
          // Force multiple change detection cycles
          this.cdr.detectChanges();
          setTimeout(() => {
            this.cdr.detectChanges();
            setTimeout(() => {
              this.cdr.detectChanges();
              console.log('Manual refresh completed - Jobs count:', this.jobs.length);
              
              // Ensure data binding and template update
              this.ensureDataBinding();
              this.forceTemplateUpdate();
              
              // Show success animation
              this.showSuccessAnimation();
            }, 50);
          }, 50);
        },
        error: (error) => {
          console.error('Error manual refreshing:', error);
          this.loading = false;
          this.errorMessage = 'Failed to refresh data. Please try again.';
        }
      });
    }, 200);
  }

  // Method to ensure data is properly bound to template
  ensureDataBinding() {
    console.log('=== ENSURING DATA BINDING ===');
    
    // Force change detection multiple times
    this.cdr.detectChanges();
    
    // Use setTimeout to ensure change detection runs in next tick
    setTimeout(() => {
      this.cdr.detectChanges();
      
      setTimeout(() => {
        this.cdr.detectChanges();
        console.log('Data binding ensured. Jobs count:', this.jobs.length);
      }, 50);
    }, 50);
  }

  // Method to force template update
  forceTemplateUpdate() {
    console.log('=== FORCING TEMPLATE UPDATE ===');
    
    // Clear and reset data to force template update
    const currentJobs = [...this.jobs];
    this.jobs = [];
    this.filteredJobs = [];
    
    // Force change detection
    this.cdr.detectChanges();
    
    // Restore data with new references
    setTimeout(() => {
      this.jobs = [...currentJobs];
      this.filteredJobs = [...currentJobs];
      this.cdr.detectChanges();
      
      setTimeout(() => {
        this.cdr.detectChanges();
        console.log('Template update forced. Jobs count:', this.jobs.length);
      }, 50);
    }, 50);
  }

  // Method to completely rebuild component state
  rebuildComponentState() {
    console.log('=== REBUILDING COMPONENT STATE ===');
    
    // Clear all data
    this.jobs = [];
    this.filteredJobs = [];
    this.loading = true;
    
    // Force change detection to clear UI
    this.cdr.detectChanges();
    
    // Multiple delays to ensure UI is completely cleared
    setTimeout(() => {
      this.cdr.detectChanges();
      
      setTimeout(() => {
        // Fetch fresh data
        this.jobService.getAllJobPostings(1, this.itemsPerPage, {}).subscribe({
          next: (response: ApiResponse<JobPosting[]>) => {
            console.log('Component state rebuild - Received data:', response.data);
            
            // Set new data with new array references
            this.jobs = [...response.data];
            this.filteredJobs = [...response.data];
            this.currentPage = 1;
            this.totalPages = response.pagination?.pages || 1;
            this.totalJobs = response.pagination?.total || 0;
            this.loading = false;
            
            // Force multiple change detection cycles
            this.cdr.detectChanges();
            setTimeout(() => {
              this.cdr.detectChanges();
              setTimeout(() => {
                this.cdr.detectChanges();
                console.log('Component state rebuild completed - Jobs count:', this.jobs.length);
                
                // Ensure data binding and template update
                this.ensureDataBinding();
                this.forceTemplateUpdate();
                this.ensureTemplateUpdate();
                
                // Show success animation
                this.showSuccessAnimation();
              }, 50);
            }, 50);
          },
          error: (error) => {
            console.error('Error rebuilding component state:', error);
            this.loading = false;
            this.errorMessage = 'Failed to rebuild component state. Please try again.';
          }
        });
      }, 100);
    }, 100);
  }

  // Method to ensure template is properly updated by checking DOM
  ensureTemplateUpdate() {
    console.log('=== ENSURING TEMPLATE UPDATE ===');
    
    // Force change detection
    this.cdr.detectChanges();
    
    // Check if data is properly bound
    console.log('Current jobs array:', this.jobs);
    console.log('Current filtered jobs array:', this.filteredJobs);
    
    // Force multiple change detection cycles
    setTimeout(() => {
      this.cdr.detectChanges();
      
      setTimeout(() => {
        this.cdr.detectChanges();
        console.log('Template update ensured. Jobs count:', this.jobs.length);
        
        // Additional check to ensure data is displayed
        if (this.jobs.length > 0) {
          console.log('Data should be visible in template. Jobs:', this.jobs);
        } else {
          console.log('No jobs found in array');
        }
      }, 50);
    }, 50);
  }

  // Method to completely reinitialize the component with fresh start
  freshStart() {
    console.log('=== FRESH START ===');
    
    // Clear all data and state
    this.jobs = [];
    this.filteredJobs = [];
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.currentPage = 1;
    this.searchTerm = '';
    
    // Force change detection to clear UI
    this.cdr.detectChanges();
    
    // Multiple delays to ensure UI is completely cleared
    setTimeout(() => {
      this.cdr.detectChanges();
      
      setTimeout(() => {
        // Reinitialize all data with larger page size
        this.fetchAllJobsUnlimited();
        this.fetchDepartments();
        this.fetchSalaryRanges();
        
        console.log('Fresh start completed - Will fetch all jobs');
      }, 100);
    }, 100);
  }

  clearSearch() {
    console.log('=== CLEARING SEARCH ===');
    this.searchTerm = '';
    this.currentPage = 1;
    this.refreshJobList();
  }

  showSuccessMessage(message: string) {
    console.log('=== SHOWING SUCCESS MESSAGE ===');
    this.successMessage = message;
    this.errorMessage = '';
    
    // Auto-clear success message after 4 seconds
    setTimeout(() => {
      if (this.successMessage === message) {
        this.successMessage = '';
      }
    }, 4000);
  }

  onCancel() {
    console.log('=== CANCELLING FORM ===');
    this.closeForm();
  }

  closeForm() {
    console.log('=== CLOSING FORM ===');
    this.showForm = false;
    this.isEdit = false;
    this.editJobId = null;
    this.jobPosting = this.getEmptyJobPosting();
    this.loading = false;
    this.setModalActive(false);
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // ===== HELPER METHODS =====

  getDepartmentName(departmentId: string): string {
    const department = this.departments.find(dept => dept.id === departmentId);
    return department ? department.department_name : 'Unknown Department';
  }

  getSalaryRangeDisplay(salaryRange: string): string {
    const range = this.salaryRanges.find(r => r.id === salaryRange);
    return range ? range.range : salaryRange;
  }

  convertSalaryRangeValueToId(salaryRangeValue: string): string {
    if (!salaryRangeValue) {
      return '';
    }
    
    console.log('Converting salary range value to ID:', salaryRangeValue);
    
    // Use the actual salaryRanges array from the backend
    const matchingRange = this.salaryRanges.find(range => range.range === salaryRangeValue);
    
    if (matchingRange) {
      console.log('Found exact match for salary range:', matchingRange);
      return matchingRange.id;
    }
    
    // If not found in salaryRanges, try to find by partial match
    const partialMatch = this.salaryRanges.find(range => 
      salaryRangeValue.includes(range.range) || range.range.includes(salaryRangeValue)
    );
    
    if (partialMatch) {
      console.log('Found partial match for salary range:', partialMatch);
      return partialMatch.id;
    }
    
    // If still no match, check if it's already an ID
    const isAlreadyId = this.salaryRanges.find(range => range.id === salaryRangeValue);
    if (isAlreadyId) {
      console.log('Value is already an ID:', salaryRangeValue);
      return salaryRangeValue;
    }
    
    console.log('No matching salary range found for:', salaryRangeValue);
    return ''; // Return empty string if no match found
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) {
      return '';
    }
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  get postingStatusCounts() {
    const counts: { [key: string]: number } = {};
    for (const job of this.jobs) {
      counts[job.posting_status] = (counts[job.posting_status] || 0) + 1;
    }
    return counts;
  }

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

  showSuccessAnimation() {
    console.log('=== SHOWING SUCCESS ANIMATION ===');
    // Add success animation class to job cards
    const jobCards = document.querySelectorAll('.job-card-admin');
    jobCards.forEach(card => {
      card.classList.add('success-animation');
      setTimeout(() => {
        card.classList.remove('success-animation');
      }, 600);
    });
  }

  setModalActive(active: boolean) {
    const body = document.body;
    if (active) {
      body.classList.add('modal-active');
    } else {
      body.classList.remove('modal-active');
    }
  }
} 