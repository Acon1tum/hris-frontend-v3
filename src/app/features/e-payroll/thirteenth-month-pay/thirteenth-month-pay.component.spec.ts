import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirteenthMonthPayComponent } from './thirteenth-month-pay.component';

describe('ThirteenthMonthPayComponent', () => {
  let component: ThirteenthMonthPayComponent;
  let fixture: ComponentFixture<ThirteenthMonthPayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThirteenthMonthPayComponent]
    });
    fixture = TestBed.createComponent(ThirteenthMonthPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
