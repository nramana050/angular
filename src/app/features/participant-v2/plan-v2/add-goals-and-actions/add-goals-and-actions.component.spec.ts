import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGoalsAndActionsComponent } from './add-goals-and-actions.component';

describe('AddGoalsAndActionsComponent', () => {
  let component: AddGoalsAndActionsComponent;
  let fixture: ComponentFixture<AddGoalsAndActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGoalsAndActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGoalsAndActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
