import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralV2Component } from './referral-v2.component';

describe('ReferralV2Component', () => {
  let component: ReferralV2Component;
  let fixture: ComponentFixture<ReferralV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
