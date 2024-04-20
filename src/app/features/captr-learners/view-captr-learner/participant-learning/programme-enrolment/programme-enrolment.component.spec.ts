import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammeEnrolmentComponent } from './programme-enrolment.component';

describe('ProgrammeEnrolmentComponent', () => {
  let component: ProgrammeEnrolmentComponent;
  let fixture: ComponentFixture<ProgrammeEnrolmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgrammeEnrolmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgrammeEnrolmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
