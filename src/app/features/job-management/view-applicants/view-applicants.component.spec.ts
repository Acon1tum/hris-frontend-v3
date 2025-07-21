import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApplicantsComponent } from './view-applicants.component';

describe('ViewApplicantsComponent', () => {
  let component: ViewApplicantsComponent;
  let fixture: ComponentFixture<ViewApplicantsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewApplicantsComponent]
    });
    fixture = TestBed.createComponent(ViewApplicantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
