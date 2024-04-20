import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantToDoComponent } from './participant-to-do.component';

describe('ParticipantToDoComponent', () => {
  let component: ParticipantToDoComponent;
  let fixture: ComponentFixture<ParticipantToDoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantToDoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantToDoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
