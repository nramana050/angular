import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantStatusPopUpComponent } from './participant-status-pop-up.component';

describe('ParticipantStatusPopUpComponent', () => {
  let component: ParticipantStatusPopUpComponent;
  let fixture: ComponentFixture<ParticipantStatusPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantStatusPopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantStatusPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
