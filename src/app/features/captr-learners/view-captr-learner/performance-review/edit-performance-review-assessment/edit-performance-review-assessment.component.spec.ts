import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditPerformanceReviewAssessmentComponent } from './edit-performance-review-assessment.component';

describe('CompleteAssessmentComponent', () => {
  let component: EditPerformanceReviewAssessmentComponent;
  let fixture: ComponentFixture<EditPerformanceReviewAssessmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPerformanceReviewAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPerformanceReviewAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
