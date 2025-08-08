import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminDashboardService, DashboardStats } from '../../../services/admin-dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  
  dashboardStats: DashboardStats | null = null;
  loading = true;
  error = false;
  private subscription = new Subscription();

  constructor(
    private adminDashboardService: AdminDashboardService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Admin Dashboard Component loaded!');
    this.loadDashboardData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadDashboardData() {
    this.loading = true;
    this.error = false;

    this.subscription.add(
      this.adminDashboardService.getDashboardStats().subscribe({
        next: (stats) => {
          this.dashboardStats = stats;
          this.loading = false;
          console.log('Dashboard stats loaded:', stats);
        },
        error: (error) => {
          console.error('Error loading dashboard data:', error);
          this.error = true;
          this.loading = false;
        }
      })
    );
  }

  refreshData() {
    this.loadDashboardData();
  }

  navigateToSection(section: string) {
    switch (section) {
      case 'personnel':
        this.router.navigate(['/personnel-information-management']);
        break;
      case 'leave':
        this.router.navigate(['/leave-management']);
        break;
      case 'payroll':
        this.router.navigate(['/payroll-management']);
        break;
      case 'attendance':
        this.router.navigate(['/timekeeping-attendance']);
        break;
      case 'reports':
        this.router.navigate(['/report-generation']);
        break;
      case 'system':
        this.router.navigate(['/system-administration']);
        break;
      default:
        break;
    }
  }

  getAttendancePercentage(): number {
    if (!this.dashboardStats?.attendanceOverview) return 0;
    const { present, total } = this.dashboardStats.attendanceOverview;
    return total > 0 ? Math.round((present / total) * 100) : 0;
  }

  getLeavePercentage(): number {
    if (!this.dashboardStats) return 0;
    const { pendingLeaveRequests, totalEmployees } = this.dashboardStats;
    return totalEmployees > 0 ? Math.round((pendingLeaveRequests / totalEmployees) * 100) : 0;
  }

  getDepartmentPercentage(count: number): number {
    if (!this.dashboardStats?.activeEmployees) return 0;
    return Math.round((count / this.dashboardStats.activeEmployees) * 100);
  }

  getEmploymentTypePercentage(count: number): number {
    if (!this.dashboardStats?.activeEmployees) return 0;
    return Math.round((count / this.dashboardStats.activeEmployees) * 100);
  }

  formatEmploymentType(type: string): string {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}
