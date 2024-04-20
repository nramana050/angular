import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseLaunchComponent } from './course-launch.component';

describe('CourseLaunchComponent', () => {
  let component: CourseLaunchComponent;
  let fixture: ComponentFixture<CourseLaunchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseLaunchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseLaunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
