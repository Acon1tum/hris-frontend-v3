import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payroll-adjustment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payroll-adjustment.component.html',
  styleUrls: ['./payroll-adjustment.component.scss']
})
export class PayrollAdjustmentComponent {
  title = 'Record Adjustments';
  subtitle = 'Manage and record adjustments for payroll, including recurring and one-time adjustments.';
  
  // Form data
  adjustmentType = 'recurring';
  adjustmentName = '';
  taxability = '';
  justification = '';
  amount = '';
  manualOverride = false;

  // Adjustment type options
  adjustmentTypes = [
    { id: 'recurring', label: 'Recurring' },
    { id: 'onetime', label: 'One-Time' }
  ];

  // Taxability options
  taxabilityOptions = [
    { value: '', label: 'Select taxability status', disabled: true },
    { value: 'taxable', label: 'Taxable' },
    { value: 'non-taxable', label: 'Non-Taxable' }
  ];

  onAdjustmentTypeChange(type: string) {
    this.adjustmentType = type;
  }

  onSaveAdjustment() {
    console.log('Save adjustment clicked');
    console.log('Form data:', {
      adjustmentType: this.adjustmentType,
      adjustmentName: this.adjustmentName,
      taxability: this.taxability,
      justification: this.justification,
      amount: this.amount,
      manualOverride: this.manualOverride
    });

    // Here you would typically call a service to save the data
    // this.payrollService.saveAdjustment(formData);
  }

  onFormSubmit(event: Event) {
    event.preventDefault();
    this.onSaveAdjustment();
  }
} 