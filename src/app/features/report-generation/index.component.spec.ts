import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportGenerationComponent } from './index.component';

describe('ReportGenerationComponent', () => {
  let component: ReportGenerationComponent;
  let fixture: ComponentFixture<ReportGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportGenerationComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Report Generation');
  });

  it('should have report features', () => {
    expect(component.reportFeatures.length).toBeGreaterThan(0);
  });
}); 