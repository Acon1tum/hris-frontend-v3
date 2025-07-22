import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  errorMessage = '';
  sessionTimeoutMessage = '';

  animationState = 'fade-up-enter';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
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

    // TODO: Implement actual job portal login logic
    // For now, simulate login process
    setTimeout(() => {
      console.log('Job portal login attempt:', this.loginData);
      
      // Simulate successful login
      this.isLoading = false;
      
      // Navigate to job portal dashboard or application tracking
      this.router.navigate(['/online-job-application-portal/dashboard']);
    }, 1500);
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

    // Set demo credentials
    this.loginData.email = 'demo@example.com';
    this.loginData.password = 'demo123';
    
    // Simulate demo login process
    setTimeout(() => {
      console.log('Demo login successful for job portal');
      
      this.isLoading = false;
      
      // Navigate to job portal dashboard
      this.router.navigate(['/online-job-application-portal/dashboard']);
    }, 1500);
  }

  goToRegister() {
    this.animationState = 'fade-down-leave';
    setTimeout(() => {
      this.router.navigate(['/online-job-register']);
    }, 500); // Match animation duration
  }
}
