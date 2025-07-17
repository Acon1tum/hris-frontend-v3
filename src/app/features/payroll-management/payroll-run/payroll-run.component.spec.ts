import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { PayrollRunComponent } from './payroll-run.component';

describe('PayrollRunComponent', () => {
  let component: PayrollRunComponent;
  let fixture: ComponentFixture<PayrollRunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollRunComponent, FormsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayrollRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.title).toBe('Create Payroll Run');
    expect(component.cutoffStartDate).toBe('');
    expect(component.cutoffEndDate).toBe('');
    expect(component.employeeFilter).toBe('all');
    expect(component.oneTimePayDescription).toBe('');
    expect(component.oneTimePayAmount).toBe('');
    expect(component.firstPay).toBe(false);
    expect(component.finalPay).toBe(false);
  });

  it('should have correct employee filter options', () => {
    expect(component.employeeFilterOptions.length).toBe(3);
    expect(component.employeeFilterOptions[0]).toEqual({ id: 'all', label: 'All Employees' });
    expect(component.employeeFilterOptions[1]).toEqual({ id: 'department', label: 'By Departments' });
    expect(component.employeeFilterOptions[2]).toEqual({ id: 'contract', label: 'By Contract Types' });
  });

  it('should have correct payroll summary data', () => {
    expect(component.payrollSummary.length).toBe(5);
    expect(component.payrollSummary[0]).toEqual({ label: 'Gross Salary', amount: 120000.00 });
    expect(component.payrollSummary[4]).toEqual({ label: 'Net Pay', amount: 100000.00, isTotal: true });
  });

  it('should change employee filter', () => {
    spyOn(console, 'log');
    component.onEmployeeFilterChange('department');
    expect(component.employeeFilter).toBe('department');
    expect(console.log).toHaveBeenCalledWith('Employee filter changed to:', 'department');
  });

  it('should call console.log on preview', () => {
    spyOn(console, 'log');
    component.cutoffStartDate = '2024-01-01';
    component.cutoffEndDate = '2024-01-15';
    
    component.onPreview();
    
    expect(console.log).toHaveBeenCalledWith('Preview payroll run');
    expect(console.log).toHaveBeenCalledWith('Form data:', jasmine.any(Object));
  });

  it('should call console.log on finalize payroll run', () => {
    spyOn(console, 'log');
    component.oneTimePayDescription = 'Bonus';
    component.oneTimePayAmount = '1000';
    
    component.onFinalizePayrollRun();
    
    expect(console.log).toHaveBeenCalledWith('Finalize payroll run');
    expect(console.log).toHaveBeenCalledWith('Form data:', jasmine.objectContaining({
      oneTimePayDescription: 'Bonus',
      oneTimePayAmount: '1000'
    }));
  });

  it('should prevent default on form submit', () => {
    const event = new Event('submit');
    spyOn(event, 'preventDefault');
    spyOn(component, 'onFinalizePayrollRun');
    
    component.onFormSubmit(event);
    
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.onFinalizePayrollRun).toHaveBeenCalled();
  });

  it('should format currency correctly', () => {
    expect(component.formatCurrency(1000)).toBe('$1,000.00');
    expect(component.formatCurrency(1234.56)).toBe('$1,234.56');
    expect(component.formatCurrency(0)).toBe('$0.00');
  });

  it('should track summary items by label', () => {
    const testItem = { label: 'Test Item', amount: 100 };
    const result = component.trackBySummaryItem(0, testItem);
    expect(result).toBe('Test Item');
  });

  it('should get complete form data', () => {
    component.cutoffStartDate = '2024-01-01';
    component.cutoffEndDate = '2024-01-15';
    component.employeeFilter = 'department';
    component.oneTimePayDescription = 'Bonus';
    component.oneTimePayAmount = '500';
    component.firstPay = true;
    component.finalPay = false;

    const formData = component['getFormData']();

    expect(formData).toEqual({
      cutoffStartDate: '2024-01-01',
      cutoffEndDate: '2024-01-15',
      employeeFilter: 'department',
      oneTimePayDescription: 'Bonus',
      oneTimePayAmount: '500',
      firstPay: true,
      finalPay: false,
      payrollSummary: component.payrollSummary
    });
  });
}); 