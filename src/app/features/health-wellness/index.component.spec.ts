import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HealthWellnessComponent } from './index.component';

describe('HealthWellnessComponent', () => {
  let component: HealthWellnessComponent;
  let fixture: ComponentFixture<HealthWellnessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthWellnessComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthWellnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Health & Wellness');
  });

  it('should have health features', () => {
    expect(component.healthFeatures.length).toBeGreaterThan(0);
  });
}); 