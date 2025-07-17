import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobPortalManagementComponent } from './index.component';

describe('JobPortalManagementComponent', () => {
  let component: JobPortalManagementComponent;
  let fixture: ComponentFixture<JobPortalManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobPortalManagementComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobPortalManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Job Portal Management');
  });
}); 