import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinkReferralComponent } from './clink-referral.component';

describe('ClinkReferralComponent', () => {
  let component: ClinkReferralComponent;
  let fixture: ComponentFixture<ClinkReferralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinkReferralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinkReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
