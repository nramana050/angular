import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DowngradePlanComponent } from './downgrade-plan.component';

describe('DowngradePlanComponent', () => {
  let component: DowngradePlanComponent;
  let fixture: ComponentFixture<DowngradePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DowngradePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DowngradePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
