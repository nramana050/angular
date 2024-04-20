import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseNoteV2Component } from './case-note-v2.component';

describe('CaseNoteV2Component', () => {
  let component: CaseNoteV2Component;
  let fixture: ComponentFixture<CaseNoteV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseNoteV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseNoteV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
