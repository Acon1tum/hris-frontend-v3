import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DigitalFootprintComponent } from './digital-footprint.component';
import { By } from '@angular/platform-browser';

describe('DigitalFootprintComponent', () => {
  let component: DigitalFootprintComponent;
  let fixture: ComponentFixture<DigitalFootprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitalFootprintComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalFootprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading initially', () => {
    component.loading = true;
    fixture.detectChanges();
    const loadingEl = fixture.debugElement.query(By.css('.digital-footprint-loading'));
    expect(loadingEl).toBeTruthy();
  });

  it('should display summary and activities after loading', () => {
    component.loading = false;
    component.summary = {
      totalLogins: 10,
      wellnessActivities: 5,
      lastActive: '2024-06-10 14:23',
    };
    component.activities = [
      { date: '2024-06-10', activity: 'Login', details: 'Web Portal' },
      { date: '2024-06-09', activity: 'Completed Wellness Survey', details: 'Monthly Check-in' },
    ];
    fixture.detectChanges();
    const summaryEls = fixture.debugElement.queryAll(By.css('.summary-item'));
    expect(summaryEls.length).toBe(3);
    const activityRows = fixture.debugElement.queryAll(By.css('.activities-table tbody tr'));
    expect(activityRows.length).toBe(2);
  });

  it('should show no activities message if activities is empty', () => {
    component.loading = false;
    component.summary = {
      totalLogins: 10,
      wellnessActivities: 5,
      lastActive: '2024-06-10 14:23',
    };
    component.activities = [];
    fixture.detectChanges();
    const noActivitiesEl = fixture.debugElement.query(By.css('.no-activities'));
    expect(noActivitiesEl).toBeTruthy();
  });
}); 