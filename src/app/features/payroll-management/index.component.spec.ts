import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayrollManagementComponent } from './index.component';

describe('PayrollManagementComponent', () => {
  let component: PayrollManagementComponent;
  let fixture: ComponentFixture<PayrollManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollManagementComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Payroll Management');
  });

  it('should have payroll features', () => {
    expect(component.payrollFeatures.length).toBeGreaterThan(0);
  });
}); 