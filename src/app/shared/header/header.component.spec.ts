import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.app-title').textContent).toContain('HRIS Frontend');
  });

  it('should have user menu items', () => {
    expect(component.userMenuItems.length).toBeGreaterThan(0);
  });

  it('should have notifications', () => {
    expect(component.notifications.length).toBeGreaterThan(0);
  });

  it('should toggle user menu', () => {
    expect(component.showUserMenu).toBeFalse();
    component.toggleUserMenu();
    expect(component.showUserMenu).toBeTrue();
  });

  it('should toggle notifications', () => {
    expect(component.showNotifications).toBeFalse();
    component.toggleNotifications();
    expect(component.showNotifications).toBeTrue();
  });
}); 