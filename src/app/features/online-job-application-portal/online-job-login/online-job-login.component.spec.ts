import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { OnlineJobLoginComponent } from './online-job-login.component';
import { JobPortalAuthService } from '../job-portal-auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

describe('OnlineJobLoginComponent', () => {
  let component: OnlineJobLoginComponent;
  let fixture: ComponentFixture<OnlineJobLoginComponent>;
  let jobPortalAuthService: jasmine.SpyObj<JobPortalAuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['setCurrentUser', 'getToken', 'isAuthenticated']);
    const jobPortalAuthServiceSpy = jasmine.createSpyObj('JobPortalAuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule, 
        FormsModule, 
        OnlineJobLoginComponent,
        HttpClientModule
      ],
      providers: [
        { provide: JobPortalAuthService, useValue: jobPortalAuthServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OnlineJobLoginComponent);
    component = fixture.componentInstance;
    jobPortalAuthService = TestBed.inject(JobPortalAuthService) as jasmine.SpyObj<JobPortalAuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call auth service on login and navigate on success', fakeAsync(() => {
    const mockApplicant = {
      id: '1',
      user_id: '1',
      first_name: 'Demo',
      last_name: 'User',
      email: 'demo@example.com',
      phone: '1234567890',
      is_existing_employee: false,
      application_date: new Date().toISOString()
    };

    jobPortalAuthService.login.and.returnValue(of(mockApplicant));

    component.loginData.email = 'demo@example.com';
    component.loginData.password = 'demo123';

    component.onLogin();
    tick(1000); // Wait for the async login call to complete

    expect(jobPortalAuthService.login).toHaveBeenCalledWith('demo@example.com', 'demo123');
    expect(component.successMessage).toBe('Login successful! Redirecting...');
    expect(component.isLoading).toBe(false);
  }));

  it('should set error message on login failure', fakeAsync(() => {
    jobPortalAuthService.login.and.returnValue(throwError(() => new Error('Invalid credentials')));

    component.loginData.email = 'test@example.com';
    component.loginData.password = 'wrongpassword';

    component.onLogin();
    tick(1000); // Wait for the async login call to complete

    expect(component.errorMessage).toBe('Invalid credentials');
    expect(component.isLoading).toBe(false);
  }));

  it('should show error if email or password is not provided', () => {
    component.onLogin();
    expect(component.errorMessage).toBe('Please enter both email and password');
  });

  it('should navigate to register page', () => {
    component.goToRegister();
    expect(router.navigate).toHaveBeenCalledWith(['/online-job-application-portal/register']);
  });

  it('should set demo credentials and call login', () => {
    spyOn(component, 'onLogin');
    component.onDemoLogin();
    
    expect(component.loginData.email).toBe('demo@example.com');
    expect(component.loginData.password).toBe('demo123');
    expect(component.onLogin).toHaveBeenCalled();
  });
});