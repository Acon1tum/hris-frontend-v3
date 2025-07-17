import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductionsComponent } from './deductions.component';

describe('DeductionsComponent', () => {
  let component: DeductionsComponent;
  let fixture: ComponentFixture<DeductionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeductionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeductionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter tax brackets based on search term', () => {
    component.searchTerm = 'Bracket 1';
    const filtered = component.filteredBrackets;
    expect(filtered.length).toBe(1);
    expect(filtered[0].bracket).toBe('Bracket 1');
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(5000);
    expect(formatted).toBe('$5,000.00');
  });

  it('should format percentage correctly', () => {
    const formatted = component.formatPercentage(25);
    expect(formatted).toBe('25%');
  });

  it('should handle null max income correctly', () => {
    const formatted = component.formatMaxIncome(null);
    expect(formatted).toBe('and above');
  });

  it('should track tax brackets by ID', () => {
    const bracket = component.taxBrackets[0];
    const tracked = component.trackByBracketId(0, bracket);
    expect(tracked).toBe(bracket.id);
  });

  it('should switch tabs correctly', () => {
    const tab = component.deductionTabs[1]; // Pag-Ibig tab
    component.onTabClick(tab);
    expect(tab.active).toBe(true);
    expect(component.activeTab).toBe(tab.id);
    expect(component.deductionTabs[0].active).toBe(false); // BIR tab should be inactive
  });
}); 