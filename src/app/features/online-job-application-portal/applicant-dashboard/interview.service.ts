import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface InterviewInfo {
  id: string;
  jobTitle: string;
  company: string;
  date: Date;
  time?: string;
  status?: string; // Add status for color coding
  department?: string; // Add department for modal display
}

@Injectable({ providedIn: 'root' })
export class InterviewService {
  private interviewsSubject = new BehaviorSubject<InterviewInfo[]>([]);
  interviews$ = this.interviewsSubject.asObservable();

  setInterviews(interviews: InterviewInfo[]) {
    this.interviewsSubject.next(interviews);
  }

  getInterviews(): InterviewInfo[] {
    return this.interviewsSubject.getValue();
  }
} 