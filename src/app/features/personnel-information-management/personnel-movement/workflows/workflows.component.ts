import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Workflow {
  id: number;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  approvalSteps: ApprovalStep[];
}

interface ApprovalStep {
  id: number;
  stepNumber: number;
  approvers: string;
  conditions: string;
}

@Component({
  selector: 'app-workflows',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.scss']
})
export class WorkflowsComponent implements OnInit {
  workflows: Workflow[] = [];
  selectedWorkflow: Workflow | null = null;
  isEditing = false;
  
  // Form data
  workflowForm = {
    name: '',
    description: '',
    approvalSteps: [] as ApprovalStep[]
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadWorkflows();
  }

  loadWorkflows() {
    // Mock data - replace with actual API call
    this.workflows = [
      {
        id: 1,
        name: 'Promotion Workflow',
        description: 'Workflow for promotions within the company.',
        status: 'Active',
        approvalSteps: [
          {
            id: 1,
            stepNumber: 1,
            approvers: 'Manager, HR',
            conditions: 'Employee Performance > 80%'
          },
          {
            id: 2,
            stepNumber: 2,
            approvers: 'HR Director',
            conditions: 'Step 1 Approved'
          }
        ]
      },
      {
        id: 2,
        name: 'Transfer Workflow',
        description: 'Workflow for transferring employees between departments.',
        status: 'Inactive',
        approvalSteps: [
          {
            id: 3,
            stepNumber: 1,
            approvers: 'Department Head',
            conditions: 'Position Available'
          }
        ]
      },
      {
        id: 3,
        name: 'Reassignment Workflow',
        description: 'Workflow for reassigning employees to different roles.',
        status: 'Active',
        approvalSteps: [
          {
            id: 4,
            stepNumber: 1,
            approvers: 'Manager',
            conditions: 'Role Change Requested'
          }
        ]
      }
    ];
  }

  onNavigateToPersonnelMovement() {
    this.router.navigate(['/personnel-information-management/personnel-movement']);
  }

  onCreateNewWorkflow() {
    this.isEditing = true;
    this.selectedWorkflow = null;
    this.resetForm();
  }

  onEditWorkflow(workflow: Workflow) {
    this.isEditing = true;
    this.selectedWorkflow = workflow;
    this.workflowForm = {
      name: workflow.name,
      description: workflow.description,
      approvalSteps: [...workflow.approvalSteps]
    };
  }

  onDeleteWorkflow(workflow: Workflow) {
    if (confirm(`Are you sure you want to delete the workflow "${workflow.name}"?`)) {
      this.workflows = this.workflows.filter(w => w.id !== workflow.id);
    }
  }

  onAddApprovalStep() {
    const newStep: ApprovalStep = {
      id: Date.now(),
      stepNumber: this.workflowForm.approvalSteps.length + 1,
      approvers: '',
      conditions: ''
    };
    this.workflowForm.approvalSteps.push(newStep);
  }

  onEditApprovalStep(step: ApprovalStep) {
    // Implement edit step functionality
    console.log('Edit step:', step);
  }

  onDeleteApprovalStep(step: ApprovalStep) {
    this.workflowForm.approvalSteps = this.workflowForm.approvalSteps.filter(s => s.id !== step.id);
    // Reorder step numbers
    this.workflowForm.approvalSteps.forEach((s, index) => {
      s.stepNumber = index + 1;
    });
  }

  onCancel() {
    this.isEditing = false;
    this.selectedWorkflow = null;
    this.resetForm();
  }

  onSaveWorkflow() {
    if (!this.workflowForm.name.trim()) {
      alert('Please enter a workflow name');
      return;
    }

    if (this.selectedWorkflow) {
      // Update existing workflow
      const index = this.workflows.findIndex(w => w.id === this.selectedWorkflow!.id);
      if (index !== -1) {
        this.workflows[index] = {
          ...this.selectedWorkflow,
          name: this.workflowForm.name,
          description: this.workflowForm.description,
          approvalSteps: this.workflowForm.approvalSteps
        };
      }
    } else {
      // Create new workflow
      const newWorkflow: Workflow = {
        id: Date.now(),
        name: this.workflowForm.name,
        description: this.workflowForm.description,
        status: 'Active',
        approvalSteps: this.workflowForm.approvalSteps
      };
      this.workflows.push(newWorkflow);
    }

    this.isEditing = false;
    this.selectedWorkflow = null;
    this.resetForm();
  }

  private resetForm() {
    this.workflowForm = {
      name: '',
      description: '',
      approvalSteps: []
    };
  }

  getStatusClass(status: string): string {
    return status === 'Active' ? 'status-badge-active' : 'status-badge-inactive';
  }
}
