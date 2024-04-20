import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAttendanceSessionComponent } from './view-attendance-session.component';

describe('ViewAttendanceSessionComponent', () => {
  let component: ViewAttendanceSessionComponent;
  let fixture: ComponentFixture<ViewAttendanceSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAttendanceSessionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAttendanceSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
