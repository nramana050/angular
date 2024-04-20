import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserV2Component } from './manage-user-v2.component';

describe('ManageUserV2Component', () => {
  let component: ManageUserV2Component;
  let fixture: ComponentFixture<ManageUserV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
