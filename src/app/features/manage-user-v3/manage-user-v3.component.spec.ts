import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserV3Component } from './manage-user-v3.component';

describe('ManageUserV3Component', () => {
  let component: ManageUserV3Component;
  let fixture: ComponentFixture<ManageUserV3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserV3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserV3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
