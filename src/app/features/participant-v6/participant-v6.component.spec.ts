import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantV6Component } from './participant-v6.component';

describe('ParticipantV6Component', () => {
  let component: ParticipantV6Component;
  let fixture: ComponentFixture<ParticipantV6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantV6Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantV6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
