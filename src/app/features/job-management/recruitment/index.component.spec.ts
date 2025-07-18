import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecruitmentComponent } from './index.component';

describe('RecruitmentComponent', () => {
  let component: RecruitmentComponent;
  let fixture: ComponentFixture<RecruitmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruitmentComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Recruitment');
  });

  it('should have recruitment features', () => {
    expect(component.recruitmentFeatures.length).toBeGreaterThan(0);
  });
}); 