import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { LoginComponent } from './auth/login/login.component';
import { SessionWarningDialogComponent } from './shared/components/session-warning-dialog/session-warning-dialog.component';
import { AuthService } from './services/auth.service';
import { InactivityService } from './services/inactivity.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink,
    HeaderComponent, 
    SidebarComponent, 
    LoginComponent,
    SessionWarningDialogComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'hris-frontend';
  isSidebarOpen = true;
  isSidebarCollapsed = false;
  currentUser$ = this.authService.currentUser$;
  private subscriptions: Subscription[] = [];
  
  features = [
    { name: 'System Administration', icon: '⚙️', route: '/system-administration', description: 'Manage system settings and configurations' },
    { name: 'Personnel Information Management', icon: '👥', route: '/personnel-information-management', description: 'Manage employee information and records' },
    { name: 'Employee Self-Service', icon: '👤', route: '/employee-self-service', description: 'Employee portal for self-service functions' },
    { name: 'Timekeeping & Attendance', icon: '⏰', route: '/timekeeping-attendance', description: 'Track employee time and attendance' },
    { name: 'Payroll Management', icon: '💰', route: '/payroll-management', description: 'Manage payroll processing and calculations' },
    { name: 'Leave Management', icon: '📅', route: '/leave-management', description: 'Handle leave requests and approvals' },
    { name: 'Report Generation', icon: '📊', route: '/report-generation', description: 'Generate and view reports' },
    { name: 'Recruitment', icon: '🎯', route: '/recruitment', description: 'Manage recruitment and hiring process' },
    { name: 'Online Job Application Portal', icon: '🌐', route: '/online-job-application-portal', description: 'External job application portal' },
    { name: 'Performance Management', icon: '📈', route: '/performance-management', description: 'Track and manage employee performance' },
    { name: 'Learning & Development', icon: '🎓', route: '/learning-development', description: 'Manage training and development programs' },
    { name: 'Health & Wellness', icon: '🏥', route: '/health-wellness', description: 'Health and wellness programs' }
  ];

  constructor(
    private authService: AuthService,
    private inactivityService: InactivityService
  ) {}

  ngOnInit() {
    // Check screen size on init
    this.checkScreenSize();
    // Listen for window resize
    window.addEventListener('resize', () => this.checkScreenSize());

    // Initialize inactivity service when user is authenticated
    this.subscriptions.push(
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          this.inactivityService.initialize();
        } else {
          this.inactivityService.destroy();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.inactivityService.destroy();
  }

  private checkScreenSize() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      this.isSidebarOpen = false;
      this.isSidebarCollapsed = false;
    } else {
      this.isSidebarOpen = true;
      this.isSidebarCollapsed = false;
    }
  }

  onLoginSuccess() {
    // Login success is handled by the AuthService
  }

  onLogout() {
    this.authService.logout();
  }

  toggleSidebar() {
    if (window.innerWidth <= 768) {
      // On mobile, just toggle open/closed
      this.isSidebarOpen = !this.isSidebarOpen;
      this.isSidebarCollapsed = false;
    } else {
      // On desktop, toggle between open and collapsed only
      if (this.isSidebarOpen && !this.isSidebarCollapsed) {
        // Currently open, collapse it
        this.isSidebarCollapsed = true;
      } else {
        // If collapsed or closed, open it
        this.isSidebarOpen = true;
        this.isSidebarCollapsed = false;
      }
    }
  }

  onSidebarStateChange(state: {isOpen: boolean; isCollapsed: boolean}) {
    this.isSidebarOpen = state.isOpen;
    this.isSidebarCollapsed = state.isCollapsed;
  }

  isFeaturePage(): boolean {
    const currentUrl = window.location.pathname;
    return currentUrl !== '/' && currentUrl !== '/dashboard' && currentUrl !== '/login';
  }

  onSidebarCollapse(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
} 