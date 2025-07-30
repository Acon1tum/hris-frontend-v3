import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { JobPortalAuthService } from '../job-portal-auth.service';

@Component({
  selector: 'app-online-job-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './online-job-register.component.html',
  styleUrls: ['./online-job-register.component.scss']
})
export class OnlineJobRegisterComponent implements OnInit {
  registerData = {
    firstName: '',
    lastName: '',
    middleName: '',
    suffix: '',
    gender: '',
    civilStatus: '',
    contactNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    currentEmployer: '',        // <-- Add this
    highestEducation: ''        // <-- Add this
  };

  isLoading = false;
  showPassword = false;
  errorMessage = '';
  animationState = 'fade-up-enter';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private jobPortalAuthService: JobPortalAuthService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.animationState = '';
    }, 500); // Remove class after animation
  }

  onRegister() {
    // Validate required fields
    if (!this.registerData.firstName || !this.registerData.lastName || 
        !this.registerData.email || !this.registerData.contactNumber || 
        !this.registerData.password || !this.registerData.confirmPassword) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerData.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    // Validate phone number format (should be numeric and at least 10 digits)
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(this.registerData.contactNumber.replace(/\D/g, ''))) {
      this.errorMessage = 'Please enter a valid phone number (at least 10 digits)';
      return;
    }

    // Validate password length
    if (this.registerData.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters long';
      return;
    }

    // Validate password confirmation
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    // Validate terms agreement
    if (!this.registerData.agreeTerms) {
      this.errorMessage = 'Please agree to the Terms of Service and Privacy Policy';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload = {
      first_name: this.registerData.firstName,
      last_name: this.registerData.lastName,
      middle_name: this.registerData.middleName,
      email: this.registerData.email,
      phone: this.registerData.contactNumber,
      password: this.registerData.password,
      current_employer: this.registerData.currentEmployer,
      highest_education: this.registerData.highestEducation
    };

    this.jobPortalAuthService.register(payload)
    .subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          // Registration successful, show success message and navigate to login
          this.errorMessage = '';
          setTimeout(() => {
            this.router.navigate(['/online-job-login'], {
              queryParams: {
                message: 'Registration successful! Please log in with your credentials.'
              }
            });
          }, 1000);
        } else {
          // Show error message from server
          this.errorMessage = res.message || 'Registration failed. Please try again.';
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        // Handle error (show error message)
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else if (err.status === 400) {
          this.errorMessage = 'Invalid registration data. Please check your information and try again.';
        } else if (err.status === 409) {
          this.errorMessage = 'Email already registered. Please use a different email or try logging in.';
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
      }
    });
}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goToLogin() {
    this.animationState = 'fade-down-leave';
    setTimeout(() => {
      this.router.navigate(['/online-job-login']);
    }, 500); // Match animation duration
  }
}
