import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCaseNoteV2Component } from './view-case-note-v2.component';

describe('ViewCaseNoteV2Component', () => {
  let component: ViewCaseNoteV2Component;
  let fixture: ComponentFixture<ViewCaseNoteV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCaseNoteV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCaseNoteV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
