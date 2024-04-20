import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalCourseProgressComponent } from './digital-course-progress.component';

describe('DigitalCourseProgressComponent', () => {
  let component: DigitalCourseProgressComponent;
  let fixture: ComponentFixture<DigitalCourseProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigitalCourseProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalCourseProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
