import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobPortalAuthService, JobApplicant } from '../job-portal-auth.service';

@Component({
  selector: 'app-application-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './application-modal.component.html',
  styleUrls: ['./application-modal.component.scss']
})
export class ApplicationModalComponent implements OnInit {
  @Input() job: any;
  @Output() close = new EventEmitter<void>();

  applicant: JobApplicant | null = null;
  currentStep = 1;
  currentDate = new Date();
  
  // Form data
  coverLetter = '';
  remarks = '';
  withdrawnDate: Date | null = null;

  constructor(private jobPortalAuthService: JobPortalAuthService) {}

  ngOnInit(): void {
    this.applicant = this.jobPortalAuthService.getCurrentApplicant();
  }

  nextPage(): void {
    if (this.coverLetter.trim()) {
      this.currentStep = 2;
    }
  }

  previousPage(): void {
    this.currentStep = 1;
  }

  submitApplication(): void {
    // TODO: Implement submission logic
    console.log('Submitting application:', {
      position_id: this.job?.id,
      applicant_id: this.applicant?.id,
      cover_letter: this.coverLetter,
      remarks: this.remarks,
      withdrawn_date: this.withdrawnDate
    });
    this.close.emit();
  }
}