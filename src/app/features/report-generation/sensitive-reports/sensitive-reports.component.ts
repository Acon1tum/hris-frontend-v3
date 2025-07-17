import { Component, Renderer2, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

// Data models
interface SensitiveReport {
  id: string;
  name: string;
  description: string;
  reportType: string;
  sensitivityLevel: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  dataFields: string[];
  retentionPolicy: string;
  encryptionRequired: boolean;
  watermarkEnabled: boolean;
  accessLogging: boolean;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  status: string;
}

interface RoleAccess {
  id: string;
  roleName: string;
  roleDescription: string;
  permissions: { [key: string]: boolean };
  restrictions: any;
  assignedReports: string[];
  assignedBy: string;
  assignedAt: Date;
  expiresAt?: Date;
  status: string;
}

interface AccessRequest {
  id: string;
  requester: string;
  requesterRole: string;
  requesterDepartment: string;
  reportId: string;
  reportName: string;
  requestedPermissions: string[];
  reason: string;
  urgency: string;
  requestedAt: Date;
  status: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  expiresAt?: Date;
}

@Component({
  selector: 'app-sensitive-reports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sensitive-reports.component.html',
  styleUrls: ['./sensitive-reports.component.scss']
})
export class SensitiveReportsComponent {
  // Mock data (copy from your provided code)
  sensitiveReports: SensitiveReport[] = [
    {
      id: '1',
      name: 'Executive Compensation Report',
      description: 'Detailed compensation analysis for C-level executives',
      reportType: 'payroll',
      sensitivityLevel: 'critical',
      category: 'payroll',
      dataFields: ['salary', 'bonus', 'stock_options', 'benefits', 'tax_info'],
      retentionPolicy: '7 years',
      encryptionRequired: true,
      watermarkEnabled: true,
      accessLogging: true,
      createdBy: 'admin@company.com',
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'active'
    },
    {
      id: '2',
      name: 'Employee Performance Evaluations',
      description: 'Comprehensive performance reviews and ratings',
      reportType: 'performance',
      sensitivityLevel: 'high',
      category: 'performance',
      dataFields: ['performance_rating', 'goals', 'feedback', 'improvement_areas'],
      retentionPolicy: '3 years',
      encryptionRequired: true,
      watermarkEnabled: true,
      accessLogging: true,
      createdBy: 'admin@company.com',
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'active'
    },
    {
      id: '3',
      name: 'Financial Compliance Audit',
      description: 'Internal audit reports for financial compliance',
      reportType: 'custom',
      sensitivityLevel: 'high',
      category: 'compliance',
      dataFields: ['audit_findings', 'compliance_status', 'risk_assessment', 'recommendations'],
      retentionPolicy: '10 years',
      encryptionRequired: true,
      watermarkEnabled: true,
      accessLogging: true,
      createdBy: 'admin@company.com',
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'active'
    },
    {
      id: '4',
      name: 'Employee Personal Data Export',
      description: 'Complete employee personal information export',
      reportType: 'employee',
      sensitivityLevel: 'critical',
      category: 'personal',
      dataFields: ['ssn', 'address', 'phone', 'emergency_contact', 'medical_info'],
      retentionPolicy: '1 year',
      encryptionRequired: true,
      watermarkEnabled: true,
      accessLogging: true,
      createdBy: 'admin@company.com',
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'active'
    }
  ];

  roleAccess: RoleAccess[] = [
    {
      id: '1',
      roleName: 'HR Manager',
      roleDescription: 'Human Resources department managers',
      permissions: {
        view: true, generate: true, export: true, print: true, schedule: true, share: false, delete: false
      },
      restrictions: {
        timeRestrictions: 'Business hours only',
        ipRestrictions: ['192.168.1.0/24'],
        dataMasking: ['ssn', 'salary']
      },
      assignedReports: ['2', '4'],
      assignedBy: 'admin@company.com',
      assignedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: 'active'
    },
    {
      id: '2',
      roleName: 'Finance Director',
      roleDescription: 'Finance department directors',
      permissions: {
        view: true, generate: true, export: true, print: true, schedule: true, share: false, delete: false
      },
      restrictions: {
        timeRestrictions: 'Business hours only',
        ipRestrictions: ['192.168.2.0/24'],
        dataMasking: ['ssn']
      },
      assignedReports: ['1', '3'],
      assignedBy: 'admin@company.com',
      assignedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: 'active'
    },
    {
      id: '3',
      roleName: 'Department Head',
      roleDescription: 'Department heads and supervisors',
      permissions: {
        view: true, generate: false, export: false, print: true, schedule: false, share: false, delete: false
      },
      restrictions: {
        timeRestrictions: 'Business hours only',
        dataMasking: ['ssn', 'salary', 'bonus']
      },
      assignedReports: ['2'],
      assignedBy: 'admin@company.com',
      assignedAt: new Date(),
      expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      status: 'active'
    }
  ];

  accessRequests: AccessRequest[] = [
    {
      id: '1',
      requester: 'john.manager@company.com',
      requesterRole: 'Department Head',
      requesterDepartment: 'Operations',
      reportId: '2',
      reportName: 'Employee Performance Evaluations',
      requestedPermissions: ['view', 'export'],
      reason: 'Need to review team performance for quarterly planning',
      urgency: 'medium',
      requestedAt: new Date(Date.now() - 86400000),
      status: 'pending'
    },
    {
      id: '2',
      requester: 'sarah.finance@company.com',
      requesterRole: 'Finance Analyst',
      requesterDepartment: 'Finance',
      reportId: '1',
      reportName: 'Executive Compensation Report',
      requestedPermissions: ['view', 'generate'],
      reason: 'Required for annual budget planning and analysis',
      urgency: 'high',
      requestedAt: new Date(Date.now() - 172800000),
      status: 'approved',
      reviewedBy: 'admin@company.com',
      reviewedAt: new Date(Date.now() - 86400000),
      reviewNotes: 'Approved for budget planning purposes',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      requester: 'mike.hr@company.com',
      requesterRole: 'HR Specialist',
      requesterDepartment: 'Human Resources',
      reportId: '4',
      reportName: 'Employee Personal Data Export',
      requestedPermissions: ['view', 'export'],
      reason: 'Required for compliance audit and data verification',
      urgency: 'urgent',
      requestedAt: new Date(Date.now() - 3600000),
      status: 'pending'
    }
  ];

  // Modal states and selected items
  showViewRoleModal = false;
  showAssignRoleModal = false;
  showRevokeRoleModal = false;
  showCreateReportModal = false;
  showEditReportModal = false;
  showDeleteReportModal = false;
  showEditRoleModal = false;
  showDeleteRoleModal = false;
  selectedRole: RoleAccess | null = null;
  selectedRequest: AccessRequest | null = null;
  selectedReport: SensitiveReport | null = null;
  selectedRoleEdit: RoleAccess | null = null;
  editRoleForm: FormGroup;

  assignRoleForm: FormGroup;
  reportForm: FormGroup;

  showViewRequestModal = false;
  showEditRequestModal = false;
  showDeleteRequestModal = false;
  selectedRequestEdit: AccessRequest | null = null;
  editRequestForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.assignRoleForm = this.fb.group({
      roleName: ['', Validators.required],
      roleDescription: [''],
      permissions: ['', Validators.required],
      restrictions: ['']
    });
    this.reportForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      reportType: ['', Validators.required],
      sensitivityLevel: ['', Validators.required],
      category: ['', Validators.required],
      dataFields: [''],
      retentionPolicy: ['', Validators.required],
      encryptionRequired: [false],
      watermarkEnabled: [false],
      accessLogging: [false]
    });
    this.editRoleForm = this.fb.group({
      roleName: ['', Validators.required],
      roleDescription: [''],
      permissions: ['', Validators.required],
      restrictions: ['']
    });
    this.editRequestForm = this.fb.group({
      requester: ['', Validators.required],
      requesterRole: ['', Validators.required],
      requesterDepartment: ['', Validators.required],
      reportName: ['', Validators.required],
      requestedPermissions: ['', Validators.required],
      reason: ['', Validators.required],
      urgency: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  // Utility to check if any modal is open
  get isAnyModalOpen(): boolean {
    return this.showViewRoleModal || this.showAssignRoleModal || this.showRevokeRoleModal || this.showCreateReportModal || this.showEditReportModal || this.showDeleteReportModal || this.showEditRoleModal || this.showDeleteRoleModal || this.showViewRequestModal || this.showEditRequestModal || this.showDeleteRequestModal;
  }

  ngDoCheck() {
    if (this.isAnyModalOpen) {
      this.renderer.addClass(this.document.body, 'modal-open');
    } else {
      this.renderer.removeClass(this.document.body, 'modal-open');
    }
  }

  // Helper methods for icons, colors, and formatting
  getSensitivityIcon(level: string): string {
    switch (level) {
      case 'low': return 'fas fa-shield-alt';
      case 'medium': return 'fas fa-shield';
      case 'high': return 'fas fa-lock';
      case 'critical': return 'fas fa-lock';
      default: return 'fas fa-file';
    }
  }
  getSensitivityColor(level: string): string {
    switch (level) {
      case 'low': return 'var(--success-color)';
      case 'medium': return 'var(--warning-color)';
      case 'high': return 'var(--danger-color)';
      case 'critical': return '#dc2626';
      default: return 'var(--text-secondary)';
    }
  }
  getCategoryIcon(category: string): string {
    switch (category) {
      case 'payroll': return 'fas fa-dollar-sign';
      case 'performance': return 'fas fa-chart-line';
      case 'personal': return 'fas fa-user-shield';
      case 'financial': return 'fas fa-chart-pie';
      case 'compliance': return 'fas fa-clipboard-check';
      case 'audit': return 'fas fa-search';
      default: return 'fas fa-file';
    }
  }
  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diff / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }
  getPermissionsText(permissions: any): string {
    const activePermissions = Object.keys(permissions).filter(key => permissions[key]);
    return activePermissions.map(perm => perm.charAt(0).toUpperCase() + perm.slice(1)).join(', ');
  }
  getRestrictionsText(restrictions: any): string {
    const restrictionsList = [];
    if (restrictions.timeRestrictions) restrictionsList.push('Time: ' + restrictions.timeRestrictions);
    if (restrictions.ipRestrictions) restrictionsList.push('IP: ' + restrictions.ipRestrictions.length + ' ranges');
    if (restrictions.dataMasking) restrictionsList.push('Masking: ' + restrictions.dataMasking.length + ' fields');
    return restrictionsList.join(' | ');
  }
  getUrgencyColor(urgency: string): string {
    switch (urgency) {
      case 'low': return 'var(--success-color)';
      case 'medium': return 'var(--warning-color)';
      case 'high': return 'var(--danger-color)';
      case 'urgent': return '#dc2626';
      default: return 'var(--text-secondary)';
    }
  }
  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'var(--success-color)';
      case 'inactive': return 'var(--warning-color)';
      case 'maintenance': return 'var(--danger-color)';
      case 'pending': return 'var(--warning-color)';
      case 'approved': return 'var(--success-color)';
      case 'denied': return 'var(--danger-color)';
      case 'expired': return 'var(--text-secondary)';
      case 'revoked': return 'var(--danger-color)';
      default: return 'var(--text-secondary)';
    }
  }

  // Action methods for modals
  viewRoleAccess(role: RoleAccess) {
    this.selectedRole = role;
    this.showViewRoleModal = true;
  }
  closeViewRoleModal() {
    this.showViewRoleModal = false;
    this.selectedRole = null;
  }
  assignRoleAccess() {
    this.assignRoleForm.reset();
    this.showAssignRoleModal = true;
  }
  closeAssignRoleModal() {
    this.showAssignRoleModal = false;
  }
  confirmAssignRoleAccess() {
    if (this.assignRoleForm.invalid) {
      this.assignRoleForm.markAllAsTouched();
      return;
    }
    const form = this.assignRoleForm.value;
    const newRole = {
      id: (this.roleAccess.length + 1).toString(),
      roleName: form.roleName,
      roleDescription: form.roleDescription,
      permissions: this.parsePermissions(form.permissions),
      restrictions: this.parseRestrictions(form.restrictions),
      assignedReports: [],
      assignedBy: 'admin@company.com',
      assignedAt: new Date(),
      status: 'active'
    };
    this.roleAccess.push(newRole);
    this.closeAssignRoleModal();
  }
  parsePermissions(permString: string) {
    // Example: "view, generate, export" => {view: true, generate: true, export: true}
    const perms = permString.split(',').map(p => p.trim()).filter(Boolean);
    const allPerms = ['view', 'generate', 'export', 'print', 'schedule', 'share', 'delete'];
    const result: any = {};
    allPerms.forEach(p => result[p] = perms.includes(p));
    return result;
  }
  parseRestrictions(restrString: string) {
    // Example: "Time: Business hours only | IP: 192.168.1.0/24" => {timeRestrictions: ..., ipRestrictions: ...}
    const result: any = {};
    if (restrString.includes('Time:')) {
      const match = restrString.match(/Time:([^|]*)/);
      if (match) result.timeRestrictions = match[1].trim();
    }
    if (restrString.includes('IP:')) {
      const match = restrString.match(/IP:([^|]*)/);
      if (match) result.ipRestrictions = match[1].split(',').map((ip: string) => ip.trim());
    }
    if (restrString.includes('Masking:')) {
      const match = restrString.match(/Masking:([^|]*)/);
      if (match) result.dataMasking = match[1].split(',').map((f: string) => f.trim());
    }
    return result;
  }
  revokeRoleAccess(role: RoleAccess) {
    this.selectedRole = role;
    this.showRevokeRoleModal = true;
  }
  closeRevokeRoleModal() {
    this.showRevokeRoleModal = false;
    this.selectedRole = null;
  }
  confirmRevokeRoleAccess() {
    if (this.selectedRole) {
      this.selectedRole.status = 'revoked';
    }
    this.closeRevokeRoleModal();
  }
  // Update button actions
  createRoleAccess() {
    this.assignRoleAccess();
  }
  editRoleAccess(role: RoleAccess) {
    this.selectedRoleEdit = role;
    this.editRoleForm.patchValue({
      roleName: role.roleName,
      roleDescription: role.roleDescription,
      permissions: this.getPermissionsText(role.permissions),
      restrictions: this.getRestrictionsText(role.restrictions)
    });
    this.showEditRoleModal = true;
  }
  closeEditRoleModal() {
    this.showEditRoleModal = false;
    this.selectedRoleEdit = null;
    this.editRoleForm.reset();
  }
  saveRoleAccess() {
    if (this.editRoleForm.invalid || !this.selectedRoleEdit) {
      this.editRoleForm.markAllAsTouched();
      return;
    }
    const form = this.editRoleForm.value;
    this.selectedRoleEdit.roleName = form.roleName;
    this.selectedRoleEdit.roleDescription = form.roleDescription;
    this.selectedRoleEdit.permissions = this.parsePermissions(form.permissions);
    this.selectedRoleEdit.restrictions = this.parseRestrictions(form.restrictions);
    this.closeEditRoleModal();
  }
  openDeleteRoleModal(role: RoleAccess) {
    this.selectedRoleEdit = role;
    this.showDeleteRoleModal = true;
  }
  closeDeleteRoleModal() {
    this.showDeleteRoleModal = false;
    this.selectedRoleEdit = null;
  }
  confirmDeleteRoleAccess() {
    if (this.selectedRoleEdit) {
      this.roleAccess = this.roleAccess.filter(r => r.id !== this.selectedRoleEdit!.id);
    }
    this.closeDeleteRoleModal();
  }

  // Sensitive Report Modal Methods
  createSensitiveReport() {
    this.reportForm.reset();
    this.showCreateReportModal = true;
  }

  closeCreateReportModal() {
    this.showCreateReportModal = false;
  }

  editSensitiveReport(report: SensitiveReport) {
    this.selectedReport = report;
    this.reportForm.patchValue({
      name: report.name,
      description: report.description,
      reportType: report.reportType,
      sensitivityLevel: report.sensitivityLevel,
      category: report.category,
      dataFields: report.dataFields.join(', '),
      retentionPolicy: report.retentionPolicy,
      encryptionRequired: report.encryptionRequired,
      watermarkEnabled: report.watermarkEnabled,
      accessLogging: report.accessLogging
    });
    this.showEditReportModal = true;
  }

  closeEditReportModal() {
    this.showEditReportModal = false;
    this.selectedReport = null;
  }

  saveReport() {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    const formValue = this.reportForm.value;
    const reportData = {
      ...formValue,
      dataFields: formValue.dataFields ? formValue.dataFields.split(',').map((f: string) => f.trim()) : [],
      createdBy: 'admin@company.com',
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'active'
    };

    if (this.showCreateReportModal) {
      // Create new report
      const newReport: SensitiveReport = {
        id: (this.sensitiveReports.length + 1).toString(),
        ...reportData
      };
      this.sensitiveReports.push(newReport);
      this.closeCreateReportModal();
    } else if (this.showEditReportModal && this.selectedReport) {
      // Update existing report
      Object.assign(this.selectedReport, reportData);
      this.closeEditReportModal();
    }
  }

  deleteSensitiveReport(id: string) {
    const report = this.sensitiveReports.find(r => r.id === id);
    if (report) {
      this.selectedReport = report;
      this.showDeleteReportModal = true;
    }
  }

  closeDeleteReportModal() {
    this.showDeleteReportModal = false;
    this.selectedReport = null;
  }

  confirmDeleteReport() {
    if (this.selectedReport) {
      this.sensitiveReports = this.sensitiveReports.filter(r => r.id !== this.selectedReport!.id);
      this.closeDeleteReportModal();
    }
  }

  // Access Request Modal Methods
  viewAccessRequest(request: AccessRequest) {
    this.selectedRequestEdit = request;
    this.showViewRequestModal = true;
  }
  closeViewRequestModal() {
    this.showViewRequestModal = false;
    this.selectedRequestEdit = null;
  }
  editAccessRequest(request: AccessRequest) {
    this.selectedRequestEdit = request;
    this.editRequestForm.patchValue({
      requester: request.requester,
      requesterRole: request.requesterRole,
      requesterDepartment: request.requesterDepartment,
      reportName: request.reportName,
      requestedPermissions: request.requestedPermissions.join(', '),
      reason: request.reason,
      urgency: request.urgency,
      status: request.status
    });
    this.showEditRequestModal = true;
  }
  closeEditRequestModal() {
    this.showEditRequestModal = false;
    this.selectedRequestEdit = null;
    this.editRequestForm.reset();
  }
  saveAccessRequest() {
    if (this.editRequestForm.invalid || !this.selectedRequestEdit) {
      this.editRequestForm.markAllAsTouched();
      return;
    }
    const form = this.editRequestForm.value;
    this.selectedRequestEdit.requester = form.requester;
    this.selectedRequestEdit.requesterRole = form.requesterRole;
    this.selectedRequestEdit.requesterDepartment = form.requesterDepartment;
    this.selectedRequestEdit.reportName = form.reportName;
    this.selectedRequestEdit.requestedPermissions = form.requestedPermissions.split(',').map((p: string) => p.trim());
    this.selectedRequestEdit.reason = form.reason;
    this.selectedRequestEdit.urgency = form.urgency;
    this.selectedRequestEdit.status = form.status;
    this.closeEditRequestModal();
  }
  openDeleteRequestModal(request: AccessRequest) {
    this.selectedRequestEdit = request;
    this.showDeleteRequestModal = true;
  }
  closeDeleteRequestModal() {
    this.showDeleteRequestModal = false;
    this.selectedRequestEdit = null;
  }
  confirmDeleteRequest() {
    if (this.selectedRequestEdit) {
      this.accessRequests = this.accessRequests.filter(r => r.id !== this.selectedRequestEdit!.id);
    }
    this.closeDeleteRequestModal();
  }

  // Action stubs
  deleteRoleAccess(id: string) {
    const role = this.roleAccess.find(r => r.id === id);
    if (role) {
      this.openDeleteRoleModal(role);
    }
  }
  approveAccessRequest(request: AccessRequest) {}
  denyAccessRequest(request: AccessRequest) {}
  deleteAccessRequest(id: string) {
    const req = this.accessRequests.find(r => r.id === id);
    if (req) {
      this.openDeleteRequestModal(req);
    }
  }
}
