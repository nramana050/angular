import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReferralComponent } from './view-referral.component';

describe('ViewReferralComponent', () => {
  let component: ViewReferralComponent;
  let fixture: ComponentFixture<ViewReferralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewReferralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
