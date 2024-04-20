import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantV2Component } from './participant-v2.component';

describe('ParticipantV2Component', () => {
  let component: ParticipantV2Component;
  let fixture: ComponentFixture<ParticipantV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
