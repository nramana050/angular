import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProgrammeEnrolmentComponent } from './view-programme-enrolment.component';

describe('ViewProgrammeEnrolmentComponent', () => {
  let component: ViewProgrammeEnrolmentComponent;
  let fixture: ComponentFixture<ViewProgrammeEnrolmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProgrammeEnrolmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProgrammeEnrolmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
