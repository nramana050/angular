import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditCaseNotesComponent } from './add-or-edit-case-notes.component';

describe('AddOrEditCaseNotesComponent', () => {
  let component: AddOrEditCaseNotesComponent;
  let fixture: ComponentFixture<AddOrEditCaseNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOrEditCaseNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrEditCaseNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
