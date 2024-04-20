import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerOutcomeComponent } from './learner-outcome.component';

describe('LearnerOutcomeComponent', () => {
  let component: LearnerOutcomeComponent;
  let fixture: ComponentFixture<LearnerOutcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearnerOutcomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerOutcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
