import { Component, EventEmitter, Input, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobPortalAuthService, JobApplicant } from '../job-portal-auth.service';
import { AuthService } from '../../../services/auth.service';
import { UserDetailsService, UserDetails } from '../../../services/user-details.service';

export interface JobApplicationForm {
  position_id: string;
  applicant_id: string;
  cover_letter?: string;
  status: 'Pending' | 'Pre_Screening' | 'For_Interview' | 'For_Examination' | 'Shortlisted' | 'Selected' | 'Rejected' | 'Withdrawn' | 'Hired';
  application_date: Date;
  withdrawn_date?: Date;
  remarks?: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
  uploadDate: Date;
}

@Component({
  selector: 'app-job-application-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './job-application-modal.component.html',
  styleUrls: ['./job-application-modal.component.scss']
})
export class JobApplicationModalComponent implements OnInit {
  @Input() job: any;
  @Input() showModal: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() applicationSubmitted = new EventEmitter<JobApplicationForm>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  applicant: JobApplicant | null = null;
  applicationForm: FormGroup;
  currentStep = 1;
  totalSteps = 4; // Updated to 4 steps
  isLoading = false;
  submitted = false;
  confirmationChecked = false; // Track confirmation checkbox state

  // Auto-filled user details
  firstName: string = '';
  middleName: string = '';
  lastName: string = '';
  email: string = '';
  contact: string = '';

