import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditParticipantV4Component } from './add-edit-participant-v4.component';

describe('AddEditParticipantV4Component', () => {
  let component: AddEditParticipantV4Component;
  let fixture: ComponentFixture<AddEditParticipantV4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditParticipantV4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditParticipantV4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
