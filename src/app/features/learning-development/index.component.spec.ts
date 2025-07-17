import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LearningDevelopmentComponent } from './index.component';

describe('LearningDevelopmentComponent', () => {
  let component: LearningDevelopmentComponent;
  let fixture: ComponentFixture<LearningDevelopmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningDevelopmentComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningDevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Learning & Development');
  });

  it('should have learning features', () => {
    expect(component.learningFeatures.length).toBeGreaterThan(0);
  });
}); 