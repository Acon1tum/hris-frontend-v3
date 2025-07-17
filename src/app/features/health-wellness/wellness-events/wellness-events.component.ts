import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface WellnessEvent {
  title: string;
  icon: string;
  location: string;
  date: string;
  time: string;
}

@Component({
  selector: 'app-wellness-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wellness-events.component.html',
  styleUrls: ['./wellness-events.component.scss']
})
export class WellnessEventsComponent {
  constructor(private router: Router) {}

  // Calendar state
  currentMonth: number = new Date().getMonth(); // 0-indexed
  currentYear: number = new Date().getFullYear();
  weekDays: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Events grouped by month
  eventsByMonth = [
    {
      label: 'July 2024',
      events: [
        {
          title: 'Mindfulness Meditation Workshop',
          icon: 'videocam',
          location: 'Virtual',
          date: 'July 15, 2024',
          time: '10:00 AM - 11:00 AM',
        },
        {
          title: 'Healthy Eating Seminar',
          icon: 'location_on',
          location: 'Conference Room A',
          date: 'July 18, 2024',
          time: '12:00 PM - 1:00 PM',
        },
        {
          title: 'Stress Management Webinar',
          icon: 'videocam',
          location: 'Virtual',
          date: 'July 22, 2024',
          time: '2:00 PM - 3:00 PM',
        },
      ]
    },
    {
      label: 'August 2024',
      events: [
        {
          title: 'Morning Yoga Session',
          icon: 'fitness_center',
          location: 'Gym',
          date: 'August 5, 2024',
          time: '9:00 AM - 10:00 AM',
        },
        {
          title: 'Financial Wellness Talk',
          icon: 'videocam',
          location: 'Virtual',
          date: 'August 12, 2024',
          time: '11:00 AM - 12:00 PM',
        },
        {
          title: 'Team Building Activity',
          icon: 'deck',
          location: 'Outdoor Space',
          date: 'August 19, 2024',
          time: '3:00 PM - 4:00 PM',
        },
      ]
    }
  ];

  // Generate the days grid for the current month
  get calendarDays(): (number | null)[] {
    const days: (number | null)[] = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const numDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    // Fill initial empty slots
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Fill days of the month
    for (let d = 1; d <= numDays; d++) {
      days.push(d);
    }
    return days;
  }

  // Calendar navigation
  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  }
  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
  }

  // Highlight today
  isToday(day: number | null): boolean {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      this.currentMonth === today.getMonth() &&
      this.currentYear === today.getFullYear()
    );
  }

  // Register for an event
  register(event: WellnessEvent) {
    alert(`You have registered for: ${event.title}`);
  }

  // Add event to calendar
  addToCalendar(event: WellnessEvent) {
    alert(`Added to calendar: ${event.title}`);
  }

  // Go back to Health & Wellness dashboard
  goBack() {
    this.router.navigate(['/health-wellness']);
  }

  // Scroll to top on component init
  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get weekMonthYear(): string {
    const date = new Date(this.currentYear, this.currentMonth);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }
} 