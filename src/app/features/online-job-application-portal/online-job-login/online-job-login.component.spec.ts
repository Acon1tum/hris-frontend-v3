import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineJobLoginComponent } from './online-job-login.component';

describe('OnlineJobLoginComponent', () => {
  let component: OnlineJobLoginComponent;
  let fixture: ComponentFixture<OnlineJobLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnlineJobLoginComponent]
    });
    fixture = TestBed.createComponent(OnlineJobLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
