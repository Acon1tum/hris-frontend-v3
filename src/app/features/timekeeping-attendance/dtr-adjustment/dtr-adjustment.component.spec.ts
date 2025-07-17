import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtrAdjustmentComponent } from './dtr-adjustment.component';

describe('DtrAdjustmentComponent', () => {
  let component: DtrAdjustmentComponent;
  let fixture: ComponentFixture<DtrAdjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DtrAdjustmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DtrAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 