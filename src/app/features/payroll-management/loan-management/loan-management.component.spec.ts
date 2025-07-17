import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanManagementComponent } from './loan-management.component';

describe('LoanManagementComponent', () => {
  let component: LoanManagementComponent;
  let fixture: ComponentFixture<LoanManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoanManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.title).toBe('Loan Management');
    expect(component.activeTab).toBe('consolidated');
    expect(component.loanTabs.length).toBe(4);
    expect(component.auditTrail.length).toBe(4);
  });

  it('should switch tabs correctly', () => {
    component.onTabClick('policy');
    expect(component.activeTab).toBe('policy');
    expect(component.loanTabs.find(tab => tab.id === 'policy')?.active).toBe(true);
    expect(component.loanTabs.find(tab => tab.id === 'consolidated')?.active).toBe(false);
  });

  it('should call console.log on new loan button click', () => {
    spyOn(console, 'log');
    component.onNewLoan();
    expect(console.log).toHaveBeenCalledWith('Add new loan clicked');
  });

  it('should call console.log on save changes button click', () => {
    spyOn(console, 'log');
    component.onSaveChanges();
    expect(console.log).toHaveBeenCalledWith('Save changes clicked');
  });
}); 