  // File upload properties
  uploadedDocuments: UploadedDocument[] = [];
  isDragOver = false;
  maxFileSize = 10 * 1024 * 1024; // 10MB
  allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/jpg'
  ];

  constructor(
    private jobPortalAuthService: JobPortalAuthService,
    private fb: FormBuilder,
    private authService: AuthService,
    private userDetailsService: UserDetailsService
  ) {
    this.applicationForm = this.fb.group({
      position_id: ['', Validators.required],
      applicant_id: ['', Validators.required],
      cover_letter: ['', [Validators.required, Validators.minLength(100)]],
      status: ['Pending', Validators.required],
      application_date: [new Date(), Validators.required],
      withdrawn_date: [null],
      remarks: ['', Validators.maxLength(500)]
    });
  }

  ngOnInit(): void {
    // Check if user is authenticated and has Applicant role
    if (!this.authService.isAuthenticated() || !this.authService.hasRole('Applicant')) {
      console.warn('User is not authenticated or does not have Applicant role');
      this.closeModal();
      return;
    }

    // Fetch user details from database
    this.fetchUserDetailsFromDatabase();
  }

  fetchUserDetailsFromDatabase(): void {
    this.isLoading = true;
    
    this.userDetailsService.getCurrentUserDetails().subscribe({
      next: (userDetails: UserDetails) => {
        console.log('✅ Fetched user details from database:', userDetails);
        
        // Populate user details from database
        this.firstName = userDetails.first_name;
        this.middleName = userDetails.middle_name || '';
        this.lastName = userDetails.last_name;
        this.email = userDetails.email;
        this.contact = userDetails.contact_number || userDetails.phone || '';
        
        // Initialize form with fetched data
        this.initializeForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error fetching user details from database:', error);
        
        // Show user-friendly error message
        if (error.status === 401) {
          console.warn('User not authenticated, redirecting to login');
          this.closeModal();
          return;
        }
        
        // Fallback to existing method if database fetch fails
        console.log('🔄 Falling back to local user data');
        this.applicant = this.jobPortalAuthService.getCurrentApplicant();
        this.populateUserDetails();
        this.initializeForm();
        this.isLoading = false;
      }
    });
  }

  populateUserDetails(): void {
    if (this.applicant) {
      this.firstName = this.applicant.first_name;
      this.middleName = this.applicant.middle_name || '';
      this.lastName = this.applicant.last_name;
      this.email = this.applicant.email;
      this.contact = this.applicant.phone;
    }
  }

  initializeForm(): void {
    if (this.job) {
      // For job applicants, get the applicant profile from the API
      if (this.authService.hasRole('Applicant')) {
        this.jobPortalAuthService.getCurrentApplicantProfile().subscribe({
          next: (applicant: JobApplicant) => {
            this.applicationForm.patchValue({
              position_id: this.job.id,
              applicant_id: applicant.id,
              application_date: new Date()
            });
          },
          error: (error: any) => {
            console.error('Error getting current applicant profile:', error);
          }
        });
      }
    }
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
    }
  }

  isStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!(this.firstName && this.lastName && this.email && this.contact);
      case 2:
        return this.applicationForm.get('cover_letter')?.valid || false;
      case 3:
        return this.uploadedDocuments.length > 0; // Application documents step - valid when documents are uploaded
      case 4:
        return this.applicationForm.valid;
      default:
        return false;
    }
  }

  isStepCompleted(step: number): boolean {
    switch (step) {
      case 1:
        return !!(this.firstName && this.lastName && this.email && this.contact);
      case 2:
        return this.applicationForm.get('cover_letter')?.valid || false;
      case 3:
        return this.uploadedDocuments.length > 0; // Application documents step - completed when documents are uploaded
      case 4:
        return this.applicationForm.valid && this.uploadedDocuments.length > 0;
      default:
        return false;
    }
  }

  canClickStep(step: number): boolean {
    // Steps 1 and 4 are always clickable
    if (step === 1) {
      return true;
    }
    // For other steps, check if the previous step is completed
    const previousStep = step - 1;
    return this.isStepCompleted(previousStep);
  }

  submitApplication(): void {
    this.submitted = true;
    
    if (this.applicationForm.valid) {
      this.isLoading = true;
      
      const applicationData: JobApplicationForm = {
        ...this.applicationForm.value,
        application_date: new Date()
      };

      console.log('Submitting job application:', applicationData);
      
      // Emit the application data to parent component
      this.applicationSubmitted.emit(applicationData);
      
      // Simulate API call delay
      setTimeout(() => {
        this.isLoading = false;
        this.closeModal();
      }, 1000);
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  getStepProgress(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  getStepTitle(step: number): string {
    switch (step) {
      case 1: return 'Personal Information';
      case 2: return 'Cover Letter';
      case 3: return 'Application Documents';
      case 4: return 'Confirmation';
      default: return '';
    }
  }

  getStepDescription(step: number): string {
    switch (step) {
      case 1: return 'Verify your personal information';
      case 2: return 'Write your cover letter and confirm position details';
      case 3: return 'Upload required documents';
      case 4: return 'Complete assessments and review';
      default: return '';
    }
  }

  getCoverLetterLength(): number {
    return this.applicationForm.get('cover_letter')?.value?.length || 0;
  }

  getRemarksLength(): number {
    return this.applicationForm.get('remarks')?.value?.length || 0;
  }

  // File upload methods
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
  }

  handleFiles(files: File[]): void {
    files.forEach(file => {
      if (this.validateFile(file)) {
        this.addFile(file);
      }
    });
  }

  validateFile(file: File): boolean {
    // Check file size
    if (file.size > this.maxFileSize) {
      alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
      return false;
    }

    // Check file type
    if (!this.allowedFileTypes.includes(file.type)) {
      alert(`File "${file.name}" is not a supported file type. Please upload PDF, Word, or image files.`);
      return false;
    }

    // Check if file already exists
    const existingFile = this.uploadedDocuments.find(doc => doc.name === file.name);
    if (existingFile) {
      alert(`File "${file.name}" has already been uploaded.`);
      return false;
    }

    return true;
  }

  addFile(file: File): void {
    const document: UploadedDocument = {
      id: this.generateId(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      uploadDate: new Date()
    };

    this.uploadedDocuments.push(document);
    console.log('File added:', document);
  }

  removeFile(documentId: string): void {
    this.uploadedDocuments = this.uploadedDocuments.filter(doc => doc.id !== documentId);
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileIcon(fileType: string): string {
    if (fileType.includes('pdf')) return 'picture_as_pdf';
    if (fileType.includes('word') || fileType.includes('document')) return 'description';
    if (fileType.includes('image')) return 'image';
    return 'insert_drive_file';
  }

  onConfirmationChange(checked: boolean): void {
    this.confirmationChecked = checked;
  }

  onConfirmationCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.confirmationChecked = target.checked;
  }
} 