import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCaseNoteComponent } from './view-case-note.component';

describe('ViewCaseNoteComponent', () => {
  let component: ViewCaseNoteComponent;
  let fixture: ComponentFixture<ViewCaseNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCaseNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCaseNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
