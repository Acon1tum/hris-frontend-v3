import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardComponent } from './admin-dashboard.component';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title', () => {
    expect(component.title).toBe('Personnel Information Management');
  });

  it('should have recent employees', () => {
    expect(component.recentEmployees).toBeDefined();
    expect(component.recentEmployees.length).toBeGreaterThan(0);
  });

  it('should call onEditEmployee when edit is triggered', () => {
    spyOn(console, 'log');
    const mockEmployee = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      department: 'IT',
      position: 'Developer',
      status: 'Active',
      hireDate: '2022-01-01',
      profileImage: ''
    };
    component.onEditEmployee(mockEmployee);
    // You may want to check for actual edit logic or modal opening instead of console.log
  });

  it('should call onDeleteEmployee when delete is triggered', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const mockEmployee = {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      department: 'HR',
      position: 'Manager',
      status: 'Active',
      hireDate: '2021-05-10',
      profileImage: ''
    };
    component.onDeleteEmployee(mockEmployee);
    // You may want to check for actual delete logic instead of console.log
  });
}); 