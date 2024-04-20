import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActionGoalModalComponent } from './add-action-goal-modal.component';

describe('AddActionGoalModalComponent', () => {
  let component: AddActionGoalModalComponent;
  let fixture: ComponentFixture<AddActionGoalModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddActionGoalModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActionGoalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
