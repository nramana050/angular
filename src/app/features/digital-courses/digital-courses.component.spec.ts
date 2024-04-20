import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalCoursesComponent } from './digital-courses.component';

describe('DigitalCoursesComponent', () => {
  let component: DigitalCoursesComponent;
  let fixture: ComponentFixture<DigitalCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigitalCoursesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
