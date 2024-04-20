import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantV4Component } from './participant-v4.component';

describe('ParticipantV4Component', () => {
  let component: ParticipantV4Component;
  let fixture: ComponentFixture<ParticipantV4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantV4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantV4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
