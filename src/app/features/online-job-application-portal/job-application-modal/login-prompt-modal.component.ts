import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-prompt-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="header-content">
            <div class="job-info">
              <h2 class="modal-title">Login Required</h2>
              <p class="job-position" *ngIf="job">{{ job.position_title }}</p>
              <p class="job-department" *ngIf="job">{{ job.department?.department_name }}</p>
            </div>
            <button class="close-btn" (click)="closeModal()" aria-label="Close modal">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <div class="login-prompt-content">
            <div class="icon-section">
              <span class="material-symbols-outlined login-icon">login</span>
            </div>
            
            <div class="message-section">
              <h3>Login to Apply</h3>
              <p>You need to be logged in as an applicant to apply for this position. Please log in or create an account to continue.</p>
            </div>

            <div class="job-summary" *ngIf="job">
              <h4>Job Details:</h4>
              <div class="job-info-grid">
                <div class="info-item">
                  <span class="label">Position:</span>
                  <span class="value">{{ job.position_title }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Department:</span>
                  <span class="value">{{ job.department?.department_name }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Type:</span>
                  <span class="value">{{ job.employment_type }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Salary:</span>
                  <span class="value">{{ job.salary_range }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <div class="footer-actions">
            <button 
              type="button" 
              class="btn btn-secondary" 
              (click)="closeModal()"
            >
              Cancel
            </button>

            <button 
              type="button" 
              class="btn btn-primary" 
              (click)="navigateToLogin()"
            >
              <span class="material-symbols-outlined">login</span>
              Continue to Login
            </button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }

    .modal-content {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      width: 90%;
      max-width: 500px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 24px 32px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
    }

    .job-info {
      flex: 1;
    }

    .modal-title {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 600;
      color: white;
    }

    .job-position {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 500;
      opacity: 0.9;
    }

    .job-department {
      margin: 0;
      font-size: 14px;
      opacity: 0.8;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .modal-body {
      padding: 32px;
    }

    .login-prompt-content {
      text-align: center;
    }

    .icon-section {
      margin-bottom: 24px;
    }

    .login-icon {
      font-size: 64px;
      color: #667eea;
    }

    .message-section h3 {
      margin: 0 0 16px 0;
      font-size: 20px;
      color: #2c3e50;
    }

    .message-section p {
      margin: 0 0 24px 0;
      color: #6c757d;
      line-height: 1.6;
    }

    .job-summary {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      margin-top: 24px;
      text-align: left;
    }

    .job-summary h4 {
      margin: 0 0 16px 0;
      color: #2c3e50;
      font-size: 16px;
    }

    .job-info-grid {
      display: grid;
      gap: 8px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .label {
      font-weight: 500;
      color: #6c757d;
      font-size: 14px;
    }

    .value {
      color: #2c3e50;
      font-weight: 500;
      font-size: 14px;
    }

    .modal-footer {
      padding: 24px 32px;
      background-color: #f8f9fa;
      border-top: 1px solid #e9ecef;
    }

    .footer-actions {
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #5a6268;
      transform: translateY(-1px);
    }

    .btn-primary {
      background-color: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background-color: #5a6fd8;
      transform: translateY(-1px);
    }

    .material-symbols-outlined {
      font-size: 18px;
    }

    @media (max-width: 768px) {
      .modal-content {
        width: 95%;
        margin: 20px;
      }

      .modal-header {
        padding: 20px;
      }

      .modal-body {
        padding: 20px;
      }

      .modal-footer {
        padding: 20px;
      }

      .footer-actions {
        flex-direction: column;
        gap: 12px;
      }

      .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class LoginPromptModalComponent {
  @Input() job: any;
  @Input() showModal: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() continueToLogin = new EventEmitter<void>();

  constructor(private router: Router) {}

  closeModal(): void {
    this.close.emit();
  }

  navigateToLogin(): void {
    this.continueToLogin.emit();
    this.router.navigate(['/online-job-login']);
  }
} 