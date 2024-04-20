import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceSessionComponent } from './attendance-session.component';

describe('AttendanceSessionComponent', () => {
  let component: AttendanceSessionComponent;
  let fixture: ComponentFixture<AttendanceSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceSessionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
