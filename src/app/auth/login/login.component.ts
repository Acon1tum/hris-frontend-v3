import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Output() loginSuccess = new EventEmitter<void>();

  loginData = {
    username: '',
    password: '',
    rememberMe: false
  };

  isLoading = false;
  showPassword = false;
  errorMessage = '';
  sessionTimeoutMessage = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Check for session timeout reason from URL parameters
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['reason'] === 'session_timeout') {
        this.sessionTimeoutMessage = 'Your session has expired due to inactivity. Please log in again.';
      }
    });

    // Check for logout reason from auth service
    const logoutReason = this.authService.getAndClearLogoutReason();
    if (logoutReason === 'session_timeout') {
      this.sessionTimeoutMessage = 'Your session has expired due to inactivity. Please log in again.';
    }
  }

  onLogin() {
    if (!this.loginData.username || !this.loginData.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData.username, this.loginData.password).subscribe({
      next: (user) => {
        console.log('Login successful:', user);
        
        // Emit login success event
        this.loginSuccess.emit();

        // Navigate to dashboard
        this.router.navigate(['/dashboard']);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = error.message || 'Login failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onForgotPassword() {
    // Implement forgot password functionality
    console.log('Forgot password clicked');
    // You can navigate to a forgot password page or show a modal
  }

  onDemoLogin(role: string) {
    this.isLoading = true;
    this.errorMessage = '';

    // Set demo credentials based on seed data
    switch (role.toLowerCase()) {
      case 'admin':
        this.loginData.username = 'admin';
        this.loginData.password = 'Admin123!';
        break;
      case 'hr':
        this.loginData.username = 'hr_manager';
        this.loginData.password = 'HR123!';
        break;
      case 'employee':
        this.loginData.username = 'employee';
        this.loginData.password = 'Employee123!';
        break;
      default:
        this.loginData.username = 'admin';
        this.loginData.password = 'Admin123!';
    }
    
    // Use the demoLogin method from auth service for consistency
    this.authService.demoLogin(role).subscribe({
      next: (user) => {
        console.log('Demo login successful:', user);
        
        // Emit login success event
        this.loginSuccess.emit();

        // Navigate to dashboard
        this.router.navigate(['/dashboard']);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Demo login error:', error);
        this.errorMessage = error.message || 'Demo login failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  openJobPortal() {
    // Set a flag to indicate public job portal mode
    localStorage.setItem('jobPortalPublicMode', 'true');
    this.router.navigate(['/online-job-application-portal']);
  }
} 