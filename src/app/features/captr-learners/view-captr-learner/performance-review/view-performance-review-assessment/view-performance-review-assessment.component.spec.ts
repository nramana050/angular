import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewPerformanceReviewAssessmentComponent } from './view-performance-review-assessment.component';

describe('CompleteAssessmentComponent', () => {
  let component: ViewPerformanceReviewAssessmentComponent;
  let fixture: ComponentFixture<ViewPerformanceReviewAssessmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPerformanceReviewAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPerformanceReviewAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
