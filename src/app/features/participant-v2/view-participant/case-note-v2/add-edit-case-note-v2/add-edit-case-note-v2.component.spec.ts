import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCaseNoteV2Component } from './add-edit-case-note-v2.component';

describe('AddEditCaseNoteV2Component', () => {
  let component: AddEditCaseNoteV2Component;
  let fixture: ComponentFixture<AddEditCaseNoteV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCaseNoteV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCaseNoteV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
