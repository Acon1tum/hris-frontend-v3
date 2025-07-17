import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { PayrollAdjustmentComponent } from './payroll-adjustment.component';

describe('PayrollAdjustmentComponent', () => {
  let component: PayrollAdjustmentComponent;
  let fixture: ComponentFixture<PayrollAdjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollAdjustmentComponent, FormsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayrollAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.title).toBe('Record Adjustments');
    expect(component.subtitle).toBe('Manage and record adjustments for payroll, including recurring and one-time adjustments.');
    expect(component.adjustmentType).toBe('recurring');
    expect(component.adjustmentName).toBe('');
    expect(component.taxability).toBe('');
    expect(component.justification).toBe('');
    expect(component.amount).toBe('');
    expect(component.manualOverride).toBe(false);
  });

  it('should have correct adjustment types', () => {
    expect(component.adjustmentTypes.length).toBe(2);
    expect(component.adjustmentTypes[0]).toEqual({ id: 'recurring', label: 'Recurring' });
    expect(component.adjustmentTypes[1]).toEqual({ id: 'onetime', label: 'One-Time' });
  });

  it('should have correct taxability options', () => {
    expect(component.taxabilityOptions.length).toBe(3);
    expect(component.taxabilityOptions[0]).toEqual({ value: '', label: 'Select taxability status', disabled: true });
    expect(component.taxabilityOptions[1]).toEqual({ value: 'taxable', label: 'Taxable' });
    expect(component.taxabilityOptions[2]).toEqual({ value: 'non-taxable', label: 'Non-Taxable' });
  });

  it('should change adjustment type', () => {
    component.onAdjustmentTypeChange('onetime');
    expect(component.adjustmentType).toBe('onetime');
  });

  it('should call console.log on save adjustment', () => {
    spyOn(console, 'log');
    component.adjustmentName = 'Test Adjustment';
    component.amount = '1000';
    
    component.onSaveAdjustment();
    
    expect(console.log).toHaveBeenCalledWith('Save adjustment clicked');
    expect(console.log).toHaveBeenCalledWith('Form data:', {
      adjustmentType: 'recurring',
      adjustmentName: 'Test Adjustment',
      taxability: '',
      justification: '',
      amount: '1000',
      manualOverride: false
    });
  });

  it('should prevent default on form submit', () => {
    const event = new Event('submit');
    spyOn(event, 'preventDefault');
    spyOn(component, 'onSaveAdjustment');
    
    component.onFormSubmit(event);
    
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.onSaveAdjustment).toHaveBeenCalled();
  });
}); 