import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerformanceManagementComponent } from './index.component';

describe('PerformanceManagementComponent', () => {
  let component: PerformanceManagementComponent;
  let fixture: ComponentFixture<PerformanceManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceManagementComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Performance Management');
  });

  it('should have performance features', () => {
    expect(component.performanceFeatures.length).toBeGreaterThan(0);
  });

  it('should have fade-in animation class on main container', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.layout-content-container').classList).toContain('fade-in');
  });

  it('should show and hide bar tooltip on hover', () => {
    const fixture = TestBed.createComponent(PerformanceManagementComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    // Simulate hovering a department bar
    component.hoveredDept = 'IT';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.grid-flow-col .absolute')).toBeTruthy();
    // Simulate mouse leave
    component.hoveredDept = null;
    fixture.detectChanges();
    expect(compiled.querySelector('.grid-flow-col .absolute')).toBeFalsy();
  });
}); 