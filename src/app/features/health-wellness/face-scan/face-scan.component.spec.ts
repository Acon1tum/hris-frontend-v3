import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaceScanComponent } from './face-scan.component';
import { By } from '@angular/platform-browser';

describe('FaceScanComponent', () => {
  let component: FaceScanComponent;
  let fixture: ComponentFixture<FaceScanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaceScanComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render face scan report after scan', () => {
    component.faceScanReport = {
      expression: 'Happy',
      ageGroup: 'Adult',
      mole: true,
      pimples: false,
      clearSkin: true,
      faceShape: 'Oval',
      paleLips: false
    };
    fixture.detectChanges();
    const reportTitle = fixture.debugElement.query(By.css('.face-scan-report-title'));
    expect(reportTitle).toBeTruthy();
    const reportCards = fixture.debugElement.queryAll(By.css('.face-scan-report-card'));
    expect(reportCards.length).toBe(7);
    const expression = fixture.debugElement.nativeElement.textContent;
    expect(expression).toContain('Expression');
    expect(expression).toContain('Happy');
    expect(expression).toContain('Age Group');
    expect(expression).toContain('Adult');
    expect(expression).toContain('Mole');
    expect(expression).toContain('Present');
    expect(expression).toContain('Pimples');
    expect(expression).toContain('None');
    expect(expression).toContain('Clear Skin');
    expect(expression).toContain('Yes');
    expect(expression).toContain('Face Shape');
    expect(expression).toContain('Oval');
    expect(expression).toContain('Pale Lips');
    expect(expression).toContain('No');
  });
}); 