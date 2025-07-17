import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeePayrollComponent } from './employee-payroll.component';

describe('EmployeePayrollComponent', () => {
  let component: EmployeePayrollComponent;
  let fixture: ComponentFixture<EmployeePayrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeePayrollComponent, CommonModule, FormsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeePayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default employee data', () => {
    expect(component.employeeName).toBe('Sarah Miller');
    expect(component.currentMonth).toBe('July 2024');
    expect(component.selectedMonth).toBe('July 2024');
  });

  it('should have correct payslip data structure', () => {
    expect(component.payslipData).toBeDefined();
    expect(component.payslipData.grossSalary).toBe(3000.00);
    expect(component.payslipData.netAmount).toBe(2500.00);
    expect(component.payslipData.mandatoryDeductions.items.length).toBe(4);
    expect(component.payslipData.loanDeductions.items.length).toBe(4);
  });

  it('should have employee information', () => {
    expect(component.employeeInfo.name).toBe('Sarah Miller');
    expect(component.employeeInfo.id).toBe('EMP12345');
    expect(component.employeeInfo.monthlySalary).toBe(3000.00);
  });

  it('should have loan summary data', () => {
    expect(component.loanSummary.length).toBe(3);
    expect(component.loanSummary[0].type).toBe('Consolidated Loan');
  });

  it('should have contribution tracker data', () => {
    expect(component.contributionTracker.length).toBe(3);
    expect(component.contributionTracker[0].name).toBe('Pag-Ibig Contributions');
  });

  it('should calculate totals correctly on init', () => {
    component.ngOnInit();
    expect(component.totalDeductions).toBe(500.00);
    expect(component.netPay).toBe(2500.00);
    expect(component.activeLoansTotal).toBe(4500.00); // 3000 + 1000 + 500
  });

  it('should handle month change', () => {
    spyOn(console, 'log');
    spyOn(component, 'loadPayslipForMonth' as any);
    
    component.selectedMonth = 'June 2024';
    component.onMonthChange();
    
    expect(console.log).toHaveBeenCalledWith('Month changed to:', 'June 2024');
    expect((component as any).loadPayslipForMonth).toHaveBeenCalledWith('June 2024');
  });

  it('should handle payslip download', () => {
    spyOn(console, 'log');
    
    component.downloadPayslip();
    
    expect(console.log).toHaveBeenCalledWith('Downloading payslip for:', component.selectedMonth);
  });

  it('should have available months array', () => {
    expect(component.availableMonths.length).toBe(5);
    expect(component.availableMonths[0].value).toBe('July 2024');
    expect(component.availableMonths[0].label).toBe('July 2024');
  });

  it('should calculate active loans total correctly', () => {
    const expectedTotal = component.loanSummary.reduce((total, loan) => total + loan.remainingBalance, 0);
    component.ngOnInit();
    expect(component.activeLoansTotal).toBe(expectedTotal);
  });
}); 