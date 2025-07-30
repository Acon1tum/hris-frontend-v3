import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipCenterComponent } from './payslip-center.component';

describe('PayslipCenterComponent', () => {
  let component: PayslipCenterComponent;
  let fixture: ComponentFixture<PayslipCenterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayslipCenterComponent]
    });
    fixture = TestBed.createComponent(PayslipCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
