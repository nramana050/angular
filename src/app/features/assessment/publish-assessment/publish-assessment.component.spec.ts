import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PublishAssessmentComponent } from './publish-assessment.component';

describe('PublishAssessmentComponent', () => {
  let component: PublishAssessmentComponent;
  let fixture: ComponentFixture<PublishAssessmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
