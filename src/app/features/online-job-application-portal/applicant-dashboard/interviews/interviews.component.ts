import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InterviewService, InterviewInfo } from '../interview.service';
import { Subject, takeUntil } from 'rxjs';

interface Interview {
  id: string;
  title: string;
  time: string;
  date: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  company?: string;
  position?: string;
  location?: string;
  type?: 'phone' | 'video' | 'in-person';
}

interface NotificationSettings {
  type: 'email' | 'inapp' | 'both';
  reminderTime: string;
  enabled: boolean;
}

@Component({
  selector: 'app-interviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.scss']
})
export class InterviewsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Notification settings
  notificationType: 'email' | 'inapp' | 'both' = 'email';
  reminderTime: string = '';
  notificationSettings: NotificationSettings = {
    type: 'email',
    reminderTime: '',
    enabled: true
  };

  reminderOptions = [
    { value: '10min', label: '10 minutes before' },
    { value: '30min', label: '30 minutes before' },
    { value: '1hr', label: '1 hour before' },
    { value: '1day', label: '1 day before' },
    { value: '2days', label: '2 days before' }
  ];

  // Calendar state
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  selectedDate: number | null = null;

  weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  interviewDates: Date[] = [];
  allInterviews: InterviewInfo[] = [];

  // Interview data
  upcomingInterviews: Interview[] = [];
  pastInterviews: Interview[] = [
    { 
      id: '1',
      title: 'Interview with Global Tech Corp.', 
      time: '11:00 AM - 12:00 PM', 
      date: new Date(this.currentYear, this.currentMonth, 2),
      status: 'completed',
      company: 'Global Tech Corp.',
      position: 'Senior Developer',
      location: 'San Francisco, CA',
      type: 'video'
    },
    { 
      id: '2',
      title: 'Interview with Digital Dynamics LLC', 
      time: '3:00 PM - 4:00 PM', 
      date: new Date(this.currentYear, this.currentMonth, 3),
      status: 'completed',
      company: 'Digital Dynamics LLC',
      position: 'Product Manager',
      location: 'New York, NY',
      type: 'in-person'
    }
  ];

  selectedDayInterviews: Interview[] = [];
  showDaySummary = false;

  // Loading states
  isLoading = false;
  isUpdatingSettings = false;

  constructor(
    private router: Router, 
    private interviewService: InterviewService
  ) {}

  ngOnInit(): void {
    this.loadInterviews();
    this.loadNotificationSettings();
    this.setupInterviewSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupInterviewSubscription(): void {
    this.interviewService.interviews$
      .pipe(takeUntil(this.destroy$))
      .subscribe(interviews => {
        this.allInterviews = interviews;
        this.updateInterviewDates();
        this.processInterviews();
      });
  }

  private loadInterviews(): void {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.upcomingInterviews = [
        {
          id: '3',
          title: 'Technical Interview - Frontend Role',
          time: '2:00 PM - 3:30 PM',
          date: new Date(this.currentYear, this.currentMonth, 15),
          status: 'scheduled',
          company: 'Tech Innovations Inc.',
          position: 'Frontend Developer',
          location: 'Remote',
          type: 'video'
        },
        {
          id: '4',
          title: 'Final Round - Senior Position',
          time: '10:00 AM - 11:30 AM',
          date: new Date(this.currentYear, this.currentMonth, 20),
          status: 'scheduled',
          company: 'Enterprise Solutions',
          position: 'Senior Software Engineer',
          location: 'Austin, TX',
          type: 'in-person'
        }
      ];
      
      this.processInterviews();
      this.isLoading = false;
    }, 1000);
  }

  private processInterviews(): void {
    // Process interviews for calendar display
    this.updateInterviewDates();
  }

  private loadNotificationSettings(): void {
    // Load saved notification settings from localStorage or API
    const savedSettings = localStorage.getItem('interviewNotificationSettings');
    if (savedSettings) {
      this.notificationSettings = JSON.parse(savedSettings);
      this.notificationType = this.notificationSettings.type;
      this.reminderTime = this.notificationSettings.reminderTime;
    }
  }

  private saveNotificationSettings(): void {
    this.notificationSettings = {
      type: this.notificationType,
      reminderTime: this.reminderTime,
      enabled: true
    };
    localStorage.setItem('interviewNotificationSettings', JSON.stringify(this.notificationSettings));
  }

  // Navigation methods
  goBack(): void {
    this.router.navigate(['/applicant-dashboard']);
  }

  goToCalendar(): void {
    const d = new Date(this.currentYear, this.currentMonth, 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    this.router.navigate(['/calendar'], { queryParams: { date: dateStr } });
  }

  // Interview management methods
  rescheduleInterview(interview: Interview): void {
    if (confirm(`Are you sure you want to reschedule "${interview.title}"?`)) {
      // Implement reschedule logic
      console.log('Rescheduling interview:', interview);
      alert('Reschedule functionality will be implemented here.');
    }
  }

  cancelInterview(interview: Interview): void {
    if (confirm(`Are you sure you want to cancel "${interview.title}"?`)) {
      this.upcomingInterviews = this.upcomingInterviews.filter(i => i.id !== interview.id);
      console.log('Interview cancelled:', interview);
    }
  }

  // Calendar methods
  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.selectedDate = null;
    this.updateInterviewDates();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.selectedDate = null;
    this.updateInterviewDates();
  }

  updateInterviewDates(): void {
    this.interviewDates = this.allInterviews
      .filter(i => i.date.getFullYear() === this.currentYear && i.date.getMonth() === this.currentMonth)
      .map(i => this.dateOnly(i.date));
  }

  selectDate(date: number): void {
    this.selectedDate = date;
    const selectedDate = new Date(this.currentYear, this.currentMonth, date);
    
    // Find interviews for this date
    this.selectedDayInterviews = [
      ...this.upcomingInterviews.filter(i => this.isSameDate(i.date, selectedDate)),
      ...this.pastInterviews.filter(i => this.isSameDate(i.date, selectedDate))
    ];
    
    this.showDaySummary = true;
  }

  closeDaySummary(): void {
    this.showDaySummary = false;
    this.selectedDate = null;
  }

  // Notification settings methods
  onNotificationTypeChange(): void {
    this.saveNotificationSettings();
  }

  onReminderTimeChange(): void {
    this.saveNotificationSettings();
  }

  // Helper methods
  private dateOnly(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  isInterviewDate(day: number): boolean {
    const d = new Date(this.currentYear, this.currentMonth, day);
    return this.interviewDates.some(idate => idate.getTime() === d.getTime()) ||
           this.upcomingInterviews.some(i => this.isSameDate(i.date, d)) ||
           this.pastInterviews.some(i => this.isSameDate(i.date, d));
  }

  getInterviewTooltip(day: number): string {
    const d = new Date(this.currentYear, this.currentMonth, day);
    const interviews = [
      ...this.upcomingInterviews.filter(i => this.isSameDate(i.date, d)),
      ...this.pastInterviews.filter(i => this.isSameDate(i.date, d))
    ];
    
    if (interviews.length === 0) return '';
    
    return interviews.map(i => `${i.title} at ${i.time}`).join('\n');
  }

  // Computed properties
  get currentMonthLabel(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleString('default', { 
      month: 'long', 
      year: 'numeric' 
    });
  }

  get firstDayOfWeek(): number {
    return new Date(this.currentYear, this.currentMonth, 1).getDay() + 1;
  }

  get daysInMonth(): number[] {
    const days = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  }

  get blanks(): any[] {
    return Array(this.firstDayOfWeek - 1).fill(0);
  }

  // Utility methods
  getInterviewStatusColor(status: string): string {
    switch (status) {
      case 'scheduled': return '#28a745';
      case 'completed': return '#6c757d';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  }

  getInterviewTypeIcon(type?: string): string {
    switch (type) {
      case 'video': return 'video_call';
      case 'in-person': return 'location_on';
      case 'phone': return 'phone';
      default: return 'work';
    }
  }

  formatInterviewDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Statistics methods
  getUpcomingInterviewsCount(): number {
    return this.upcomingInterviews.length;
  }

  getPastInterviewsCount(): number {
    return this.pastInterviews.length;
  }

  getTotalInterviewsCount(): number {
    return this.upcomingInterviews.length + this.pastInterviews.length;
  }
}
