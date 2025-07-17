import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterPayrollComponent } from './master-payroll.component';

describe('MasterPayrollComponent', () => {
  let component: MasterPayrollComponent;
  let fixture: ComponentFixture<MasterPayrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterPayrollComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MasterPayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter employees based on search term', () => {
    component.searchTerm = 'Ethan';
    const filtered = component.filteredEmployees;
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Ethan Carter');
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(5000);
    expect(formatted).toBe('$5,000.00');
  });

  it('should track employees by ID', () => {
    const employee = component.employees[0];
    const tracked = component.trackByEmployeeId(0, employee);
    expect(tracked).toBe(employee.id);
  });
}); 