import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompleteAssessmentsComponent } from './complete-assessments.component';

describe('CompleteAssessmentsComponent', () => {
  let component: CompleteAssessmentsComponent;
  let fixture: ComponentFixture<CompleteAssessmentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteAssessmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
