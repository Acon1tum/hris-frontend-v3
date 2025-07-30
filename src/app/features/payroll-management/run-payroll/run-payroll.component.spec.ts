import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunPayrollComponent } from './run-payroll.component';

describe('RunPayrollComponent', () => {
  let component: RunPayrollComponent;
  let fixture: ComponentFixture<RunPayrollComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RunPayrollComponent]
    });
    fixture = TestBed.createComponent(RunPayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
