import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { JobPortalAuthService } from '../job-portal-auth.service';
import lottie from 'lottie-web';

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
  errorMessage: string | null = null;
  sessionTimeoutMessage: string | null = null;
  animationState = 'fade-up-enter';
  successMessage: string | null = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private jobPortalAuthService: JobPortalAuthService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.animationState = '';
    }, 500); // Remove 
    // class after animation
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['reason'] === 'session_timeout') {
        this.sessionTimeoutMessage = 'Your session has expired. Please log in again.';
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
    this.successMessage = '';

    this.jobPortalAuthService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (applicant) => {
        console.log('Login successful:', applicant);
        this.isLoading = false;
        this.successMessage = 'Login successful! Redirecting...';
        
        // Navigate to the applicant dashboard
        setTimeout(() => {
          this.router.navigate(['/applicant-dashboard']);
        }, 1000);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = error.message || 'Login failed. Please check your credentials and try again.';
        this.isLoading = false;
      }
    });
  }

  onDemoLogin() {
    this.loginData.email = 'demo@example.com';
    this.loginData.password = 'demo123';
    this.onLogin();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onForgotPassword() {
    // Implement forgot password functionality for job portal
    console.log('Forgot password clicked');
    // You can navigate to a forgot password page or show a modal
  }

  goToRegister() {
    this.animationState = 'fade-down-leave';
    setTimeout(() => {
      this.router.navigate(['/online-job-register']);
    }, 500); // Match animation duration
  }
}
