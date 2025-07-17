import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonnelInformationManagementComponent } from './index.component';

describe('PersonnelInformationManagementComponent', () => {
  let component: PersonnelInformationManagementComponent;
  let fixture: ComponentFixture<PersonnelInformationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonnelInformationManagementComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonnelInformationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Personnel Information Management');
  });

  it('should have personnel features', () => {
    expect(component.personnelFeatures.length).toBeGreaterThan(0);
  });
}); 