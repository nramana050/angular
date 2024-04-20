import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditParticipantV6Component } from './add-edit-participant-v6.component';

describe('AddEditParticipantV6Component', () => {
  let component: AddEditParticipantV6Component;
  let fixture: ComponentFixture<AddEditParticipantV6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditParticipantV6Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditParticipantV6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
