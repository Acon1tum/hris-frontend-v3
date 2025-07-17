import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveManagementComponent } from './index.component';

describe('LeaveManagementComponent', () => {
  let component: LeaveManagementComponent;
  let fixture: ComponentFixture<LeaveManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveManagementComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Leave Management');
  });

  it('should have leave features', () => {
    expect(component.leaveFeatures.length).toBeGreaterThan(0);
  });
}); 