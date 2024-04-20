import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanInductionComponent } from './action-plan-induction.component';

describe('ActionPlanInductionComponent', () => {
  let component: ActionPlanInductionComponent;
  let fixture: ComponentFixture<ActionPlanInductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanInductionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanInductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
