import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InterviewService, InterviewInfo } from '../interview.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  selectedDate: Date = new Date();
  miniMonth: number = new Date().getMonth();
  miniYear: number = new Date().getFullYear();
  mainMonth: number = new Date().getMonth();
  mainYear: number = new Date().getFullYear();
  weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  allInterviews: InterviewInfo[] = [];
  miniInterviewDays: number[] = [];
  mainInterviewDays: number[] = [];
  selectedDayInterviews: InterviewInfo[] = [];
  showModal = false;
  modalInterview: InterviewInfo | null = null;
  viewModes = [
    { label: 'Day', shortcut: 'D' },
    { label: 'Week', shortcut: 'W' },
    { label: 'Month', shortcut: 'M' },
    { label: 'Year', shortcut: 'Y' },
    { label: 'Schedule', shortcut: 'A' },
    { label: '4 days', shortcut: 'X' },
  ];
  viewModeLabel = 'Day';
  showViewDropdown = false;
  viewMode: string = 'Day';
  get showDayView() {
    return this.viewMode === 'Day';
  }
  get showWeekView() {
    return this.viewMode === 'Week';
  }
  get weekStartDate(): Date {
    // Start week on Monday
    const date = new Date(this.selectedDate);
    const day = date.getDay();
    const diff = (day === 0 ? -6 : 1) - day; // Monday as 0
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);
    return monday;
  }
  get weekViewDays(): Date[] {
    const start = this.weekStartDate;
    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }
  isSelectedWeekDay(day: Date): boolean {
    return day.getFullYear() === this.selectedDate.getFullYear() &&
      day.getMonth() === this.selectedDate.getMonth() &&
      day.getDate() === this.selectedDate.getDate();
  }
  hours = Array.from({ length: 24 }, (_, i) => i);
  showCalendars = true;
  toggleCalendars() {
    this.showCalendars = !this.showCalendars;
  }

  constructor(private route: ActivatedRoute, private interviewService: InterviewService, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params['date']) {
        this.selectedDate = new Date(params['date']);
        this.mainMonth = this.selectedDate.getMonth();
        this.mainYear = this.selectedDate.getFullYear();
      }
    });
    this.interviewService.interviews$.subscribe(interviews => {
      this.allInterviews = interviews;
      this.updateInterviewMarkers();
      this.updateSelectedDayInterviews();
    });
  }

  updateInterviewMarkers() {
    this.miniInterviewDays = this.allInterviews
      .filter(i => i.date.getFullYear() === this.miniYear && i.date.getMonth() === this.miniMonth)
      .map(i => i.date.getDate());
    this.mainInterviewDays = this.allInterviews
      .filter(i => i.date.getFullYear() === this.mainYear && i.date.getMonth() === this.mainMonth)
      .map(i => i.date.getDate());
  }

  updateSelectedDayInterviews() {
    this.selectedDayInterviews = this.allInterviews.filter(i =>
      i.date.getFullYear() === this.selectedDate.getFullYear() &&
      i.date.getMonth() === this.selectedDate.getMonth() &&
      i.date.getDate() === this.selectedDate.getDate()
    );
  }

  getMiniDayInterviews(day: number): InterviewInfo[] {
    return this.allInterviews.filter(i =>
      i.date.getFullYear() === this.miniYear &&
      i.date.getMonth() === this.miniMonth &&
      i.date.getDate() === day
    );
  }
  getMainDayInterviews(day: number): InterviewInfo[] {
    return this.allInterviews.filter(i =>
      i.date.getFullYear() === this.mainYear &&
      i.date.getMonth() === this.mainMonth &&
      i.date.getDate() === day
    );
  }
  getStatusColor(status: string): string {
    switch ((status || '').toLowerCase()) {
      case 'accepted': return '#22c55e'; // green
      case 'rejected': return '#ef4444'; // red
      case 'interviewed': return '#2563eb'; // blue
      case 'pending': return '#f59e0b'; // yellow
      case 'shortlisted': return '#10b981'; // teal
      default: return '#2563eb'; // default blue
    }
  }
  openInterviewModal(interview: InterviewInfo) {
    this.modalInterview = interview;
    this.showModal = true;
  }
  closeInterviewModal() {
    this.showModal = false;
    this.modalInterview = null;
  }

  getMiniMonthLabel(): string {
    return new Date(this.miniYear, this.miniMonth).toLocaleString('default', { month: 'long', year: 'numeric' });
  }
  getMainMonthLabel(): string {
    return new Date(this.mainYear, this.mainMonth).toLocaleString('default', { month: 'long', year: 'numeric' });
  }
  getMiniFirstDayOfWeek(): number {
    return new Date(this.miniYear, this.miniMonth, 1).getDay();
  }
  getMiniDaysInMonth(): number[] {
    const days = new Date(this.miniYear, this.miniMonth + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  }
  getMainFirstDayOfWeek(): number {
    return new Date(this.mainYear, this.mainMonth, 1).getDay();
  }
  getMainDaysInMonth(): number[] {
    const days = new Date(this.mainYear, this.mainMonth + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  }
  prevMiniMonth() {
    if (this.miniMonth === 0) {
      this.miniMonth = 11;
      this.miniYear--;
    } else {
      this.miniMonth--;
    }
    this.updateInterviewMarkers();
  }
  nextMiniMonth() {
    if (this.miniMonth === 11) {
      this.miniMonth = 0;
      this.miniYear++;
    } else {
      this.miniMonth++;
    }
    this.updateInterviewMarkers();
  }
  prevMainMonth() {
    if (this.mainMonth === 0) {
      this.mainMonth = 11;
      this.mainYear--;
    } else {
      this.mainMonth--;
    }
    this.selectedDate = new Date(this.mainYear, this.mainMonth, 1);
    this.updateInterviewMarkers();
    this.updateSelectedDayInterviews();
  }
  nextMainMonth() {
    if (this.mainMonth === 11) {
      this.mainMonth = 0;
      this.mainYear++;
    } else {
      this.mainMonth++;
    }
    this.selectedDate = new Date(this.mainYear, this.mainMonth, 1);
    this.updateInterviewMarkers();
    this.updateSelectedDayInterviews();
  }
  selectMiniDate(day: number) {
    this.selectedDate = new Date(this.miniYear, this.miniMonth, day);
    this.mainMonth = this.miniMonth;
    this.mainYear = this.miniYear;
    this.updateSelectedDayInterviews();
  }
  selectMainDate(day: number) {
    this.selectedDate = new Date(this.mainYear, this.mainMonth, day);
    this.updateSelectedDayInterviews();
  }
  isSelectedMiniDate(day: number): boolean {
    return this.selectedDate.getFullYear() === this.miniYear && this.selectedDate.getMonth() === this.miniMonth && this.selectedDate.getDate() === day;
  }
  isSelectedMainDate(day: number): boolean {
    return this.selectedDate.getFullYear() === this.mainYear && this.selectedDate.getMonth() === this.mainMonth && this.selectedDate.getDate() === day;
  }
  isMiniInterviewDay(day: number): boolean {
    return this.miniInterviewDays.includes(day);
  }
  isMainInterviewDay(day: number): boolean {
    return this.mainInterviewDays.includes(day);
  }
  goBack() {
    this.router.navigate(['/applicant-interviews']);
  }
  goToToday() {
    const today = new Date();
    this.selectedDate = today;
    this.mainMonth = today.getMonth();
    this.mainYear = today.getFullYear();
    this.miniMonth = today.getMonth();
    this.miniYear = today.getFullYear();
    this.updateSelectedDayInterviews();
  }

  toggleViewDropdown() {
    this.showViewDropdown = !this.showViewDropdown;
  }
  selectViewMode(mode: { label: string; shortcut: string }) {
    this.viewModeLabel = mode.label;
    this.viewMode = mode.label;
    this.showViewDropdown = false;
  }
  isToday(day: Date): boolean {
    const now = new Date();
    return day.getFullYear() === now.getFullYear() &&
      day.getMonth() === now.getMonth() &&
      day.getDate() === now.getDate();
  }
  getCurrentTimeTop(): string {
    const now = new Date();
    const hour = now.getHours();
    const min = now.getMinutes();
    const pxPerHour = 48; // 48px per hour (h-12)
    return `${(hour + min / 60) * pxPerHour}px`;
  }
  getInterviewHour(interview: InterviewInfo): number {
    // Try to parse hour from interview.time (e.g., '10:00 AM - 11:00 AM') or use interview.date
    if (interview.time) {
      const match = interview.time.match(/(\d{1,2}):(\d{2})? ?(AM|PM)/i);
      if (match) {
        let hour = parseInt(match[1], 10);
        const ampm = match[3].toUpperCase();
        if (ampm === 'PM' && hour !== 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
        return hour;
      }
    }
    return interview.date.getHours();
  }
  getInterviewsForDay(day: Date): InterviewInfo[] {
    return this.allInterviews.filter(i =>
      i.date.getFullYear() === day.getFullYear() &&
      i.date.getMonth() === day.getMonth() &&
      i.date.getDate() === day.getDate()
    );
  }
}
