import { TestBed } from '@angular/core/testing';

import { DigitalCourseProgressService } from './digital-course-progress.service';

describe('DigitalCourseProgressService', () => {
  let service: DigitalCourseProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DigitalCourseProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
