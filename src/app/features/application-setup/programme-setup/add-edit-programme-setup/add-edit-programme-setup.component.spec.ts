import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProgrammeSetupComponent } from './add-edit-programme-setup.component';

describe('AddEditProgrammeSetupComponent', () => {
  let component: AddEditProgrammeSetupComponent;
  let fixture: ComponentFixture<AddEditProgrammeSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditProgrammeSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditProgrammeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
