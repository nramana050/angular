import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCaseNotesV2Component } from './print-case-notes-v2.component';

describe('PrintCaseNotesV2Component', () => {
  let component: PrintCaseNotesV2Component;
  let fixture: ComponentFixture<PrintCaseNotesV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCaseNotesV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCaseNotesV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
