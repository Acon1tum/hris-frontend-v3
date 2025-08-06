import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobApplicationModalComponent, JobApplicationForm } from './job-application-modal.component';
import { LoginPromptModalComponent } from './login-prompt-modal.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-job-application-modal-demo',
  standalone: true,
  imports: [CommonModule, JobApplicationModalComponent, LoginPromptModalComponent],
  template: `
    <div class="demo-container">
      <h2>Job Application Modal Demo</h2>
      
      <div class="demo-job-card">
        <h3>Software Engineer</h3>
        <p>IT Department</p>
        <p>Full-time position with competitive salary</p>
        <button class="btn btn-primary" (click)="openModal()">
          Apply Now
        </button>
      </div>

      <!-- Job Application Modal -->
      <app-job-application-modal
        [showModal]="showApplicationModal"
        [job]="selectedJob"
        (close)="closeApplicationModal()"
        (applicationSubmitted)="onApplicationSubmitted($event)"
      ></app-job-application-modal>

      <!-- Login Prompt Modal -->
      <app-login-prompt-modal
        [showModal]="showLoginPromptModal"
        [job]="selectedJob"
        (close)="closeLoginPromptModal()"
        (continueToLogin)="onLoginPromptContinue()"
      ></app-login-prompt-modal>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }

    .demo-job-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 20px;

      h3 {
        margin: 0 0 8px 0;
        color: #2c3e50;
      }

      p {
        margin: 0 0 8px 0;
        color: #6c757d;
      }

      .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s;

        &.btn-primary {
          background-color: #667eea;
          color: white;

          &:hover {
            background-color: #5a6fd8;
            transform: translateY(-1px);
          }
        }
      }
    }
  `]
})
export class JobApplicationModalDemoComponent {
  showApplicationModal = false;
  showLoginPromptModal = false;
  selectedJob: any = {
    id: 'job-123',
    position_title: 'Software Engineer',
    department: {
      department_name: 'IT Department'
    },
    job_description: 'We are looking for a talented software engineer...',
    qualifications: 'Bachelor\'s degree in Computer Science or related field...',
    salary_range: '$60,000 - $80,000',
    employment_type: 'Regular',
    num_vacancies: 2,
    application_deadline: new Date('2024-12-31')
  };

  constructor(private authService: AuthService) {}

  openModal(): void {
    // Check if user is authenticated and has Applicant role
    if (this.authService.isAuthenticated() && this.authService.hasRole('Applicant')) {
      // User is logged in as Applicant - show application modal
      this.showApplicationModal = true;
    } else {
      // User is not authenticated or not an Applicant - show login prompt
      this.showLoginPromptModal = true;
    }
  }

  closeApplicationModal(): void {
    this.showApplicationModal = false;
  }

  closeLoginPromptModal(): void {
    this.showLoginPromptModal = false;
  }

  onLoginPromptContinue(): void {
    this.closeLoginPromptModal();
    // The login prompt modal will handle navigation to login page
  }

  onApplicationSubmitted(applicationData: JobApplicationForm): void {
    console.log('Application submitted:', applicationData);
    
    // Here you would typically send the data to your backend API
    // Example API call:
    // this.jobApplicationService.submitApplication(applicationData).subscribe({
    //   next: (response) => {
    //     console.log('Application submitted successfully:', response);
    //     this.showSuccessMessage('Application submitted successfully!');
    //   },
    //   error: (error) => {
    //     console.error('Error submitting application:', error);
    //     this.showErrorMessage('Failed to submit application. Please try again.');
    //   }
    // });

    // For demo purposes, just show a success message
    alert('Application submitted successfully!');
    this.closeModal();
  }
} 