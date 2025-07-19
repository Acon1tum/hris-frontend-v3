import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineJobRegisterComponent } from './online-job-register.component';

describe('OnlineJobRegisterComponent', () => {
  let component: OnlineJobRegisterComponent;
  let fixture: ComponentFixture<OnlineJobRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnlineJobRegisterComponent]
    });
    fixture = TestBed.createComponent(OnlineJobRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
