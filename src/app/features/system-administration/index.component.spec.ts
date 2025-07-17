import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemAdministrationComponent } from './index.component';

describe('SystemAdministrationComponent', () => {
  let component: SystemAdministrationComponent;
  let fixture: ComponentFixture<SystemAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemAdministrationComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('System Administration');
  });

  it('should have admin features', () => {
    expect(component.adminFeatures.length).toBeGreaterThan(0);
  });
}); 