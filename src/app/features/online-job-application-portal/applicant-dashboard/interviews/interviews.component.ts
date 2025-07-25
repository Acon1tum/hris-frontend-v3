import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InterviewService, InterviewInfo } from '../interview.service';

interface Interview {
  title: string;
  time: string;
  date: Date;
}

@Component({
  selector: 'app-interviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.scss']
})
export class InterviewsComponent {
  constructor(private router: Router, private interviewService: InterviewService) {
    this.interviewService.interviews$.subscribe(interviews => {
      this.allInterviews = interviews;
      this.updateInterviewDates();
      this.upcomingInterviews = interviews.map(i => ({
        title: i.jobTitle,
        time: i.time || '',
        date: i.date
      }));
    });
  }
  // Notification settings
  notificationType: string = 'email';
  reminderTime: string = '';
  reminderOptions = [
    { value: '10min', label: '10 minutes before' },
    { value: '30min', label: '30 minutes before' },
    { value: '1hr', label: '1 hour before' },
    { value: '1day', label: '1 day before' }
  ];
  // Calendar state
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  selectedDate: number | null = null;

  weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  interviewDates: Date[] = [];
  allInterviews: InterviewInfo[] = [];
  // Mock interview data (will be replaced by service)
  upcomingInterviews: Interview[] = [];
  pastInterviews: Interview[] = [
    { title: 'Interview with Global Tech Corp.', time: '11:00 AM - 12:00 PM', date: new Date(this.currentYear, this.currentMonth, 2) },
    { title: 'Interview with Digital Dynamics LLC', time: '3:00 PM - 4:00 PM', date: new Date(this.currentYear, this.currentMonth, 3) }
  ];
  selectedDayInterviews: Interview[] = [];
  showDaySummary = false;
  goBack() {
    this.router.navigate(['/applicant-dashboard']);
  }
  syncCalendar() {
    alert('Syncing with external calendar...');
  }
  rescheduleInterview(interview: Interview) {
    alert('Reschedule: ' + interview.title);
  }
  cancelInterview(interview: Interview) {
    if (confirm('Are you sure you want to cancel this interview?')) {
      this.upcomingInterviews = this.upcomingInterviews.filter(i => i !== interview);
    }
  }
  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.selectedDate = null;
    this.updateInterviewDates();
  }
  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.selectedDate = null;
    this.updateInterviewDates();
  }
  updateInterviewDates() {
    this.interviewDates = this.allInterviews
      .filter(i => i.date.getFullYear() === this.currentYear && i.date.getMonth() === this.currentMonth)
      .map(i => this.dateOnly(i.date));
  }
  selectDate(date: number) {
    this.selectedDate = date;
    const d = new Date(this.currentYear, this.currentMonth, date);
    // Navigate to calendar page with date as query param
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    this.router.navigate(['/calendar'], { queryParams: { date: dateStr } });
  }
  goToCalendar() {
    // Navigate to calendar page for the current month
    const d = new Date(this.currentYear, this.currentMonth, 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    this.router.navigate(['/calendar'], { queryParams: { date: dateStr } });
  }

  closeDaySummary() {
    this.showDaySummary = false;
  }
  get currentMonthLabel(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' });
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
  // Helper to compare only date part
  dateOnly(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  isInterviewDate(day: number): boolean {
    const d = new Date(this.currentYear, this.currentMonth, day);
    return this.interviewDates.some(idate => idate.getTime() === d.getTime());
  }
  getInterviewTooltip(day: number): string {
    const d = new Date(this.currentYear, this.currentMonth, day);
    const interview = this.upcomingInterviews.find(i => {
      const idate = new Date(i.date.getFullYear(), i.date.getMonth(), i.date.getDate());
      return idate.getTime() === d.getTime();
    });
    return interview ? `${interview.title} at ${interview.date.toLocaleDateString()}\n${interview.time}` : '';
  }
}
