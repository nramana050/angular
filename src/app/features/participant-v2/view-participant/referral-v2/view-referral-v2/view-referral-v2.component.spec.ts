import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReferralV2Component } from './view-referral-v2.component';

describe('ViewReferralV2Component', () => {
  let component: ViewReferralV2Component;
  let fixture: ComponentFixture<ViewReferralV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewReferralV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReferralV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
