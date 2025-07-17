import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { InactivityService } from '../../../services/inactivity.service';

@Component({
  selector: 'app-session-warning-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-warning-dialog.component.html',
  styleUrls: ['./session-warning-dialog.component.scss']
})
export class SessionWarningDialogComponent implements OnInit, OnDestroy {
  isVisible = false;
  timeLeft = 0;
  private subscriptions: Subscription[] = [];

  constructor(private inactivityService: InactivityService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.inactivityService.isWarningShown$.subscribe(isShowing => {
        this.isVisible = isShowing;
      })
    );

    this.subscriptions.push(
      this.inactivityService.timeLeft$.subscribe(timeLeft => {
        this.timeLeft = timeLeft;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  extendSession(): void {
    this.inactivityService.extendSession();
  }

  logout(): void {
    this.inactivityService.forceLogout();
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
} 