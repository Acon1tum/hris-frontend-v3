import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

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
    suffix: '',           // <-- Add this line
    gender: '',
    civilStatus: '',
    contactNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  };

  isLoading = false;
  showPassword = false;
  errorMessage = '';
  animationState = 'fade-up-enter';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.animationState = '';
    }, 500); // Remove class after animation
  }

  onRegister() {
    // Validate required fields
    if (!this.registerData.firstName || !this.registerData.lastName || 
        !this.registerData.email || !this.registerData.password || 
        !this.registerData.confirmPassword) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerData.email)) {
      this.errorMessage = 'Please enter a valid email address';
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

    // TODO: Implement actual job portal registration logic
    // For now, simulate registration process
    setTimeout(() => {
      console.log('Job portal registration attempt:', this.registerData);
      
      // Simulate successful registration
      this.isLoading = false;
      
      // Navigate to job portal dashboard or application form
      this.router.navigate(['/online-job-application-portal/dashboard']);
    }, 2000);
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
