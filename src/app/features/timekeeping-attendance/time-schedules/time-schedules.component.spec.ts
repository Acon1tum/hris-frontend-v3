import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSchedulesComponent } from './time-schedules.component';

describe('TimeSchedulesComponent', () => {
  let component: TimeSchedulesComponent;
  let fixture: ComponentFixture<TimeSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeSchedulesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimeSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 