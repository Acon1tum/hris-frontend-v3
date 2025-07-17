import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DigitalFootprintSummary {
  totalLogins: number;
  wellnessActivities: number;
  lastActive: string;
}

interface DigitalActivity {
  date: string;
  activity: string;
  details: string;
}

@Component({
  selector: 'app-digital-footprint',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './digital-footprint.component.html',
  styleUrls: ['./digital-footprint.component.scss']
})
export class DigitalFootprintComponent implements OnInit {
  loading = true;
  summary: DigitalFootprintSummary | null = null;
  activities: DigitalActivity[] = [];

  ngOnInit(): void {
    this.fetchDigitalFootprint();
  }

  fetchDigitalFootprint() {
    // Simulate API call
    setTimeout(() => {
      this.summary = {
        totalLogins: 42,
        wellnessActivities: 15,
        lastActive: '2024-06-10 14:23',
      };
      this.activities = [
        { date: '2024-06-10', activity: 'Login', details: 'Web Portal' },
        { date: '2024-06-09', activity: 'Completed Wellness Survey', details: 'Monthly Check-in' },
        { date: '2024-06-08', activity: 'Joined Yoga Session', details: 'Health & Wellness Program' },
        { date: '2024-06-07', activity: 'Login', details: 'Mobile App' },
        { date: '2024-06-06', activity: 'Viewed Health Tips', details: 'Article: Healthy Eating' },
      ];
      this.loading = false;
    }, 1200);
  }
} 