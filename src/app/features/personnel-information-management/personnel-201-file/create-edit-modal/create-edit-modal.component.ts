import { Component, EventEmitter, Input, Output, HostListener, AfterViewInit, ElementRef, Renderer2, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export interface Personnel201ModalData {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  email: string;
  number: string;
  address: string;
  department: string;
  position: string;
  file?: File | null;
  birthdate?: string;
  gender?: string;
  civilStatus?: string;
  employmentType?: string;
  designation?: string;
  appointmentDate?: string;
  startDate?: string;
  employmentStatus?: string;
  jobLevel?: string;
  jobGrade?: string;
  gsis?: string;
  pagibig?: string;
  philhealth?: string;
  sss?: string;
  tin_number?: string;
  dependents?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  emergencyContactRelationship?: string;
  fileName?: string;
  profilePictureUrl?: string;
  profilePictureFile?: File | null;
  username?: string;
  password?: string;
  confirmPassword?: string;
  profilePictureBase64?: string | null;
}

export interface Department {
  id: string;
  department_name: string;
  description?: string;
  department_head?: string;
}

@Component({
  selector: 'app-create-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-edit-modal.component.html',
  styleUrls: ['./create-edit-modal.component.scss']
})
export class CreateEditModalComponent implements AfterViewInit {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() data: Personnel201ModalData = {
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    email: '',
    number: '',
    address: '',
    department: '',
    position: '',
    file: null,
    birthdate: '',
    gender: '',
    civilStatus: '',
    employmentType: '',
    designation: '',
    appointmentDate: '',
    startDate: '',
    employmentStatus: '',
    jobLevel: '',
    jobGrade: '',
    gsis: '',
    pagibig: '',
    philhealth: '',
    sss: '',
    tin_number: '',
    dependents: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    emergencyContactRelationship: '',
    fileName: '',
    profilePictureUrl: '',
    profilePictureFile: null,
    username: '',
    password: '',
    confirmPassword: '',
    profilePictureBase64: undefined
  };
  @Input() departments: Department[] = [];
  @Input() loading: boolean = false;
  @Output() save = new EventEmitter<Personnel201ModalData>();
  @Output() cancel = new EventEmitter<void>();
  @Input() personnelId: string = '';
  @Output() uploadDocuments = new EventEmitter<{ files: File[]; metas: { title: string; description: string }[] }>();
  @Output() refreshTable = new EventEmitter<void>();

  @ViewChildren('fadeSection', { read: ElementRef }) fadeSections!: QueryList<ElementRef>;
  @ViewChild('modalForm') modalForm: any;
  private lastScrollTop = 0;

  constructor(private renderer: Renderer2, private http: HttpClient) {}

  isDragOver = false;
  showFloatingProfile = false;
  closing = false;

  public formSubmitted: boolean = false;
  public showValidationMessage: boolean = false;

  selectedFiles: File[] = [];
  fileMetas: { title: string; description: string }[] = [];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollThreshold = 150;
    this.showFloatingProfile = window.scrollY > scrollThreshold;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        this.selectedFiles.push(input.files[i]);
        this.fileMetas.push({ title: input.files[i].name, description: '' });
      }
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files) {
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        this.selectedFiles.push(event.dataTransfer.files[i]);
        this.fileMetas.push({ title: event.dataTransfer.files[i].name, description: '' });
      }
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.fileMetas.splice(index, 1);
  }

  onProfilePictureChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.data.profilePictureFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.data.profilePictureUrl = e.target.result;
        this.data.profilePictureBase64 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeProfilePicture(): void {
    this.data.profilePictureFile = null;
    this.data.profilePictureUrl = '';
    this.data.profilePictureBase64 = null;
  }

  async onSave() {
    this.formSubmitted = true;
    if (this.modalForm && !this.modalForm.form.valid) {
      this.showValidationMessage = true;
      return;
    }
    if (this.mode === 'create') {
      // Generate username from email
      this.data.username = this.generateUsernameFromEmail();
      
      // Enhanced password validation
      if (!this.data.password || !this.data.confirmPassword) {
        this.showValidationMessage = true;
        return;
      }
      
      // Check password strength
      const passwordValidation = this.validatePassword(this.data.password);
      if (!passwordValidation.isValid) {
        this.showValidationMessage = true;
        return;
      }
      
      // Check if passwords match
      if (this.data.password !== this.data.confirmPassword) {
        this.showValidationMessage = true;
        return;
      }
    }
    this.save.emit({ ...this.data });
    this.refreshTable.emit();
    if (this.selectedFiles.length > 0) {
      this.uploadDocuments.emit({ files: this.selectedFiles, metas: this.fileMetas });
    }
  }

  // Password validation method
  private validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Password strength indicator methods
  getPasswordStrengthClass(): string {
    if (!this.data.password) return '';
    
    const validation = this.validatePassword(this.data.password);
    const strength = 5 - validation.errors.length;
    
    if (strength <= 1) return 'weak';
    if (strength <= 3) return 'medium';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    if (!this.data.password) return '';
    
    const validation = this.validatePassword(this.data.password);
    const strength = 5 - validation.errors.length;
    
    if (strength <= 1) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  }

  hasUppercase(): boolean {
    return /[A-Z]/.test(this.data.password || '');
  }

  hasLowercase(): boolean {
    return /[a-z]/.test(this.data.password || '');
  }

  hasNumber(): boolean {
    return /\d/.test(this.data.password || '');
  }

  hasSpecialChar(): boolean {
    return /[!@#$%^&*(),.?":{}|<>]/.test(this.data.password || '');
  }

  generateUsernameFromEmail(): string {
    if (!this.data.email) {
      return '';
    }
    // Extract the part before @ and remove any special characters
    const emailPart = this.data.email.split('@')[0];
    return emailPart.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  }

  hideValidationMessage() {
    this.showValidationMessage = false;
  }

  onCancel() {
    this.closing = true;
    setTimeout(() => {
      this.cancel.emit();
      this.closing = false;
    }, 400); // match animation duration
  }

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollingUp = scrollTop < this.lastScrollTop;
          this.lastScrollTop = scrollTop;

          if (entry.isIntersecting && scrollingUp) {
            this.renderer.addClass(entry.target, 'in-view');
          } else if (!entry.isIntersecting) {
            this.renderer.removeClass(entry.target, 'in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    this.fadeSections.forEach(section => {
      observer.observe(section.nativeElement);
    });
  }

  noop(event: Event) {
    // Do nothing, just prevent propagation
    event.stopPropagation();
  }
} 