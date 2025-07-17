import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { JobPortalService, JobPosting } from './job-portal.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-online-job-application-portal',
  standalone: true,
  imports: [CommonModule, HeaderComponent, HttpClientModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class OnlineJobApplicationPortalComponent implements OnInit {
  publicMode = false;
  jobs: JobPosting[] = [];
  loading = false;
  error: string | null = null;
  selectedJob: JobPosting | null = null;

  constructor(private jobPortalService: JobPortalService) {}

  ngOnInit() {
    this.publicMode = localStorage.getItem('jobPortalPublicMode') === 'true';
    this.fetchJobs();
  }

  fetchJobs() {
    this.loading = true;
    this.jobPortalService.getJobPostings().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
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

  selectJob(job: JobPosting) {
    this.selectedJob = job;
  }
}
 