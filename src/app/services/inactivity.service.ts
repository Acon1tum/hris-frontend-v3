import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, fromEvent, merge, timer } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  private readonly INACTIVITY_TIMEOUT = environment.session.inactivityTimeout;
  private readonly WARNING_TIME = environment.session.warningTime;
  private readonly CHECK_INTERVAL = environment.session.checkInterval;

  private isWarningShownSubject = new BehaviorSubject<boolean>(false);
  private timeLeftSubject = new BehaviorSubject<number>(0);
  private isActiveSubject = new BehaviorSubject<boolean>(true);

  public isWarningShown$ = this.isWarningShownSubject.asObservable();
  public timeLeft$ = this.timeLeftSubject.asObservable();
  public isActive$ = this.isActiveSubject.asObservable();

  private lastActivity: number = Date.now();
  private warningTimer?: any;
  private checkTimer?: any;
  private isInitialized = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  initialize(): void {
    if (this.isInitialized) return;
    
    this.isInitialized = true;
    this.setupActivityListeners();
    this.startInactivityCheck();
    this.resetTimer();
  }

  destroy(): void {
    this.isInitialized = false;
    this.stopTimers();
    this.isWarningShownSubject.next(false);
    this.isActiveSubject.next(true);
  }

  resetTimer(): void {
    this.lastActivity = Date.now();
    this.isWarningShownSubject.next(false);
    this.isActiveSubject.next(true);
    
    // Clear existing warning timer
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
    }

    // Set new warning timer
    this.warningTimer = setTimeout(() => {
      this.showWarning();
    }, this.INACTIVITY_TIMEOUT - this.WARNING_TIME);
  }

  extendSession(): void {
    this.resetTimer();
  }

  getTimeUntilWarning(): number {
    const timeSinceLastActivity = Date.now() - this.lastActivity;
    const timeUntilWarning = (this.INACTIVITY_TIMEOUT - this.WARNING_TIME) - timeSinceLastActivity;
    return Math.max(0, timeUntilWarning);
  }

  getTimeUntilLogout(): number {
    const timeSinceLastActivity = Date.now() - this.lastActivity;
    const timeUntilLogout = this.INACTIVITY_TIMEOUT - timeSinceLastActivity;
    return Math.max(0, timeUntilLogout);
  }

  private setupActivityListeners(): void {
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    const eventStreams = events.map(event => fromEvent(document, event));
    
    merge(...eventStreams)
      .pipe(
        debounceTime(500) // Debounce to avoid excessive resets
      )
      .subscribe(() => {
        this.ngZone.run(() => {
          this.resetTimer();
        });
      });
  }

  private startInactivityCheck(): void {
    this.checkTimer = setInterval(() => {
      this.ngZone.run(() => {
        const timeUntilLogout = this.getTimeUntilLogout();
        
        if (timeUntilLogout <= 0) {
          this.performLogout();
        } else if (timeUntilLogout <= this.WARNING_TIME) {
          this.timeLeftSubject.next(Math.ceil(timeUntilLogout / 1000));
          if (!this.isWarningShownSubject.value) {
            this.showWarning();
          }
        }
      });
    }, this.CHECK_INTERVAL);
  }

  private showWarning(): void {
    this.isWarningShownSubject.next(true);
    this.isActiveSubject.next(false);
  }

  private performLogout(): void {
    this.stopTimers();
    
    // Get current user before logout
    const currentUser = this.authService.getCurrentUser();
    const isApplicant = currentUser && currentUser.role === 'Applicant';
    
    this.authService.logout('session_timeout');
    
    // Redirect based on user role
    if (isApplicant) {
      this.router.navigate(['/online-job-login'], {
        queryParams: { reason: 'session_timeout' }
      });
    } else {
      this.router.navigate(['/login'], {
        queryParams: { reason: 'session_timeout' }
      });
    }
  }

  private stopTimers(): void {
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = undefined;
    }
    
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = undefined;
    }
  }

  // Public methods for manual control
  forceLogout(): void {
    this.performLogout();
  }

  isUserActive(): boolean {
    return this.isActiveSubject.value;
  }

  getInactivityTime(): number {
    return Date.now() - this.lastActivity;
  }

  // Configuration methods
  setInactivityTimeout(milliseconds: number): void {
    // This would typically be called from a settings service
    // For now, this is just a placeholder for future enhancement
    console.warn('Dynamic timeout configuration not implemented yet');
  }
} 