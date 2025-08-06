import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPayrollComponent } from './e-payroll.component';

describe('EPayrollComponent', () => {
  let component: EPayrollComponent;
  let fixture: ComponentFixture<EPayrollComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EPayrollComponent]
    });
    fixture = TestBed.createComponent(EPayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
