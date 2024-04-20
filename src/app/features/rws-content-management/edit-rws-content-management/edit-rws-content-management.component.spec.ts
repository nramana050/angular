import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRwsContentManagementComponent } from './edit-rws-content-management.component';

describe('EditRwsContentManagementComponent', () => {
  let component: EditRwsContentManagementComponent;
  let fixture: ComponentFixture<EditRwsContentManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRwsContentManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRwsContentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
