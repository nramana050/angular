import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCaptrLearnerComponent } from './add-captr-learner.component';

describe('AddCaptrLearnerComponent', () => {
  let component: AddCaptrLearnerComponent;
  let fixture: ComponentFixture<AddCaptrLearnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCaptrLearnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCaptrLearnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
