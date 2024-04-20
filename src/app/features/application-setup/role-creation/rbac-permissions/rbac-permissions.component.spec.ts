import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RbacPermissionsComponent } from './rbac-permissions.component';

describe('RbacPermissionsComponent', () => {
  let component: RbacPermissionsComponent;
  let fixture: ComponentFixture<RbacPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RbacPermissionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RbacPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
