import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

enum ReportType {
  EMPLOYEE = 'employee',
  PAYROLL = 'payroll',
  ATTENDANCE = 'attendance',
  LEAVE = 'leave',
  PERFORMANCE = 'performance',
  CUSTOM = 'custom'
}

export interface AuditTrail {
  id: string;
  reportName: string;
  reportType: ReportType | string;
  generatedBy: string;
  generatedAt: Date;
  department: string;
  action: string;
  fileSize: string;
  downloadCount: number;
  status: string;
  ipAddress: string;
  userAgent: string;
  filters: string[];
  templateUsed: string;
  // New fields for report data
  exportFormat?: 'csv' | 'excel' | 'pdf' | 'print';
  reportData?: {
    headers: string[];
    rows: any[][];
    totalRecords: number;
    totalValue?: number;
  };
  reportMetadata?: {
    dateRange: string;
    department: string;
    reportType: string;
    appliedFilters: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuditTrailService {
  private auditTrailsSubject = new BehaviorSubject<AuditTrail[]>([]);
  public auditTrails$ = this.auditTrailsSubject.asObservable();

  constructor() { }

  // Get current audit trails
  getAuditTrails(): AuditTrail[] {
    return this.auditTrailsSubject.value;
  }

  // Add new audit trail entry
  addAuditTrailEntry(auditEntry: AuditTrail): void {
    console.log('Service: Adding audit trail entry:', auditEntry);
    const currentTrails = this.auditTrailsSubject.value;
    console.log('Service: Current trails count:', currentTrails.length);
    const updatedTrails = [auditEntry, ...currentTrails]; // Add to beginning
    
    // Optional: Limit the number of entries to prevent memory issues
    if (updatedTrails.length > 1000) {
      updatedTrails.splice(1000);
    }
    
    console.log('Service: Updated trails count:', updatedTrails.length);
    this.auditTrailsSubject.next(updatedTrails);
    console.log('Service: New audit trail entry added via service:', auditEntry);
  }

  // Clear all audit trails
  clearAuditTrails(): void {
    this.auditTrailsSubject.next([]);
  }

  // Delete specific audit trail
  deleteAuditTrail(id: string): void {
    const currentTrails = this.auditTrailsSubject.value;
    const updatedTrails = currentTrails.filter(trail => trail.id !== id);
    this.auditTrailsSubject.next(updatedTrails);
  }

  // Update audit trail
  updateAuditTrail(id: string, updates: Partial<AuditTrail>): void {
    const currentTrails = this.auditTrailsSubject.value;
    const updatedTrails = currentTrails.map(trail => 
      trail.id === id ? { ...trail, ...updates } : trail
    );
    this.auditTrailsSubject.next(updatedTrails);
  }
} 