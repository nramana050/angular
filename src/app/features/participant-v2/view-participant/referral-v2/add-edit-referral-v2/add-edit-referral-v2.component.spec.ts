import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditReferralV2Component } from './add-edit-referral-v2.component';

describe('AddEditReferralV2Component', () => {
  let component: AddEditReferralV2Component;
  let fixture: ComponentFixture<AddEditReferralV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditReferralV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditReferralV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
