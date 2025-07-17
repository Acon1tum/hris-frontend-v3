import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditModalComponent, Personnel201ModalData } from './create-edit-modal.component';
import { By } from '@angular/platform-browser';

describe('CreateEditModalComponent', () => {
  let component: CreateEditModalComponent;
  let fixture: ComponentFixture<CreateEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditModalComponent);
    component = fixture.componentInstance;
    component.data = {
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      email: '',
      number: '',
      address: '',
      department: '',
      position: '',
      file: null
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all form fields', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('input[name="firstName"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="middleName"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="lastName"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="suffix"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="department"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="position"]')).toBeTruthy();
    expect(compiled.querySelector('input[type="file"]')).toBeTruthy();
  });

  it('should hide validation message when OK is clicked', () => {
    component.showValidationMessage = true;
    fixture.detectChanges();
    const okButton = fixture.debugElement.query(By.css('button'));
    okButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.showValidationMessage).toBeFalse();
  });

  it('should render username, password, and confirm password fields', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('input[name="username"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="password"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="confirmPassword"]')).toBeTruthy();
  });

  it('should show validation error if password and confirm password do not match', () => {
    component.data.username = 'testuser';
    component.data.password = 'password1';
    component.data.confirmPassword = 'password2';
    component.formSubmitted = true;
    fixture.detectChanges();
    const errorMsg = fixture.nativeElement.querySelector('.text-red-500');
    expect(errorMsg?.textContent).toContain('Passwords do not match');
  });
}); 