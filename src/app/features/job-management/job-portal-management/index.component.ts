import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobPortalManagementService, JobPosting } from './job-portal-management.service';

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
  editIndex: number | null = null;
  jobs: JobPosting[] = [];
  filteredJobs: JobPosting[] = [];
  jobPosting: JobPosting = this.getEmptyJobPosting();
  searchTerm: string = '';
  departments = [
    { id: '1', name: 'IT' },
    { id: '2', name: 'HR' },
    { id: '3', name: 'Finance' }
  ];
  users = [
    { id: '1', name: 'Admin User' },
    { id: '2', name: 'HR Manager' }
  ];

  constructor(private jobService: JobPortalManagementService) {}

  ngOnInit(): void {
    this.fetchJobs();
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
      posting_status: 'Open',
      created_by: '',
      created_at: '',
      department: '',
      created_by_user: ''
    };
  }

  fetchJobs() {
    this.jobService.getAllJobPostings().subscribe({
      next: (res) => {
        this.jobs = res.data;
        this.filteredJobs = res.data;
      },
      error: (err) => {
        // handle error
      }
    });
  }

  onSearch() {
    this.filteredJobs = this.jobs.filter(job =>
      job.position_title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get postingStatusCounts() {
    const counts: { [key: string]: number } = {};
    for (const job of this.jobs) {
      counts[job.posting_status] = (counts[job.posting_status] || 0) + 1;
    }
    return counts;
  }

  onAddNewJob() {
    this.showForm = true;
    this.isEdit = false;
    this.editIndex = null;
    this.jobPosting = this.getEmptyJobPosting();
  }

  onSubmitJob() {
    if (this.isEdit && this.editIndex !== null) {
      this.jobs[this.editIndex] = { ...this.jobPosting };
      this.showForm = false;
      this.isEdit = false;
      this.editIndex = null;
    } else {
      // Set created_at to current date/time in ISO format
      const now = new Date();
      const jobToCreate = { ...this.jobPosting, created_at: now.toISOString() };
      this.jobService.createJobPosting(jobToCreate).subscribe({
        next: (res) => {
          this.fetchJobs(); // Refresh list from backend
          this.showForm = false;
          this.isEdit = false;
          this.editIndex = null;
        },
        error: (err) => {
          // handle error (e.g., show notification)
        }
      });
    }
  }

  onEditJob(index: number) {
    this.jobPosting = { ...this.jobs[index] };
    this.showForm = true;
    this.isEdit = true;
    this.editIndex = index;
  }

  onDeleteJob(index: number) {
    if (confirm('Are you sure you want to delete this job posting?')) {
      this.jobs.splice(index, 1);
    }
  }

  onCancel() {
    this.showForm = false;
    this.isEdit = false;
    this.editIndex = null;
  }
} 