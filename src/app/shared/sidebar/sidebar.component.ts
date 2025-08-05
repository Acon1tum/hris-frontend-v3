import { Component, Input, Output, EventEmitter, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MenuItem } from '../../interfaces/auth.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Input() isCollapsed = false;
  @Input() isSidebarCollapsed = false;
  @Output() stateChange = new EventEmitter<{isOpen: boolean; isCollapsed: boolean}>();

  menuItems: MenuItem[] = [];
  currentUser$ = this.authService.currentUser$;
  expandedItem: string | null = null;
  isMobile = window.innerWidth <= 768;

  // Tooltip state for collapsed sidebar
  tooltip = {
    visible: false,
    text: '',
    x: 0,
    y: 0
  };

  // Add static app links for the APP section
  appLinks = [
    { name: 'Webflow', icon: 'apps' },
    { name: 'Framer', icon: 'dashboard_customize' },
    { name: 'Typeform', icon: 'description' }
  ];

  // Replace menuItemsConfig with a grouped config by role
  menuItemsByRole: { [role: string]: MenuItem[] } = {
    Admin: [
      { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
      { name: 'System Administration', icon: 'admin_panel_settings', path: '/system-administration', children: [
        { name: 'User Management', icon: 'manage_accounts', path: '/system-administration/user-management' },
        { name: 'Audit Trail', icon: 'history', path: '/system-administration/audit-trail' },
        { name: 'System Parameters', icon: 'settings', path: '/system-administration/system-parameters' }
      ] },
      { name: 'Personnel Information', icon: 'people', path: '/personnel-information-management', children: [
        { name: 'Admin Dashboard', icon: 'analytics', path: '/personnel-information-management/admin-dashboard' },
        { name: 'Admin Custom', icon: 'build', path: '/personnel-information-management/admin-custom' },
        { name: 'Admin Request', icon: 'build', path: '/personnel-information-management/admin-request' },
        { name: 'Personnel 201 File', icon: 'folder', path: '/personnel-information-management/personnel-201-file' },
        { name: 'Personnel Movement', icon: 'swap_horiz', path: '/personnel-information-management/personnel-movement' }
      ] },
      { name: 'Employee Self-Service', icon: 'person', path: '/employee-self-service', children: [
        { name: 'My Profile', icon: 'person', path: '/employee-self-service/my-profile' },
        { name: 'My Requests', icon: 'request_page', path: '/employee-self-service/my-requests' },
        { name: 'My Reports', icon: 'report', path: '/employee-self-service/my-reports' }
      ] },
      { name: 'Timekeeping & Attendance', icon: 'schedule', path: '/timekeeping-attendance', children: [
        { name: 'Attendance Overview', icon: 'analytics', path: '/timekeeping-attendance/attendance-overview' },
        { name: 'Attendance Logs', icon: 'history', path: '/timekeeping-attendance/attendance-logs' },
        { name: 'Time Schedules', icon: 'schedule', path: '/timekeeping-attendance/time-schedules' },
        { name: 'DTR Adjustment', icon: 'adjust', path: '/timekeeping-attendance/dtr-adjustment' },
        { name: 'Employee Attendance', icon: 'person', path: '/timekeeping-attendance/employee-attendance' }
      ] },
      { name: 'Payroll Management', icon: 'payments', path: '/payroll-management', children: [
        { name: 'Run Payroll', icon: 'payments', path: '/payroll-management/run-payroll' },
        { name: 'Payslip Center', icon: 'payments', path: '/payroll-management/payslip-center' },
        { name: 'Thirteen Month Pay', icon: 'payments', path: '/payroll-management/thirteen-month-pay' },
        { name: 'Final Pay Process', icon: 'payments', path: '/payroll-management/final-pay-process' }
      ] },
      { name: 'Leave Management', icon: 'event', path: '/leave-management', children: [
        { name: 'Leave Request Management', icon: 'event', path: '/leave-management/leave-request-management' },
        { name: 'Leave Type Management', icon: 'event', path: '/leave-management/leave-type-management' },
        { name: 'Leave Balance', icon: 'event', path: '/leave-management/leave-balance' },
        { name: 'Leave Employee', icon: 'event', path: '/leave-management/leave-employee' }
      ] },
      { name: 'Job Management', icon: 'work', path: '/job-management', children: [
        { name: 'Recruitment', icon: 'work', path: '/recruitment' },
        { name: 'Job Portal Management', icon: 'admin_panel_settings', path: '/job-portal-management' }
      ] },
      { name: 'Report Generation', icon: 'assessment', path: '/report-generation' },
      { name: 'Performance Management', icon: 'trending_up', path: '/performance-management' },
      { name: 'Learning & Development', icon: 'school', path: '/learning-development' },
      { name: 'Health & Wellness', icon: 'health_and_safety', path: 'https://quanby-health-care.vercel.app/', external: true, target: '_blank' }
    ],
    HR: [
      { name: 'Personnel Information', icon: 'people', path: '/personnel-information-management', children: [
        { name: 'Admin Dashboard', icon: 'analytics', path: '/personnel-information-management/admin-dashboard' },
        { name: 'Admin Custom', icon: 'build', path: '/personnel-information-management/admin-custom' },
        { name: 'Admin Request', icon: 'build', path: '/personnel-information-management/admin-request' },
        { name: 'Personnel 201 File', icon: 'folder', path: '/personnel-information-management/personnel-201-file' },
        { name: 'Personnel Movement', icon: 'swap_horiz', path: '/personnel-information-management/personnel-movement' }
      ] },
      { name: 'Employee Self-Service', icon: 'person', path: '/employee-self-service', children: [
        { name: 'My Profile', icon: 'person', path: '/employee-self-service/my-profile' },
        { name: 'My Requests', icon: 'request_page', path: '/employee-self-service/my-requests' },
        { name: 'My Reports', icon: 'report', path: '/employee-self-service/my-reports' }
      ] },
      { name: 'Timekeeping & Attendance', icon: 'schedule', path: '/timekeeping-attendance', children: [
        { name: 'Attendance Overview', icon: 'analytics', path: '/timekeeping-attendance/attendance-overview' },
        { name: 'Attendance Logs', icon: 'history', path: '/timekeeping-attendance/attendance-logs' },
        { name: 'Time Schedules', icon: 'schedule', path: '/timekeeping-attendance/time-schedules' },
        { name: 'DTR Adjustment', icon: 'adjust', path: '/timekeeping-attendance/dtr-adjustment' },
        { name: 'Employee Attendance', icon: 'person', path: '/timekeeping-attendance/employee-attendance' }
      ] },
      { name: 'Payroll Management', icon: 'payments', path: '/payroll-management', children: [
        { name: 'Payroll Overview', icon: 'analytics', path: '/payroll-management/payroll-overview' },
        { name: 'Master Payroll', icon: 'payments', path: '/payroll-management/master-payroll' },
        { name: 'Deductions', icon: 'payments', path: '/payroll-management/deductions' },
        { name: 'Loan Management', icon: 'payments', path: '/payroll-management/loan-management' },
        { name: 'Payroll Adjustment', icon: 'payments', path: '/payroll-management/payroll-adjustment' },
        { name: 'Payroll Run', icon: 'payments', path: '/payroll-management/payroll-run' },
        { name: 'Employee Payroll', icon: 'payments', path: '/payroll-management/employee-payroll' }
      ] },
      { name: 'Leave Management', icon: 'event', path: '/leave-management', children: [
        { name: 'Leave Request Management', icon: 'event', path: '/leave-management/leave-request-management' },
        { name: 'Leave Type Management', icon: 'event', path: '/leave-management/leave-type-management' },
        { name: 'Leave Balance', icon: 'event', path: '/leave-management/leave-balance' },
        { name: 'Leave Employee', icon: 'event', path: '/leave-management/leave-employee' }
      ] },
      { name: 'Report Generation', icon: 'assessment', path: '/report-generation' },
      { name: 'Job Management', icon: 'work', path: '/job-management', children: [
        { name: 'Recruitment', icon: 'work', path: '/recruitment' },
        { name: 'Job Portal Management', icon: 'admin_panel_settings', path: '/job-portal-management' }
      ] },
      { name: 'Performance Management', icon: 'trending_up', path: '/performance-management' },
      { name: 'Learning & Development', icon: 'school', path: '/learning-development' },
      { name: 'Health & Wellness', icon: 'health_and_safety', path: 'https://quanby-health-care.vercel.app/', external: true, target: '_blank' }
    ],
    Employee: [
      { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
      { name: 'My Profile', icon: 'person', path: '/employee-self-service/my-profile' },
      { name: 'My Requests', icon: 'request_page', path: '/employee-self-service/my-requests' },
      { name: 'My Reports', icon: 'report', path: '/employee-self-service/my-reports' },
      { name: 'Employee Attendance', icon: 'person', path: '/timekeeping-attendance/employee-attendance' },
      { name: 'Leave Employee', icon: 'event', path: '/leave-management/leave-employee' },
      { name: 'Performance Management', icon: 'trending_up', path: '/performance-management' },
      { name: 'Health & Wellness', icon: 'health_and_safety', path: 'https://quanby-health-care.vercel.app/', external: true, target: '_blank' }
    ],
    Manager: [
      { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
      { name: 'Team Management', icon: 'groups', path: '/manager/team-management' },
      { name: 'Attendance Overview', icon: 'analytics', path: '/timekeeping-attendance/attendance-overview' },
      { name: 'Attendance Logs', icon: 'history', path: '/timekeeping-attendance/attendance-logs' },
      { name: 'Employee Attendance', icon: 'person', path: '/timekeeping-attendance/employee-attendance' },
      { name: 'Leave Management', icon: 'event', path: '/leave-management', children: [
        { name: 'Leave Balance', icon: 'event', path: '/leave-management/leave-balance' },
        { name: 'Leave Employee', icon: 'event', path: '/leave-management/leave-employee' }
      ] },
      { name: 'Performance Management', icon: 'trending_up', path: '/performance-management' },
      { name: 'Learning & Development', icon: 'school', path: '/learning-development' },
      { name: 'Health & Wellness', icon: 'health_and_safety', path: 'https://quanby-health-care.vercel.app/', external: true, target: '_blank' }
    ],
    Applicant: [
      { name: 'Applicant Dashboard', icon: 'dashboard', path: '/applicant-dashboard' },
      { name: 'Job Portal', icon: 'work', path: '/online-job-application-portal' }
    ]
  };

  get currentMenuItems(): MenuItem[] {
    const user = this.authService.getCurrentUser();
    return user && user.role && this.menuItemsByRole[user.role] ? this.menuItemsByRole[user.role] : [];
  }

  private userSub: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    const wasNotMobile = !this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    if (wasNotMobile && this.isMobile) {
      this.isOpen = false;
      this.emitStateChange();
    } else if (!wasNotMobile && !this.isMobile) {
      this.isOpen = true;
      this.isCollapsed = false;
      this.emitStateChange();
    }
  }

  ngOnInit() {
    this.updateMenuItems();
    this.isOpen = !this.isMobile;
    this.isCollapsed = false;
    this.emitStateChange();

    this.userSub = this.currentUser$.subscribe(() => {
      this.updateMenuItems();
    });

    // Listen to route changes to update menu for job portal public mode
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateMenuItems();
      }
    });
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }

  private updateMenuItems() {
    // If in job portal public mode and on the job portal route, show only Login/Register
    const publicMode = localStorage.getItem('jobPortalPublicMode') === 'true';
    const onJobPortal = this.router.url.startsWith('/online-job-application-portal');
    if (publicMode && onJobPortal) {
      this.menuItems = [
        { name: 'Login', icon: 'login', path: '/login', roles: [] },
        { name: 'Register', icon: 'person_add', path: '/register', roles: [] }
      ];
      return;
    }
    // If not on the job portal, clear the flag
    if (publicMode && !onJobPortal) {
      localStorage.removeItem('jobPortalPublicMode');
    }
    // Use the imported menu configuration instead of defining items inline
    this.menuItems = this.currentMenuItems;
  }

  toggleMenuItem(itemName: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    // If sidebar is collapsed and not mobile, expand it
    if (this.isCollapsed && !this.isMobile) {
      this.isCollapsed = false;
      this.isOpen = true;
      this.emitStateChange();
      setTimeout(() => {
        this.expandedItem = itemName;
      }, 200); // Adjust delay as needed for animation
      return;
    }

    if (this.expandedItem === itemName) {
      this.expandedItem = null;
    } else {
      this.expandedItem = itemName;
    }
  }

  isMenuItemExpanded(itemName: string): boolean {
    return this.expandedItem === itemName;
  }

  onMenuItemClick() {
    if (this.isMobile) {
      this.isOpen = false;
    }
  }

  logout() {
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

  showTooltip(event: MouseEvent, text: string) {
    if (this.isCollapsed && !this.isMobile) {
      this.tooltip.visible = true;
      this.tooltip.text = text;
      this.setTooltipPosition(event);
    }
  }

  moveTooltip(event: MouseEvent) {
    if (this.tooltip.visible) {
      this.setTooltipPosition(event);
    }
  }

  hideTooltip() {
    this.tooltip.visible = false;
  }

  private setTooltipPosition(event: MouseEvent) {
    // Offset the tooltip a bit to the right of the cursor
    this.tooltip.x = event.clientX + 16;
    this.tooltip.y = event.clientY + 8;
  }

  private emitStateChange() {
    this.stateChange.emit({
      isOpen: this.isOpen,
      isCollapsed: this.isCollapsed
    });
  }
} 