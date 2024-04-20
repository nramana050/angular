import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCaseNotesComponent } from './print-case-notes.component';

describe('PrintCaseNotesComponent', () => {
  let component: PrintCaseNotesComponent;
  let fixture: ComponentFixture<PrintCaseNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCaseNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCaseNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
