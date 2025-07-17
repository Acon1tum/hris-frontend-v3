import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Request {
  id: string;
  type: string;
  status: string;
  createdBy: string;
  date: string | Date;
  description?: string;
  priority?: 'Low' | 'Medium' | 'High';
  assignedTo?: string;
}

interface WorkflowStep {
  id: string;
  name: string;
  role: string;
  order: number;
  isRequired: boolean;
  estimatedDays: number;
}

interface EscalationRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  timeLimit: number;
  notifyTo: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  requestType: string;
  isActive: boolean;
  steps: WorkflowStep[];
  escalationRules: EscalationRule[];
  createdAt: Date;
  updatedAt: Date;
}

interface AuditLog {
  id: string;
  action: string;
  entityType: 'Request' | 'Workflow' | 'Step' | 'Escalation' | 'System';
  entityId: string;
  entityName: string;
  userId: string;
  userName: string;
  timestamp: Date;
  details: string;
  ipAddress: string;
  userAgent: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

interface AnalyticsData {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  averageProcessingTime: number;
  requestsByType: { type: string; count: number; percentage: number }[];
  requestsByStatus: { status: string; count: number; percentage: number }[];
  requestsByPriority: { priority: string; count: number; percentage: number }[];
  requestsByMonth: { month: string; count: number }[];
  topRequesters: { name: string; count: number }[];
  topApprovers: { name: string; count: number }[];
  workflowEfficiency: { workflowName: string; avgTime: number; successRate: number }[];
  complianceMetrics: {
    slaCompliance: number;
    averageResponseTime: number;
    escalationRate: number;
    approvalRate: number;
  };
}

interface ComplianceReport {
  id: string;
  reportType: string;
  period: string;
  generatedAt: Date;
  data: any;
  status: 'Generated' | 'Processing' | 'Failed';
}

@Component({
  selector: 'app-admin-request',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-request.component.html',
  styleUrls: ['./admin-request.component.scss']
})
export class AdminRequestComponent implements OnInit {
  requests: Request[] = [];
  requestTypes: string[] = ['Feature Request', 'Bug Report', 'Support Request', 'Leave', 'Overtime', 'Travel', 'Equipment Request', 'Training Request'];
  workflows: Workflow[] = [];
  auditLogs: AuditLog[] = [];
  analyticsData: AnalyticsData = this.getEmptyAnalytics();
  complianceReports: ComplianceReport[] = [];
  
  showDialog = false;
  isEdit = false;
  dialogTitle = 'New Request';
  requestForm: Request = this.getEmptyRequest();
  editIndex: number | null = null;
  
  // Workflow Management
  showWorkflowDialog = false;
  isWorkflowEdit = false;
  workflowDialogTitle = 'New Workflow';
  workflowForm: Workflow = this.getEmptyWorkflow();
  editWorkflowIndex: number | null = null;
  
  // Workflow Step Management
  showStepDialog = false;
  isStepEdit = false;
  stepDialogTitle = 'New Step';
  stepForm: WorkflowStep = this.getEmptyStep();
  editStepIndex: number | null = null;
  currentWorkflowId: string = '';
  
  // Escalation Rule Management
  showEscalationDialog = false;
  isEscalationEdit = false;
  escalationDialogTitle = 'New Escalation Rule';
  escalationForm: EscalationRule = this.getEmptyEscalationRule();
  editEscalationIndex: number | null = null;
  
  // Analytics & Audit
  showAnalyticsDialog = false;
  showAuditDialog = false;
  showComplianceDialog = false;
  selectedAnalyticsPeriod = '30days';
  selectedAuditFilters = {
    action: '',
    entityType: '',
    userId: '',
    dateRange: ''
  };
  
  filterText = '';
  advancedFilter = { 
    type: '', 
    status: '', 
    date: '', 
    priority: '',
    assignedTo: ''
  };
  
  // Workflow Filters
  workflowFilterText = '';
  workflowTypeFilter = '';
  
  // UI State
  isLoading = false;
  showAdvancedFilters = false;
  selectedRequests: string[] = [];
  selectedWorkflows: string[] = [];
  currentTab = 'requests'; // 'requests', 'workflows', 'analytics', 'audit'
  
  // Statistics
  statistics = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  };

  // Available roles for workflow steps
  availableRoles = [
    'HR Manager',
    'Department Head',
    'Project Manager',
    'Finance Manager',
    'IT Manager',
    'General Manager',
    'CEO',
    'Super Admin'
  ];

  // Escalation conditions
  escalationConditions = [
    'Request pending for more than 3 days',
    'Request pending for more than 7 days',
    'High priority request pending',
    'Request assigned to unavailable approver',
    'Weekend or holiday request'
  ];

