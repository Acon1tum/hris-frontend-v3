import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalPayComponent } from './final-pay.component';

describe('FinalPayComponent', () => {
  let component: FinalPayComponent;
  let fixture: ComponentFixture<FinalPayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinalPayComponent]
    });
    fixture = TestBed.createComponent(FinalPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
