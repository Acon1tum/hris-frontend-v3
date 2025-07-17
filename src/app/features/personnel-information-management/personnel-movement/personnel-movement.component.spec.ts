import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelMovementComponent } from './personnel-movement.component';

describe('PersonnelMovementComponent', () => {
  let component: PersonnelMovementComponent;
  let fixture: ComponentFixture<PersonnelMovementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PersonnelMovementComponent]
    });
    fixture = TestBed.createComponent(PersonnelMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
