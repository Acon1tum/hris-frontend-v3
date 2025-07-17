import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface JobPosting {
  id?: number;
  position_title: string;
  department_id: string;
  job_description: string;
  qualifications: string;
  technical_competencies: string;
  salary_range: string;
  employment_type: string;
  num_vacancies: number;
  application_deadline: string;
  posting_status: string;
  created_by: string;
  created_at: string;
  department: string;
  created_by_user: string;
}

@Component({
  selector: 'app-job-portal-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class JobPortalManagementComponent {
  showForm = false;
  isEdit = false;
  editIndex: number | null = null;
  jobs: JobPosting[] = [];
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

  get filteredJobs(): JobPosting[] {
    if (!this.searchTerm.trim()) return this.jobs;
    const term = this.searchTerm.trim().toLowerCase();
    return this.jobs.filter(job =>
      job.position_title.toLowerCase().includes(term) ||
      job.department.toLowerCase().includes(term) ||
      job.job_description.toLowerCase().includes(term) ||
      job.qualifications.toLowerCase().includes(term) ||
      job.technical_competencies.toLowerCase().includes(term) ||
      job.salary_range.toLowerCase().includes(term) ||
      job.employment_type.toLowerCase().includes(term)
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
    } else {
      // Set created_at to current date/time in ISO format
      const now = new Date();
      this.jobs.push({ ...this.jobPosting, id: Date.now(), created_at: now.toISOString() });
    }
    this.showForm = false;
    this.isEdit = false;
    this.editIndex = null;
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