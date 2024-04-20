import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLearnerComponent } from './add-learner.component';

describe('AddLearnerComponent', () => {
  let component: AddLearnerComponent;
  let fixture: ComponentFixture<AddLearnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLearnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLearnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
