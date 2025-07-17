import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrailComponent } from './audit-trail.component';

describe('AuditTrailComponent', () => {
  let component: AuditTrailComponent;
  let fixture: ComponentFixture<AuditTrailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AuditTrailComponent]
    });
    fixture = TestBed.createComponent(AuditTrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
