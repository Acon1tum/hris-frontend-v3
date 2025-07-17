import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensitiveReportsComponent } from './sensitive-reports.component';

describe('SensitiveReportsComponent', () => {
  let component: SensitiveReportsComponent;
  let fixture: ComponentFixture<SensitiveReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SensitiveReportsComponent]
    });
    fixture = TestBed.createComponent(SensitiveReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
