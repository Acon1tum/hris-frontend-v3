import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnlineJobApplicationPortalComponent } from './index.component';

describe('OnlineJobApplicationPortalComponent', () => {
  let component: OnlineJobApplicationPortalComponent;
  let fixture: ComponentFixture<OnlineJobApplicationPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineJobApplicationPortalComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineJobApplicationPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Online Job Application Portal');
  });

  it('should have jobs listed', () => {
    expect(component.jobs.length).toBeGreaterThan(0);
  });
}); 