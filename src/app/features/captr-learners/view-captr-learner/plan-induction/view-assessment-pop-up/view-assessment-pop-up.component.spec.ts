import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssessmentPopUpComponent } from './view-assessment-pop-up.component';

describe('ViewAssessmentPopUpComponent', () => {
  let component: ViewAssessmentPopUpComponent;
  let fixture: ComponentFixture<ViewAssessmentPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAssessmentPopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAssessmentPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
