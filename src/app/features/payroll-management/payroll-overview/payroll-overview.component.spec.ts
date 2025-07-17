import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollOverviewComponent } from './payroll-overview.component';

describe('PayrollOverviewComponent', () => {
  let component: PayrollOverviewComponent;
  let fixture: ComponentFixture<PayrollOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title and subtitle', () => {
    expect(component.title).toBe('Payroll Overview');
    expect(component.subtitle).toBe('Real-time insights into your payroll operations');
  });

  it('should have main KPIs data', () => {
    expect(component.mainKPIs.length).toBe(3);
    expect(component.mainKPIs[0].title).toBe('Total Gross Pay');
    expect(component.mainKPIs[0].value).toBe('$1,250,000');
  });

  it('should have secondary KPIs data', () => {
    expect(component.secondaryKPIs.length).toBe(2);
    expect(component.secondaryKPIs[0].title).toBe('Total Employees Paid');
    expect(component.secondaryKPIs[1].title).toBe('Payroll Run Status');
  });

  it('should have alerts data', () => {
    expect(component.alerts.length).toBe(3);
    expect(component.alerts[0].type).toBe('error');
    expect(component.alerts[1].type).toBe('warning');
    expect(component.alerts[2].type).toBe('info');
  });

  it('should handle tab click correctly', () => {
    const weeklyTab = component.chartTabs.find(tab => tab.key === 'weekly');
    const monthlyTab = component.chartTabs.find(tab => tab.key === 'monthly');
    
    expect(monthlyTab?.active).toBe(true);
    
    if (weeklyTab) {
      component.onTabClick(weeklyTab);
      expect(weeklyTab.active).toBe(true);
      expect(monthlyTab?.active).toBe(false);
      expect(component.activeTab).toBe('weekly');
    }
  });

  it('should return correct icon color for alert types', () => {
    expect(component.getIconColor('error')).toBe('text-red-500');
    expect(component.getIconColor('warning')).toBe('text-yellow-500');
    expect(component.getIconColor('info')).toBe('text-orange-500');
    expect(component.getIconColor('unknown')).toBe('text-gray-500');
  });

  it('should handle alert action click', () => {
    spyOn(console, 'log');
    const alert = component.alerts[0];
    
    component.onAlertAction(alert);
    expect(console.log).toHaveBeenCalledWith('Alert action clicked:', alert.title);
  });
}); 