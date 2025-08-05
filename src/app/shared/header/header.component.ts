import { Component, HostBinding, Input, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/auth.interface';
import { FormsModule } from '@angular/forms';

interface Notification {
  id: string;
  message: string;
  time: string;
  type: 'success' | 'warning' | 'info';
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @HostBinding('class.sidebar-open') isSidebarOpen = false;
  @Input() isSidebarCollapsed = false;
  @Input() isSidebarOpenInput = true;
  @Input() publicMode = false;
  
  currentUser$ = this.authService.currentUser$;
  
  userMenuItems = [
    { name: 'Profile', icon: 'person', action: 'profile' },
    { name: 'Settings', icon: 'settings', action: 'settings' },
    { name: 'Logout', icon: 'logout', action: 'logout' }
  ];

  notifications: Notification[] = [
    { id: '1', message: 'New leave request pending', time: '2 min ago', type: 'info' },
    { id: '2', message: 'Payroll processed successfully', time: '1 hour ago', type: 'success' },
    { id: '3', message: 'System maintenance scheduled', time: '3 hours ago', type: 'warning' }
  ];

  showUserMenu = false;
  showNotifications = false;
  searchText = '';
  isOnline = true;
  isMobile = window.innerWidth <= 768;

  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }

  clearAllNotifications() {
    this.notifications = [];
    this.showNotifications = false;
  }

  removeNotification(id: string) {
    this.notifications = this.notifications.filter(notification => notification.id !== id);
  }

  onUserAction(action: string) {
    console.log('User action:', action);
    this.showUserMenu = false;
    
    if (action === 'logout') {
      // Get current user before logout
      const currentUser = this.authService.getCurrentUser();
      const isApplicant = currentUser && currentUser.role === 'Applicant';
      
      this.authService.logout();
      
      // Redirect based on user role
      if (isApplicant) {
        this.router.navigate(['/online-job-login']);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  onNotificationClick(notification: Notification) {
    console.log('Notification clicked:', notification);
    this.showNotifications = false;
  }

  clearSearch() {
    this.searchText = '';
  }

  onSearchInput() {
    // Optionally, implement search logic here
  }

  ngOnInit(): void {
    // Initialization logic can go here if needed
  }

  get headerClass() {
    return this.isSidebarCollapsed ? 'collapsed' : '';
  }

  /**
   * Returns the dynamic style object for the header based on sidebar state.
   */
  get headerDynamicStyle() {
    const margin = this.isMobile ? '0.5rem' : '1.5rem';
    
    // Get current user to check if they are an Applicant
    const currentUser = this.authService.getCurrentUser();
    const isApplicant = currentUser && (currentUser.role === 'Applicant' || currentUser.roles?.includes('Applicant'));
    
    // Adjust sidebar width based on user role
    const sidebarWidth = this.isSidebarCollapsed ? '80px' : (isApplicant ? '230px' : '290px');
    
    return {
      left: sidebarWidth,
      width: `calc(100vw - ${sidebarWidth} - (${margin} * 2))`,
      'max-width': `calc(100vw - ${sidebarWidth} - (${margin} * 2))`,
      'border-radius': this.isMobile ? '0 0 1.5rem 1.5rem' : '0 0 2rem 2rem',
      transition: 'left 0.3s cubic-bezier(.4,2,.6,1), width 0.3s cubic-bezier(.4,2,.6,1)',
    };
  }

  emitToggleSidebar() {
    this.toggleSidebar.emit();
  }

  goToLogin() {
    this.router.navigate(['/online-job-login']);
  }
  goToRegister() {
    this.router.navigate(['/online-job-register']);
  }
} 