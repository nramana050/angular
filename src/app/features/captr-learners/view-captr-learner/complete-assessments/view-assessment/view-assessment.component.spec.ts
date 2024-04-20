import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewCompleteAssessmentComponent } from './view-assessment.component';

describe('CompleteAssessmentComponent', () => {
  let component: ViewCompleteAssessmentComponent;
  let fixture: ComponentFixture<ViewCompleteAssessmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompleteAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompleteAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
