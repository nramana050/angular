import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantProfessionalViewComponent } from './participant-professional-view.component';

describe('ParticipantProfessionalViewComponent', () => {
  let component: ParticipantProfessionalViewComponent;
  let fixture: ComponentFixture<ParticipantProfessionalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantProfessionalViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantProfessionalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
