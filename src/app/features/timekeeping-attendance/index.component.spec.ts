import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimekeepingAttendanceComponent } from './index.component';

describe('TimekeepingAttendanceComponent', () => {
  let component: TimekeepingAttendanceComponent;
  let fixture: ComponentFixture<TimekeepingAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimekeepingAttendanceComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimekeepingAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Timekeeping & Attendance');
  });

  it('should have timekeeping features', () => {
    expect(component.timekeepingFeatures.length).toBeGreaterThan(0);
  });
}); 