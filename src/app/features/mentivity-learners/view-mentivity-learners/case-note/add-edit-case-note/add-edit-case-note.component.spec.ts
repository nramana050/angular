import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCaseNoteComponent } from './add-edit-case-note.component';

describe('AddEditCaseNoteComponent', () => {
  let component: AddEditCaseNoteComponent;
  let fixture: ComponentFixture<AddEditCaseNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCaseNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCaseNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
