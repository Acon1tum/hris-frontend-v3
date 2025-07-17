import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WellnessEventsComponent } from './wellness-events.component';
import { Router } from '@angular/router';

describe('WellnessEventsComponent', () => {
  let component: WellnessEventsComponent;
  let fixture: ComponentFixture<WellnessEventsComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [WellnessEventsComponent],
      providers: [{ provide: Router, useValue: routerSpy }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WellnessEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have events for July and August', () => {
    expect(component.eventsByMonth.length).toBe(2);
    expect(component.eventsByMonth[0].label).toContain('July');
    expect(component.eventsByMonth[1].label).toContain('August');
  });

  it('should alert when registering for an event', () => {
    spyOn(window, 'alert');
    const event = component.eventsByMonth[0].events[0];
    component.register(event);
    expect(window.alert).toHaveBeenCalledWith(`You have registered for: ${event.title}`);
  });

  it('should alert when adding to calendar', () => {
    spyOn(window, 'alert');
    const event = component.eventsByMonth[0].events[0];
    component.addToCalendar(event);
    expect(window.alert).toHaveBeenCalledWith(`Added to calendar: ${event.title}`);
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/health-wellness']);
  });
}); 