  // Escalation actions
  escalationActions = [
    'Send reminder notification',
    'Auto-escalate to next level',
    'Send email to supervisor',
    'Create urgent ticket',
    'Auto-approve if conditions met'
  ];

  // Analytics periods
  analyticsPeriods = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: '1year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  // Audit actions
  auditActions = [
    'Create',
    'Update',
    'Delete',
    'Approve',
    'Reject',
    'Escalate',
    'Login',
    'Logout',
    'Export',
    'Import'
  ];

  // Entity types for audit
  auditEntityTypes = [
    'Request',
    'Workflow',
    'Step',
    'Escalation',
    'System'
  ];

  constructor() {}

  ngOnInit() {
    this.loadRequests();
    this.loadWorkflows();
    this.loadAuditLogs();
    this.loadComplianceReports();
    this.calculateStatistics();
    this.generateAnalytics();
  }

  getEmptyRequest(): Request {
    return {
      id: this.generateId(),
      type: '',
      status: 'Pending',
      createdBy: '',
      date: this.formatDate(new Date()),
      description: '',
      priority: 'Medium',
      assignedTo: ''
    };
  }

  getEmptyWorkflow(): Workflow {
    return {
      id: this.generateId(),
      name: '',
      description: '',
      requestType: '',
      isActive: true,
      steps: [],
      escalationRules: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  getEmptyStep(): WorkflowStep {
    return {
      id: this.generateId(),
      name: '',
      role: '',
      order: 1,
      isRequired: true,
      estimatedDays: 3
    };
  }

  getEmptyEscalationRule(): EscalationRule {
    return {
      id: this.generateId(),
      name: '',
      condition: '',
      action: '',
      timeLimit: 3,
      notifyTo: ''
    };
  }

  getEmptyAnalytics(): AnalyticsData {
    return {
      totalRequests: 0,
      pendingRequests: 0,
      approvedRequests: 0,
      rejectedRequests: 0,
      averageProcessingTime: 0,
      requestsByType: [],
      requestsByStatus: [],
      requestsByPriority: [],
      requestsByMonth: [],
      topRequesters: [],
      topApprovers: [],
      workflowEfficiency: [],
      complianceMetrics: {
        slaCompliance: 0,
        averageResponseTime: 0,
        escalationRate: 0,
        approvalRate: 0
      }
    };
  }

  generateId(): string {
    return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  loadRequests() {
    this.isLoading = true;
    
    setTimeout(() => {
      const data = localStorage.getItem('admin-requests');
      if (data) {
        this.requests = JSON.parse(data).map((r: any) => ({ 
          ...r, 
          date: r.date,
          id: r.id || this.generateId(),
          description: r.description || '',
          priority: r.priority || 'Medium',
          assignedTo: r.assignedTo || ''
        }));
      } else {
        this.requests = [
          { 
            id: this.generateId(),
            type: 'Leave', 
            status: 'Pending', 
            createdBy: 'John Doe', 
            date: this.formatDate(new Date()),
            description: 'Annual leave request for vacation',
            priority: 'Medium',
            assignedTo: 'HR Manager'
          },
          { 
            id: this.generateId(),
            type: 'Overtime', 
            status: 'Approved', 
            createdBy: 'Jane Smith', 
            date: this.formatDate(new Date()),
            description: 'Overtime request for project completion',
            priority: 'High',
            assignedTo: 'Project Manager'
          },
          { 
            id: this.generateId(),
            type: 'Travel', 
            status: 'Rejected', 
            createdBy: 'Alice Brown', 
            date: this.formatDate(new Date()),
            description: 'Business travel request for conference',
            priority: 'Low',
            assignedTo: 'Finance Manager'
          }
        ];
        this.saveRequests();
      }
      this.isLoading = false;
      this.calculateStatistics();
    }, 500);
  }

  loadWorkflows() {
    const data = localStorage.getItem('admin-workflows');
    if (data) {
      this.workflows = JSON.parse(data).map((w: any) => ({
        ...w,
        createdAt: new Date(w.createdAt),
        updatedAt: new Date(w.updatedAt)
      }));
    } else {
      this.workflows = [
        {
          id: 'wf_1',
          name: 'Leave Approval Workflow',
          description: 'Multi-level approval process for leave requests',
          requestType: 'Leave',
          isActive: true,
          steps: [
            {
              id: 'step_1',
              name: 'Direct Manager Approval',
              role: 'Department Head',
              order: 1,
              isRequired: true,
              estimatedDays: 2
            },
            {
              id: 'step_2',
              name: 'HR Review',
              role: 'HR Manager',
              order: 2,
              isRequired: true,
              estimatedDays: 3
            }
          ],
          escalationRules: [
            {
              id: 'esc_1',
              name: 'Manager Reminder',
              condition: 'Request pending for more than 3 days',
              action: 'Send reminder notification',
              timeLimit: 3,
              notifyTo: 'Department Head'
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'wf_2',
          name: 'Overtime Escalation Rule',
          description: 'Automatic escalation for overtime requests',
          requestType: 'Overtime',
          isActive: true,
          steps: [
            {
              id: 'step_3',
              name: 'Project Manager Approval',
              role: 'Project Manager',
              order: 1,
              isRequired: true,
              estimatedDays: 1
            }
          ],
          escalationRules: [
            {
              id: 'esc_2',
              name: 'Urgent Overtime',
              condition: 'High priority request pending',
              action: 'Auto-escalate to next level',
              timeLimit: 1,
              notifyTo: 'General Manager'
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      this.saveWorkflows();
    }
  }

  loadAuditLogs() {
    const data = localStorage.getItem('admin-audit-logs');
    if (data) {
      this.auditLogs = JSON.parse(data).map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      }));
    } else {
      // Generate sample audit logs
      this.auditLogs = this.generateSampleAuditLogs();
      this.saveAuditLogs();
    }
  }

  loadComplianceReports() {
    const data = localStorage.getItem('admin-compliance-reports');
    if (data) {
      this.complianceReports = JSON.parse(data).map((report: any) => ({
        ...report,
        generatedAt: new Date(report.generatedAt)
      }));
    } else {
      this.complianceReports = this.generateSampleComplianceReports();
      this.saveComplianceReports();
    }
  }

  generateSampleAuditLogs(): AuditLog[] {
    const actions = ['Create', 'Update', 'Delete', 'Approve', 'Reject', 'Login', 'Export'];
    const users = ['Super Admin', 'HR Manager', 'Department Head', 'Project Manager'];
    const logs: AuditLog[] = [];

    for (let i = 0; i < 50; i++) {
      const action = actions[Math.floor(Math.random() * actions.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30));

      logs.push({
        id: this.generateId(),
        action,
        entityType: 'Request',
        entityId: this.generateId(),
        entityName: `Request ${i + 1}`,
        userId: user.toLowerCase().replace(' ', '_'),
        userName: user,
        timestamp,
        details: `${action} operation performed on request`,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        changes: action === 'Update' ? [
          {
            field: 'status',
            oldValue: 'Pending',
            newValue: 'Approved'
          }
        ] : undefined
      });
    }

    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  generateSampleComplianceReports(): ComplianceReport[] {
    return [
      {
        id: this.generateId(),
        reportType: 'SLA Compliance Report',
        period: 'Q1 2024',
        generatedAt: new Date(),
        data: { slaCompliance: 95.2, averageResponseTime: 2.3 },
        status: 'Generated'
      },
      {
        id: this.generateId(),
        reportType: 'Audit Trail Report',
        period: 'March 2024',
        generatedAt: new Date(),
        data: { totalActions: 1250, uniqueUsers: 45 },
        status: 'Generated'
      },
      {
        id: this.generateId(),
        reportType: 'Workflow Efficiency Report',
        period: 'Q1 2024',
        generatedAt: new Date(),
        data: { avgProcessingTime: 3.2, successRate: 87.5 },
        status: 'Generated'
      }
    ];
  }

  saveRequests() {
    localStorage.setItem('admin-requests', JSON.stringify(this.requests));
    this.calculateStatistics();
    this.logAudit('Update', 'Request', 'requests', 'Super Admin', 'Requests data updated');
  }

  saveWorkflows() {
    localStorage.setItem('admin-workflows', JSON.stringify(this.workflows));
    this.logAudit('Update', 'Workflow', 'workflows', 'Super Admin', 'Workflows data updated');
  }

  saveAuditLogs() {
    localStorage.setItem('admin-audit-logs', JSON.stringify(this.auditLogs));
  }

  saveComplianceReports() {
    localStorage.setItem('admin-compliance-reports', JSON.stringify(this.complianceReports));
  }

  logAudit(action: string, entityType: string, entityId: string, userName: string, details: string, changes?: any[]) {
    const auditLog: AuditLog = {
      id: this.generateId(),
      action,
      entityType: entityType as any,
      entityId,
      entityName: entityId,
      userId: userName.toLowerCase().replace(' ', '_'),
      userName,
      timestamp: new Date(),
      details,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      changes
    };

    this.auditLogs.unshift(auditLog);
    this.saveAuditLogs();
  }

  calculateStatistics() {
    this.statistics = {
      total: this.requests.length,
      pending: this.requests.filter(r => r.status === 'Pending').length,
      approved: this.requests.filter(r => r.status === 'Approved').length,
      rejected: this.requests.filter(r => r.status === 'Rejected').length
    };
  }

  generateAnalytics() {
    const totalRequests = this.requests.length;
    const pendingRequests = this.requests.filter(r => r.status === 'Pending').length;
    const approvedRequests = this.requests.filter(r => r.status === 'Approved').length;
    const rejectedRequests = this.requests.filter(r => r.status === 'Rejected').length;

    // Calculate requests by type
    const typeCounts = this.requests.reduce((acc, req) => {
      acc[req.type] = (acc[req.type] || 0) + 1;
      return acc;
    }, {} as any);

    const requestsByType = Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count: count as number,
      percentage: totalRequests > 0 ? ((count as number) / totalRequests) * 100 : 0
    }));

    // Calculate requests by status
    const statusCounts = this.requests.reduce((acc, req) => {
      acc[req.status] = (acc[req.status] || 0) + 1;
      return acc;
    }, {} as any);

    const requestsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count: count as number,
      percentage: totalRequests > 0 ? ((count as number) / totalRequests) * 100 : 0
    }));

    // Calculate requests by priority
    const priorityCounts = this.requests.reduce((acc, req) => {
      if (req.priority) {
        acc[req.priority] = (acc[req.priority] || 0) + 1;
      }
      return acc;
    }, {} as any);

    const requestsByPriority = Object.entries(priorityCounts).map(([priority, count]) => ({
      priority,
      count: count as number,
      percentage: totalRequests > 0 ? ((count as number) / totalRequests) * 100 : 0
    }));

    // Calculate top requesters
    const requesterCounts = this.requests.reduce((acc, req) => {
      acc[req.createdBy] = (acc[req.createdBy] || 0) + 1;
      return acc;
    }, {} as any);

    const topRequesters = Object.entries(requesterCounts)
      .map(([name, count]) => ({ name, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate top approvers
    const approverCounts = this.requests.reduce((acc, req) => {
      if (req.assignedTo) {
        acc[req.assignedTo] = (acc[req.assignedTo] || 0) + 1;
      }
      return acc;
    }, {} as any);

    const topApprovers = Object.entries(approverCounts)
      .map(([name, count]) => ({ name, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate workflow efficiency
    const workflowEfficiency = this.workflows.map(workflow => ({
      workflowName: workflow.name,
      avgTime: Math.random() * 5 + 1, // Simulated data
      successRate: Math.random() * 20 + 80 // Simulated data
    }));

    // Calculate compliance metrics
    const slaCompliance = approvedRequests > 0 ? (approvedRequests / totalRequests) * 100 : 0;
    const averageResponseTime = 2.5; // Simulated data
    const escalationRate = 15.3; // Simulated data
    const approvalRate = approvedRequests > 0 ? (approvedRequests / totalRequests) * 100 : 0;

    this.analyticsData = {
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      averageProcessingTime: 3.2,
      requestsByType,
      requestsByStatus,
      requestsByPriority,
      requestsByMonth: this.generateMonthlyData(),
      topRequesters,
      topApprovers,
      workflowEfficiency,
      complianceMetrics: {
        slaCompliance,
        averageResponseTime,
        escalationRate,
        approvalRate
      }
    };
  }

  generateMonthlyData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      count: Math.floor(Math.random() * 50) + 10
    }));
  }

  // Request Management Methods
  openDialog(edit: boolean = false, index: number | null = null) {
    this.isEdit = edit;
    this.dialogTitle = edit ? 'Edit Request' : 'New Request';
    
    if (edit && index !== null) {
      this.editIndex = index;
      const req = this.requests[index];
      this.requestForm = { ...req };
    } else {
      this.editIndex = null;
      this.requestForm = this.getEmptyRequest();
    }
    
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.requestForm = this.getEmptyRequest();
  }

  saveRequest() {
    if (!this.requestForm.type || !this.requestForm.createdBy) {
      alert('Please fill in all required fields');
      return;
    }

    const action = this.isEdit ? 'Update' : 'Create';
    const changes = this.isEdit ? [
      {
        field: 'status',
        oldValue: this.requests[this.editIndex!].status,
        newValue: this.requestForm.status
      }
    ] : undefined;

    if (this.isEdit && this.editIndex !== null) {
      this.requests[this.editIndex] = { ...this.requestForm };
    } else {
      this.requests.unshift({ ...this.requestForm });
    }
    
    this.saveRequests();
    this.closeDialog();
    this.logAudit(action, 'Request', this.requestForm.id, 'Super Admin', `${action} request: ${this.requestForm.type}`, changes);
    this.showNotification('Request saved successfully!', 'success');
  }

  deleteRequest(index: number) {
    if (confirm('Are you sure you want to delete this request?')) {
      const request = this.requests[index];
      this.requests.splice(index, 1);
      this.saveRequests();
      this.logAudit('Delete', 'Request', request.id, 'Super Admin', `Deleted request: ${request.type}`);
      this.showNotification('Request deleted successfully!', 'success');
    }
  }

  // Workflow Management Methods
  openWorkflowDialog(edit: boolean = false, index: number | null = null) {
    this.isWorkflowEdit = edit;
    this.workflowDialogTitle = edit ? 'Edit Workflow' : 'New Workflow';
    
    if (edit && index !== null) {
      this.editWorkflowIndex = index;
      const workflow = this.workflows[index];
      this.workflowForm = { ...workflow };
    } else {
      this.editWorkflowIndex = null;
      this.workflowForm = this.getEmptyWorkflow();
    }
    
    this.showWorkflowDialog = true;
  }

  closeWorkflowDialog() {
    this.showWorkflowDialog = false;
    this.workflowForm = this.getEmptyWorkflow();
  }

  saveWorkflow() {
    if (!this.workflowForm.name || !this.workflowForm.requestType) {
      this.showNotification('Please fill in all required fields', 'warning');
      return;
    }

    this.workflowForm.updatedAt = new Date();
    const action = this.isWorkflowEdit ? 'Update' : 'Create';

    if (this.isWorkflowEdit && this.editWorkflowIndex !== null) {
      this.workflows[this.editWorkflowIndex] = { ...this.workflowForm };
    } else {
      this.workflows.unshift({ ...this.workflowForm });
    }
    
    this.saveWorkflows();
    this.closeWorkflowDialog();
    this.logAudit(action, 'Workflow', this.workflowForm.id, 'Super Admin', `${action} workflow: ${this.workflowForm.name}`);
    this.showNotification('Workflow saved successfully!', 'success');
  }

  deleteWorkflow(index: number) {
    if (confirm('Are you sure you want to delete this workflow? This will affect all related requests.')) {
      const workflow = this.workflows[index];
      this.workflows.splice(index, 1);
      this.saveWorkflows();
      this.logAudit('Delete', 'Workflow', workflow.id, 'Super Admin', `Deleted workflow: ${workflow.name}`);
      this.showNotification('Workflow deleted successfully!', 'success');
    }
  }

  toggleWorkflow(workflowId: string) {
    const workflow = this.workflows.find(w => w.id === workflowId);
    if (workflow) {
      workflow.isActive = !workflow.isActive;
      workflow.updatedAt = new Date();
      this.saveWorkflows();
      const action = workflow.isActive ? 'Activate' : 'Deactivate';
      this.logAudit(action, 'Workflow', workflow.id, 'Super Admin', `${action} workflow: ${workflow.name}`);
      this.showNotification(`Workflow ${workflow.isActive ? 'activated' : 'deactivated'}`, 'info');
    }
  }

  // Workflow Step Management
  openStepDialog(workflowId: string, edit: boolean = false, stepIndex: number | null = null) {
    this.currentWorkflowId = workflowId;
    this.isStepEdit = edit;
    this.stepDialogTitle = edit ? 'Edit Step' : 'New Step';
    
    if (edit && stepIndex !== null) {
      this.editStepIndex = stepIndex;
      const workflow = this.workflows.find(w => w.id === workflowId);
      if (workflow) {
        this.stepForm = { ...workflow.steps[stepIndex] };
      }
    } else {
      this.editStepIndex = null;
      this.stepForm = this.getEmptyStep();
      // Set the next order number
      const workflow = this.workflows.find(w => w.id === workflowId);
      if (workflow) {
        this.stepForm.order = workflow.steps.length + 1;
      }
    }
    
    this.showStepDialog = true;
  }

  closeStepDialog() {
    this.showStepDialog = false;
    this.stepForm = this.getEmptyStep();
    this.currentWorkflowId = '';
  }

  saveStep() {
    if (!this.stepForm.name || !this.stepForm.role) {
      this.showNotification('Please fill in all required fields', 'warning');
      return;
    }

    const workflowIndex = this.workflows.findIndex(w => w.id === this.currentWorkflowId);
    if (workflowIndex === -1) return;

    if (this.isStepEdit && this.editStepIndex !== null) {
      this.workflows[workflowIndex].steps[this.editStepIndex] = { ...this.stepForm };
    } else {
      this.workflows[workflowIndex].steps.push({ ...this.stepForm });
    }

    // Reorder steps
    this.workflows[workflowIndex].steps.sort((a, b) => a.order - b.order);
    
    this.saveWorkflows();
    this.closeStepDialog();
    this.showNotification('Workflow step saved successfully!', 'success');
  }

  deleteStep(workflowId: string, stepIndex: number) {
    if (confirm('Are you sure you want to delete this step?')) {
      const workflowIndex = this.workflows.findIndex(w => w.id === workflowId);
      if (workflowIndex !== -1) {
        this.workflows[workflowIndex].steps.splice(stepIndex, 1);
        // Reorder remaining steps
        this.workflows[workflowIndex].steps.forEach((step, index) => {
          step.order = index + 1;
        });
        this.saveWorkflows();
        this.showNotification('Workflow step deleted successfully!', 'success');
      }
    }
  }

  // Escalation Rule Management
  openEscalationDialog(workflowId: string, edit: boolean = false, escalationIndex: number | null = null) {
    this.currentWorkflowId = workflowId;
    this.isEscalationEdit = edit;
    this.escalationDialogTitle = edit ? 'Edit Escalation Rule' : 'New Escalation Rule';
    
    if (edit && escalationIndex !== null) {
      this.editEscalationIndex = escalationIndex;
      const workflow = this.workflows.find(w => w.id === workflowId);
      if (workflow) {
        this.escalationForm = { ...workflow.escalationRules[escalationIndex] };
      }
    } else {
      this.editEscalationIndex = null;
      this.escalationForm = this.getEmptyEscalationRule();
    }
    
    this.showEscalationDialog = true;
  }

  closeEscalationDialog() {
    this.showEscalationDialog = false;
    this.escalationForm = this.getEmptyEscalationRule();
    this.currentWorkflowId = '';
  }

  saveEscalationRule() {
    if (!this.escalationForm.name || !this.escalationForm.condition || !this.escalationForm.action) {
      this.showNotification('Please fill in all required fields', 'warning');
      return;
    }

    const workflowIndex = this.workflows.findIndex(w => w.id === this.currentWorkflowId);
    if (workflowIndex === -1) return;

    if (this.isEscalationEdit && this.editEscalationIndex !== null) {
      this.workflows[workflowIndex].escalationRules[this.editEscalationIndex] = { ...this.escalationForm };
    } else {
      this.workflows[workflowIndex].escalationRules.push({ ...this.escalationForm });
    }
    
    this.saveWorkflows();
    this.closeEscalationDialog();
    this.showNotification('Escalation rule saved successfully!', 'success');
  }

  deleteEscalationRule(workflowId: string, escalationIndex: number) {
    if (confirm('Are you sure you want to delete this escalation rule?')) {
      const workflowIndex = this.workflows.findIndex(w => w.id === workflowId);
      if (workflowIndex !== -1) {
        this.workflows[workflowIndex].escalationRules.splice(escalationIndex, 1);
        this.saveWorkflows();
        this.showNotification('Escalation rule deleted successfully!', 'success');
      }
    }
  }

  // Analytics Methods
  openAnalyticsDialog() {
    this.showAnalyticsDialog = true;
    this.generateAnalytics();
  }

  closeAnalyticsDialog() {
    this.showAnalyticsDialog = false;
  }

  // Audit Methods
  openAuditDialog() {
    this.showAuditDialog = true;
  }

  closeAuditDialog() {
    this.showAuditDialog = false;
  }

  // Compliance Methods
  openComplianceDialog() {
    this.showComplianceDialog = true;
  }

  closeComplianceDialog() {
    this.showComplianceDialog = false;
  }

  generateComplianceReport() {
    const report: ComplianceReport = {
      id: this.generateId(),
      reportType: 'Comprehensive Compliance Report',
      period: new Date().toLocaleDateString(),
      generatedAt: new Date(),
      data: {
        totalRequests: this.analyticsData.totalRequests,
        slaCompliance: this.analyticsData.complianceMetrics.slaCompliance,
        averageResponseTime: this.analyticsData.complianceMetrics.averageResponseTime,
        escalationRate: this.analyticsData.complianceMetrics.escalationRate,
        approvalRate: this.analyticsData.complianceMetrics.approvalRate,
        auditLogsCount: this.auditLogs.length,
        uniqueUsers: new Set(this.auditLogs.map(log => log.userId)).size
      },
      status: 'Generated'
    };

    this.complianceReports.unshift(report);
    this.saveComplianceReports();
    this.logAudit('Create', 'System', report.id, 'Super Admin', `Generated compliance report: ${report.reportType}`);
    this.showNotification('Compliance report generated successfully!', 'success');
  }

  exportAuditLogs() {
    const filteredLogs = this.filteredAuditLogs();
    if (filteredLogs.length === 0) {
      this.showNotification('No audit logs to export', 'warning');
      return;
    }

    const csv = [
      ['ID', 'Action', 'Entity Type', 'Entity Name', 'User', 'Timestamp', 'Details', 'IP Address'],
      ...filteredLogs.map(log => [
        log.id,
        log.action,
        log.entityType,
        log.entityName,
        log.userName,
        log.timestamp.toISOString(),
        log.details,
        log.ipAddress
      ])
    ].map(e => e.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    this.logAudit('Export', 'System', 'audit_logs', 'Super Admin', 'Exported audit logs');
    this.showNotification('Audit logs exported successfully!', 'success');
  }

  // Filtering Methods
  filteredRequests(): Request[] {
    let filtered = this.requests;
    
    if (this.filterText) {
      const filter = this.filterText.toLowerCase();
      filtered = filtered.filter(r =>
        r.type.toLowerCase().includes(filter) ||
        r.status.toLowerCase().includes(filter) ||
        r.createdBy.toLowerCase().includes(filter) ||
        (r.description && r.description.toLowerCase().includes(filter)) ||
        (r.assignedTo && r.assignedTo.toLowerCase().includes(filter))
      );
    }
    
    if (this.advancedFilter.type) {
      filtered = filtered.filter(r => r.type === this.advancedFilter.type);
    }
    if (this.advancedFilter.status) {
      filtered = filtered.filter(r => r.status === this.advancedFilter.status);
    }
    if (this.advancedFilter.date) {
      filtered = filtered.filter(r => r.date === this.advancedFilter.date);
    }
    if (this.advancedFilter.priority) {
      filtered = filtered.filter(r => r.priority === this.advancedFilter.priority);
    }
    if (this.advancedFilter.assignedTo) {
      filtered = filtered.filter(r => r.assignedTo === this.advancedFilter.assignedTo);
    }
    
    return filtered;
  }

  filteredWorkflows(): Workflow[] {
    let filtered = this.workflows;
    
    if (this.workflowFilterText) {
      const filter = this.workflowFilterText.toLowerCase();
      filtered = filtered.filter(w =>
        w.name.toLowerCase().includes(filter) ||
        w.description.toLowerCase().includes(filter) ||
        w.requestType.toLowerCase().includes(filter)
      );
    }
    
    if (this.workflowTypeFilter) {
      filtered = filtered.filter(w => w.requestType === this.workflowTypeFilter);
    }
    
    return filtered;
  }

  filteredAuditLogs(): AuditLog[] {
    let filtered = this.auditLogs;
    
    if (this.selectedAuditFilters.action) {
      filtered = filtered.filter(log => log.action === this.selectedAuditFilters.action);
    }
    
    if (this.selectedAuditFilters.entityType) {
      filtered = filtered.filter(log => log.entityType === this.selectedAuditFilters.entityType);
    }
    
    if (this.selectedAuditFilters.userId) {
      filtered = filtered.filter(log => log.userId === this.selectedAuditFilters.userId);
    }
    
    if (this.selectedAuditFilters.dateRange) {
      const date = new Date(this.selectedAuditFilters.dateRange);
      filtered = filtered.filter(log => 
        log.timestamp.toDateString() === date.toDateString()
      );
    }
    
    return filtered;
  }

  // Utility Methods
  formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  }

  showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    console.log(`${type.toUpperCase()}: ${message}`);
    
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    toast.style.backgroundColor = colors[type];
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  // Tab Management
  setCurrentTab(tab: string) {
    this.currentTab = tab;
  }

  // Bulk actions for workflows
  toggleWorkflowSelection(workflowId: string) {
    const index = this.selectedWorkflows.indexOf(workflowId);
    if (index > -1) {
      this.selectedWorkflows.splice(index, 1);
    } else {
      this.selectedWorkflows.push(workflowId);
    }
  }

  selectAllWorkflows() {
    if (this.selectedWorkflows.length === this.filteredWorkflows().length) {
      this.selectedWorkflows = [];
    } else {
      this.selectedWorkflows = this.filteredWorkflows().map(w => w.id);
    }
  }

  bulkActivateWorkflows() {
    if (this.selectedWorkflows.length === 0) {
      this.showNotification('Please select workflows to activate', 'warning');
      return;
    }

    this.workflows.forEach(workflow => {
      if (this.selectedWorkflows.includes(workflow.id)) {
        workflow.isActive = true;
        workflow.updatedAt = new Date();
      }
    });
    
    this.saveWorkflows();
    this.selectedWorkflows = [];
    this.showNotification(`${this.selectedWorkflows.length} workflow(s) activated!`, 'success');
  }

  bulkDeactivateWorkflows() {
    if (this.selectedWorkflows.length === 0) {
      this.showNotification('Please select workflows to deactivate', 'warning');
      return;
    }

    this.workflows.forEach(workflow => {
      if (this.selectedWorkflows.includes(workflow.id)) {
        workflow.isActive = false;
        workflow.updatedAt = new Date();
      }
    });
    
    this.saveWorkflows();
    this.selectedWorkflows = [];
    this.showNotification(`${this.selectedWorkflows.length} workflow(s) deactivated!`, 'success');
  }

  deleteSelectedWorkflows() {
    if (this.selectedWorkflows.length === 0) {
      this.showNotification('Please select workflows to delete', 'warning');
      return;
    }

    if (confirm(`Are you sure you want to delete ${this.selectedWorkflows.length} selected workflow(s)?`)) {
      this.workflows = this.workflows.filter(w => !this.selectedWorkflows.includes(w.id));
      this.selectedWorkflows = [];
      this.saveWorkflows();
      this.showNotification(`${this.selectedWorkflows.length} workflow(s) deleted successfully!`, 'success');
    }
  }

  // Export workflows
  exportWorkflows() {
    const filteredWorkflows = this.filteredWorkflows();
    if (filteredWorkflows.length === 0) {
      this.showNotification('No workflows to export', 'warning');
      return;
    }

    const csv = [
      ['ID', 'Name', 'Description', 'Request Type', 'Status', 'Steps Count', 'Escalation Rules Count', 'Created At', 'Updated At'],
      ...filteredWorkflows.map(w => [
        w.id,
        w.name,
        w.description,
        w.requestType,
        w.isActive ? 'Active' : 'Inactive',
        w.steps.length,
        w.escalationRules.length,
        w.createdAt.toISOString().split('T')[0],
        w.updatedAt.toISOString().split('T')[0]
      ])
    ].map(e => e.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflows-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    this.showNotification('Workflows CSV report exported successfully!', 'success');
  }

  // Clear filters
  clearAdvancedFilters() {
    this.advancedFilter = { 
      type: '', 
      status: '', 
      date: '', 
      priority: '',
      assignedTo: ''
    };
    this.showNotification('Filters cleared', 'info');
  }

  clearWorkflowFilters() {
    this.workflowFilterText = '';
    this.workflowTypeFilter = '';
    this.showNotification('Workflow filters cleared', 'info');
  }

  clearAuditFilters() {
    this.selectedAuditFilters = {
      action: '',
      entityType: '',
      userId: '',
      dateRange: ''
    };
    this.showNotification('Audit filters cleared', 'info');
  }

  applyAdvancedFilters() {
    this.showNotification('Filters applied', 'info');
  }

  toggleAdvancedFilters() {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  // Request management methods (existing)
  deleteSelectedRequests() {
    if (this.selectedRequests.length === 0) {
      this.showNotification('Please select requests to delete', 'warning');
      return;
    }

    if (confirm(`Are you sure you want to delete ${this.selectedRequests.length} selected request(s)?`)) {
      this.requests = this.requests.filter(req => !this.selectedRequests.includes(req.id));
      this.selectedRequests = [];
      this.saveRequests();
      this.showNotification(`${this.selectedRequests.length} request(s) deleted successfully!`, 'success');
    }
  }

  toggleRequestSelection(requestId: string) {
    const index = this.selectedRequests.indexOf(requestId);
    if (index > -1) {
      this.selectedRequests.splice(index, 1);
    } else {
      this.selectedRequests.push(requestId);
    }
  }

  selectAllRequests() {
    if (this.selectedRequests.length === this.filteredRequests().length) {
      this.selectedRequests = [];
    } else {
      this.selectedRequests = this.filteredRequests().map(req => req.id);
    }
  }

  exportRequests() {
    const filteredRequests = this.filteredRequests();
    if (filteredRequests.length === 0) {
      this.showNotification('No requests to export', 'warning');
      return;
    }

    const csv = [
      ['ID', 'Type', 'Status', 'Created By', 'Date', 'Priority', 'Assigned To', 'Description'],
      ...filteredRequests.map(r => [
        r.id,
        r.type,
        r.status,
        r.createdBy,
        r.date,
        r.priority || '',
        r.assignedTo || '',
        r.description || ''
      ])
    ].map(e => e.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `requests-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    this.showNotification('CSV report exported successfully!', 'success');
  }

  bulkApprove() {
    if (this.selectedRequests.length === 0) {
      this.showNotification('Please select requests to approve', 'warning');
      return;
    }

    this.requests.forEach(req => {
      if (this.selectedRequests.includes(req.id)) {
        req.status = 'Approved';
      }
    });
    
    this.saveRequests();
    this.selectedRequests = [];
    this.showNotification(`${this.selectedRequests.length} request(s) approved!`, 'success');
  }

  bulkReject() {
    if (this.selectedRequests.length === 0) {
      this.showNotification('Please select requests to reject', 'warning');
      return;
    }

    this.requests.forEach(req => {
      if (this.selectedRequests.includes(req.id)) {
        req.status = 'Rejected';
      }
    });
    
    this.saveRequests();
    this.selectedRequests = [];
    this.showNotification(`${this.selectedRequests.length} request(s) rejected!`, 'success');
  }
}
