import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import lottie from 'lottie-web';
import { JobPortalAuthService } from '../job-portal-auth.service';

@Component({
  selector: 'app-online-job-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './online-job-login.component.html',
  styleUrls: ['./online-job-login.component.scss']
})
export class OnlineJobLoginComponent implements OnInit, AfterViewInit {
  @ViewChild('lottieContainer', { static: true }) lottieContainer!: ElementRef;

  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  isLoading = false;
  showPassword = false;
  errorMessage = '';
  sessionTimeoutMessage = '';
  successMessage = '';

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

    // Check for session timeout reason from URL parameters
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['reason'] === 'session_timeout') {
        this.sessionTimeoutMessage = 'Your session has expired due to inactivity. Please log in again.';
      }
      
      // Check for success message from registration
      if (params['message']) {
        this.successMessage = params['message'];
        // Clear success message after 5 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      }
    });
  }

  ngAfterViewInit() {
    lottie.loadAnimation({
      container: this.lottieContainer.nativeElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/images/register.json'
    });
  }

  onLogin() {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = ''; // Clear success message

    // Use the job portal auth service to login
    this.jobPortalAuthService.login(this.loginData.email, this.loginData.password)
      .subscribe({
        next: (applicant) => {
          this.isLoading = false;
          console.log('Login successful:', applicant);
          
          // Navigate to job portal dashboard
          this.router.navigate(['/online-job-application-portal/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);
          
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else if (error.status === 401) {
            this.errorMessage = 'Invalid email or password. Please try again.';
          } else if (error.status === 404) {
            this.errorMessage = 'User not found. Please check your email or register.';
          } else {
            this.errorMessage = 'Login failed. Please try again later.';
          }
        }
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onForgotPassword() {
    // TODO: Implement forgot password functionality for job portal
    console.log('Forgot password clicked for job portal');
    // You can navigate to a forgot password page or show a modal
  }

  onDemoLogin() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Set demo credentials
    this.loginData.email = 'demo@example.com';
    this.loginData.password = 'demo123';
    
    // Use the actual login service for demo
    this.jobPortalAuthService.login(this.loginData.email, this.loginData.password)
      .subscribe({
        next: (applicant) => {
          this.isLoading = false;
          console.log('Demo login successful:', applicant);
          
          // Navigate to job portal dashboard
          this.router.navigate(['/online-job-application-portal/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Demo login error:', error);
          this.errorMessage = 'Demo login failed. Please try with your actual credentials.';
        }
      });
  }

  goToRegister() {
    this.animationState = 'fade-down-leave';
    setTimeout(() => {
      this.router.navigate(['/online-job-register']);
    }, 500); // Match animation duration
  }
}
