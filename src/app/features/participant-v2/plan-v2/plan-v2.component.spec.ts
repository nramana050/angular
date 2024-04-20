import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanV2Component } from './plan-v2.component';

describe('PlanV2Component', () => {
  let component: PlanV2Component;
  let fixture: ComponentFixture<PlanV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
