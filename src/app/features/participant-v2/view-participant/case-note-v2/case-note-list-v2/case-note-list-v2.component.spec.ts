import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseNoteListV2Component } from './case-note-list-v2.component';

describe('CaseNoteListV2Component', () => {
  let component: CaseNoteListV2Component;
  let fixture: ComponentFixture<CaseNoteListV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseNoteListV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseNoteListV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
