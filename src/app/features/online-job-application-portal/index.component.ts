import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-online-job-application-portal',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class OnlineJobApplicationPortalComponent implements OnInit {
  publicMode = false;
  jobs = [
    {
      title: 'Customer Service Specialist "Email Support"',
      company: 'AlphaMeta',
      location: 'Metro Manila (Remote)',
      salary: '₱38,000 – ₱48,000 per month',
      tags: [],
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Bitmap_Icon.png',
      date: '18d ago'
    },
    {
      title: 'No More Graveyard Shifts! - Work from Home Virtual Assistant',
      company: 'The Freedom Geek',
      location: 'Metro Manila (Remote)',
      salary: '₱32,000 – ₱48,000 per month',
      tags: [
        'Work from Home in Comfort & with Convenience',
        'Flexible Hours & Work-Life Balance',
        'Part-Time or Full-Time: Choose What Suits You'
      ],
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Bitmap_Icon.png',
      date: '20d ago'
    },
    {
      title: 'Collections Representative (Work from Home)',
      company: 'Michael & Associates',
      location: 'Metro Manila (Remote)',
      salary: '₱50,000 – ₱60,000 per month',
      tags: [
        'Permanent Work from Home set-up',
        'Career Growth Potential',
        'Competitive Salary - Based on experience'
      ],
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Bitmap_Icon.png',
      date: '24d ago'
    },
    {
      title: 'Sales Representative (Work At Home)',
      company: 'Branders (Philippines) Inc.',
      location: 'Ortigas, Metro Manila (Remote)',
      salary: '₱30,000 – ₱50,000 per month',
      tags: [
        'Work from home',
        'Commissions',
        'Work-life balance'
      ],
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Bitmap_Icon.png',
      date: '26d ago'
    }
  ];
  ngOnInit() {
    this.publicMode = localStorage.getItem('jobPortalPublicMode') === 'true';
  }
}
 