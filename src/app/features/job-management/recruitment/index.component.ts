import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recruitment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class RecruitmentComponent {
  title = 'Recruitment';
  recruitmentFeatures = [
    { name: 'Job Posting', description: 'Create and manage job openings', icon: '📢' },
    { name: 'Applicant Tracking', description: 'Track applicants and their status', icon: '📝' },
    { name: 'Interview Scheduling', description: 'Schedule and manage interviews', icon: '📅' },
    { name: 'Resume Management', description: 'Store and review applicant resumes', icon: '📄' },
    { name: 'Offer Letters', description: 'Generate and send offer letters', icon: '✉️' },
    { name: 'Recruitment Analytics', description: 'Analyze recruitment data and trends', icon: '📊' }
  ];
} 