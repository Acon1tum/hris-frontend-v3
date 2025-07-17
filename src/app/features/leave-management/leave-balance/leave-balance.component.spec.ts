import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { LeaveBalanceComponent } from './leave-balance.component';

describe('LeaveBalanceComponent', () => {
  let component: LeaveBalanceComponent;
  let fixture: ComponentFixture<LeaveBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveBalanceComponent, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title and subtitle', () => {
    expect(component.title).toBe('Leave Balances');
    expect(component.subtitle).toBe('Manage and view leave balances for all employees.');
  });

  it('should filter employees based on search term', () => {
    component.searchTerm = 'Ethan';
    component.onSearchChange();
    expect(component.filteredEmployees.length).toBe(1);
    expect(component.filteredEmployees[0].name).toBe('Ethan Carter');
  });

  it('should handle pagination correctly', () => {
    expect(component.currentPage).toBe(1);
    expect(component.currentPage === 1).toBe(true); // replaces isPreviousDisabled
    component.onPageChange(component.currentPage + 1); // replaces nextPage()
    // Since we have 5 employees and 5 items per page, we should still be on page 1
    expect(component.currentPage).toBe(1);
  });

  it('should call viewDetails method', () => {
    spyOn(console, 'log');
    const employee = component.employees[0];
    component.viewDetails(employee);
    expect(console.log).toHaveBeenCalledWith('View details for:', employee.name);
  });

  it('should call adjustCredits method', () => {
    spyOn(console, 'log');
    component.adjustCredits();
    expect(console.log).toHaveBeenCalledWith('Adjust credits clicked');
  });
}); 