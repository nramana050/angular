import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackReviewComponent } from './feedback-review.component';

describe('FeedbackReviewComponent', () => {
  let component: FeedbackReviewComponent;
  let fixture: ComponentFixture<FeedbackReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
