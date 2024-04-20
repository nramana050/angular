import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammeAttendanceComponent } from './programme-attendance.component';

describe('ProgrammeAttendanceComponent', () => {
  let component: ProgrammeAttendanceComponent;
  let fixture: ComponentFixture<ProgrammeAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgrammeAttendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgrammeAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
