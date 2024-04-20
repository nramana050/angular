import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseNoteComponent } from './case-note.component';

describe('CaseNoteComponent', () => {
  let component: CaseNoteComponent;
  let fixture: ComponentFixture<CaseNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
