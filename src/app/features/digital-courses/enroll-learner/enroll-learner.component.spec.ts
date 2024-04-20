import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EnrollLearnerComponent } from './enroll-learner.component';

describe('EnrollLearnerComponent', () => {
  let component: EnrollLearnerComponent;
  let fixture: ComponentFixture<EnrollLearnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollLearnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollLearnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
