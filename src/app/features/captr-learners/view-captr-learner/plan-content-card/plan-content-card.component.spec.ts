import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlanContentCardComponent } from './plan-content-card.component';

describe('PlanContentCardComponent', () => {
  let component: PlanContentCardComponent;
  let fixture: ComponentFixture<PlanContentCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanContentCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanContentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
