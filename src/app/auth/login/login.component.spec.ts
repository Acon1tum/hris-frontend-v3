import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form data', () => {
    expect(component.loginData.username).toBe('');
    expect(component.loginData.password).toBe('');
    expect(component.loginData.rememberMe).toBe(false);
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBe(false);
    
    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(true);
    
    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(false);
  });

  it('should set demo credentials and login', () => {
    spyOn(component, 'onLogin');
    
    component.onDemoLogin('admin');
    
    expect(component.loginData.username).toBe('admin');
    expect(component.loginData.password).toBe('Admin123!');
    expect(component.onLogin).toHaveBeenCalled();
  });

  it('should handle successful login', (done) => {
    component.loginData.username = 'admin';
    component.loginData.password = 'Admin123!';
    
    component.onLogin();
    
    setTimeout(() => {
      expect(localStorage.getItem('isAuthenticated')).toBe('true');
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      done();
    }, 1600);
  });

  it('should handle failed login', (done) => {
    component.loginData.username = 'wrong';
    component.loginData.password = 'wrongpassword';
    
    component.onLogin();
    
    setTimeout(() => {
      expect(component.errorMessage).toBe('Invalid username or password. Please try again.');
      expect(localStorage.getItem('isAuthenticated')).toBeNull();
      done();
    }, 1600);
  });

  it('should show loading state during login', () => {
    expect(component.isLoading).toBe(false);
    
    component.onLogin();
    expect(component.isLoading).toBe(true);
  });

  it('should clear error message on new login attempt', (done) => {
    component.errorMessage = 'Previous error';
    component.loginData.username = 'admin';
    component.loginData.password = 'Admin123!';
    
    component.onLogin();
    expect(component.errorMessage).toBe('');
    
    setTimeout(() => {
      done();
    }, 1600);
  });

  it('should handle forgot password click', () => {
    spyOn(console, 'log');
    
    component.onForgotPassword();
    
    expect(console.log).toHaveBeenCalledWith('Forgot password clicked');
  });
}); 