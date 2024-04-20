import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompleteAssessmentComponent } from './complete-assessment.component';

describe('CompleteAssessmentComponent', () => {
  let component: CompleteAssessmentComponent;
  let fixture: ComponentFixture<CompleteAssessmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
