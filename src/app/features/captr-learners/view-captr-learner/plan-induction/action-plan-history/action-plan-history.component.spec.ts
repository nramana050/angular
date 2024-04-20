import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanHistoryComponent } from './action-plan-history.component';

describe('ActionPlanHistoryComponent', () => {
  let component: ActionPlanHistoryComponent;
  let fixture: ComponentFixture<ActionPlanHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
