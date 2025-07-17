import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeSelfServiceComponent } from './index.component';

describe('EmployeeSelfServiceComponent', () => {
  let component: EmployeeSelfServiceComponent;
  let fixture: ComponentFixture<EmployeeSelfServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSelfServiceComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSelfServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Employee Self-Service');
  });

  it('should have self service features', () => {
    expect(component.selfServiceFeatures.length).toBeGreaterThan(0);
  });
}); 