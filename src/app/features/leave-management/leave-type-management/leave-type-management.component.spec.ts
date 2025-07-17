import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveTypeManagementComponent } from './leave-type-management.component';

describe('LeaveTypeManagementComponent', () => {
  let component: LeaveTypeManagementComponent;
  let fixture: ComponentFixture<LeaveTypeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveTypeManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeaveTypeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties', () => {
    expect(component.leaveTypes).toBeDefined();
    expect(component.isLoading).toBeDefined();
  });

  it('should have leave types array initialized', () => {
    expect(component.leaveTypes).toBeDefined();
    expect(Array.isArray(component.leaveTypes)).toBe(true);
  });

  it('should handle add new leave type', () => {
    component.onAddLeaveType();
    expect(component.showAddModal).toBe(true);
  });

  it('should handle edit leave type', () => {
    const mockLeaveType = {
      id: '1',
      leave_type_name: 'Test Leave',
      description: 'Test Description',
      requires_document: false,
      max_days: 10,
      is_active: true
    };
    component.onEditLeaveType(mockLeaveType);
    expect(component.showEditModal).toBe(true);
    expect(component.editForm.id).toBe('1');
  });

  it('should handle delete leave type', () => {
    const mockLeaveType = {
      id: '1',
      leave_type_name: 'Test Leave',
      description: 'Test Description',
      requires_document: false,
      max_days: 10,
      is_active: true
    };
    component.onDeleteLeaveType(mockLeaveType);
    expect(component.showDeleteModal).toBe(true);
    expect(component.leaveTypeToDelete).toBe(mockLeaveType);
  });
}); 