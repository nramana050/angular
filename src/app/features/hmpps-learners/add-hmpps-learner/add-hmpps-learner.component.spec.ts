import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHmppsLearnerComponent } from './add-hmpps-learner.component';

describe('AddHmppsLearnerComponent', () => {
  let component: AddHmppsLearnerComponent;
  let fixture: ComponentFixture<AddHmppsLearnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHmppsLearnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHmppsLearnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
