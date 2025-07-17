import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-learning-development',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class LearningDevelopmentComponent {
  title = 'Learning & Development';
  learningFeatures = [
    { name: 'Training Programs', description: 'Enroll in and manage training sessions', icon: '🎓' },
    { name: 'Course Catalog', description: 'Browse available courses and materials', icon: '📚' },
    { name: 'Progress Tracking', description: 'Track learning progress and achievements', icon: '📈' },
    { name: 'Certifications', description: 'Manage and verify certifications', icon: '📜' },
    { name: 'Learning Paths', description: 'Personalized learning journeys', icon: '🛤️' },
    { name: 'Feedback & Assessment', description: 'Assessments and feedback for courses', icon: '📝' }
  ];
} 